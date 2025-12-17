import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
import * as icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleTooltip } from '@/components/ui/SimpleTooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PercentageOption {
  label: string;
  icon: string;
  percent: number;
}

interface PercentageAllocatorProps {
  title: string;
  infoTooltip: string;
  left: PercentageOption;
  right: PercentageOption;
  step?: number;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'read-only';
  onChange?: (leftPercent: number, rightPercent: number) => void;
  className?: string;
}

export function PercentageAllocator({
  title,
  infoTooltip,
  left,
  right,
  step = 5,
  disabled = false,
  variant = 'default',
  onChange,
  className
}: PercentageAllocatorProps) {
  const [leftPercent, setLeftPercent] = useState(left.percent);
  const rightPercent = 100 - leftPercent;

  const isReadOnly = variant === 'read-only' || disabled;
  const isCompact = variant === 'compact';

  // Get icon components from lucide-react
  const getIcon = (iconName: string): LucideIcon => {
    const iconKey = iconName
      .split('-')
      .map((word, index) => 
        index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
    
    return (icons as any)[iconKey] || icons.Circle;
  };

  const LeftIcon = getIcon(left.icon);
  const RightIcon = getIcon(right.icon);

  const handleLeftArrow = () => {
    if (isReadOnly) return;
    const newLeft = Math.min(leftPercent + step, 100);
    setLeftPercent(newLeft);
    onChange?.(newLeft, 100 - newLeft);
  };

  const handleRightArrow = () => {
    if (isReadOnly) return;
    const newLeft = Math.max(leftPercent - step, 0);
    setLeftPercent(newLeft);
    onChange?.(newLeft, 100 - newLeft);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isReadOnly) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        handleLeftArrow();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleRightArrow();
        break;
    }
  };

  const iconSize = isCompact ? 20 : 24;
  const buttonSize = isCompact ? 32 : 40;

  return (
    <Card className={cn("w-full max-w-[520px] mx-auto", className)}>
      <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", isCompact ? "pb-2" : "pb-4")}>
        <CardTitle className="text-cmm-magenta font-medium text-base">
          {title}
        </CardTitle>
        <SimpleTooltip content={infoTooltip}>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </SimpleTooltip>
      </CardHeader>
      <CardContent className={cn(isCompact ? "px-4 pb-4" : "px-6 pb-6")}>
        <div 
          className="grid grid-cols-3 gap-4 items-center"
          role="group"
          aria-label={`${title}: ${left.label} ${leftPercent} percent, ${right.label} ${rightPercent} percent`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {/* Left Option */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <LeftIcon 
                size={iconSize} 
                className="text-cmm-navy transition-opacity"
                style={{ opacity: leftPercent >= 50 ? 1 : 0.4 }}
              />
              <span className="text-2xl font-semibold text-foreground">
                {leftPercent}%
              </span>
            </div>
            <span className="text-sm font-medium text-muted-foreground text-center">
              {left.label}
            </span>
          </div>

          {/* Control Buttons */}
          {!isReadOnly && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleLeftArrow}
                disabled={leftPercent >= 100}
                aria-label={`Increase ${left.label} by ${step} percent`}
                className={cn(
                  "rounded-full bg-cmm-navy text-white flex items-center justify-center transition-all",
                  "hover:bg-cmm-cyan hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-cmm-navy",
                  "focus:outline-none focus:ring-2 focus:ring-cmm-cyan focus:ring-offset-2"
                )}
                style={{ width: buttonSize, height: buttonSize }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleRightArrow}
                disabled={leftPercent <= 0}
                aria-label={`Increase ${right.label} by ${step} percent`}
                className={cn(
                  "rounded-full bg-cmm-navy text-white flex items-center justify-center transition-all",
                  "hover:bg-cmm-cyan hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-cmm-navy",
                  "focus:outline-none focus:ring-2 focus:ring-cmm-cyan focus:ring-offset-2"
                )}
                style={{ width: buttonSize, height: buttonSize }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Right Option */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-semibold text-foreground">
                {rightPercent}%
              </span>
              <RightIcon 
                size={iconSize} 
                className="text-cmm-navy transition-opacity"
                style={{ opacity: rightPercent >= 50 ? 1 : 0.4 }}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground text-center">
              {right.label}
            </span>
          </div>
        </div>

        {/* ARIA live region for screen readers */}
        <div 
          className="sr-only" 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
        >
          {left.label} {leftPercent} percent, {right.label} {rightPercent} percent
        </div>
      </CardContent>
    </Card>
  );
}
