interface TriangleMarkerProps {
  cx?: number;
  cy?: number;
  size?: number;
  fill?: string;
}

/**
 * Custom triangle marker for indicating actual team outcome on the chart
 */
export const TriangleMarker = ({ cx = 0, cy = 0, size = 8, fill = "white" }: TriangleMarkerProps) => {
  const points = [
    [cx, cy - size], // Top point
    [cx - size, cy + size], // Bottom left
    [cx + size, cy + size], // Bottom right
  ].map(point => point.join(',')).join(' ');

  return (
    <polygon
      points={points}
      fill={fill}
      stroke="hsl(var(--foreground))"
      strokeWidth={1}
    />
  );
};
