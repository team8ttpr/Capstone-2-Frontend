import React from "react";
import Skeleton from "react-loading-skeleton";

// Reusable skeleton shapes (colors come from the app-wide SkeletonTheme in App.jsx).

export const RowSkeleton = ({ count = 5, width = 260, height = 90 }) => (
  <div style={{ display: "flex", gap: 16, overflow: "hidden", padding: "10px 0" }}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} width={width} height={height} borderRadius={10} />
    ))}
  </div>
);

export const BlockSkeleton = ({ width = 360, height = 360, borderRadius = 16 }) => (
  <Skeleton width={width} height={height} borderRadius={borderRadius} />
);

export const GridSkeleton = ({ count = 8, minWidth = 220, height = 170 }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
      gap: 16,
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} height={height} borderRadius={12} />
    ))}
  </div>
);

export const LineSkeleton = ({ count = 3, width = "100%" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} width={width} height={18} />
    ))}
  </div>
);
