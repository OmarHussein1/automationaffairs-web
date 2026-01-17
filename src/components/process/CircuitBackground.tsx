import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

interface CircuitBackgroundProps {
  particleCount?: number;
  className?: string;
}

export function CircuitBackground({
  particleCount = 0,
  className = "",
}: CircuitBackgroundProps) {
  // Generate random particles - memoized to prevent re-generation on re-renders
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2, // 2-5px
      opacity: Math.random() * 0.1 + 0.15, // 0.15-0.25 opacity
      delay: Math.random() * 6, // 0-6s delay
      duration: Math.random() * 4 + 6, // 6-10s duration
    }));
  }, [particleCount]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="circuit-particle absolute rounded-full bg-primary dark:bg-[#f3ff5a]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Subtle connecting lines - purely decorative */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
        <defs>
          <linearGradient
            id="circuit-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" className="[stop-color:var(--circuit-start)]" />
            <stop offset="100%" className="[stop-color:var(--circuit-end)]" />
          </linearGradient>
        </defs>

        {/* A few subtle circuit paths */}
        <path
          d="M 10% 20% L 30% 20% L 30% 40%"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary dark:text-[#f3ff5a]"
          strokeDasharray="4 4"
        />
        <path
          d="M 70% 60% L 90% 60% L 90% 80%"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary dark:text-[#f3ff5a]"
          strokeDasharray="4 4"
        />
        <path
          d="M 50% 10% L 50% 30% L 70% 30%"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary dark:text-[#f3ff5a]"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
}
