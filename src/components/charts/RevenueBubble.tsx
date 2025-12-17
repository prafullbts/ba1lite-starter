import { formatSmartCurrency } from "@/utils/tempFormatting";

interface RevenueBubbleProps {
  cx?: number;
  cy?: number;
  payload?: {
    name: string;
    x: number;
    y: number;
    z: number;
    revenue: number;
    label: string;
    minZ: number;
    maxZ: number;
    isLatestRound?: boolean;
    decimals?: number;
  };
  index?: number;
}

export const RevenueBubble = ({ cx, cy, payload, index }: RevenueBubbleProps) => {
  if (!cx || !cy || !payload) return null;

  const { revenue, minZ, maxZ, name, isLatestRound } = payload;

  // Scale bubble size from 20-40px based on z-value
  const minRadius = 20;
  const maxRadius = 40;
  const range = maxZ - minZ;
  const radius = range === 0 
    ? (minRadius + maxRadius) / 2 
    : minRadius + ((revenue - minZ) / range) * (maxRadius - minRadius);

  // Determine round based on name
  const isBaseline = name === "Round 0";
  const isRound1 = name === "Round 1";
  const isRound2 = name === "Round 2";
  
  // Color styling for three rounds
  let fillColor, strokeColor, textColor, textWeight;

  if (isBaseline) {
    fillColor = "rgba(209, 213, 219, 0.6)";
    strokeColor = "rgb(156, 163, 175)";
    textColor = "hsl(var(--foreground))";
    textWeight = "500";
  } else if (isRound1) {
    // If Round 1 is the latest round, use dark magenta; otherwise use light pink
    if (isLatestRound) {
      fillColor = "rgba(231, 8, 101, 0.8)"; // CMM Magenta (dark)
      strokeColor = "rgb(231, 8, 101)";
      textColor = "white";
      textWeight = "700";
    } else {
      fillColor = "rgba(248, 165, 194, 0.7)"; // Light pink
      strokeColor = "rgb(248, 165, 194)";
      textColor = "white";
      textWeight = "600";
    }
  } else if (isRound2) {
    fillColor = "rgba(231, 8, 101, 0.8)"; // CMM Magenta
    strokeColor = "rgb(231, 8, 101)";
    textColor = "white";
    textWeight = "700";
  } else {
    // Fallback
    fillColor = "rgba(209, 213, 219, 0.6)";
    strokeColor = "rgb(156, 163, 175)";
    textColor = "hsl(var(--foreground))";
    textWeight = "500";
  }

  return (
    <g>
      {/* Drop shadow for current bubble only */}
      {!isBaseline && (
        <defs>
          <filter id={`bubble-shadow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>
      )}
      
      {/* Bubble circle */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={2}
        filter={!isBaseline ? `url(#bubble-shadow-${index})` : undefined}
      />
      
      {/* Revenue label inside bubble */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize="11"
        fontWeight={textWeight}
      >
        {formatSmartCurrency(payload.revenue, payload.decimals ?? 1)}
      </text>
    </g>
  );
};
