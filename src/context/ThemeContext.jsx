import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Try to get the theme from localStorage, or default to 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('quizAppTheme') || 'light');

  useEffect(() => {
    // Save the theme to localStorage whenever it changes
    localStorage.setItem('quizAppTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};