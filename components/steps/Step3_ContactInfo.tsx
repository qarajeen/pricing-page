import React, { useState, useEffect } from 'react';
import type { QuoteFormData } from '../../types';

interface Step3Props {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Icon: React.FC<{ path: string }> = ({ path }) => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d={path} clipRule="evenodd"></path></svg>
);

export const Step3_ContactInfo: React.FC<Step3Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const { contact } = formData;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!contact.name.trim()) newErrors.name = 'Full name is required.';
    if (!contact.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!contact.phone.trim()) newErrors.phone = 'Phone number is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Re-validate whenever the form data changes
  useEffect(() => {
    validate();
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ contact: { ...contact, [name]: value } });
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, company: true });
    if (validate()) {
      onNext();
    }
  };
  
  const inputBaseClasses = "w-full bg-studio-bg-light/50 dark:bg-studio-bg-dark/50 pl-10 p-3 rounded-xl text-studio-text-dark dark:text-studio-text-light placeholder-studio-text-dark/60 dark:placeholder-studio-text-light/60 focus:outline-none focus:ring-2 transition-all input-inset";
  const inputFocusClasses = "focus:ring-studio-gold/80 dark:focus:ring-studio-gold/80";
  const inputErrorClasses = "ring-2 ring-red-500/70";

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-metallic mb-2 uppercase tracking-wider font-serif">Just a Few Details to Get Started</h2>
      <p className="text-center text-studio-text-dark/70 dark:text-studio-text-light/70 mb-8">This helps us prepare a personalized quote and get in touch with you.</p>
      
      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Name Field */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-studio-text-dark/50 dark:text-studio-text-light/50">
                <Icon path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
             </div>
             <input id="name" name="name" type="text" className={`${inputBaseClasses} ${touched.name && errors.name ? inputErrorClasses : inputFocusClasses}`} placeholder="Full Name" value={contact.name} onChange={handleChange} onBlur={handleBlur} required />
             {touched.name && errors.name && <p className="text-red-400 text-xs mt-1 absolute">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-studio-text-dark/50 dark:text-studio-text-light/50">
                <Icon path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
             </div>
             <input id="email" name="email" type="email" className={`${inputBaseClasses} ${touched.email && errors.email ? inputErrorClasses : inputFocusClasses}`} placeholder="Email Address" value={contact.email} onChange={handleChange} onBlur={handleBlur} required />
             {touched.email && errors.email && <p className="text-red-400 text-xs mt-1 absolute">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-studio-text-dark/50 dark:text-studio-text-light/50">
                <Icon path="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
             </div>
             <input id="phone" name="phone" type="tel" className={`${inputBaseClasses} ${touched.phone && errors.phone ? inputErrorClasses : inputFocusClasses}`} placeholder="Phone Number" value={contact.phone} onChange={handleChange} onBlur={handleBlur} required />
             {touched.phone && errors.phone && <p className="text-red-400 text-xs mt-1 absolute">{errors.phone}</p>}
          </div>

          {/* Company Field */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-studio-text-dark/50 dark:text-studio-text-light/50">
                <Icon path="M10 2a2 2 0 11-4 0 2 2 0 014 0zM4 6a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2-2H6a2 2 0 01-2-2V6z" />
             </div>
             <input id="company" name="company" type="text" className={`${inputBaseClasses} ${inputFocusClasses}`} placeholder="Company (Optional)" value={contact.company} onChange={handleChange} />
          </div>

        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 mt-12 border-t border-black/10 dark:border-white/20">
          <button type="button" onClick={onBack} className="btn-glossy btn-glossy-silver font-bold py-3 px-8 rounded-full transition w-full sm:w-auto">Back</button>
          <button type="submit" disabled={Object.keys(errors).length > 0} className="btn-glossy btn-glossy-gold font-bold py-3 px-8 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto">
              Generate Quote
          </button>
        </div>
      </form>
    </div>
  );
};