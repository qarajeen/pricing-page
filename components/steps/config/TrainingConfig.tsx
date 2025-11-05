import React, { useEffect } from 'react';
import { OptionGroup, Radio, Checkbox } from './CommonOptions';
import { QuantityStepper } from '../../QuantityStepper';
import type { QuoteFormData } from '../../../types';

interface ConfigProps {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const TrainingConfig: React.FC<ConfigProps> = ({ formData, updateFormData, onValidationChange }) => {
  const { config } = formData;
  const subServices = ['Private (one-on-one)', 'Group'];

  useEffect(() => {
    const newConfig = { ...config };
    let needsUpdate = false;
    if (!newConfig.subService) {
      newConfig.subService = subServices[0];
      needsUpdate = true;
    }
    if (!newConfig.logistics) {
      newConfig.logistics = 'Dubai';
      needsUpdate = true;
    }
     if (typeof newConfig.hours === 'undefined') {
      newConfig.hours = 1;
      needsUpdate = true;
    }
    if (needsUpdate) {
      updateFormData({ config: newConfig });
    }
  }, []);

  useEffect(() => {
    onValidationChange(!!config.subService && (config.hours || 0) > 0);
  }, [config, onValidationChange]);

  const handleConfigChange = (key: string, value: any) => {
    updateFormData({ config: { ...config, [key]: value } });
  };

  const handleAddonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentAddons = config.addons || [];
    let newAddons;
    if (checked) {
      newAddons = [...currentAddons, value];
    } else {
      newAddons = currentAddons.filter((addon: string) => addon !== value);
    }
    updateFormData({ config: { ...config, addons: newAddons } });
  };

  const handleSubServiceChange = (name: string, value: string) => {
    const newConfig = {
      ...config,
      [name]: value,
      addons: [], // Reset addons when changing type
    };
    updateFormData({ config: newConfig });
  };
  
  const renderAddons = () => {
    if (config.subService === 'Private (one-on-one)') {
      return (
        <OptionGroup label="Add-ons (Per Hour)">
          <Checkbox 
            options={[
              { label: 'Camera Rental', tooltip: 'AED 100 per hour' },
              { label: 'Classroom Rental', tooltip: 'AED 150 per hour' }
            ]} 
            values={config.addons} 
            onChange={handleAddonsChange} 
          />
        </OptionGroup>
      );
    }
    if (config.subService === 'Group') {
      return (
        <OptionGroup label="Add-ons (Per Hour)">
          <Checkbox 
            options={[{ label: 'Classroom Rental', tooltip: 'AED 200 per hour' }]} 
            values={config.addons} 
            onChange={handleAddonsChange} 
          />
        </OptionGroup>
      );
    }
    return null;
  }
  
  const logisticsOptions = ['Dubai', 'Sharjah', 'Abu Dhabi / Other Emirates'];

  return (
    <div className="space-y-6">
      <OptionGroup label="Type of Training">
        <Radio name="subService" options={subServices} value={config.subService} onChange={handleSubServiceChange} />
      </OptionGroup>

      <div className="pt-6 mt-6 border-t border-eggshell-white/20 space-y-6">
        <OptionGroup label="Duration">
            <QuantityStepper label="Hours" value={config.hours || 1} onValueChange={(val) => handleConfigChange('hours', val)} min={1} max={8} />
        </OptionGroup>
        
        {renderAddons()}
      </div>
      
      <div className="space-y-6 pt-6 mt-6 border-t border-eggshell-white/20">
        <OptionGroup label="Logistics & Travel">
            <Radio name="logistics" options={logisticsOptions} value={config.logistics} onChange={handleConfigChange} />
        </OptionGroup>
      </div>
    </div>
  );
};