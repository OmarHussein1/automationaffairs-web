interface VectorProps {
  className?: string;
}

export function PrivacyVector({ className }: VectorProps) {
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
      {/* Shield outline */}
      <path d="M50 8 L85 22 L85 50 C85 72 68 88 50 95 C32 88 15 72 15 50 L15 22 Z" />

      {/* Inner shield line */}
      <path
        d="M50 18 L75 28 L75 50 C75 66 62 78 50 83 C38 78 25 66 25 50 L25 28 Z"
        strokeDasharray="4 2"
      />

      {/* Lock body */}
      <rect x="38" y="48" width="24" height="20" rx="3" />

      {/* Lock shackle */}
      <path d="M42 48 L42 40 C42 34 46 30 50 30 C54 30 58 34 58 40 L58 48" />

      {/* Keyhole */}
      <circle cx="50" cy="56" r="3" fill="currentColor" />
      <path d="M50 59 L50 64" strokeWidth="3" />

      {/* Small security dots */}
      <circle cx="50" cy="22" r="2" fill="currentColor" />
      <circle cx="32" cy="34" r="1.5" fill="currentColor" />
      <circle cx="68" cy="34" r="1.5" fill="currentColor" />
    </svg>
  );
}
