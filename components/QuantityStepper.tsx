import React from 'react';

interface QuantityStepperProps {
  label: string;
  value: number;
  onValueChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  label,
  value,
  onValueChange,
  min = 1,
  max = 100,
  step = 1,
}) => {
  const handleDecrement = () => onValueChange(Math.max(min, value - step));
  const handleIncrement = () => onValueChange(Math.min(max, value + step));
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => onValueChange(Number(e.target.value));

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-studio-text-dark/80 dark:text-studio-text-light/80">{label}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleDecrement} disabled={value <= min} className="w-10 h-10 rounded-full btn-glossy btn-glossy-silver font-bold text-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`Decrease ${label}`}>-</button>
          <span className="w-12 text-center text-lg font-bold text-studio-text-dark dark:text-studio-text-light font-serif">{value}</span>
          <button type="button" onClick={handleIncrement} disabled={value >= max} className="w-10 h-10 rounded-full btn-glossy btn-glossy-silver font-bold text-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`Increase ${label}`}>+</button>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={handleSliderChange} className="w-full cursor-pointer range-slider" />
    </div>
  );
};