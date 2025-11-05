import React, { useEffect } from 'react';
import { OptionGroup, Radio } from './CommonOptions';
import { QuantityStepper } from '../../QuantityStepper';
import type { QuoteFormData } from '../../../types';
import { PROJECT_PRICING } from '../../../services/pricingService';

interface ConfigProps {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const formatLabel = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

export const PostProductionConfig: React.FC<ConfigProps> = ({ formData, updateFormData, onValidationChange }) => {
  const { config } = formData;
  const subServices = Object.keys(PROJECT_PRICING['Post Production']);

  // Dynamic validation
  useEffect(() => {
    if (!config.subService) {
        onValidationChange(false);
        return;
    }
    const subServiceConfig = (PROJECT_PRICING['Post Production'] as any)[config.subService];
    let optionsValid = true;

    if (subServiceConfig.options) {
      optionsValid = Object.keys(subServiceConfig.options).every(optionKey => !!config[optionKey]);
    }

    onValidationChange(optionsValid);
  }, [config, onValidationChange]);

  const handleSubServiceChange = (name: string, value: string) => {
    // Reset config on sub-service change
    updateFormData({ config: { [name]: value } });
  };
  
  const handleConfigChange = (key: string, value: any) => {
    updateFormData({ config: { ...config, [key]: value } });
  };

  const renderSubServiceOptions = () => {
    if (!config.subService) return null;
    
    const subServiceConfig = (PROJECT_PRICING['Post Production'] as any)[config.subService];
    if (!subServiceConfig) return null;

    return (
      <>
        {/* Render Radio options */}
        {subServiceConfig.options && Object.entries(subServiceConfig.options).map(([key, options]) => (
          <React.Fragment key={key}>
            <OptionGroup label={formatLabel(key)}>
              <Radio 
                name={key} 
                options={Object.keys(options as object).map(opt => {
                    // This is a simple tooltip generator; could be expanded
                    const price = (options as any)[opt];
                    return { label: opt, tooltip: `Starts at AED ${price}` };
                })}
                value={config[key]} 
                onChange={handleConfigChange}
              />
            </OptionGroup>
            
            {/* Special handling for quantity steppers */}
            {(key === 'editType' && (config.editType === 'Per Hour' || config.editType === 'Per Finished Minute')) && (
              <OptionGroup label="Quantity">
                 <QuantityStepper label={config.editType === 'Per Hour' ? 'Hours' : 'Minutes'} value={config.quantity || 1} onValueChange={(val) => handleConfigChange('quantity', val)} min={1} max={120} />
              </OptionGroup>
            )}
             {(key === 'retouchType') && (
              <OptionGroup label="Number of Photos">
                <QuantityStepper label="Photos" value={config.photos || 1} onValueChange={(val) => handleConfigChange('photos', val)} min={1} max={200} />
              </OptionGroup>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="space-y-6">
        <OptionGroup label="Service Category">
            <Radio name="subService" options={subServices} value={config.subService} onChange={handleSubServiceChange} />
        </OptionGroup>

        {config.subService && (
            <div className="pt-6 mt-6 border-t border-raisin-black/10 dark:border-eggshell-white/20 space-y-6 animate-fade-in-up">
                 <h3 className="text-lg font-bold text-action-blue dark:text-vibrant-magenta -mb-2">Configure: {config.subService}</h3>
                {renderSubServiceOptions()}
            </div>
        )}
      {/* Note: CommonOptions for logistics are excluded as per pricingService logic */}
    </div>
  );
};