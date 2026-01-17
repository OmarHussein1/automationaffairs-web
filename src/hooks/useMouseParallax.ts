import { useEffect, useState, useCallback } from 'react';
import type { RefObject } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MouseParallaxOptions {
  maxRotation?: number;
  springConfig?: { stiffness: number; damping: number };
  disabled?: boolean;
}

export function useMouseParallax(
  ref: RefObject<HTMLElement | null>,
  options: MouseParallaxOptions = {}
) {
  const {
    maxRotation = 15,
    springConfig = { stiffness: 300, damping: 30 },
    disabled = false
  } = options;

  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mouse position relative to center of element (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply spring physics
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transform to rotation values
  const rotateX = useTransform(springY, [-1, 1], [maxRotation, -maxRotation]);
  const rotateY = useTransform(springX, [-1, 1], [-maxRotation, maxRotation]);

  // Check for mobile and reduced motion on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };

    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkMobile();
    checkReducedMotion();

    window.addEventListener('resize', checkMobile);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', checkMobile);
      motionQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  const shouldAnimate = !disabled && !isMobile && !prefersReducedMotion;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!shouldAnimate || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate position from -1 to 1 relative to center
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(Math.max(-1, Math.min(1, x)));
    mouseY.set(Math.max(-1, Math.min(1, y)));
  }, [shouldAnimate, ref, mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Reset to center position
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return {
    rotateX: shouldAnimate ? rotateX : mouseX, // mouseX is already 0 when not animating
    rotateY: shouldAnimate ? rotateY : mouseY,
    isHovered,
    shouldAnimate,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseMove: handleMouseMove,
    },
  };
}
