import React, { useState, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface SimpleTooltipProps {
  content: string;
  children: ReactNode;
}

export function SimpleTooltip({ content, children }: SimpleTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleTooltipShow = () => {
    setIsVisible(true);
    
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap below trigger
        left: rect.left + rect.width / 2 + window.scrollX // Center horizontally
      });
    }
  };

  const handleTooltipHide = () => {
    setIsVisible(false);
  };

  return (
    <div 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleTooltipShow}
      onMouseLeave={handleTooltipHide}
    >
      {children}
      {isVisible && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 9999
          }}
          className="pointer-events-none"
        >
          <div className="bg-popover text-popover-foreground text-sm rounded-lg px-4 py-2 shadow-xl border border-border max-w-sm w-64">
            <div className="text-center whitespace-pre-wrap">
              {content}
            </div>
            {/* Arrow pointing up */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-b-popover"></div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}