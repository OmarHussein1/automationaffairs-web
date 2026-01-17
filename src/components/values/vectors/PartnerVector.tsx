interface VectorProps {
  className?: string;
}

export function PartnerVector({ className }: VectorProps) {
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
      {/* Left puzzle piece */}
      <path d="M12 30 L35 30
               C35 30 35 25 40 25 C45 25 45 35 40 35 C35 35 35 30 35 30
               L35 45
               C35 45 30 45 30 50 C30 55 40 55 40 50 C40 45 35 45 35 45
               L35 70 L12 70
               L12 55
               C12 55 17 55 17 50 C17 45 7 45 7 50 C7 55 12 55 12 55
               Z" />

      {/* Right puzzle piece */}
      <path d="M88 30 L65 30
               C65 30 65 25 60 25 C55 25 55 35 60 35 C65 35 65 30 65 30
               L65 45
               C65 45 70 45 70 50 C70 55 60 55 60 50 C60 45 65 45 65 45
               L65 70 L88 70
               L88 55
               C88 55 83 55 83 50 C83 45 93 45 93 50 C93 55 88 55 88 55
               Z" />

      {/* Connection lines showing collaboration */}
      <path d="M40 50 L60 50" strokeDasharray="3 3" />

      {/* Center connection node */}
      <circle cx="50" cy="50" r="4" />
      <circle cx="50" cy="50" r="2" fill="currentColor" />

      {/* Small dots indicating data flow */}
      <circle cx="44" cy="50" r="1.5" fill="currentColor" />
      <circle cx="56" cy="50" r="1.5" fill="currentColor" />

      {/* Top connection arc */}
      <path d="M35 25 Q50 15 65 25" strokeDasharray="2 2" />
      <circle cx="50" cy="17" r="2" fill="currentColor" />

      {/* Bottom connection arc */}
      <path d="M35 70 Q50 80 65 70" strokeDasharray="2 2" />
      <circle cx="50" cy="78" r="2" fill="currentColor" />
    </svg>
  );
}
