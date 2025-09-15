import React from 'react';
import './Footer.css'; 

function Footer() {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          &copy; {currentYear} &nbsp;
          <a href="https://github.com/IsherfG" target="_blank" rel="noopener noreferrer">
            Isherf
          </a>
          &nbsp; // Built with React & Firebase
        </p>
        <p>
          <a href="https://github.com/IsherfG/fun-quiz" target="_blank" rel="noopener noreferrer">
            View Source Code on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}


export default Footer;