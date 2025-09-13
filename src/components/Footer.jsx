import React from 'react';
import './Footer.css'; // We'll create this file next

function Footer() {
  const currentYear = new Date().getFullYear(); // Automatically gets the current year

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          &copy; {currentYear} &nbsp;
          <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer">
            Isherf
          </a>
          &nbsp; // Built with React & Firebase
        </p>
        <p>
          <a href="https://github.com/your-username/fanquiz-maker" target="_blank" rel="noopener noreferrer">
            View Source Code on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}

// Don't forget to replace the placeholder GitHub links with your actual ones!

export default Footer;