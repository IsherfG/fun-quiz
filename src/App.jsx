import React, { useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';

// Import components
import Home from './components/Home.jsx';
import QuizBuilder from './components/QuizBuilder.jsx';
import TakeQuiz from './components/TakeQuiz.jsx';
import Footer from './components/Footer.jsx';

// Import CSS files
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`app-wrapper theme-${theme}`}>
      {/* THIS IS THE NEW, SIMPLER BACKGROUND ELEMENT */}
      <div className="background-grid"></div>

      <div className="app-content-wrapper">
        <header className="app-header">
          <h1 className="app-title">FanQuiz Maker</h1>
          <nav className="app-nav">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>HOME</NavLink>
            <NavLink to="/create" className={({ isActive }) => (isActive ? 'active' : '')}>CREATE</NavLink>
          </nav>
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<QuizBuilder />} />
            <Route path="/quiz/:quizId" element={<TakeQuiz />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;