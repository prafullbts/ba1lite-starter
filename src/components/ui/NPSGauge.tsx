import React from 'react';
import GaugeComponent from 'react-gauge-component';
import { useCalcValue } from '@/hooks/useCalcValue';

interface NPSGaugeProps {
  refName: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * NPS Gauge component using react-gauge-component
 * Displays NPS score (-100 to 100) as a semi-circle gauge with CMM color thresholds
 */
export function NPSGauge({ refName, className = '', width = 100, height = 38 }: NPSGaugeProps) {
  const rawValue = useCalcValue(refName, true);
  const npsValue = parseFloat(rawValue) || 0;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <GaugeComponent
        type="semicircle"
        marginInPercent={{ top: 0, bottom: 0, left: 0, right: 0 }}
        arc={{
            colorArray: ['#E70865', '#FF8F1C', '#008AD8'], // CMM Magenta, Orange, Cyan
            subArcs: [
              { limit: 0 },   // Negative NPS (Magenta) -100 to 0
              { limit: 30 },  // Neutral NPS (Orange) 0 to 30
              {}              // Positive NPS (Cyan) 30 to 100
            ],
            width: 0.25,
            padding: 0.02,
            cornerRadius: 1,
          }}
          pointer={{
            type: 'needle',
            color: '#01426A', // CMM Navy
            length: 0.7,
            width: 8,
            elastic: true,
            animationDelay: 0,
            animationDuration: 1500,
          }}
          labels={{
            valueLabel: {
              formatTextValue: (value) => `${Math.round(value)}`,
              style: {
                fontSize: '16px',
                fill: '#01426A',
                fontWeight: 'bold',
                textShadow: 'none',
              },
              matchColorWithArc: false,
            },
            tickLabels: {
              hideMinMax: true,
            }
          }}
          value={npsValue}
          minValue={-100}
          maxValue={100}
        style={{ 
          width: width,
          height: height,
        }}
      />
    </div>
  );
}
