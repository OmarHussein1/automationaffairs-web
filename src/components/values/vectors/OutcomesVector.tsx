interface VectorProps {
  className?: string;
}

export function OutcomesVector({ className }: VectorProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Ascending graph bars */}
      <rect x="15" y="65" width="12" height="20" rx="2" />
      <rect x="32" y="50" width="12" height="35" rx="2" />
      <rect x="49" y="35" width="12" height="50" rx="2" />

      {/* Ascending trend line */}
      <path d="M21 60 L38 45 L55 30 L75 15" />

      {/* Target/bullseye at the top */}
      <circle cx="75" cy="15" r="10" />
      <circle cx="75" cy="15" r="6" />
      <circle cx="75" cy="15" r="2" fill="currentColor" />

      {/* Arrow pointing to target */}
      <path d="M55 30 L68 17" />
      <path d="M65 12 L68 17 L63 20" />

      {/* Base line */}
      <path d="M10 90 L90 90" />

      {/* Y-axis indicators */}
      <path d="M10 90 L10 20" strokeDasharray="4 4" strokeWidth="1" />
      <circle cx="10" cy="20" r="2" fill="currentColor" />
      <circle cx="10" cy="50" r="2" fill="currentColor" />
      <circle cx="10" cy="70" r="2" fill="currentColor" />
    </svg>
  );
}
