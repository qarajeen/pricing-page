import React, { useState, useEffect } from 'react';
import type { Page, Article, Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { translations } from '../i18n/translations';

interface MindPageProps {
    onNavigate: (page: Page) => void;
    onViewArticle: (article: Article) => void;
    language: Language;
}

export const MindPage: React.FC<MindPageProps> = ({ onNavigate, onViewArticle, language }) => {
    const { t } = useTranslation(language);

    const contentCategories = [
    {
      title: t('mind.categories.craft.title'),
      category: t('mind.categories.craft.category'),
      description: t('mind.categories.craft.description'),
      image: "https://picsum.photos/seed/craft/800/600",
    },
    {
      title: t('mind.categories.strategy.title'),
      category: t('mind.categories.strategy.category'),
      description: t('mind.categories.strategy.description'),
      image: "https://picsum.photos/seed/strategy/800/600",
    },
    {
      title: t('mind.categories.spark.title'),
      category: t('mind.categories.spark.category'),
      description: t('mind.categories.spark.description'),
      image: "https://picsum.photos/seed/spark/800/600",
    },
    {
      title: t('mind.categories.journey.title'),
      category: t('mind.categories.journey.category'),
      description: t('mind.categories.journey.description'),
      image: "https://picsum.photos/seed/journey/800/600",
    },
  ];

  const allArticles: Article[] = t('articles');
  const filterCategories: string[] = t('mind.filterCategories');
  const englishFilterCategories: string[] = ["All", "The Craft", "The Strategy", "The Spark", "Our Journey"];


  const [filter, setFilter] = useState(filterCategories[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedArticles, setDisplayedArticles] = useState(allArticles);
  
  const featuredArticle = allArticles.find(article => article.id === 10);

  useEffect(() => {
    let articles = [...allArticles];
    
    const filterIndex = filterCategories.indexOf(filter);
    const englishFilter = englishFilterCategories[filterIndex];

    if (englishFilter !== 'All') {
      articles = articles.filter(article => {
        // FIX: Compare with English category from the source `translations` object, not the translated `t()` result.
        const enArticleCategory = translations.en.articles.find((a: Article) => a.id === article.id)?.category;
        return enArticleCategory === englishFilter;
      });
    }

    if (searchTerm.trim() !== '') {
      const lowercasedTerm = searchTerm.toLowerCase();
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(lowercasedTerm) ||
        article.excerpt.toLowerCase().includes(lowercasedTerm)
      );
    }

    setDisplayedArticles(articles);
  }, [filter, searchTerm, allArticles, filterCategories]);


  return (
    <div className="space-y-16 md:space-y-24">
      {/* Section 1: The Header */}
      <section className="relative text-center py-20 md:py-32 rounded-lg overflow-hidden min-h-[50vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://picsum.photos/seed/prism/1600/900)' }}
        >
            {/* Conceptual video placeholder */}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-raisin-black/50 to-raisin-black/20 dark:from-raisin-black/70 dark:to-raisin-black/40"></div>
        <div className="relative z-10 animate-fade-in-up max-w-4xl mx-auto px-6">
          <h1 className="font-serif font-bold text-4xl md:text-6xl text-eggshell-white mb-4">
            {t('mind.title')}
          </h1>
          <p className="text-lg md:text-xl text-eggshell-white/90">
            {t('mind.subtitle')}
          </p>
        </div>
      </section>

      {/* Section 2: Featured Article */}
      {featuredArticle && (
        <section className="container mx-auto px-6">
            <div className="text-start mb-8">
                <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-raisin-black/60 dark:text-eggshell-white/60">
                    {t('mind.featuredInsight')}
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 p-8 rounded-lg shadow-lg border border-raisin-black/10 dark:border-eggshell-white/10">
                <div className="relative h-80 rounded-lg overflow-hidden shadow-xl animate-fade-in-up">
                    <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover" />
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <p className="font-sans text-xs font-bold uppercase tracking-wider text-action-blue dark:text-vibrant-magenta mb-3">{featuredArticle.category}</p>
                    <h3 className="font-serif font-bold text-3xl text-raisin-black dark:text-eggshell-white mb-4">
                        {featuredArticle.title}
                    </h3>
                    <p className="text-raisin-black/80 dark:text-eggshell-white/80 mb-6">
                        {featuredArticle.excerpt}
                    </p>
                    <button 
                        onClick={() => onViewArticle(featuredArticle)} 
                        className="font-bold text-action-blue dark:text-vibrant-magenta hover:underline flex items-center gap-2 group"
                    >
                        {t('mind.readFullStory')}
                        <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </button>
                </div>
            </div>
        </section>
      )}
      
      {/* Section 3: Explore Our Mind */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-raisin-black dark:text-eggshell-white">
            {t('mind.findYourFocus')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contentCategories.map((card, index) => (
                <div key={card.title} className="group relative flex flex-col bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 rounded-lg shadow-lg border border-raisin-black/10 dark:border-eggshell-white/10 overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="relative h-48 overflow-hidden">
                        <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-raisin-black/70 dark:text-eggshell-white/70">{card.title}</h3>
                        <h4 className="font-serif font-bold text-xl text-raisin-black dark:text-eggshell-white mt-1">{card.category}</h4>
                        <p className="text-raisin-black/80 dark:text-eggshell-white/80 mt-3 text-sm flex-grow">{card.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Section 4: The Library */}
      <section className="container mx-auto px-6">
        <div className="mb-12">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-raisin-black dark:text-eggshell-white text-center mb-8">
                {t('mind.library')}
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-4 bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 rounded-lg border border-raisin-black/10 dark:border-eggshell-white/10">
                <div className="flex-wrap flex items-center gap-2">
                    <span className="text-sm font-bold me-2 text-raisin-black/80 dark:text-eggshell-white/80">{t('mind.filterBy')}</span>
                    {filterCategories.map(category => (
                        <button key={category} onClick={() => setFilter(category)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === category ? 'bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black' : 'bg-raisin-black/10 text-raisin-black/80 hover:bg-raisin-black/20 dark:bg-eggshell-white/10 dark:text-eggshell-white/80 dark:hover:bg-eggshell-white/20'}`}>
                            {category}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-auto">
                    <input type="search" placeholder={t('mind.searchPlaceholder')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-64 ps-10 pe-4 py-2 bg-eggshell-white dark:bg-deep-ocean-surface rounded-full border-2 border-raisin-black/20 dark:border-eggshell-white/20 focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta text-raisin-black dark:text-eggshell-white transition-colors" />
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.length > 0 ? (
                displayedArticles.map((article, index) => (
                    <button onClick={() => onViewArticle(article)} key={article.id} className="group text-start flex flex-col bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 rounded-lg shadow-lg border border-raisin-black/10 dark:border-eggshell-white/10 overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-action-blue/40 dark:hover:border-vibrant-magenta/40 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="relative h-56 overflow-hidden">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <p className="font-sans text-xs font-bold uppercase tracking-wider text-action-blue dark:text-vibrant-magenta mb-2">{article.category}</p>
                            <h3 className="font-serif font-bold text-xl text-raisin-black dark:text-eggshell-white flex-grow">{article.title}</h3>
                            <p className="text-raisin-black/80 dark:text-eggshell-white/80 mt-3 text-sm">{article.excerpt}</p>
                            <span className="mt-4 self-start bg-action-blue/10 text-action-blue dark:bg-vibrant-magenta/10 dark:text-vibrant-magenta font-bold text-sm px-4 py-2 rounded-full transition-colors group-hover:bg-action-blue/20 dark:group-hover:bg-vibrant-magenta/20">
                                {t('mind.readFullStory')} &rarr;
                            </span>
                        </div>
                    </button>
                ))
            ) : (
                <div className="md:col-span-2 lg:col-span-3 text-center py-16">
                    <h3 className="text-2xl font-bold text-raisin-black dark:text-eggshell-white">{t('mind.noArticlesFound')}</h3>
                    <p className="text-raisin-black/70 dark:text-eggshell-white/70 mt-2">{t('mind.noArticlesHint')}</p>
                </div>
            )}
        </div>
      </section>

      {/* Section 5: Let's Create Together (Final CTA) */}
      <section className="py-16 sm:py-24 bg-raisin-black/5 dark:bg-deep-ocean-surface/20">
          <div className="container mx-auto px-6 text-center max-w-3xl">
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-raisin-black dark:text-eggshell-white mb-4">
                  {t('mind.cta.title')}
              </h2>
              <p className="text-lg text-raisin-black/80 dark:text-eggshell-white/80 leading-relaxed mb-8">
                  {t('mind.cta.subtitle')}
              </p>
              <div className="inline-block interactive-shadow-container">
                  <button
                      onClick={() => onNavigate('connect')}
                      className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 relative overflow-hidden shine-effect text-lg button-inset-shadow"
                  >
                      <span className="relative z-10">{t('mind.cta.button')}</span>
                  </button>
              </div>
          </div>
      </section>

    </div>
  );
};