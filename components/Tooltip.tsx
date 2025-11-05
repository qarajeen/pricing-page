import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative flex items-center w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <div 
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-3 text-sm text-raisin-black bg-eggshell-white/95 backdrop-blur-sm rounded-lg shadow-lg z-10 transition-all duration-200 ease-in-out transform ${
            show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ pointerEvents: show ? 'auto' : 'none' }}
      >
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-eggshell-white/95"></div>
      </div>
    </div>
  );
};