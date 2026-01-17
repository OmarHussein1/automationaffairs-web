interface VectorProps {
  className?: string;
}

export function HumanLedVector({ className }: VectorProps) {
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
      {/* Human head */}
      <circle cx="50" cy="22" r="12" />

      {/* Body */}
      <path d="M50 34 L50 60" />

      {/* Arms */}
      <path d="M50 42 L30 52" />
      <path d="M50 42 L70 52" />

      {/* Legs */}
      <path d="M50 60 L35 85" />
      <path d="M50 60 L65 85" />

      {/* Circuit connection nodes */}
      <circle cx="30" cy="52" r="4" />
      <circle cx="70" cy="52" r="4" />
      <circle cx="50" cy="42" r="3" />

      {/* Connection lines extending from nodes */}
      <path d="M26 52 L15 52" strokeDasharray="2 2" />
      <path d="M74 52 L85 52" strokeDasharray="2 2" />
      <path d="M15 52 L15 35 L30 35" strokeDasharray="2 2" />
      <path d="M85 52 L85 35 L70 35" strokeDasharray="2 2" />

      {/* Small endpoint dots */}
      <circle cx="15" cy="52" r="2" fill="currentColor" />
      <circle cx="85" cy="52" r="2" fill="currentColor" />
      <circle cx="30" cy="35" r="2" fill="currentColor" />
      <circle cx="70" cy="35" r="2" fill="currentColor" />
    </svg>
  );
}
