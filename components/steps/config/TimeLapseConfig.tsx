import React, { useEffect } from 'react';
import { CommonOptions, OptionGroup, Radio, Checkbox } from './CommonOptions';
import { QuantityStepper } from '../../QuantityStepper';
import type { QuoteFormData } from '../../../types';
import { PROJECT_PRICING } from '../../../services/pricingService';

interface ConfigProps {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const TimeLapseConfig: React.FC<ConfigProps> = ({ formData, updateFormData, onValidationChange }) => {
  const { config } = formData;
  const subServices = Object.keys(PROJECT_PRICING['Time Lapse'].options.subService);
  
  // Initialize duration when a sub-service is selected
  useEffect(() => {
    if (config.subService && !config.duration) {
        updateFormData({ config: { ...config, duration: 1 } });
    }
  }, [config.subService]);

  // Validation
  useEffect(() => {
    onValidationChange(!!config.subService && (config.duration || 0) > 0);
  }, [config, onValidationChange]);
  
  const handleSubServiceChange = (name: string, value: string) => {
    updateFormData({ config: { ...config, [name]: value, duration: 1 } });
  };

  const handleConfigChange = (key: string, value: any) => {
    updateFormData({ config: { ...config, [key]: value } });
  };
  
  const handleAddonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentAddons = config.addons || [];
    const newAddons = checked
      ? [...currentAddons, value]
      : currentAddons.filter((addon: string) => addon !== value);
    updateFormData({ config: { ...config, addons: newAddons } });
  };
  
  // Dynamically render the correct quantity stepper based on the sub-service name
  const renderDurationControl = () => {
    if (!config.subService) return null;

    let stepperProps = { label: 'Units', min: 1, max: 100 };
    if (config.subService.toLowerCase().includes('hour')) {
      stepperProps = { label: 'Hours', min: 1, max: 10 };
    } else if (config.subService.toLowerCase().includes('day')) {
      stepperProps = { label: 'Days', min: 1, max: 30 };
    } else if (config.subService.toLowerCase().includes('month')) {
      stepperProps = { label: 'Months', min: 1, max: 24 };
    }

    return (
      <QuantityStepper
        label={stepperProps.label}
        value={config.duration || 1}
        onValueChange={(val) => handleConfigChange('duration', val)}
        min={stepperProps.min}
        max={stepperProps.max}
      />
    );
  };
  
  const addons = (PROJECT_PRICING['Time Lapse'] as any).addons;

  return (
    <div className="space-y-6">
      <OptionGroup label="Project Term">
        <Radio name="subService" options={subServices} value={config.subService} onChange={handleSubServiceChange} />
      </OptionGroup>
      
      {config.subService && (
        <div className="pt-6 mt-6 border-t border-raisin-black/10 dark:border-eggshell-white/20 space-y-6 animate-fade-in-up">
            <OptionGroup label="Project Length">
                <p className="text-sm text-raisin-black/70 dark:text-eggshell-white/70 mb-4">Please specify the duration for your <span className="font-bold text-action-blue dark:text-vibrant-magenta">{config.subService}</span> time-lapse.</p>
              {renderDurationControl()}
            </OptionGroup>

            {addons && (
                <div className="pt-6 mt-6 border-t border-raisin-black/10 dark:border-eggshell-white/20">
                    <OptionGroup label="Add-ons">
                    <Checkbox 
                        options={Object.entries(addons).map(([name, price]) => ({
                            label: name,
                            tooltip: typeof price === 'string' ? `Adds ${price.replace('_base', '')} of base price.` : `Cost: AED ${price}`
                        }))} 
                        values={config.addons} 
                        onChange={handleAddonsChange} 
                    />
                    </OptionGroup>
                </div>
            )}
            
            <CommonOptions formData={formData} updateFormData={updateFormData} />
        </div>
      )}
    </div>
  );
};