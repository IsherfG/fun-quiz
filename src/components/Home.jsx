import React from 'react';
import { Link } from 'react-router-dom';

// 1. Re-import the dedicated CSS file
import './Home.css';

function Home() {
  return (
    // 2. Use specific class names for styling
    <div className="home-container">
      <h2 className="home-title">WELCOME TO THE ARCADE</h2>
      <p className="home-subtitle">
        Use the CREATE link to build your own 8-bit fan quiz. When you're done,
        you'll get a special link to challenge your friends!
      </p>
      <Link to="/create">
        <button className="home-cta-button">START BUILDING</button>
      </Link>
    </div>
  );
}

export default Home;