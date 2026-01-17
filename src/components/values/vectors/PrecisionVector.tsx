interface VectorProps {
  className?: string;
}

export function PrecisionVector({ className }: VectorProps) {
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
      {/* Outer calibration circle */}
      <circle cx="50" cy="50" r="38" />

      {/* Middle circle */}
      <circle cx="50" cy="50" r="28" strokeDasharray="4 2" />

      {/* Inner circle */}
      <circle cx="50" cy="50" r="18" />

      {/* Center point */}
      <circle cx="50" cy="50" r="4" fill="currentColor" />

      {/* Calibration marks - cardinal directions */}
      <path d="M50 12 L50 20" />
      <path d="M50 80 L50 88" />
      <path d="M12 50 L20 50" />
      <path d="M80 50 L88 50" />

      {/* Calibration marks - diagonals */}
      <path d="M23 23 L28 28" />
      <path d="M72 72 L77 77" />
      <path d="M77 23 L72 28" />
      <path d="M23 77 L28 72" />

      {/* Precision needle pointing to exact position */}
      <path d="M50 50 L65 28" strokeWidth="2.5" />
      <circle cx="65" cy="28" r="3" />

      {/* Small measurement ticks around outer ring */}
      <path d="M50 14 L50 16" strokeWidth="1" />
      <path d="M62 15 L61 17" strokeWidth="1" />
      <path d="M73 20 L71 22" strokeWidth="1" />
      <path d="M82 29 L80 31" strokeWidth="1" />
      <path d="M86 50 L84 50" strokeWidth="1" />
    </svg>
  );
}
