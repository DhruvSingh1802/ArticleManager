require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const { OpenAI } = require('openai');

const API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_KEY) {
    console.error('❌ Missing OPENAI_API_KEY in .env');
    process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_KEY });

async function getLatestArticle() {
    try {
        console.log('🔍 Getting latest article...');
        const { data } = await axios.get(`${API_URL}/articles`, {
            params: { latest: 1, type: 'original' }
        });
        console.log(`✅ Got: ${data.title}`);
        return data;
    } catch (err) {
        console.error('💥 Article fetch failed:', err.message);
        throw err;
    }
}

async function searchGoogle(title) {
    try {
        console.log(`\n🔎 Google search: "${title}"`);
        const query = encodeURIComponent(`${title} blog article`);
        const url = `https://www.google.com/search?q=${query}&num=10`;

        const { data } = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(data);
        const urls = [];

        $('div.g').each((i, el) => {
            if (urls.length >= 2) return false;
            const link = $(el).find('a').first().attr('href');
            if (link?.startsWith('http')) {
                if (link.includes('blog') || link.includes('medium.com') || link.includes('dev.to')) {
                    urls.push(link);
                    console.log(`  📝 Blog: ${link}`);
                }
            }
        });

        if (urls.length < 2) {
            $('div.g').each((i, el) => {
                if (urls.length >= 2) return false;
                const link = $(el).find('a').first().attr('href');
                if (link?.startsWith('http') && !urls.includes(link)) {
                    urls.push(link);
                    console.log(`  🔗 URL: ${link}`);
                }
            });
        }

        console.log(`✅ Found ${urls.length} links`);
        return urls.slice(0, 2);
    } catch (err) {
        console.error('💥 Google search failed:', err.message);
        return [];
    }
}

async function scrapeContent(url) {
    try {
        console.log(`  🕷️  Scraping: ${url}`);
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 10000
        });

        const $ = cheerio.load(data);
        $('script, style, nav, footer, header').remove();

        const selectors = ['article', 'main', '.post-content', '.entry-content', '.content'];
        let content = '';

        for (const sel of selectors) {
            const el = $(sel).first();
            if (el.length) {
                content = el.text().trim();
                if (content.length > 300) break;
            }
        }

        if (!content || content.length < 300) {
            content = $('p').map((i, el) => $(el).text()).get().join('\n').trim();
        }

        content = content.replace(/\s+/g, ' ').trim().substring(0, 4000);
        console.log(`  ✅ ${content.length} chars`);
        return content;
    } catch (err) {
        console.error(`  💥 Scrape failed: ${err.message}`);
        return '';
    }
}

async function enhanceWithGPT(original, refs) {
    console.log('\n🤖 Enhancing with GPT...');

    const prompt = `Improve this article's formatting and structure using the reference articles as style guides.

ORIGINAL:
${original.title}
${original.content}

REFERENCES:
${refs.map((r, i) => `Ref ${i+1}: ${r.title}\n${r.url}\n${r.content.substring(0, 1500)}...`).join('\n')}

Keep original facts. Improve readability, headings, flow only.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'Expert content formatter.' },
            { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
    });

    const enhanced = response.choices[0].message.content;
    console.log(`✅ Enhanced: ${enhanced.length} chars (was ${original.content.length})`);
    return enhanced;
}

async function publishEnhanced(original, content, refs) {
    console.log('\n📤 Publishing...');

    const payload = {
        title: `${original.title} (Enhanced)`,
        content,
        url: original.url,
        is_enhanced: true,
        original_article_id: original.id,
        references: refs.map(r => ({ title: r.title, url: r.url }))
    };

    const { data } = await axios.post(`${API_URL}/articles`, payload);
    console.log(`✅ Published! ID: ${data.data.id}`);
    return data.data;
}

async function run() {
    console.log('🚀 ARTICLE ENHANCER');
    console.log('='.repeat(50));

    try {
        const article = await getLatestArticle();
        if (!article) {
            console.log('No articles to enhance');
            return;
        }

        const urls = await searchGoogle(article.title);
        const refs = [];

        for (const url of urls) {
            const content = await scrapeContent(url);
            if (content) {
                refs.push({ title: 'Reference', url, content });
            }
            await new Promise(r => setTimeout(r, 1500));
        }

        if (refs.length === 0) {
            console.log('⚠️  No refs found, skipping');
            return;
        }

        const enhanced = await enhanceWithGPT(article, refs);
        await publishEnhanced(article, enhanced, refs);

        console.log('\n🎉 DONE!');
    } catch (err) {
        console.error('\n💥 FAILED:', err.message);
        process.exit(1);
    }
}

if (require.main === module) {
    run();
}

module.exports = {
    getLatestArticle,
    searchGoogle,
    scrapeContent,
    enhanceWithGPT,
    publishEnhanced
};
