import React, { useState } from 'react';
import type { QuoteFormData, Language } from '../types';
import { Step1_EngagementType } from './steps/Step1_EngagementType';
import { Step2_Configuration } from './steps/Step2_Configuration';
import { Step3_ContactInfo } from './steps/Step3_ContactInfo';
import { Step4_Summary } from './steps/Step4_Summary';
import { ProgressBar } from './steps/ProgressBar';

const initialFormData: QuoteFormData = {
  engagementType: null,
  service: null,
  config: {},
  contact: {
    name: '',
    email: '',
    phone: '',
    company: '',
  },
};

interface QuoteCalculatorProps {
    language: Language;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ language }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  
  const getActiveSteps = () => {
    // The flow is now consistent. 'Selection' is the new combined first step.
    return ['Selection', 'Configure', 'Contact', 'Quote'];
  };

  const steps = getActiveSteps();
  const totalSteps = steps.length;

  const updateFormData = (data: Partial<QuoteFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps + 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const reset = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  }
  
  const renderStep = () => {
    const stepName = steps[currentStep - 1];

    switch (stepName) {
        case 'Selection': 
            return <Step1_EngagementType formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
        case 'Configure': 
            return <Step2_Configuration formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
        case 'Contact': 
            return <Step3_ContactInfo formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
        case 'Quote':
             // The summary page is effectively the step after the last configuration step
             return <Step4_Summary formData={formData} onBack={handleBack} onReset={reset} />;
        default: 
             if (currentStep > totalSteps) {
                 return <Step4_Summary formData={formData} onBack={handleBack} onReset={reset} />;
             }
            return null;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} customSteps={steps} />
      </div>
      <div className="ui-panel p-6 sm:p-10 rounded-3xl">
        {renderStep()}
      </div>
    </div>
  );
};