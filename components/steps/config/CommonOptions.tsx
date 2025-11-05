import React from 'react';
import { Tooltip } from '../../Tooltip';
import type { QuoteFormData } from '../../../types';

export const OptionGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-sm font-bold text-studio-text-dark/80 dark:text-studio-text-light/80 mb-3">{label}</label>
    <div className="space-y-2">{children}</div>
  </div>
);

interface RadioOption { label: string; tooltip?: string; }
export const Radio: React.FC<{ name: string; options: (string | RadioOption)[]; value: string; onChange: (name: string, value: string) => void }> = ({ name, options, value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {options.map(option => {
      const label = typeof option === 'string' ? option : option.label;
      const tooltipText = typeof option === 'string' ? null : option.tooltip;
      const content = (
          <label key={label} className={`flex items-center justify-center text-center p-4 rounded-full cursor-pointer transition-all duration-300 btn-glossy ${value === label ? 'btn-glossy-gold' : 'btn-glossy-silver'}`}>
            <input type="radio" name={name} value={label} checked={value === label} onChange={e => onChange(name, e.target.value)} className="sr-only" />
            <span className="font-semibold">{label}</span>
          </label>
      );
      return tooltipText ? <Tooltip key={label} text={tooltipText}>{content}</Tooltip> : content;
    })}
  </div>
);

interface CheckboxOption { label: string; tooltip?: string; }
export const Checkbox: React.FC<{ options: (string | CheckboxOption)[]; values: string[]; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ options, values = [], onChange }) => (
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {options.map(option => {
      const label = typeof option === 'string' ? option : option.label;
      const tooltipText = typeof option === 'string' ? null : option.tooltip;
      const isChecked = (values || []).includes(label);
      const content = (
         <label key={label} className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 w-full btn-glossy ${isChecked ? 'btn-glossy-gold' : 'btn-glossy-silver'}`}>
          <div className="w-5 h-5 rounded-md border-2 border-black/20 dark:border-white/20 bg-white/30 dark:bg-black/20 flex items-center justify-center flex-shrink-0">
            {isChecked && <div className="w-3 h-3 bg-studio-gold-dark dark:bg-studio-gold rounded-sm"></div>}
          </div>
          <input type="checkbox" value={label} checked={isChecked} onChange={onChange} className="sr-only" />
          <span className="ml-3 font-semibold">{label}</span>
        </label>
      );
      return tooltipText ? <Tooltip key={label} text={tooltipText}>{content}</Tooltip> : content;
    })}
  </div>
);

export const CommonOptions: React.FC<{ formData: QuoteFormData; updateFormData: (data: Partial<QuoteFormData>) => void; }> = ({ formData, updateFormData }) => {
    const { config } = formData;
    const handleConfigChange = (key: string, value: any) => updateFormData({ config: { ...config, [key]: value } });
    const logisticsOptions = ['Dubai', 'Sharjah', 'Abu Dhabi / Other Emirates'];
    const deliveryOptions = ['Standard Delivery', { label: 'Rush Delivery (24h)', tooltip: '+50% of the combined Base Price and Add-ons cost.' }];
    return (
        <div className="space-y-6 pt-6 mt-6 border-t border-black/10 dark:border-white/20">
            <OptionGroup label="Logistics & Travel">
                <Radio name="logistics" options={logisticsOptions} value={config.logistics} onChange={handleConfigChange} />
            </OptionGroup>
            <OptionGroup label="Delivery Timeline">
                <Radio name="delivery" options={deliveryOptions} value={config.delivery} onChange={handleConfigChange} />
            </OptionGroup>
        </div>
    );
};