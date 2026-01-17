import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Target, Crosshair, ShieldCheck, Handshake, CaretLeft, CaretRight } from '@phosphor-icons/react';
import gsap from 'gsap';
import type { ValueKey } from './types';
import { cn } from '../../lib/utils';

const VALUE_ICONS: Record<ValueKey, React.ComponentType<{ className?: string; weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone' }>> = {
  humanLed: Users,
  outcomes: Target,
  precision: Crosshair,
  privacy: ShieldCheck,
  partner: Handshake,
};

const VALUES_ORDER: ValueKey[] = ['humanLed', 'outcomes', 'precision', 'privacy', 'partner'];

export function ValuesSplitScreen() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const iconRef = useRef<HTMLDivElement>(null);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % VALUES_ORDER.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Floating animation for icon
  useEffect(() => {
    if (!iconRef.current) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(iconRef.current, {
      y: -20,
      duration: 2,
      ease: 'power1.inOut',
    });

    return () => {
      tl.kill();
    };
  }, []);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VALUES_ORDER.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + VALUES_ORDER.length) % VALUES_ORDER.length);
  };

  const currentValue = VALUES_ORDER[currentIndex];
  const Icon = VALUE_ICONS[currentValue];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left side - Large animated icon */}
      <div className="values-icon-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentValue}
            ref={iconRef}
            initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 10, scale: 0.8 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="values-icon"
          >
            <Icon className="w-full h-full text-primary dark:text-accent" weight="duotone" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right side - Content */}
      <div className="values-content-wrapper">
        {/* Fixed "Our Values" label - outside animation */}
        <p className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
          {t('home:values.title')}
        </p>

        {/* Animated content area with fixed height */}
        <div className="values-content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentValue}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="values-content-inner"
            >
              <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                {t(`home:values.items.${currentValue}.title`)}
              </h3>
              <p className="text-xl leading-relaxed">
                {t(`home:values.items.${currentValue}.description`)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fixed Navigation - outside content area */}
        <div className="values-nav">
          {/* Dot indicators */}
          <div className="nav-dots">
            {VALUES_ORDER.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={cn('nav-dot', currentIndex === index && 'nav-dot-active')}
                aria-label={`Go to value ${index + 1}`}
                aria-pressed={currentIndex === index}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="nav-arrows">
            <button
              onClick={goPrev}
              className="nav-arrow"
              aria-label="Previous value"
            >
              <CaretLeft className="w-5 h-5" weight="bold" />
            </button>
            <button
              onClick={goNext}
              className="nav-arrow"
              aria-label="Next value"
            >
              <CaretRight className="w-5 h-5" weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
