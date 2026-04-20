"use client";

// =============================================================================
// Placeholder Image
// =============================================================================
// Beautiful SVG placeholder for gallery items.
// Uses the site theme colors with a subtle pattern.
// =============================================================================

interface PlaceholderImageProps {
  index: number;
  alt?: string;
  className?: string;
}

export function PlaceholderImage({ index, alt, className }: PlaceholderImageProps) {
  // Rotate pattern for visual variety
  const patterns = [
    { angle: 135, opacity: 0.7 },
    { angle: 225, opacity: 0.6 },
    { angle: 180, opacity: 0.65 },
    { angle: 45, opacity: 0.7 },
    { angle: 315, opacity: 0.6 },
    { angle: 90, opacity: 0.65 },
  ];
  const p = patterns[index % patterns.length];

  return (
    <div
      className={`relative overflow-hidden ${className || ""}`}
      title={alt}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${p.angle}deg, var(--sf-primary), var(--sf-secondary))`,
          opacity: p.opacity,
        }}
      />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--sf-background) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Camera icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-20"
          style={{ color: "var(--sf-background)" }}
        >
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <circle cx="12" cy="13" r="4" />
          <path d="M2 6l3-3h5l2 3" />
        </svg>
      </div>
    </div>
  );
}
