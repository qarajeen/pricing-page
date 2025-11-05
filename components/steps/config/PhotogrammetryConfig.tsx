import React, { useEffect } from 'react';
import { CommonOptions, OptionGroup, Radio } from './CommonOptions';
import type { QuoteFormData } from '../../../types';
import { PROJECT_PRICING } from '../../../services/pricingService';

interface ConfigProps {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const PhotogrammetryConfig: React.FC<ConfigProps> = ({ formData, updateFormData, onValidationChange }) => {
  const { config } = formData;
  const subServices = Object.keys(PROJECT_PRICING['Photogrammetry'].options.subService);
  
   useEffect(() => {
    const newConfig = { ...config };
    let needsUpdate = false;
    if (!newConfig.logistics) {
      newConfig.logistics = 'Dubai';
      needsUpdate = true;
    }
    if (!newConfig.delivery) {
      newConfig.delivery = 'Standard Delivery';
      needsUpdate = true;
    }
    if (needsUpdate) {
        updateFormData({ config: newConfig });
    }
  }, []);

  useEffect(() => {
    onValidationChange(!!config.subService && !!config.logistics && !!config.delivery);
  }, [config, onValidationChange]);

  const handleSubServiceChange = (name: string, value: string) => {
    updateFormData({ config: { ...config, [name]: value } });
  };

  return (
    <div className="space-y-6">
      <OptionGroup label="Project Scale">
        <Radio name="subService" options={subServices} value={config.subService} onChange={handleSubServiceChange} />
      </OptionGroup>
        
      {config.subService && (
        <div className="animate-fade-in-up">
          <CommonOptions formData={formData} updateFormData={updateFormData} />
        </div>
      )}
    </div>
  );
};