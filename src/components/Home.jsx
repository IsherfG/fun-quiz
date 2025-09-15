import React from 'react';
import { Link } from 'react-router-dom';


import './Home.css';

function Home() {
  return (

    <div className="home-container">
      <h2 className="home-title">WELCOME TO THE QUIZ MAKER</h2>
      <p className="home-subtitle">
        Use the CREATE link to build your own quiz. When you're done,
        you'll get a special link to challenge your friends!
      </p>
      <Link to="/create">
        <button className="home-cta-button">START BUILDING</button>
      </Link>
    </div>
  );
}

export default Home;