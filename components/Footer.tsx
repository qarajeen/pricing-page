import React from 'react';
import type { Page, Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';

const SocialIcon: React.FC<{ href: string; path: string; label: string; }> = ({ href, path, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-raisin-black/60 dark:text-eggshell-white/60 hover:text-action-blue dark:hover:text-vibrant-magenta transition-transform duration-300 transform hover:scale-110">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d={path} />
        </svg>
    </a>
);

export const Footer: React.FC<{ onNavigate: (page: Page) => void; language: Language; }> = ({ onNavigate, language }) => {
  const { t } = useTranslation(language);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-raisin-black/5 dark:bg-deep-ocean-surface/30 border-t border-raisin-black/10 dark:border-eggshell-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-start">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div onClick={() => onNavigate('home')} className="cursor-pointer inline-block h-16 overflow-hidden mb-4">
               <img src="./2.png" alt="STUDIOO Logo" className="h-32 w-auto -mt-8" />
            </div>
            <p className="text-raisin-black/70 dark:text-eggshell-white/70 max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>
          
          {/* Column 2: Connect */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-raisin-black/90 dark:text-eggshell-white/90 mb-6">{t('footer.connect.title')}</h3>
             <ul className="space-y-3 text-raisin-black/70 dark:text-eggshell-white/70 flex flex-col items-center md:items-start">
              <li>
                <a href="mailto:hi@studioo.ae" className="hover:text-action-blue dark:hover:text-vibrant-magenta transition-colors duration-300">
                  hi@studioo.ae
                </a>
              </li>
              <li>
                <a href="tel:+971586583939" className="hover:text-action-blue dark:hover:text-vibrant-magenta transition-colors duration-300">
                  +971 58 658 3939
                </a>
              </li>
            </ul>
            <div className="flex justify-center md:justify-start gap-5 mt-8">
                <SocialIcon
                    href="https://www.linkedin.com"
                    label="LinkedIn"
                    path="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
                />
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-raisin-black/10 dark:border-eggshell-white/10 text-center text-raisin-black/50 dark:text-eggshell-white/50">
          <p>&copy; {currentYear} STUDIOO. Made with love in Dubai.</p>
        </div>
      </div>
    </footer>
  );
};