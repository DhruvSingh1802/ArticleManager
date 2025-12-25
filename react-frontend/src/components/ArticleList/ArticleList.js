import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from '../ArticleCard/ArticleCard';

import './ArticleList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, original, enhanced

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.type = filter;
      }

      const response = await axios.get(`${API_URL}/articles`, { params });
      const data = response.data.data || response.data;
      setArticles(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    if (!window.confirm('This will scrape articles from BeyondChats. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/articles/scrape`);
      alert('Articles scraped successfully!');
      fetchArticles();
    } catch (err) {
      console.error('Error scraping articles:', err);
      alert('Failed to scrape articles. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchArticles}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="article-list-container">
      <div className="container">
        <div className="controls">
          <div className="filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Articles
            </button>
            <button
              className={`filter-btn ${filter === 'original' ? 'active' : ''}`}
              onClick={() => setFilter('original')}
            >
              Original
            </button>
            <button
              className={`filter-btn ${filter === 'enhanced' ? 'active' : ''}`}
              onClick={() => setFilter('enhanced')}
            >
              Enhanced
            </button>
          </div>
          <button className="btn btn-secondary" onClick={handleScrape}>
            Scrape New Articles
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="no-articles">
            <p>No articles found. Click "Scrape New Articles" to get started.</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
