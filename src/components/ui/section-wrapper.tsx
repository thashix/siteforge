"use client";

// =============================================================================
// SectionWrapper
// =============================================================================
// Every section in a generated site is wrapped in this component.
// It provides consistent vertical spacing, max-width containment,
// and optional background variants (default, surface, primary).
// =============================================================================

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  background?: "default" | "surface" | "primary";
  className?: string;
  fullWidth?: boolean;
}

export function SectionWrapper({
  children,
  id,
  background = "default",
  className = "",
  fullWidth = false,
}: SectionWrapperProps) {
  const bgStyles: Record<string, string> = {
    default: "bg-[var(--sf-background)]",
    surface: "bg-[var(--sf-surface)]",
    primary: "bg-[var(--sf-primary)] text-white",
  };

  return (
    <section
      id={id}
      className={`
        w-full
        py-16 sm:py-20 md:py-28 lg:py-32
        ${bgStyles[background]}
        ${className}
      `}
    >
      <div
        className={
          fullWidth
            ? "w-full"
            : "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12"
        }
      >
        {children}
      </div>
    </section>
  );
}
