import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Section {
  id: string;
  label: string;
}

interface UseFullpageScrollOptions {
  sections: Section[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface UseFullpageScrollReturn {
  activeSection: number;
  navigateToSection: (index: number) => void;
  isScrolling: boolean;
}

export function useFullpageScroll({
  sections,
  containerRef,
}: UseFullpageScrollOptions): UseFullpageScrollReturn {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animatedSectionsRef = useRef<Set<string>>(new Set());
  const prefersReducedMotion = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;

    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Animation functions for each section
  const animateSection = useCallback((sectionId: string) => {
    if (prefersReducedMotion.current) {
      // For reduced motion, just make everything visible
      const section = document.getElementById(sectionId);
      if (section) {
        gsap.set(section.querySelectorAll('.gsap-fade-up, .gsap-fade-left, .gsap-fade-right, .gsap-scale-up'), {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
      }
      return;
    }

    // Skip if already animated
    if (animatedSectionsRef.current.has(sectionId)) return;
    animatedSectionsRef.current.add(sectionId);

    const section = document.getElementById(sectionId);
    if (!section) return;

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    switch (sectionId) {
      case 'hero':
        // Hero animations - logo, title, subtitle, buttons
        tl.fromTo(
          section.querySelector('.hero-logo'),
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
        )
          .fromTo(
            section.querySelector('.hero-title'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 },
            '-=0.4'
          )
          .fromTo(
            section.querySelector('.hero-subtitle'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.4'
          )
          .fromTo(
            section.querySelectorAll('.hero-buttons > *'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 },
            '-=0.3'
          );
        break;

      case 'what-we-do':
        // What We Do - content from left, image from right
        tl.fromTo(
          section.querySelector('.what-we-do-content'),
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.8 }
        ).fromTo(
          section.querySelector('.what-we-do-image'),
          { opacity: 0, x: 50, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 0.8 },
          '-=0.6'
        );
        break;

      case 'process':
        // Process - title, subtitle, then staggered cards
        tl.fromTo(
          section.querySelector('.process-title'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
          .fromTo(
            section.querySelector('.process-subtitle'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.3'
          )
          .fromTo(
            section.querySelectorAll('.process-card'),
            { opacity: 0, y: 40, rotateY: -10 },
            {
              opacity: 1,
              y: 0,
              rotateY: 0,
              duration: 0.7,
              stagger: 0.2,
              ease: 'power2.out',
            },
            '-=0.2'
          );
        break;

      case 'testimonials':
        // Testimonials - header, then staggered testimonial cards
        tl.fromTo(
          section.querySelector('.testimonials-header'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 }
        ).fromTo(
          section.querySelectorAll('.testimonial-card'),
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
          },
          '-=0.3'
        );
        break;

      case 'values':
        // Values - header, then carousel scales up
        tl.fromTo(
          section.querySelector('.values-header'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 }
        ).fromTo(
          section.querySelector('.values-carousel-container'),
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8 },
          '-=0.3'
        );
        break;

      case 'cta':
        // CTA - title, subtitle, button, then footer
        tl.fromTo(
          section.querySelector('.cta-title'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
          .fromTo(
            section.querySelector('.cta-subtitle'),
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            '-=0.3'
          )
          .fromTo(
            section.querySelector('.cta-button'),
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
            '-=0.2'
          )
          .fromTo(
            section.querySelector('.cta-footer'),
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
            '-=0.2'
          );
        break;
    }
  }, []);

  // Set up IntersectionObserver for section tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create observer to track which section is in view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const sectionId = entry.target.id;
            const sectionIndex = sections.findIndex((s) => s.id === sectionId);

            if (sectionIndex !== -1) {
              setActiveSection(sectionIndex);
              // Trigger animation for this section
              animateSection(sectionId);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.5, // Trigger when 50% visible
      }
    );

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    // Animate hero on initial load
    setTimeout(() => {
      animateSection('hero');
    }, 100);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sections, containerRef, animateSection]);

  // Navigate to a specific section
  const navigateToSection = useCallback(
    (index: number) => {
      if (isScrolling || index < 0 || index >= sections.length) return;

      const container = containerRef.current;
      const section = document.getElementById(sections[index].id);

      if (!container || !section) return;

      setIsScrolling(true);

      // Use native scrollIntoView for smooth CSS scroll-snap
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Reset scrolling flag after animation completes
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    },
    [sections, containerRef, isScrolling]
  );

  return {
    activeSection,
    navigateToSection,
    isScrolling,
  };
}
