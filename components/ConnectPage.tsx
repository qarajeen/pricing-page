import React from 'react';
import { ContactForm } from './ContactForm';
import { useTranslation } from '../hooks/useTranslation';
import type { Language } from '../types';

// A simple SVG icon component for demonstration
const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d={path} />
  </svg>
);

interface ConnectPageProps {
    language: Language;
}

export const ConnectPage: React.FC<ConnectPageProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const contactDetails = [
    {
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      title: t('connect.email.title'),
      info: 'hi@studioo.ae',
      action: 'mailto:hi@studioo.ae',
      actionText: t('connect.email.action'),
      isExternal: false,
    },
    {
      icon: "M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z",
      title: t('connect.call.title'),
      info: '+971 58 658 3939',
      action: 'tel:+971586583939',
      actionText: t('connect.call.action'),
      isExternal: false,
    },
    {
      icon: "M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.75c0-1.4-.5-2-1.5-2s-1.5 1-1.5 2V19h-3v-9h3V8.75c0-2 1-3.25 3-3.25s2 .5 2 2.5V19z",
      title: t('connect.linkedin.title'),
      info: t('connect.linkedin.info'),
      action: 'https://www.linkedin.com',
      actionText: t('connect.linkedin.action'),
      isExternal: true,
    }
  ];

  return (
    <div className="max-w-5xl mx-auto text-center space-y-16">
      <div className="animate-fade-in-up">
        <h1 className="font-serif font-bold text-4xl md:text-5xl text-raisin-black dark:text-eggshell-white mb-4 uppercase tracking-wider">
          {t('connect.title')}
        </h1>
        <p style={{ animationDelay: '100ms' }} className="text-lg text-raisin-black/80 dark:text-eggshell-white/80 max-w-3xl mx-auto animate-fade-in-up">
          {t('connect.subtitle')}
        </p>
      </div>
      
      <div style={{ animationDelay: '200ms' }} className="animate-fade-in-up">
        <ContactForm language={language} />
      </div>

      <div style={{ animationDelay: '300ms' }} className="animate-fade-in-up">
          <h2 className="text-xl font-bold text-raisin-black/80 dark:text-eggshell-white/80 mb-8">{t('connect.otherWays')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactDetails.map((detail, index) => (
              <div 
                key={detail.title} 
                style={{ animationDelay: `${400 + index * 100}ms` }}
                className="bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 p-8 rounded-lg shadow-lg border border-raisin-black/10 dark:border-eggshell-white/10 flex flex-col items-center transition-transform transform hover:-translate-y-1 animate-fade-in-up"
              >
                <div className="text-action-blue dark:text-vibrant-magenta mb-4">
                  <Icon path={detail.icon} className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-raisin-black dark:text-eggshell-white">{detail.title}</h2>
                <p className="text-raisin-black/70 dark:text-eggshell-white/70 mt-2 whitespace-pre-line flex-grow">{detail.info}</p>
                <div className="mt-6">
                  <a 
                    href={detail.action}
                    {...(detail.isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="font-bold text-action-blue dark:text-vibrant-magenta hover:underline"
                  >
                    {detail.actionText}
                  </a>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};