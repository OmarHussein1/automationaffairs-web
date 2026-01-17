import { useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Crosshair, MagnifyingGlass, Wrench } from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { AnimatedBorder } from './AnimatedBorder';

type StepKey = 'scope' | 'identify' | 'build';

interface ProcessCardProps {
  stepKey: StepKey;
  index: number;
}

// Icon mapping
const iconConfig: Record<StepKey, ComponentType<IconProps>> = {
  scope: Crosshair,
  identify: MagnifyingGlass,
  build: Wrench,
};

export function ProcessCard({ stepKey, index }: ProcessCardProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { rotateX, rotateY, isHovered, handlers } = useMouseParallax(cardRef, {
    maxRotation: 12,
    springConfig: { stiffness: 300, damping: 30 },
  });

  const Icon = iconConfig[stepKey];
  const isActive = isHovered || isFocused;

  return (
    <div
      className="process-card opacity-0"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-[#f3ff5a] focus-visible:ring-offset-2 rounded-2xl cursor-default"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...handlers}
      >
        <AnimatedBorder isHovered={isHovered} isFocused={isFocused}>
          <div className="p-8 flex flex-col items-center text-center">
            {/* Step Badge */}
            <div className="flex items-center justify-center mb-6 w-full">
              <span className="text-sm font-medium text-primary dark:text-[#f3ff5a] bg-primary/10 dark:bg-[#f3ff5a]/10 px-3 py-1 rounded-full">
                Step {index + 1}
              </span>
            </div>

            {/* Icon Container with Pulse Effect */}
            <div className="relative mb-6">
              {/* Pulse ripple on hover */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-primary/20 dark:bg-[#f3ff5a]/20"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}

              <div className="relative w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 dark:from-[#f3ff5a]/10 dark:to-[#f3ff5a]/20 rounded-xl flex items-center justify-center">
                <Icon
                  className="w-8 h-8 text-primary dark:text-[#f3ff5a]"
                  weight="bold"
                />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-neutral-ink dark:text-dark-text mb-4">
              {t(`home:process.steps.${stepKey}.title`)}
            </h3>

            {/* Description */}
            <p className="text-neutral-ink/70 dark:text-dark-text/70 leading-relaxed">
              {t(`home:process.steps.${stepKey}.description`)}
            </p>
          </div>
        </AnimatedBorder>
      </motion.div>
    </div>
  );
}
