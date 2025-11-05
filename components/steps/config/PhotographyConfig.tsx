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

// Helper to format option keys into readable labels (e.g., 'propertySize' -> 'Property Size')
const formatLabel = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

export const PhotographyConfig: React.FC<ConfigProps> = ({ formData, updateFormData, onValidationChange }) => {
  const { config } = formData;
  const subServices = Object.keys(PROJECT_PRICING['Photography']);

  // Set default common options on initial load
  useEffect(() => {
    if (!config.logistics || !config.delivery) {
      updateFormData({ 
        config: { 
          ...config,
          logistics: config.logistics || 'Dubai',
          delivery: config.delivery || 'Standard Delivery',
        } 
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Dynamic validation based on pricing data
  useEffect(() => {
    const subService = config.subService;
    if (!subService) {
        onValidationChange(false);
        return;
    }

    const subServiceConfig = (PROJECT_PRICING['Photography'] as any)[subService];
    if (!subServiceConfig) {
        onValidationChange(false);
        return;
    }
    
    const isValid = () => {
        // 1. Check common options
        if (!config.logistics || !config.delivery) return false;

        // 2. Check options specific to the sub-service
        if (subServiceConfig.options) {
            if (subService === 'Real Estate Photography') {
                if (!config.propertySize || !config.furnishing) return false;
            } else {
                for (const optionKey in subServiceConfig.options) {
                    if (!config[optionKey]) return false;
                }
            }
        }
        
        // 3. Check quantity-based requirements
        if (subServiceConfig.perItem && (!config.items || config.items < 1)) return false;
        if (subServiceConfig.perPerson && (!config.persons || config.persons < 1)) return false;

        // If all checks pass
        return true;
    };

    onValidationChange(isValid());
  }, [config, onValidationChange]);
  
  const handleSubServiceChange = (name: string, value: string) => {
    const subServiceConfig = (PROJECT_PRICING['Photography'] as any)[value];
    
    // Start with a clean config, preserving only common options
    const newConfig: { [key: string]: any } = { 
        logistics: config.logistics,
        delivery: config.delivery,
        [name]: value // This sets subService: value
    };

    // Set defaults based on the newly selected sub-service's data structure
    if (subServiceConfig) {
        if (value === 'Real Estate Photography') {
            newConfig.furnishing = 'Unfurnished'; // Specific default for this service
        }
        if (subServiceConfig.perItem) {
            newConfig.items = 1;
        }
        if (subServiceConfig.perPerson) {
            newConfig.persons = 1;
        }
    }
    
    updateFormData({ config: newConfig });
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

  // Dynamically render configuration options based on the selected sub-service
  const renderSubServiceOptions = () => {
    if (!config.subService) return null;

    const subServiceConfig = (PROJECT_PRICING['Photography'] as any)[config.subService];
    if (!subServiceConfig) return null;

    return (
      <>
        {/* Render Radio options */}
        {subServiceConfig.options && Object.entries(subServiceConfig.options).map(([key, options]) => (
          <React.Fragment key={key}>
            <OptionGroup label={formatLabel(key)}>
              <Radio 
                name={key} 
                options={Array.isArray(options) ? options as string[] : Object.keys(options as object)} 
                value={config[key] || ''} 
                onChange={(name, val) => handleConfigChange(name, val)}
              />
            </OptionGroup>
            {/* Special case for 'Per Hour' quantity stepper */}
            {key === 'duration' && config.duration === 'Per Hour' && (
               <OptionGroup label="Number of Hours">
                <QuantityStepper label="Hours" value={config.hours || 1} onValueChange={(val) => handleConfigChange('hours', val)} min={1} max={12} />
              </OptionGroup>
            )}
          </React.Fragment>
        ))}

        {/* Render Quantity Steppers for items/persons */}
        {subServiceConfig.perItem && (
          <OptionGroup label="Number of Items">
            <QuantityStepper label="Items" value={config.items || 1} onValueChange={(val) => handleConfigChange('items', val)} min={1} max={100} />
          </OptionGroup>
        )}
        {subServiceConfig.perPerson && (
          <OptionGroup label="Number of People">
            <QuantityStepper label="People" value={config.persons || 1} onValueChange={(val) => handleConfigChange('persons', val)} min={1} max={50} />
          </OptionGroup>
        )}

        {/* Render Add-ons */}
        {subServiceConfig.addons && (
          <OptionGroup label="Add-ons">
            <Checkbox 
              options={Object.entries(subServiceConfig.addons).map(([name, price]) => {
                  let tooltip = `Cost: AED ${price}`;
                  if (typeof price === 'string') {
                      tooltip = `Adds ${price.replace('_base', '')} of the base price.`
                  } else if (typeof price === 'object' && (price as any).perItem) {
                      tooltip = `Cost: AED ${(price as any).perItem} per item.`
                  }
                  // Hide Additional Hours from this list as it's handled separately
                  return name === 'Additional Hours' ? null : { label: name, tooltip };
              }).filter(Boolean) as { label: string; tooltip: string }[]} 
              values={config.addons} 
              onChange={handleAddonsChange} 
            />
          </OptionGroup>
        )}
        
        {/* Special case for Event Photography "Additional Hours" */}
        {config.subService === 'Event Photography' && (config.duration === 'Half Day (4 hours)' || config.duration === 'Full Day (8 hours)') && (
            <OptionGroup label="Extend Your Session">
                <QuantityStepper 
                    label="Additional Hours" 
                    value={config.additionalHours || 0} 
                    onValueChange={(val) => handleConfigChange('additionalHours', val)} 
                    min={0} 
                    max={4}
                />
            </OptionGroup>
        )}
      </>
    );
  };
  
  return (
    <div className="space-y-6">
      <OptionGroup label="Service Category">
        <Radio name="subService" options={subServices} value={config.subService || ''} onChange={handleSubServiceChange} />
      </OptionGroup>
      
      {config.subService && (
        <div className="pt-6 mt-6 border-t border-eggshell-white/20 space-y-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-action-blue dark:text-vibrant-magenta -mb-2">Configure: {config.subService}</h3>
            {renderSubServiceOptions()}
            <CommonOptions formData={formData} updateFormData={updateFormData} />
        </div>
      )}
    </div>
  );
};