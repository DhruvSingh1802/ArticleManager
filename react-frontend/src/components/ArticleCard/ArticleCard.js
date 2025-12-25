import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css';

const ArticleCard = ({ article }) => {
  const formatDate = (dateString) => {
    if (!dateString) return ''; // no date in current API
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content, maxLength = 200) => {
    if (typeof content !== 'string') return '';      // guard against undefined
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const description = truncateContent(article?.description); // from API
  const referencesCount = Array.isArray(article?.references)
    ? article.references.length
    : 0;

  return (
    <div className="article-card">
      <div className="article-header">
        <div className="article-badge">
          {article.is_enhanced ? (
            <span className="badge enhanced">✨ Enhanced</span>
          ) : (
            <span className="badge original">📄 Original</span>
          )}
        </div>
        <span className="article-date">{formatDate(article.created_at)}</span>
      </div>

      <h3 className="article-title">{article.title}</h3>

      <p className="article-excerpt">{description}</p>

      {referencesCount > 0 && (
        <div className="references">
          <p className="references-label">📚 {referencesCount} References</p>
        </div>
      )}

      <div className="article-footer">
        <Link to={`/article/${article.id}`} className="btn btn-primary">
          Read More
        </Link>
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Source
          </a>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
