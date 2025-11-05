import React, { useEffect } from 'react';
import { OptionGroup, Checkbox } from './CommonOptions';
import { QuantityStepper } from '../../QuantityStepper';
import type { QuoteFormData } from '../../../types';

interface ConfigProps {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const addons = [
    { label: 'Second Camera', tooltip: 'Adds a second camera operator for more dynamic coverage during shoots.' },
    { label: 'Advanced Shooting Tools', tooltip: 'Adds 50% of the base monthly cost for tools like high-end cameras, drones, etc.' },
    { label: 'Full Scriptwriting & Storyboarding', tooltip: 'Complete pre-production planning for a narrative-driven video.' },
    { label: 'Advanced Editing & Color Grading', tooltip: 'High-end post-production for a cinematic and polished look.' },
    { label: 'Custom Motion Graphics', tooltip: 'Branded animations, titles, and lower thirds.' },
    { label: 'Professional Voice-over', tooltip: 'A professional voice actor to narrate your video.' },
];

export const RetainerConfig: React.FC<ConfigProps> = ({ formData, updateFormData, onValidationChange }) => {
  const { config } = formData;

  useEffect(() => {
    // Set a default number of hours if none is selected
    if (typeof config.hours === 'undefined') {
      updateFormData({ config: { ...config, hours: 4, retainerAddons: [] } }); 
    }
  }, []);

  useEffect(() => {
    // Validation logic: hours must be selected and > 0
    onValidationChange(!!config.hours && config.hours > 0);
  }, [config.hours, onValidationChange]);

  const handleConfigChange = (key: string, value: any) => {
    updateFormData({ config: { ...config, [key]: value } });
  };
  
  const handleAddonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentAddons = config.retainerAddons || [];
    let newAddons;
    if (checked) {
      newAddons = [...currentAddons, value];
    } else {
      newAddons = currentAddons.filter((addon: string) => addon !== value);
    }
    updateFormData({ config: { ...config, retainerAddons: newAddons } });
  };

  return (
    <div className="space-y-8">
      <OptionGroup label="Select Your Monthly Hours">
        <p className="text-sm text-raisin-black/70 dark:text-eggshell-white/70 mb-4">
          Choose the number of dedicated hours you need each month. The first hour includes the initial consultation and setup.
        </p>
        <QuantityStepper 
          label="Hours per Month" 
          value={config.hours || 4} 
          onValueChange={(val) => handleConfigChange('hours', val)} 
          min={1} 
          max={40} 
          step={1}
        />
      </OptionGroup>

      <div className="pt-8 border-t border-raisin-black/10 dark:border-eggshell-white/20">
        <OptionGroup label="Customize with Add-Ons">
          <Checkbox options={addons} values={config.retainerAddons} onChange={handleAddonsChange} />
        </OptionGroup>
      </div>
    </div>
  );
};