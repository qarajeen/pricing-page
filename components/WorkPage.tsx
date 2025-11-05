import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';

const media = [
  // Images (15)
  { id: 1, type: 'image', src: 'https://picsum.photos/seed/projectA/800/600', title: 'Architectural Elegance', span: 'md:col-span-2 md:row-span-2' },
  { id: 2, type: 'image', src: 'https://picsum.photos/seed/projectB/800/600', title: 'Corporate Headshots' },
  { id: 3, type: 'image', src: 'https://picsum.photos/seed/projectC/800/600', title: 'Culinary Delights' },
  { id: 10, type: 'video', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', thumbnail: 'https://picsum.photos/seed/video1/800/600', title: 'Brand Anthem' },
  { id: 4, type: 'image', src: 'https://picsum.photos/seed/projectD/800/600', title: 'Product Showcase' },
  { id: 5, type: 'image', src: 'https://picsum.photos/seed/projectE/800/600', title: 'Event Highlights' },
  { id: 6, type: 'image', src: 'https://picsum.photos/seed/projectF/800/600', title: 'Urban Landscape', span: 'md:col-span-2' },
  { id: 7, type: 'image', src: 'https://picsum.photos/seed/projectG/800/600', title: 'Fashion Forward' },
  { id: 8, type: 'image', src: 'https://picsum.photos/seed/projectH/800/600', title: 'Automotive Power' },
  { id: 9, type: 'image', src: 'https://picsum.photos/seed/projectI/800/600', title: 'Serene Nature' },
  { id: 11, type: 'video', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', thumbnail: 'https://picsum.photos/seed/video2/800/600', title: 'Sci-Fi Short', span: 'md:col-span-2 md:row-span-2' },
  { id: 12, type: 'image', src: 'https://picsum.photos/seed/projectJ/800/600', title: 'Interior Design' },
  { id: 13, type: 'image', src: 'https://picsum.photos/seed/projectK/800/600', title: '360 Tour Still' },
  { id: 14, type: 'image', src: 'https://picsum.photos/seed/projectL/800/600', title: 'Action Sports' },
  { id: 15, type: 'image', src: 'https://picsum.photos/seed/projectM/800/600', title: 'Candid Moments' },
  { id: 16, type: 'image', src: 'https://picsum.photos/seed/projectN/800/600', title: 'Drone Aerial' },
];


const PlayIcon: React.FC = () => (
    <svg className="w-12 h-12 text-white/90 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
);

interface WorkPageProps {
    language: Language;
}

export const WorkPage: React.FC<WorkPageProps> = ({ language }) => {
    const { t } = useTranslation(language);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    
    const handleItemClick = (index: number) => {
        if (document.activeElement instanceof HTMLElement) {
            triggerRef.current = document.activeElement;
        } else {
            triggerRef.current = null;
        }
        setFocusedIndex(index);
    };

    const handleCloseModal = () => {
        setFocusedIndex(null);
    };

    const handleModalNavigate = (direction: 'next' | 'prev') => {
        if (focusedIndex === null) return;
        const newIndex = direction === 'next'
            ? (focusedIndex + 1) % media.length
            : (focusedIndex - 1 + media.length) % media.length;
        setFocusedIndex(newIndex);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (focusedIndex !== null) {
                if (e.key === 'Escape') handleCloseModal();
                if (e.key === 'ArrowRight') handleModalNavigate('next');
                if (e.key === 'ArrowLeft') handleModalNavigate('prev');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedIndex]);
    
    useEffect(() => {
      if (focusedIndex !== null && modalRef.current) {
        const modalElement = modalRef.current;
        const focusableElements = Array.from(
          modalElement.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (firstElement instanceof HTMLElement) {
          firstElement.focus();
        }

        const handleFocusTrap = (e: KeyboardEvent) => {
          if (e.key !== 'Tab') return;
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              if (lastElement instanceof HTMLElement) {
                lastElement.focus();
              }
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              if (firstElement instanceof HTMLElement) {
                firstElement.focus();
              }
              e.preventDefault();
            }
          }
        };
        modalElement.addEventListener('keydown', handleFocusTrap);
        return () => modalElement.removeEventListener('keydown', handleFocusTrap);

      } else if (focusedIndex === null) {
        triggerRef.current?.focus();
      }
    }, [focusedIndex]);
    
    const focusedItem = focusedIndex !== null ? media[focusedIndex] : null;
    const modalRoot = document.getElementById('modal-root');

    return (
        <div className="min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="font-serif font-bold text-4xl md:text-5xl text-raisin-black dark:text-eggshell-white mb-4 uppercase tracking-wider">
                    {t('work.title')}
                </h1>
                <p className="text-lg text-raisin-black/80 dark:text-eggshell-white/80 max-w-3xl mx-auto">
                    {t('work.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[25vh] gap-4">
                {media.map((item, index) => (
                    <div
                        key={item.id}
                        className={`group relative overflow-hidden rounded-lg cursor-pointer shadow-lg ${item.span || ''}`}
                        onClick={() => handleItemClick(index)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleItemClick(index); } }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View project: ${item.title}`}
                    >
                        <img
                            src={item.type === 'image' ? item.src : item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex flex-col items-start justify-end p-4">
                            <h3 className="font-bold text-white text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                        </div>
                        {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                                <PlayIcon />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {focusedItem && modalRoot && ReactDOM.createPortal(
                <div 
                    ref={modalRef}
                    onClick={handleCloseModal}
                    className="fixed inset-0 bg-raisin-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div 
                        className="relative w-full h-full max-w-6xl max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={handleCloseModal} aria-label="Close dialog" className="absolute -top-3 -right-3 z-20 text-raisin-black bg-eggshell-white rounded-full p-2 hover:scale-110 transition-transform shadow-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <button onClick={() => handleModalNavigate('prev')} aria-label="Previous item" className="interactive-shadow-container-round absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-20 text-raisin-black bg-eggshell-white/80 rounded-full p-3 hover:scale-110 hover:bg-eggshell-white transition-transform shadow-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => handleModalNavigate('next')} aria-label="Next item" className="interactive-shadow-container-round absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-20 text-raisin-black bg-eggshell-white/80 rounded-full p-3 hover:scale-110 hover:bg-eggshell-white transition-transform shadow-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>

                        <div className="w-full h-full flex items-center justify-center">
                            {focusedItem.type === 'image' ? (
                                <img src={focusedItem.src} alt={focusedItem.title} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                            ) : (
                                <video src={focusedItem.src} controls autoPlay className="max-w-full max-h-full object-contain rounded-lg shadow-2xl">
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                        
                        <div className="absolute -bottom-12 left-0 w-full text-center p-4">
                            <h3 id="modal-title" className="font-serif font-bold text-2xl text-eggshell-white drop-shadow-lg">{focusedItem.title}</h3>
                        </div>
                    </div>
                </div>,
                modalRoot
            )}
        </div>
    );
};