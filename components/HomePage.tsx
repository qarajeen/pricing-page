import React, { useState, useRef, useEffect } from 'react';
import type { Page, Language } from '../types';
import { ContactForm } from './ContactForm';
import { useTranslation } from '../hooks/useTranslation';

interface HomePageProps {
    onNavigate: (page: Page) => void;
    language: Language;
}

// Custom hook to detect when an element is in the viewport
const useInView = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options]);

    return { ref, isInView };
};

// New ProcessStep component for dynamic stepper
const ProcessStep: React.FC<{ step: string; title: string; description: string; delay: string; }> = ({ step, title, description, delay }) => {
    const { ref, isInView } = useInView({ threshold: 0.7, rootMargin: "-100px 0px -100px 0px" });

    return (
        <div 
          ref={ref}
          className="flex flex-col items-center text-center animate-fade-in-up transition-opacity duration-300 group-hover:opacity-60 hover:!opacity-100" 
          style={{ animationDelay: delay }}
        >
          <div className={`relative z-10 w-24 h-24 mb-6 transition-transform duration-500 ease-out ${isInView ? 'scale-110' : 'scale-100'}`}>
              <div className={`absolute inset-0 rounded-full border-2 shadow-lg transition-colors duration-500 ${isInView ? 'bg-action-blue dark:bg-vibrant-magenta border-action-blue dark:border-vibrant-magenta' : 'bg-eggshell-white dark:bg-deep-ocean-surface border-raisin-black/10 dark:border-eggshell-white/10'}`}></div>
              <div className="absolute -inset-1 rounded-full bg-action-blue/20 dark:bg-vibrant-magenta/20 animate-pulse-glow opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                  <span className={`text-4xl font-serif font-bold transition-colors duration-500 ${isInView ? 'text-eggshell-white dark:text-raisin-black' : 'text-action-blue dark:text-vibrant-magenta'}`}>{step}</span>
              </div>
          </div>
          <h3 className="text-xl font-bold font-serif mb-2 text-raisin-black dark:text-eggshell-white">{title}</h3>
          <p className="text-raisin-black/80 dark:text-eggshell-white/80 leading-relaxed">
            {description}
          </p>
        </div>
    );
};

const TiltButton: React.FC<{
  onClick: () => void;
  className: string;
  children: React.ReactNode;
  isTouchDevice: boolean;
}> = ({ onClick, className, children, isTouchDevice }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg) scale(1)');

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTouchDevice || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const { width, height, left, top } = rect;
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const x = (mouseX / width) - 0.5;
    const y = (mouseY / height) - 0.5;
    const maxRotate = 12;
    const rotateY = x * maxRotate * 2;
    const rotateX = -y * maxRotate * 2;
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setTransform('rotateX(0deg) rotateY(0deg) scale(1)');
  };
    
  return (
    <div className="[perspective:800px] interactive-shadow-container">
        <button
            ref={btnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ transform, transformStyle: 'preserve-3d' }}
            className={`${className} transition-transform duration-200 ease-out relative overflow-hidden shine-effect button-inset-shadow active:scale-95`}
        >
            <span className="relative z-10 [transform:translateZ(20px)] block">{children}</span>
        </button>
    </div>
  );
};

const SectionIcon: React.FC<{ path: string }> = ({ path }) => (
    <svg className="w-12 h-12 text-action-blue dark:text-vibrant-magenta" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

interface PartnershipCardProps {
  model: { key: string; number: string; iconPath: string; };
  index: number;
  onNavigate: (page: Page) => void;
  language: Language;
  isTouchDevice: boolean;
}

const PartnershipCard: React.FC<PartnershipCardProps> = ({ model, index, onNavigate, language, isTouchDevice }) => {
    const { t } = useTranslation(language);
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isTouchDevice || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const { width, height, left, top } = rect;
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;
        const x = (mouseX / width) - 0.5;
        const y = (mouseY / height) - 0.5;
        const maxRotate = 10;
        const rotateY = x * maxRotate * 2;
        const rotateX = -y * maxRotate * 2;
        setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    };

    const handleMouseLeave = () => {
        if (isTouchDevice) return;
        setTransform('rotateX(0deg) rotateY(0deg)');
    };

    return (
        <div className="[perspective:1000px] animate-fade-in-up h-full" style={{ animationDelay: `${index * 150}ms` }}>
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ transform }}
                className="group relative [transform-style:preserve-3d] transition-transform duration-300 ease-out bg-eggshell-white dark:bg-deep-ocean-surface p-8 rounded-lg shadow-lg border border-raisin-black/10 dark:border-eggshell-white/10 h-full flex flex-col items-center text-center min-h-[350px] active:scale-[.98] active:shadow-2xl"
            >
                {/* Glow effect on hover */}
                <div className="absolute -inset-2 bg-action-blue/10 dark:bg-vibrant-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-xl pointer-events-none"></div>
                
                <div className="relative [transform:translateZ(50px)] mb-6 flex flex-col items-center">
                    <div className="relative">
                        <SectionIcon path={model.iconPath} />
                        <div className="absolute -top-2 -right-6 w-10 h-10 flex items-center justify-center font-bold text-2xl font-serif text-action-blue dark:text-vibrant-magenta bg-action-blue/10 dark:bg-vibrant-magenta/10 rounded-full">{model.number}</div>
                    </div>
                </div>
                
                <h3 className="relative [transform:translateZ(40px)] text-2xl font-bold font-serif mb-4 text-raisin-black dark:text-eggshell-white">{t(`home.partnerships.${model.key}.title`)}</h3>
                
                {/* Content is now always visible */}
                <div className="relative [transform:translateZ(20px)] flex flex-col items-center flex-grow w-full">
                    <div className="flex-grow flex flex-col justify-center text-raisin-black/80 dark:text-eggshell-white/80">
                        <strong className="block text-base font-semibold text-raisin-black dark:text-eggshell-white">{t(`home.partnerships.${model.key}.howLabel`)}</strong>
                        <p className="text-base mt-1">{t(`home.partnerships.${model.key}.how`)}</p>
                    </div>
                     <button 
                        onClick={() => onNavigate('connect')} 
                        className="mt-6 font-bold text-lg text-action-blue dark:text-vibrant-magenta flex items-center gap-1 group/link"
                    >
                        Learn More
                        <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1">&rarr;</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


export const HomePage: React.FC<HomePageProps> = ({ onNavigate, language }) => {
    const { t } = useTranslation(language);
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg) scale(1)');
    const { ref: howWeStartRef, isInView: howWeStartInView } = useInView({ threshold: 0.5 });
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isTouchDevice || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const { width, height, left, top } = rect;
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;
        const x = (mouseX / width) - 0.5;
        const y = (mouseY / height) - 0.5;
        const maxRotate = 8;
        const rotateY = x * maxRotate * 2;
        const rotateX = -y * maxRotate * 2;
        setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`);
    };

    const handleMouseLeave = () => {
        if (isTouchDevice) return;
        setTransform('rotateX(0deg) rotateY(0deg) scale(1)');
    };
    
    const partnershipModels = [
        {
            key: 'directPayment',
            number: '1',
            iconPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6',
        },
        {
            key: 'serviceExchange',
            number: '2',
            iconPath: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
        },
        {
            key: 'growthPartner',
            number: '3',
            iconPath: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a6 6 0 01-5.84 7.38v-4.82m-5.84 2.56a6 6 0 015.84-7.38v4.82m0 0V3.18a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0118 3.18v4.82m0 0a2.25 2.25 0 01-2.25 2.25h-1.5A2.25 2.25 0 0112 8.18v-4.82',
        }
    ];
    
    const processSteps = [
        {
            step: '1',
            title: t('home.howWeStart.step1.title'),
            description: t('home.howWeStart.step1.desc'),
            delay: '0ms'
        },
        {
            step: '2',
            title: t('home.howWeStart.step2.title'),
            description: t('home.howWeStart.step2.desc'),
            delay: '200ms'
        },
        {
            step: '3',
            title: t('home.howWeStart.step3.title'),
            description: t('home.howWeStart.step3.desc'),
            delay: '400ms'
        }
    ];

    const isEnglish = language === 'en';

    return (
        <div className="-mt-16">
            {/* Hero Section */}
            <section className="flex items-center justify-center [perspective:1000px] p-8 min-h-[50vh] md:min-h-[70vh]">
                <div 
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ transform }}
                    className="text-center transition-transform duration-300 ease-out [transform-style:preserve-3d] bg-eggshell-white/30 dark:bg-deep-ocean-surface/30 p-8 sm:p-12 rounded-2xl border border-raisin-black/10 dark:border-eggshell-white/10 shadow-2xl"
                >
                    <h1 className="text-4xl md:text-6xl font-bold font-serif text-raisin-black dark:text-eggshell-white mb-6 [transform:translateZ(40px)]">
                        {isEnglish ? (
                            <>
                                We are here{' '}
                                <span className="bg-gradient-to-br from-blue-300 via-action-blue to-blue-500 dark:from-yellow-200 dark:via-vibrant-magenta dark:to-amber-400 text-transparent bg-clip-text bg-[length:200%_auto] animate-text-shine">
                                    WITH
                                </span>
                                {' '}you
                            </>
                        ) : (
                            t('home.hero.title')
                        )}
                    </h1>
                    <p className="text-lg md:text-xl text-raisin-black/80 dark:text-eggshell-white/80 mb-12 max-w-2xl mx-auto [transform:translateZ(30px)]">
                        {t('home.hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 [transform:translateZ(50px)]">
                        <TiltButton
                            onClick={() => onNavigate('mind')}
                            className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-2 px-8 rounded-full w-full sm:w-auto text-xl"
                            isTouchDevice={isTouchDevice}
                        >
                            {t('home.hero.readMind')}
                        </TiltButton>
                        <TiltButton
                            onClick={() => onNavigate('work')}
                            className="bg-transparent border-2 border-action-blue text-action-blue hover:bg-action-blue/10 dark:border-vibrant-magenta dark:text-vibrant-magenta dark:hover:bg-vibrant-magenta/10 font-bold py-2 px-8 rounded-full w-full sm:w-auto text-xl"
                            isTouchDevice={isTouchDevice}
                        >
                            {t('home.hero.seeWork')}
                        </TiltButton>
                    </div>
                </div>
            </section>

            {/* Who We Are Section */}
            <section className="py-12 sm:py-16">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* Image Column */}
                  <div className="animate-fade-in-up relative z-0">
                    <div 
                      className="relative aspect-square md:aspect-[4/5] w-full max-w-md mx-auto rounded-2xl bg-cover bg-center shadow-2xl"
                      style={{ backgroundImage: 'url(https://picsum.photos/seed/founder/800/1000)' }}
                    >
                    </div>
                  </div>
                  
                  {/* Text Column */}
                  <div 
                    className="animate-fade-in-up text-center md:text-start relative z-10 -mt-16 md:mt-0 bg-eggshell-white dark:bg-deep-ocean-surface md:bg-transparent md:dark:bg-transparent p-8 md:p-0 rounded-2xl md:rounded-none shadow-xl md:shadow-none" 
                    style={{ animationDelay: '200ms' }}
                  >
                    <h2 className="font-serif font-bold text-3xl md:text-4xl text-raisin-black dark:text-eggshell-white mb-6">
                      {t('home.whoWeAre.title')}
                    </h2>
                    <div className="space-y-4 text-lg text-raisin-black/80 dark:text-eggshell-white/80 leading-relaxed">
                      <p>
                       {t('home.whoWeAre.p1')}
                      </p>
                      <p>
                        {t('home.whoWeAre.p2')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Partnership Models Section */}
            <section className="py-12 sm:py-16 bg-raisin-black/5 dark:bg-deep-ocean-surface/20 overflow-hidden">
              <div className="container mx-auto">
                <div className="text-center mb-16">
                  <h2 className="font-serif font-bold text-3xl md:text-4xl text-raisin-black dark:text-eggshell-white">
                    {t('home.partnerships.title')}
                  </h2>
                  <p className="mt-4 text-lg text-raisin-black/70 dark:text-eggshell-white/70 max-w-2xl mx-auto">
                    {t('home.partnerships.subtitle')}
                  </p>
                </div>
                {/* Horizontal scroll on mobile, grid on desktop */}
                <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory pb-4 -mx-6 px-6 md:mx-0 md:px-0">
                  {partnershipModels.map((model, index) => (
                    <div key={model.key} className="w-[85vw] sm:w-[70vw] md:w-auto flex-shrink-0 snap-center">
                      <PartnershipCard 
                        model={model} 
                        index={index} 
                        onNavigate={onNavigate} 
                        language={language}
                        isTouchDevice={isTouchDevice}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* How We Start Section */}
            <section className="py-12 sm:py-16">
              <div ref={howWeStartRef} className="container mx-auto">
                <div className="text-center mb-20">
                  <h2 className="font-serif font-bold text-3xl md:text-4xl text-raisin-black dark:text-eggshell-white">
                    {t('home.howWeStart.title')}
                  </h2>
                </div>

                <div className="relative">
                  {/* Animated connecting line for larger screens */}
                  <div className="hidden md:block absolute top-12 left-0 w-full h-[2px]">
                    <svg width="100%" height="2px" preserveAspectRatio="none" className="overflow-visible">
                      <path 
                        className={`line-path stroke-[var(--line-color)] ${howWeStartInView ? 'line-animated' : ''}`}
                        d={`M ${100 / 6}% 1 L ${100 * 5 / 6}% 1`}
                        strokeWidth="2" 
                        fill="none" 
                      />
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative group">
                    {processSteps.map((item) => (
                      <ProcessStep key={item.step} {...item} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-12 sm:py-16 bg-raisin-black/5 dark:bg-deep-ocean-surface/20">
              <div className="container mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                  <h2 className="font-serif font-bold text-3xl md:text-4xl text-raisin-black dark:text-eggshell-white">
                    {t('home.contact.title')}
                  </h2>
                  <p className="mt-4 text-lg text-raisin-black/70 dark:text-eggshell-white/70">
                    {t('home.contact.subtitle')}
                  </p>
                </div>
                <div className="max-w-3xl mx-auto">
                    <ContactForm language={language} />
                </div>
              </div>
            </section>
        </div>
    );
};