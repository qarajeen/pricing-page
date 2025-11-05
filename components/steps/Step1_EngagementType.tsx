import React, { useRef, useState } from 'react';
import type { QuoteFormData, ServiceName } from '../../types';

interface Step1Props {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onNext: () => void;
}

const serviceIcons: Record<ServiceName, string> = {
    'Photography': 'M2.25 8.25v-2.25a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v2.25m-6 0v5.25a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25v-5.25m-15 0h15',
    'Video Production': 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 004.5 18.75z',
    '360 Tours': 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 21a9 9 0 01-9-9m9 9a9 9 0 009-9m-9 9V3M3 12h18',
    'Time Lapse': 'M12 6v6h6m6 0a9 9 0 11-18 0 9 9 0 0118 0z',
    'Post Production': 'M15.75 5.25v13.5m-1.5-13.5v13.5m-1.5-13.5v13.5m-1.5-13.5v13.5m-1.5-13.5v13.5m10.5-13.5h-15a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5z',
    'Photogrammetry': 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25m-9-5.25v9l9 5.25m0-9v9',
};

const serviceDescriptions: Record<ServiceName, string> = {
  'Photography': 'Still images for events, products, or real estate.',
  'Video Production': 'From corporate videos to promotional content.',
  'Post Production': 'Editing services for your existing footage or photos.',
  '360 Tours': 'Immersive virtual tours for properties and spaces.',
  'Time Lapse': 'Capture long processes in short, engaging videos.',
  'Photogrammetry': 'Create 3D models from photos.',
};

const services = Object.keys(serviceDescriptions) as ServiceName[];

const selectionOptions = [
    ...services.map(serviceName => ({
        name: serviceName,
        description: serviceDescriptions[serviceName],
        icon: serviceIcons[serviceName],
        type: 'Project' as const,
        service: serviceName,
    })),
    {
        name: 'Retainer',
        description: "For ongoing creative needs. Let's build a long-term partnership to consistently support your brand.",
        icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691V5.25a3.375 3.375 0 00-3.375-3.375H8.25a3.375 3.375 0 00-3.375 3.375v5.25m5.9-4.875A3.375 3.375 0 009.75 6H6.375a3.375 3.375 0 00-3.375 3.375v1.5',
        type: 'Retainer' as const,
    },
    {
        name: 'Training & Workshops',
        description: "Ready to learn? We offer friendly, hands-on training to help you or your team master new creative skills.",
        icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0v14.25',
        type: 'Training' as const,
    }
];

const Icon: React.FC<{ path: string }> = ({ path }) => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// --- NEW: Tilt Effect Hook ---
const useTiltEffect = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!elementRef.current) return;
    const { width, height, left, top } = elementRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    const rotateY = x * 20; // Max rotation
    const rotateX = -y * 20;
    elementRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    if (!elementRef.current) return;
    elementRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return { elementRef, handleMouseMove, handleMouseLeave };
};

// --- NEW: Card Component ---
const Card: React.FC<{
  option: typeof selectionOptions[0];
  isSelected: boolean;
  onSelect: () => void;
}> = ({ option, isSelected, onSelect }) => {
    const { elementRef, handleMouseMove, handleMouseLeave } = useTiltEffect();

    return (
        <div
            ref={elementRef}
            onClick={onSelect}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease-out' }}
            className={`card-glossy p-6 rounded-2xl cursor-pointer relative flex flex-col items-center text-center ${isSelected ? 'selected' : ''}`}
        >
            <div className={`mb-4 [transform:translateZ(30px)] ${isSelected ? 'text-studio-text-dark' : 'text-studio-gold'}`}>
                <Icon path={option.icon} />
            </div>
            <h3 className={`text-lg font-bold [transform:translateZ(20px)] ${isSelected ? 'text-studio-text-dark' : 'text-studio-text-dark dark:text-studio-text-light'}`}>{option.name}</h3>
            <p className={`text-sm mt-2 flex-grow [transform:translateZ(10px)] ${isSelected ? 'text-studio-text-dark/80' : 'text-studio-text-dark/70 dark:text-studio-text-light/70'}`}>{option.description}</p>
        </div>
    );
};


export const Step1_EngagementType: React.FC<Step1Props> = ({ formData, updateFormData, onNext }) => {
  
  const handleSelect = (option: { type: 'Project' | 'Retainer' | 'Training'; service?: ServiceName }) => {
    if (option.type === 'Project') {
        updateFormData({ engagementType: 'Project', service: option.service, config: {} });
    } else {
        updateFormData({ engagementType: option.type, service: null, config: {} });
    }
    setTimeout(() => {
        onNext();
    }, 300);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1000px]">
        {selectionOptions.map((option) => {
            const isSelected = formData.engagementType === option.type && (option.type !== 'Project' || formData.service === option.service);
            return (
              <Card
                key={option.name}
                option={option}
                isSelected={isSelected}
                onSelect={() => handleSelect(option)}
              />
            );
        })}
      </div>
    </div>
  );
};