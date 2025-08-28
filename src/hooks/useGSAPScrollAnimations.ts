import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGSAPScrollAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // What We Do content animation
      gsap.fromTo('.what-we-do-content',
        {
          x: -60,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.what-we-do-content',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // What We Do image animation
      gsap.fromTo('.what-we-do-image',
        {
          x: 60,
          opacity: 0,
          scale: 0.95
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.what-we-do-image',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Process steps with connecting lines
      gsap.fromTo('.process-step',
        {
          y: 80,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.process-grid',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // KPI counters with number animation
      gsap.fromTo('.kpi-metric',
        {
          scale: 0.5,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.kpi-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Values section animation
      gsap.fromTo('.values-card',
        {
          y: 60,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.values-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Parallax effect for background elements
      gsap.to('.parallax-bg', {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: '.parallax-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Hero text reveal animation
      gsap.fromTo('.hero-title',
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out"
        }
      );

      gsap.fromTo('.hero-subtitle',
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out"
        }
      );

      gsap.fromTo('.hero-buttons',
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.6,
          ease: "power3.out"
        }
      );

    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return containerRef;
};

// Hook for animated counters
export const useAnimatedCounter = (endValue: string, duration: number = 2) => {
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!counterRef.current) return;

    // Extract number from string (e.g., "500+" -> 500)
    const numericValue = parseInt(endValue.replace(/\D/g, '')) || 0;
    const suffix = endValue.replace(/\d/g, '');

    const counter = { value: 0 };
    
    gsap.to(counter, {
      value: numericValue,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(counter.value) + suffix;
        }
      },
      scrollTrigger: {
        trigger: counterRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

  }, [endValue, duration]);

  return counterRef;
};
