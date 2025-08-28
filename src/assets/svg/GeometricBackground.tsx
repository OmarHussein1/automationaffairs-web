
interface GeometricBackgroundProps {
  variant?: 'lines' | 'grid' | 'stripes';
  className?: string;
}

export function GeometricBackground({ variant = 'lines', className = '' }: GeometricBackgroundProps) {
  const patterns = {
    lines: (
      <svg className={`absolute inset-0 w-full h-full ${className}`} viewBox="0 0 1200 800" fill="none">
        <defs>
          <pattern id="lines" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 30h60M30 0v60" stroke="currentColor" strokeWidth="1" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lines)" />
        <path 
          d="M0 400 Q300 200 600 400 T1200 400" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.15"
        />
        <path 
          d="M0 500 Q400 300 800 500 T1200 500" 
          stroke="currentColor" 
          strokeWidth="1" 
          fill="none" 
          opacity="0.1"
        />
      </svg>
    ),
    grid: (
      <svg className={`absolute inset-0 w-full h-full ${className}`} viewBox="0 0 1200 800" fill="none">
        <defs>
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" stroke="currentColor" strokeWidth="1" opacity="0.08" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect 
          x="100" 
          y="100" 
          width="200" 
          height="200" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.12"
        />
        <rect 
          x="900" 
          y="400" 
          width="150" 
          height="150" 
          stroke="currentColor" 
          strokeWidth="1" 
          fill="none" 
          opacity="0.08"
        />
      </svg>
    ),
    stripes: (
      <svg className={`absolute inset-0 w-full h-full ${className}`} viewBox="0 0 1200 800" fill="none">
        <defs>
          <pattern id="stripes" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M0 0l80 80M0 80l80-80" stroke="currentColor" strokeWidth="1" opacity="0.06" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stripes)" />
        <path 
          d="M200 0 L400 800 M600 0 L800 800 M1000 0 L1200 800" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          opacity="0.1"
        />
      </svg>
    ),
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {patterns[variant]}
    </div>
  );
}
