import React, { useEffect, useState, useMemo } from 'react';
import { CommonOptions, OptionGroup, Radio, Checkbox } from './CommonOptions';
import { QuantityStepper } from '../../QuantityStepper';
import type { QuoteFormData } from '../../../types';
import { PACKAGE_DATA, PROJECT_PRICING } from '../../../services/pricingService';

interface ConfigProps {
  formData: QuoteFormData;
  updateFormData: (data: Partial<QuoteFormData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const areArraysEqual = (arr1: string[], arr2: string[]) => {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((value, index) => value === sorted2[index]);
};

// Helper to format option keys into readable labels
const formatLabel = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());


export const VideographyConfig: React.FC<ConfigProps> = ({ formData, updateFormData, onValidationChange }) => {
  const { config } = formData;
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const subServices = Object.keys(PROJECT_PRICING['Video Production']);

  const currentPackages = useMemo(() => {
    return PACKAGE_DATA[config.subService as keyof typeof PACKAGE_DATA] || [];
  }, [config.subService]);

  // Set default common options
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

  // Dynamic Validation Logic
  useEffect(() => {
    if (!config.subService) {
        onValidationChange(false);
        return;
    }

    // Sync selected package state with addons
    const currentAddons = config.addons || [];
    const matchingPackage = currentPackages.find(p => areArraysEqual(p.includedAddons, currentAddons));
    setSelectedPackage(matchingPackage ? matchingPackage.name : null);

    const subServiceConfig = (PROJECT_PRICING['Video Production'] as any)[config.subService];
    let optionsValid = true;

    if (subServiceConfig.options) {
      optionsValid = Object.keys(subServiceConfig.options).every(optionKey => !!config[optionKey]);
    }
    
    const commonOptionsValid = !!config.logistics && !!config.delivery;
    onValidationChange(optionsValid && commonOptionsValid);
  }, [config, onValidationChange, currentPackages]);

  const handleSubServiceChange = (name: string, value: string) => {
    updateFormData({ 
      config: { 
        logistics: config.logistics,
        delivery: config.delivery,
        [name]: value 
      } 
    });
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
  
  const handlePackageSelect = (packageName: string) => {
    const pkg = currentPackages.find(p => p.name === packageName);
    if (pkg) {
        setSelectedPackage(pkg.name);
        updateFormData({ config: { ...config, addons: pkg.includedAddons }});
    }
  };
  
  const renderPackageSelector = () => {
    if (!currentPackages.length) return null;
    return (
        <OptionGroup label="Choose a Starting Point">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPackages.map(pkg => (
                <div key={pkg.name} onClick={() => handlePackageSelect(pkg.name)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 h-full flex flex-col ${selectedPackage === pkg.name ? 'border-action-blue bg-action-blue/10 dark:border-vibrant-magenta dark:bg-vibrant-magenta/10 shadow-lg' : 'border-raisin-black/20 dark:border-eggshell-white/20 hover:border-action-blue/50 dark:hover:border-vibrant-magenta/50'}`}>
                    <h4 className="font-bold text-raisin-black dark:text-eggshell-white">{pkg.name}</h4>
                    <p className="text-sm text-raisin-black/70 dark:text-eggshell-white/70 mt-1 flex-grow">{pkg.description}</p>
                </div>
            ))}
          </div>
        </OptionGroup>
    );
  };
  
  const renderSubServiceOptions = () => {
    if (!config.subService) return null;

    const subServiceConfig = (PROJECT_PRICING['Video Production'] as any)[config.subService];
    if (!subServiceConfig) return null;

    // Conditionally render package selector for relevant sub-services
    const showPackages = ['Corporate Video', 'Promotional/Brand Video', 'Wedding Videography'].includes(config.subService);

    return (
      <>
        {showPackages && renderPackageSelector()}
        
        {/* Render Radio options for services like Event Videography */}
        {subServiceConfig.options && Object.entries(subServiceConfig.options).map(([key, options]) => (
          <React.Fragment key={key}>
            <OptionGroup label={formatLabel(key)}>
              <Radio 
                name={key} 
                options={Object.keys(options as object)} 
                value={config[key]} 
                onChange={handleConfigChange}
              />
            </OptionGroup>
            {key === 'duration' && config.duration === 'Per Hour' && (
               <OptionGroup label="Number of Hours">
                <QuantityStepper label="Hours" value={config.hours || 1} onValueChange={(val) => handleConfigChange('hours', val)} min={1} max={12} />
              </OptionGroup>
            )}
          </React.Fragment>
        ))}

        {/* Render Add-ons, now dynamically */}
        {subServiceConfig.addons && (
          <OptionGroup label={showPackages && selectedPackage ? "Customize Your Package" : "Select Add-ons"}>
            <Checkbox 
              options={Object.entries(subServiceConfig.addons).map(([name, price]) => ({
                label: name,
                tooltip: typeof price === 'string' ? `Adds ${price.replace('_base', '')} of base price.` : `Cost: AED ${price}`
              }))} 
              values={config.addons} 
              onChange={handleAddonsChange} 
            />
          </OptionGroup>
        )}
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
                <CommonOptions formData={formData} updateFormData={updateFormData} />
            </div>
        )}
    </div>
  );
};