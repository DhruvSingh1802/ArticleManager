import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ArticleDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/articles/${id}`);
      setArticle(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load article. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="error-message">
        <p>{error || 'Article not found'}</p>
        <Link to="/" className="btn btn-primary">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="article-detail">
          <div className="article-meta">
            <div className="badge-container">
              {article.is_enhanced ? (
                <span className="badge enhanced">✨ Enhanced by AI</span>
              ) : (
                <span className="badge original">📄 Original Article</span>
              )}
            </div>
            <span className="date">{formatDate(article.created_at)}</span>
          </div>

          <h1 className="article-title">{article.title}</h1>

          <div className="article-content">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {article.url && (
            <div className="source-link">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                View Original Source →
              </a>
            </div>
          )}

          {article.references && article.references.length > 0 && (
            <div className="references-section">
              <h2>📚 References</h2>
              <ul className="references-list">
                {article.references.map((ref, index) => (
                  <li key={index}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {ref.title || `Reference ${index + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.original_article && (
            <div className="related-article">
              <h3>📄 View Original Version</h3>
              <Link
                to={`/article/${article.original_article.id}`}
                className="btn btn-primary"
              >
                Go to Original Article
              </Link>
            </div>
          )}

          {article.enhanced_versions && article.enhanced_versions.length > 0 && (
            <div className="related-article">
              <h3>✨ Enhanced Versions Available</h3>
              <div className="enhanced-list">
                {article.enhanced_versions.map((enhanced) => (
                  <Link
                    key={enhanced.id}
                    to={`/article/${enhanced.id}`}
                    className="btn btn-primary"
                  >
                    View Enhanced Version
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
