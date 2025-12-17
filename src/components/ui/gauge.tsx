import React from 'react';
import { cn } from '@/lib/utils';

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function Gauge({ 
  value, 
  max, 
  label, 
  size = 'md', 
  color = 'hsl(var(--secondary))',
  className 
}: GaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20', 
    lg: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--border))"
            strokeWidth="6"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold text-foreground', textSizes[size])}>
            {value}
          </span>
        </div>
      </div>
      <span className={cn('text-muted-foreground text-center', textSizes[size])}>
        {label}
      </span>
    </div>
  );
}