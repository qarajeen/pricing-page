import React from 'react';
import type { Article, Page, Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface ArticlePageProps {
  article: Article;
  onNavigate: (page: Page) => void;
  language: Language;
}

const renderParagraphWithBold = (text: string, index: number) => {
    // Handle bold text **...**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={index} className="text-lg text-raisin-black/80 dark:text-eggshell-white/80 leading-relaxed">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-raisin-black dark:text-eggshell-white">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
};


export const ArticlePage: React.FC<ArticlePageProps> = ({ article, onNavigate, language }) => {
  const isRtl = language === 'ar';
  const { t } = useTranslation(language);
    
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('mind')} 
          className="flex items-center gap-2 text-sm font-bold text-action-blue dark:text-vibrant-magenta hover:underline"
        >
          <span className={isRtl ? 'transform rotate-180' : ''}>&larr;</span>
          <span>Back to The Library</span>
        </button>
      </div>

      <article>
        <header className="mb-12 text-center">
          <p className="font-sans text-sm font-bold uppercase tracking-wider text-action-blue dark:text-vibrant-magenta mb-4">{article.category}</p>
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-raisin-black dark:text-eggshell-white mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="text-sm text-raisin-black/60 dark:text-eggshell-white/60">
            <span>Published on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="mx-2">&bull;</span>
            <span>5 min read</span>
          </div>
        </header>

        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl mb-12">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-16">
          <p className="text-xl font-semibold text-raisin-black dark:text-eggshell-white border-s-4 border-action-blue dark:border-vibrant-magenta ps-4 leading-relaxed">
            {article.excerpt}
          </p>
          
          {article.content?.map((section, sectionIndex) => {
            const isOdd = sectionIndex % 2 !== 0;
            const imageOrderClass = isRtl ? (isOdd ? '' : 'md:order-last') : (isOdd ? 'md:order-last' : '');

            return (
              <div key={sectionIndex}>
                {section.image ? (
                  // Section with an image (2-column layout)
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className={`relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-lg ${imageOrderClass}`}>
                      <img src={section.image} alt={section.heading || 'Article section image'} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-4 text-start">
                      {section.heading && (
                        <h3 className="text-2xl md:text-3xl font-bold font-serif text-raisin-black dark:text-eggshell-white">
                          {section.heading}
                        </h3>
                      )}
                      <div className="space-y-4">
                          {section.paragraphs.map((paragraph, pIndex) => (
                             renderParagraphWithBold(paragraph, pIndex)
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Section without an image (full-width layout)
                  <div className="space-y-4 text-start">
                    {section.heading && (
                      <h3 className="text-2xl md:text-3xl font-bold font-serif text-raisin-black dark:text-eggshell-white">
                        {section.heading}
                      </h3>
                    )}
                    <div className="space-y-4">
                      {section.paragraphs.map((paragraph, pIndex) => (
                         renderParagraphWithBold(paragraph, pIndex)
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
};