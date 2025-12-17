/**
 * InfoTooltip Component
 * Displays an info button with a tooltip on hover
 */
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  variant?: 'magenta' | 'grey' | 'simple';
}

export function InfoTooltip({ content, position = 'bottom', className, variant = 'magenta' }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [screenPosition, setScreenPosition] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleTooltipShow = () => {
    setIsVisible(true);

    // Calculate screen position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let top = 0;
      let left = 0;

      switch (position) {
        case 'bottom':
          top = rect.bottom + scrollY + 8;
          left = rect.left + rect.width / 2 + scrollX;
          break;
        case 'top':
          top = rect.top + scrollY - 8;
          left = rect.left + rect.width / 2 + scrollX;
          break;
        case 'left':
          top = rect.top + rect.height / 2 + scrollY;
          left = rect.left + scrollX - 8;
          break;
        case 'right':
          top = rect.top + rect.height / 2 + scrollY;
          left = rect.right + scrollX + 8;
          break;
      }

      // Viewport boundary detection
      const tooltipWidth = 320;
      const tooltipHeight = 100;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 16;

      let adjustedPosition = position;
      let adjustedTop = top;
      let adjustedLeft = left;

      // Check boundaries and adjust position if needed
      if (position === 'bottom') {
        const tooltipBottom = top + tooltipHeight;
        if (tooltipBottom > viewportHeight - margin) {
          adjustedPosition = 'top';
          adjustedTop = rect.top + scrollY - 8;
        }
        
        const tooltipRight = left + tooltipWidth / 2;
        if (tooltipRight > viewportWidth - margin) {
          adjustedLeft = viewportWidth - tooltipWidth / 2 - margin + scrollX;
        }
        
        const tooltipLeft = left - tooltipWidth / 2;
        if (tooltipLeft < margin) {
          adjustedLeft = tooltipWidth / 2 + margin + scrollX;
        }
      }

      if (position === 'top') {
        const tooltipTop = top - tooltipHeight;
        if (tooltipTop < margin) {
          adjustedPosition = 'bottom';
          adjustedTop = rect.bottom + scrollY + 8;
        }
        
        const tooltipRight = left + tooltipWidth / 2;
        if (tooltipRight > viewportWidth - margin) {
          adjustedLeft = viewportWidth - tooltipWidth / 2 - margin + scrollX;
        }
        
        const tooltipLeft = left - tooltipWidth / 2;
        if (tooltipLeft < margin) {
          adjustedLeft = tooltipWidth / 2 + margin + scrollX;
        }
      }

      if (position === 'left' || position === 'right') {
        const tooltipBottom = top + tooltipHeight / 2;
        const tooltipTop = top - tooltipHeight / 2;
        
        if (tooltipBottom > viewportHeight - margin) {
          adjustedTop = viewportHeight - tooltipHeight / 2 - margin + scrollY;
        }
        
        if (tooltipTop < margin) {
          adjustedTop = tooltipHeight / 2 + margin + scrollY;
        }
        
        if (position === 'left') {
          const tooltipLeft = left - tooltipWidth;
          if (tooltipLeft < margin) {
            adjustedPosition = 'right';
            adjustedLeft = rect.right + scrollX + 8;
          }
        }
        
        if (position === 'right') {
          const tooltipRight = left + tooltipWidth;
          if (tooltipRight > viewportWidth - margin) {
            adjustedPosition = 'left';
            adjustedLeft = rect.left + scrollX - 8;
          }
        }
      }

      setActualPosition(adjustedPosition);
      setScreenPosition({ top: adjustedTop, left: adjustedLeft });

      // Find the card element and boost its stacking context
      const cardSection = buttonRef.current.closest('[data-node-id]');
      if (cardSection) {
        const stackingParent = cardSection.closest('.z-10');
        if (stackingParent instanceof HTMLElement) {
          stackingParent.style.zIndex = '50';
        }
      }
    }
  };

  const handleTooltipHide = () => {
    setIsVisible(false);

    // Reset the z-index on the stacking context parent after animation completes
    setTimeout(() => {
      if (buttonRef.current) {
        const cardSection = buttonRef.current.closest('[data-node-id]');
        if (cardSection) {
          const stackingParent = cardSection.closest('.z-10');
          if (stackingParent instanceof HTMLElement) {
            stackingParent.style.zIndex = '';
          }
        }
      }
    }, 250); // Delay slightly longer than tooltip animation (200ms)
  };

  const getTooltipTransform = (pos: typeof position) => {
    switch (pos) {
      case 'bottom':
        return 'translate(-50%, 0)';
      case 'top':
        return 'translate(-50%, -100%)';
      case 'left':
        return 'translate(-100%, -50%)';
      case 'right':
        return 'translate(0, -50%)';
    }
  };

  const getArrowStyles = (pos: typeof position) => {
    const baseStyle = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      borderWidth: '6px',
      borderStyle: 'solid' as const,
      borderColor: 'transparent'
    };

    switch (pos) {
      case 'bottom':
        return {
          ...baseStyle,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottomColor: 'hsl(var(--popover))'
        };
      case 'top':
        return {
          ...baseStyle,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderTopColor: 'hsl(var(--popover))'
        };
      case 'left':
        return {
          ...baseStyle,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderLeftColor: 'hsl(var(--popover))'
        };
      case 'right':
        return {
          ...baseStyle,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderRightColor: 'hsl(var(--popover))'
        };
    }
  };

  return (
    <div className={cn("relative inline-block z-[9999]", className)}>
      {/* Info Button */}
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          "rounded-full transition-all duration-200",
          "flex items-center justify-center",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          "cursor-help",
          variant === 'simple' ? '' : 'shadow-sm hover:shadow-md',
          variant === 'grey' && 'w-3 h-3 bg-gray-300 hover:bg-gray-400 text-gray-700',
          variant === 'magenta' && 'h-4 w-4 theme-info-button text-white text-xs font-bold',
          variant === 'simple' && 'h-4 w-4 text-muted-foreground hover:text-foreground'
        )}
        onMouseEnter={handleTooltipShow}
        onMouseLeave={handleTooltipHide}
        onFocus={handleTooltipShow}
        onBlur={handleTooltipHide}
      >
        {variant === 'grey' ? (
          <Info className="w-2 h-2" strokeWidth={2.5} />
        ) : variant === 'simple' ? (
          <Info className="h-4 w-4" />
        ) : (
          'i'
        )}
      </button>

      {/* Tooltip Portal */}
      {isVisible && createPortal(
        <div
          style={{
            position: 'fixed',
            top: `${screenPosition.top}px`,
            left: `${screenPosition.left}px`,
            transform: getTooltipTransform(actualPosition),
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          <div
            className={cn(
              "px-4 py-3 text-sm rounded-lg shadow-xl border",
              "w-80 whitespace-normal break-words",
              "animate-in fade-in-0 zoom-in-95 duration-200",
              "bg-popover text-popover-foreground border-border"
            )}
            role="tooltip"
          >
            {content}
            
            {/* Arrow */}
            <div style={getArrowStyles(actualPosition)} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
