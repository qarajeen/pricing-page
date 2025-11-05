import React, { useState, useEffect, useRef } from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  customSteps: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, customSteps }) => {
  const activeLabelIndex = Math.min(currentStep - 1, totalSteps);
  const progressPercentage = activeLabelIndex > 0 ? (activeLabelIndex / (totalSteps - 1)) * 100 : 0;
  
  const [stepName, setStepName] = useState(customSteps[activeLabelIndex] || 'Done');
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    const newActiveIndex = Math.min(currentStep - 1, totalSteps);
    if (prevStepRef.current !== currentStep) {
        setStepName(customSteps[newActiveIndex] || 'Done');
        prevStepRef.current = currentStep;
    } else if (customSteps[newActiveIndex] !== stepName) {
        setStepName(customSteps[newActiveIndex]);
    }
  }, [currentStep, customSteps, stepName, totalSteps]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-studio-text-dark dark:text-studio-text-light font-serif tracking-wider uppercase">
          Step {activeLabelIndex + 1}: <span className="text-metallic">{stepName}</span>
        </span>
        <span className="text-sm font-semibold text-studio-text-dark/70 dark:text-studio-text-light/70 font-serif">
          {activeLabelIndex + 1}/{totalSteps}
        </span>
      </div>
      <div className="w-full bg-studio-panel-dark/20 dark:bg-black/20 rounded-full h-3.5 overflow-hidden shadow-inner">
        <div
          className="relative bg-gradient-to-r from-studio-gold-dark to-studio-gold h-3.5 rounded-full transition-all duration-500 ease-in-out border-t border-white/30 overflow-hidden progress-shimmer"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};