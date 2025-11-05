import React, { useState, useEffect, useRef } from 'react';
import type { Quote } from '../types';
import { formatCurrency } from '../utils/formatters';

// --- START: New Count Up Hook & Component ---
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

const useCountUp = (end: number, duration: number = 1500, startDelay: number = 200) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  
  useEffect(() => {
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < startDelay) {
          frameRef.current = requestAnimationFrame(animate);
          return;
      }

      const effectiveElapsedTime = elapsedTime - startDelay;
      const progress = Math.min(effectiveElapsedTime / duration, 1);
      const easedProgress = easeOutExpo(progress);
      
      const currentCount = easedProgress * end;
      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure it ends exactly on the end value
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, startDelay]);

  return count;
};

const AnimatedNumber: React.FC<{ value: number; isCurrency?: boolean; isInt?: boolean }> = ({ value, isCurrency = false, isInt = false }) => {
  const count = useCountUp(value);

  if (isCurrency) {
    return <span>{formatCurrency(count)}</span>;
  }
  
  if (isInt) {
    return <span>{Math.round(count)}</span>;
  }

  return <span>{Math.round(count)}</span>; // Default to rounded int if not specified
};
// --- END: New Count Up Hook & Component ---


interface QuoteDisplayProps {
  quote: Quote;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {

  return (
    <div className="ui-panel p-8 sm:p-10 rounded-3xl text-studio-text-dark dark:text-studio-text-light">
      <div className="flex flex-col sm:flex-row justify-between items-start text-center sm:text-left mb-8 gap-4">
        <div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl uppercase tracking-wider text-metallic">Quotation</h2>
          <p className="font-serif text-studio-text-dark/70 dark:text-studio-text-light/70 mt-1">Quote #: {quote.quoteNumber}</p>
          <p className="font-serif text-studio-text-dark/70 dark:text-studio-text-light/70">Date: {quote.date}</p>
        </div>
        <div className="sm:text-right">
            <div className="h-5 overflow-hidden">
              <img src="./2.png" alt="STUDIOO Logo" className="h-10 w-auto -mt-2.5" />
            </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-center sm:text-left">
        <div>
          <h4 className="font-sans text-sm text-studio-text-dark/60 dark:text-studio-text-light/60 font-bold uppercase tracking-wider mb-2">Prepared For</h4>
          <p className="text-lg font-bold text-studio-text-dark dark:text-studio-text-light">{quote.clientName}</p>
          {quote.clientCompany && <p className="text-md text-studio-text-dark/80 dark:text-studio-text-light/80">{quote.clientCompany}</p>}
          <div className="text-sm text-studio-text-dark/70 dark:text-studio-text-light/70 mt-1">
              {quote.clientEmail && <p>{quote.clientEmail}</p>}
              {quote.clientPhone && <p>{quote.clientPhone}</p>}
          </div>
        </div>
        <div>
          <h4 className="font-sans text-sm text-studio-text-dark/60 dark:text-studio-text-light/60 font-bold uppercase tracking-wider mb-2">Project</h4>
          <p className="font-sans text-studio-text-dark/80 dark:text-studio-text-light/80">{quote.projectName}</p>
        </div>
      </div>

      <div className="overflow-x-auto responsive-table">
        <table className="w-full text-left">
          <thead className="border-b-2 border-studio-panel-dark/50 dark:border-studio-text-light/20">
            <tr>
              <th className="p-3 font-bold uppercase tracking-wider text-sm font-sans">Description</th>
              <th className="p-3 text-center font-bold uppercase tracking-wider text-sm font-sans">Qty</th>
              <th className="p-3 text-right font-bold uppercase tracking-wider text-sm font-sans">Rate</th>
              <th className="p-3 text-right font-bold uppercase tracking-wider text-sm font-sans">Total</th>
            </tr>
          </thead>
          <tbody>
            {quote.lineItems.map((item, index) => (
              <tr key={index} className="border-b border-studio-panel-dark/30 dark:border-studio-text-light/10">
                <td className="p-3 font-sans" data-label="Description">{item.description}</td>
                <td className="p-3 text-center font-serif" data-label="Qty"><AnimatedNumber value={item.quantity} isInt /></td>
                <td className="p-3 text-right font-serif" data-label="Rate"><AnimatedNumber value={item.rate} isCurrency /></td>
                <td className="p-3 text-right font-serif" data-label="Total"><AnimatedNumber value={item.total} isCurrency /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-8">
        <div className="w-full max-w-xs font-serif">
          <div className="flex justify-between py-3 btn-glossy btn-glossy-gold px-4 rounded-xl mt-2 shadow-lg border border-amber-600/50">
            <span className="font-sans font-bold text-lg">Total</span>
            <span className="font-bold text-lg"><AnimatedNumber value={quote.grandTotal} isCurrency /></span>
          </div>
        </div>
      </div>
      
    </div>
  );
};