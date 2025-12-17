import { Rectangle } from "recharts";

interface CustomRangeBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: {
    rangeMin: number;
    rangeMax: number;
  };
  [key: string]: any;
}

/**
 * Custom bar shape that renders from rangeMin to rangeMax instead of 0 to value
 * Used to show a floating range bar in the chart
 */
export const CustomRangeBar = (props: CustomRangeBarProps) => {
  const { x = 0, y = 0, width = 0, height = 0, fill, payload } = props;
  
  if (!payload) return null;
  
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      radius={[4, 4, 4, 4]}
    />
  );
};
