import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleList from './components/ArticleList/ArticleList';
import ArticleDetail from './components/ArticleDetail/ArticleDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="container">
            <h1>BeyondChats Article Manager</h1>
            <p className="tagline">Original & AI-Enhanced Articles</p>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Routes>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2024 BeyondChats. Technical Product Manager Assignment.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
// import React from 'react';
// import './App.css';

// function App() {
//   return (
//     <div
//       style={{
//         padding: '3rem',
//         textAlign: 'center',
//         background: '#111',
//         minHeight: '100vh',
//       }}
//     >
//       <h1 style={{ color: 'white' }}>It WORKS ✅</h1>
//       <p style={{ color: '#60a5fa' }}>If you see this, React setup is fine.</p>
//     </div>
//   );
// }

// export default App;
