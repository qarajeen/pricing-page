import React, { useState } from 'react';
import type { QuoteFormData } from '../../types';
import { PhotographyConfig } from './config/PhotographyConfig';
import { VideographyConfig } from './config/VideographyConfig';
import { PostProductionConfig } from './config/PostProductionConfig';
import { ToursConfig } from './config/ToursConfig';
import { TimeLapseConfig } from './config/TimeLapseConfig';
import { PhotogrammetryConfig } from './config/PhotogrammetryConfig';
import { TrainingConfig } from './config/TrainingConfig';
import { RetainerConfig } from './config/RetainerConfig';

interface Step2Props {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2_Configuration: React.FC<Step2Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const [isFormValid, setIsFormValid] = useState(false);
  
  const getTitle = () => {
    switch(formData.engagementType) {
        case 'Retainer': return 'Configure Your Retainer';
        case 'Training': return 'Configure Your Training';
        case 'Project': return `Configure Your ${formData.service}`;
        default: return 'Configuration';
    }
  }

  const renderConfigComponent = () => {
    switch (formData.engagementType) {
        case 'Retainer':
            return <RetainerConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
        case 'Training':
            return <TrainingConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
        case 'Project':
            switch (formData.service) {
                case 'Photography':
                    return <PhotographyConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                case 'Video Production':
                    return <VideographyConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                case 'Post Production':
                    return <PostProductionConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                case '360 Tours':
                    return <ToursConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                case 'Time Lapse':
                    return <TimeLapseConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                case 'Photogrammetry':
                    return <PhotogrammetryConfig formData={formData} updateFormData={updateFormData} onValidationChange={setIsFormValid} />;
                default:
                    return <p className="text-center text-studio-text-dark/70 dark:text-studio-text-light/70">Please go back and select a service to configure it.</p>;
            }
        default:
            return <p className="text-center text-studio-text-dark/70 dark:text-studio-text-light/70">Please go back and select an engagement type.</p>;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-metallic mb-6 uppercase tracking-wider font-serif">
        {getTitle()}
      </h2>
      {renderConfigComponent()}
      <div className="flex justify-between items-center pt-8 mt-8 border-t border-black/10 dark:border-white/20">
        <button type="button" onClick={onBack} className="btn-glossy btn-glossy-silver font-bold py-3 px-8 rounded-full transition">Back</button>
        <button type="button" onClick={onNext} disabled={!isFormValid} className="btn-glossy btn-glossy-gold font-bold py-3 px-8 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed">
            Next: Contact Info
        </button>
      </div>
    </div>
  );
};