import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { Project } from '../types';

interface NewProjectModalProps {
  onClose: () => void;
  onSubmit: (data: Omit<Project, 'id' | 'status' | 'client_id'>) => void;
}

// Data for form selections
const serviceTypes = [
    { name: 'Photography', icon: 'M2.25 8.25v-2.25a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v2.25m-6 0v5.25a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25v-5.25m-15 0h15' },
    { name: 'Video Production', icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 004.5 18.75z' },
    { name: '360 Tours', icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 21a9 9 0 01-9-9m9 9a9 9 0 009-9m-9 9V3M3 12h18' },
    { name: 'Time Lapse', icon: 'M12 6v6h6m6 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Post Production', icon: 'M15.75 5.25v13.5m-1.5-13.5v13.5m-1.5-13.5v13.5m-1.5-13.5v13.5m-1.5-13.5v13.5m10.5-13.5h-15a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5z' },
    { name: 'Photogrammetry', icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25m-9-5.25v9l9 5.25m0-9v9' },
];

const subServicesData: Record<string, string[]> = {
    'Photography': ['Event', 'Food', 'Real Estate', 'Product', 'Corporate Headshots'],
    'Video Production': ['Corporate', 'Promotional/Brand', 'Event Coverage', 'Real Estate'],
    '360 Tours': ['Real Estate Property', 'Commercial Space', 'Venue'],
    'Time Lapse': ['Construction', 'Event', 'Nature'],
    'Post Production': ['Video Editing', 'Photo Retouching', 'Color Grading'],
    'Photogrammetry': ['Small Object Scan', 'Building Exterior', 'Large Environment'],
};

const styleOptionsData: Record<string, { name: string; image: string }[]> = {
    'Food': [ { name: 'Dark & Moody', image: 'https://picsum.photos/seed/darkfood/400/300' }, { name: 'Light & Airy', image: 'https://picsum.photos/seed/lightfood/400/300' } ],
    'Real Estate': [ { name: 'Natural & Bright', image: 'https://picsum.photos/seed/brightrealestate/400/300' }, { name: 'Cinematic & Dramatic', image: 'https://picsum.photos/seed/dramaticrealestate/400/300' } ],
    'Corporate': [ { name: 'Clean & Professional', image: 'https://picsum.photos/seed/cleancorp/400/300' }, { name: 'Dynamic & Modern', image: 'https://picsum.photos/seed/moderncorp/400/300' } ],
    'Default': [ { name: 'Standard', image: 'https://picsum.photos/seed/defaultstyle1/400/300' }, { name: 'Cinematic', image: 'https://picsum.photos/seed/defaultstyle2/400/300' } ]
};

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const FormSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="animate-fade-in-up space-y-4">
        <h3 className="text-lg font-semibold text-eggshell-white">{title}</h3>
        {children}
    </div>
);

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose, onSubmit }) => {
    const modalRef = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState({
        projectType: '',
        subService: '',
        style: '',
        title: '',
        description: '',
        location: '',
        date: '',
        requirements: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    
    // Accessibility: Focus trap
    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const focusableElements = Array.from(modalElement.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        // FIX: Add a type guard to correctly type the filtered elements as HTMLElements,
        // which resolves issues with accessing properties like 'hasAttribute' and 'focus'.
        )).filter((el): el is HTMLElement => el instanceof HTMLElement && !el.hasAttribute('disabled'));

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        firstElement.focus();

        const handleFocusTrap = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        modalElement.addEventListener('keydown', handleFocusTrap);

        return () => modalElement.removeEventListener('keydown', handleFocusTrap);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        const validationErrors: string[] = [];
        if (!formData.projectType) validationErrors.push('Project Category');
        if (formData.projectType && !formData.subService) validationErrors.push('Specific Service');
        if (formData.subService && !formData.style) validationErrors.push('Preferred Style');
        
        if (formData.style) {
            if (!formData.title) validationErrors.push('Project Title');
            if (!formData.description) validationErrors.push('Project Description');
            if (!formData.location) validationErrors.push('Location');
            if (!formData.date) validationErrors.push('Preferred Start Date');
        }
        
        setErrors(validationErrors);
    }, [formData]);

    const handleSelect = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            ...(field === 'projectType' && { subService: '', style: '' }),
            ...(field === 'subService' && { style: '' }),
        }));
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (errors.length > 0) return;
        setIsSubmitting(true);
        setTimeout(() => {
            // Map form data to the snake_case format expected by the database.
            onSubmit({
                project_type: formData.projectType,
                sub_service: formData.subService,
                style: formData.style,
                title: formData.title,
                description: formData.description,
                location: formData.location,
                start_date: formData.date,
                requirements: formData.requirements,
            });
        }, 1500);
    };
    
    const currentSubServices = subServicesData[formData.projectType] || [];
    const currentStyleKey = Object.keys(styleOptionsData).find(key => formData.subService.toLowerCase().includes(key.toLowerCase())) || 'Default';
    const currentStyleOptions = styleOptionsData[currentStyleKey];
    
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    const modalContent = (
        <div 
            className="fixed inset-0 bg-raisin-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-project-title"
        >
            <form 
                ref={modalRef}
                onSubmit={handleSubmit}
                className="bg-deep-ocean-surface w-full max-w-2xl rounded-lg shadow-2xl border border-eggshell-white/10 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-eggshell-white/10 flex-shrink-0">
                    <h2 id="new-project-title" className="font-serif font-bold text-2xl text-eggshell-white">Let's Start Something New</h2>
                    <button type="button" onClick={onClose} aria-label="Close" className="text-eggshell-white/70 hover:text-action-blue dark:hover:text-vibrant-magenta transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8 flex-grow min-h-0">
                    <FormSection title="1. What are we creating together?">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {serviceTypes.map(service => (
                                <div key={service.name} onClick={() => handleSelect('projectType', service.name)} 
                                    className={`flex flex-col items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 bg-deep-ocean-surface/50 ${formData.projectType === service.name ? 'border-action-blue dark:border-vibrant-magenta' : 'border-eggshell-white/20 hover:border-action-blue/50 dark:hover:border-vibrant-magenta/50'}`}>
                                    <div className="text-action-blue dark:text-vibrant-magenta mb-2"><Icon path={service.icon} className="w-8 h-8" /></div>
                                    <span className="font-semibold text-eggshell-white">{service.name}</span>
                                </div>
                            ))}
                        </div>
                    </FormSection>

                    {formData.projectType && (
                        <FormSection title="2. Let's get more specific.">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {currentSubServices.map(sub => (
                                    <div key={sub} onClick={() => handleSelect('subService', sub)} className={`flex items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 bg-deep-ocean-surface/50 ${formData.subService === sub ? 'border-action-blue dark:border-vibrant-magenta' : 'border-eggshell-white/20 hover:border-action-blue/50 dark:hover:border-vibrant-magenta/50'}`}>
                                        <span className="font-semibold text-eggshell-white">{sub}</span>
                                    </div>
                                ))}
                            </div>
                        </FormSection>
                    )}

                    {formData.subService && (
                         <FormSection title="3. What style feels right for you?">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentStyleOptions.map(style => (
                                    <div key={style.name} onClick={() => handleSelect('style', style.name)} className={`text-center border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 bg-deep-ocean-surface/50 overflow-hidden ${formData.style === style.name ? 'border-action-blue dark:border-vibrant-magenta' : 'border-eggshell-white/20 hover:border-action-blue/50 dark:hover:border-vibrant-magenta/50'}`}>
                                        <img src={style.image} alt={style.name} className="w-full h-40 object-cover" />
                                        <p className="font-semibold text-eggshell-white p-3">{style.name}</p>
                                    </div>
                                ))}
                            </div>
                        </FormSection>
                    )}
                    
                    {formData.style && (
                        <FormSection title="4. Tell us about your vision.">
                             <div className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-bold text-eggshell-white/80 mb-2">Project Title</label>
                                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-bold text-eggshell-white/80 mb-2">Project Description</label>
                                    <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" placeholder="Tell us about your project. What's the story you want to tell? What do you hope your audience will feel?"></textarea>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-bold text-eggshell-white/80 mb-2">Location</label>
                                        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" />
                                    </div>
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-bold text-eggshell-white/80 mb-2">Preferred Start Date</label>
                                        <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="requirements" className="block text-sm font-bold text-eggshell-white/80 mb-2">Additional Requirements (Optional)</label>
                                    <textarea name="requirements" id="requirements" rows={2} value={formData.requirements} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" placeholder="Any specific equipment, talent, or other needs?"></textarea>
                                </div>
                            </div>
                        </FormSection>
                    )}
                </div>

                <div className="p-6 border-t border-eggshell-white/10 flex-shrink-0 bg-deep-ocean-surface transition-all duration-300">
                    {errors.length > 0 ? (
                        <div className="text-left text-eggshell-white/70 animate-fade-in">
                            <p className="font-bold text-sm text-eggshell-white/90 mb-2">To complete your request, please provide:</p>
                            <ul className="list-disc list-inside text-xs grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                                {errors.map(error => <li key={error}>{error}</li>)}
                            </ul>
                        </div>
                    ) : (
                        <div className="flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition disabled:bg-action-blue/50 dark:disabled:bg-vibrant-magenta/50 disabled:cursor-wait relative overflow-hidden shine-effect button-inset-shadow">
                                <span className="relative z-10">
                                    {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );

    return ReactDOM.createPortal(modalContent, modalRoot);
};
