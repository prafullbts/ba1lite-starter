import { formatNumberM } from "@/Sim/Content";

interface NetworkHealthBubbleProps {
  cx?: number;
  cy?: number;
  payload?: {
    networkHealth: number;
    name: string;
    z: number;
    minZ: number;
    maxZ: number;
    isLatestRound?: boolean;
  };
  index?: number;
}

/**
 * Custom bubble shape that displays Network Health value inside the bubble.
 * Dynamically scales bubble size based on z-value's position within dataset range.
 * 
 * Scaling Logic:
 * - Largest z-value in dataset → maxRadius (40px)
 * - Smallest z-value in dataset → minRadius (20px)
 * - All others scale proportionally via linear interpolation
 */
export const NetworkHealthBubble = ({ 
  cx = 0, 
  cy = 0, 
  payload, 
  index = 0 
}: NetworkHealthBubbleProps) => {
  if (!payload) return null;

  // Bubble size constraints (in pixels)
  const minRadius = 20;
  const maxRadius = 40;
  
  // Get z-value and dataset range from payload
  const zValue = payload.z || 0;
  const minZ = payload.minZ || zValue;
  const maxZ = payload.maxZ || zValue;
  
  // Linear interpolation: map z-value to radius
  // Formula: radius = minRadius + (normalized_position * radius_range)
  let radius;
  if (maxZ === minZ) {
    // Edge case: all values are the same, use middle size
    radius = (minRadius + maxRadius) / 2;
  } else {
    // Normalize z-value to [0, 1] range
    const normalizedPosition = (zValue - minZ) / (maxZ - minZ);
    // Map to [minRadius, maxRadius] range
    radius = minRadius + normalizedPosition * (maxRadius - minRadius);
  }

  const isBaseline = payload.name === "Round 0";
  const isRound1 = payload.name === "Round 1";
  const isRound2 = payload.name === "Round 2";
  
  // Color definitions for three rounds
  // Round 0: Gray
  // Round 1: Light pink
  // Round 2: CMM Magenta
  let fillColor, strokeColor, textColor, textWeight, bubbleLabel;

  if (isBaseline) {
    fillColor = "rgba(209, 213, 219, 0.6)";
    strokeColor = "rgb(156, 163, 175)";
    textColor = "hsl(var(--foreground))";
    textWeight = "500";
    bubbleLabel = "B";
  } else if (isRound1) {
    // If Round 1 is the latest round, use dark magenta; otherwise use light pink
    if (payload.isLatestRound) {
      fillColor = "rgba(231, 8, 101, 0.8)"; // CMM Magenta (dark)
      strokeColor = "rgb(231, 8, 101)";
      textColor = "white";
      textWeight = "700";
      bubbleLabel = "1";
    } else {
      fillColor = "rgba(248, 165, 194, 0.7)"; // Light pink
      strokeColor = "rgb(248, 165, 194)";
      textColor = "white";
      textWeight = "600";
      bubbleLabel = "1";
    }
  } else if (isRound2) {
    fillColor = "rgba(231, 8, 101, 0.8)"; // CMM Magenta
    strokeColor = "rgb(231, 8, 101)";
    textColor = "white";
    textWeight = "700";
    bubbleLabel = "2";
  } else {
    // Fallback
    fillColor = "rgba(209, 213, 219, 0.6)";
    strokeColor = "rgb(156, 163, 175)";
    textColor = "hsl(var(--foreground))";
    textWeight = "500";
    bubbleLabel = "?";
  }
  
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={2}
        className={isBaseline ? "" : "drop-shadow-lg"}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize="11"
        fontWeight={textWeight}
      >
        {formatNumberM(payload.networkHealth, 1)}
      </text>
    </g>
  );
};
