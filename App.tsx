import React, { useState, useEffect } from 'react';
import { QuoteCalculator } from './components/QuoteCalculator';
import type { Theme, Language } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('en');

  // Effect to initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  // Effect to initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    setLanguage(savedLanguage || 'en');
  }, []);

  // Effect to apply theme changes to the DOM and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effect to apply language changes to the DOM
  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.remove('font-sans', 'font-amiri');
    document.body.classList.add(language === 'ar' ? 'font-amiri' : 'font-sans');
    localStorage.setItem('language', language);
  }, [language]);
  
  // Effect for mouse-following spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.body.style.setProperty('--x', `${e.clientX}px`);
      document.body.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  const fontClass = language === 'ar' ? 'font-amiri' : 'font-sans';
  
  return (
    <div className={`text-studio-text-dark dark:text-studio-text-light min-h-screen transition-colors duration-300 ${fontClass}`}>
      <main className="container mx-auto px-6 pt-12 pb-24">
        <div className="animate-fade-in-up">
          <QuoteCalculator language={language} />
        </div>
      </main>
    </div>
  );
};

export default App;