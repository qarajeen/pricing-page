import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { Project } from '../types';

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onSave: (data: Partial<Omit<Project, 'id' | 'status' | 'client_id'>>) => Promise<void>;
}

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        projectType: project.project_type,
        subService: project.sub_service,
        style: project.style,
        title: project.title,
        description: project.description,
        location: project.location,
        date: project.start_date,
        requirements: project.requirements,
    });
    const modalRef = useRef<HTMLFormElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setLocalError(null);
        try {
            await onSave({
                project_type: formData.projectType,
                sub_service: formData.subService,
                style: formData.style,
                title: formData.title,
                description: formData.description,
                location: formData.location,
                start_date: formData.date,
                requirements: formData.requirements,
            });
            // On success, parent component will close the modal
        } catch (err) {
            let message = 'An unknown error occurred.';
            if (err && typeof err === 'object' && 'message' in err) {
               message = String(err.message);
            }
            setLocalError(message);
        } finally {
            setIsSaving(false);
        }
    };
    
    const isFormValid = formData.title && formData.location && formData.date && formData.description;
    
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    const modalContent = (
        <div 
            className="fixed inset-0 bg-raisin-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-project-title"
        >
            <div 
                className="bg-deep-ocean-surface w-full max-w-2xl rounded-lg shadow-2xl border border-eggshell-white/10 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-eggshell-white/10">
                    <h2 id="edit-project-title" className="font-serif font-bold text-2xl text-eggshell-white">Edit Project Details</h2>
                    <button onClick={onClose} aria-label="Close" className="text-eggshell-white/70 hover:text-action-blue dark:hover:text-vibrant-magenta transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form ref={modalRef} onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                    {localError && (
                        <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-center text-sm">
                            {localError}
                        </div>
                    )}
                    <div>
                        <label htmlFor="title" className="block text-sm font-bold text-eggshell-white/80 mb-2">Project Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-eggshell-white/80 mb-2">Project Description</label>
                        <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" required></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="location" className="block text-sm font-bold text-eggshell-white/80 mb-2">Location</label>
                            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" required />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-bold text-eggshell-white/80 mb-2">Start Date</label>
                            <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta" required />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="requirements" className="block text-sm font-bold text-eggshell-white/80 mb-2">Additional Requirements (Optional)</label>
                        <textarea name="requirements" id="requirements" rows={2} value={formData.requirements} onChange={handleChange} className="w-full bg-deep-ocean-surface/50 p-3 rounded-md border-2 border-eggshell-white/20 text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <h4 className="font-bold text-eggshell-white/80 mb-2">Category</h4>
                            <p className="p-3 bg-deep-ocean-surface/50 rounded-md">{formData.projectType}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-eggshell-white/80 mb-2">Service</h4>
                            <p className="p-3 bg-deep-ocean-surface/50 rounded-md">{formData.subService}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-eggshell-white/80 mb-2">Style</h4>
                            <p className="p-3 bg-deep-ocean-surface/50 rounded-md">{formData.style}</p>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-eggshell-white/10 flex justify-end gap-4">
                     <button type="button" onClick={onClose} className="font-bold py-2 px-6 rounded-full text-eggshell-white/80 hover:bg-eggshell-white/10 transition">
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        onClick={handleSubmit} 
                        disabled={isSaving || !isFormValid}
                        className="bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition disabled:bg-action-blue/50 dark:disabled:bg-vibrant-magenta/50 disabled:cursor-wait button-inset-shadow"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, modalRoot);
};
