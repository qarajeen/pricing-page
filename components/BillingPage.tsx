import React from 'react';

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-12 h-12 text-raisin-black/40 dark:text-eggshell-white/40" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

export const BillingPage: React.FC = () => {
  return (
    <div className="bg-eggshell-white/50 dark:bg-deep-ocean-surface/50 p-8 rounded-lg border border-raisin-black/10 dark:border-eggshell-white/10 animate-fade-in-up">
      <h2 className="text-2xl font-bold font-serif text-raisin-black dark:text-eggshell-white mb-6">Billing & Invoices</h2>
      <div className="text-center p-12 bg-eggshell-white/30 dark:bg-deep-ocean-surface/30 rounded-lg border-2 border-dashed border-raisin-black/20 dark:border-eggshell-white/20">
          <div className="flex justify-center items-center mb-4">
              <Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3.75-3.75M17.25 19.5l-3.75-3.75m0 0l3.75 3.75m-3.75-3.75l3.75-3.75" />
          </div>
          <h3 className="text-xl font-bold text-raisin-black dark:text-eggshell-white">Billing Area Under Construction</h3>
          <p className="text-raisin-black/60 dark:text-eggshell-white/60 mt-2 max-w-md mx-auto">This is where you'll be able to view and download your invoices, check your payment history, and manage your payment methods. This feature is coming soon!</p>
      </div>
    </div>
  );
};