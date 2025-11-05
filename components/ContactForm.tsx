import React, { useState } from 'react';
import { supabaseClient as supabase } from '../services/supabaseClient';
import { useTranslation } from '../hooks/useTranslation';
import type { Language } from '../types';

const Icon: React.FC<{ path: string }> = ({ path }) => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d={path} clipRule="evenodd"></path></svg>
);

type SubmissionStatus = 'idle' | 'sending' | 'success' | 'error';

interface ContactFormProps {
    language: Language;
}

export const ContactForm: React.FC<ContactFormProps> = ({ language }) => {
    const { t } = useTranslation(language);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Project Quote',
        message: '',
    });
    const [status, setStatus] = useState<SubmissionStatus>('idle');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required.';
        if (!formData.email.trim()) {
          newErrors.email = 'Email address is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.message.trim()) newErrors.message = 'A message is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setStatus('sending');
        try {
            const { error } = await supabase.from('contact_submissions').insert(formData);

            if (error) {
                throw error;
            }

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: 'Project Quote', message: '' });

        } catch (error) {
            console.error('Error submitting contact form:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center p-8 bg-green-500/10 dark:bg-deep-ocean-surface/50 border border-green-500/50 rounded-lg">
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">{t('contactForm.successTitle')}</h3>
                <p className="text-raisin-black/80 dark:text-eggshell-white/80 mt-2">{t('contactForm.successMessage')}</p>
                <button onClick={() => setStatus('idle')} className="mt-6 font-bold text-action-blue dark:text-vibrant-magenta hover:underline">
                    {t('contactForm.sendAnother')}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="text-start bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 p-8 rounded-lg shadow-lg border border-raisin-black/10 dark:border-eggshell-white/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Name Field */}
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                        <Icon path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </div>
                    <input name="name" type="text" className={`w-full bg-eggshell-white dark:bg-deep-ocean-surface/50 ps-10 p-3 rounded-md border-2 text-raisin-black dark:text-eggshell-white ${errors.name ? 'border-red-500/70' : 'border-raisin-black/20 dark:border-eggshell-white/20'} focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta transition-colors`} placeholder={t('contactForm.name')} value={formData.name} onChange={handleChange} required />
                </div>
                {/* Email Field */}
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                        <Icon path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </div>
                    <input name="email" type="email" className={`w-full bg-eggshell-white dark:bg-deep-ocean-surface/50 ps-10 p-3 rounded-md border-2 text-raisin-black dark:text-eggshell-white ${errors.email ? 'border-red-500/70' : 'border-raisin-black/20 dark:border-eggshell-white/20'} focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta transition-colors`} placeholder={t('contactForm.email')} value={formData.email} onChange={handleChange} required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Field */}
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                        <Icon path="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </div>
                    <input name="phone" type="tel" className="w-full bg-eggshell-white dark:bg-deep-ocean-surface/50 ps-10 p-3 rounded-md border-2 border-raisin-black/20 dark:border-eggshell-white/20 text-raisin-black dark:text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta transition-colors" placeholder={t('contactForm.phone')} value={formData.phone} onChange={handleChange} />
                </div>
                {/* Subject Field */}
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-raisin-black/50 dark:text-eggshell-white/50">
                        <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </div>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-eggshell-white dark:bg-deep-ocean-surface/50 ps-10 p-3 rounded-md border-2 border-raisin-black/20 dark:border-eggshell-white/20 text-raisin-black dark:text-eggshell-white focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta appearance-none transition-colors">
                        <option>Project Quote</option>
                        <option>General Inquiry</option>
                        <option>Collaboration</option>
                        <option>Feedback</option>
                    </select>
                </div>
            </div>
            <div>
                 <textarea name="message" rows={5} className={`w-full bg-eggshell-white dark:bg-deep-ocean-surface/50 p-3 rounded-md border-2 text-raisin-black dark:text-eggshell-white ${errors.message ? 'border-red-500/70' : 'border-raisin-black/20 dark:border-eggshell-white/20'} focus:outline-none focus:border-action-blue dark:focus:border-vibrant-magenta transition-colors`} placeholder={t('contactForm.message')} value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                 {status === 'error' && (
                    <p className="text-red-400 text-sm">
                        {t('contactForm.error')}
                    </p>
                 )}
                 <div className="w-full sm:w-auto sm:ms-auto">
                    <div className="interactive-shadow-container w-full">
                        <button type="submit" disabled={status === 'sending'} className="w-full bg-action-blue text-eggshell-white dark:bg-vibrant-magenta dark:text-raisin-black font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition disabled:bg-action-blue/50 dark:disabled:bg-vibrant-magenta/50 disabled:cursor-wait shine-effect button-inset-shadow">
                            {status === 'sending' ? t('contactForm.sending') : t('contactForm.send')}
                        </button>
                    </div>
                 </div>
            </div>
        </form>
    );
};