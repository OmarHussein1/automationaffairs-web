import { useRef, useState } from "react";
import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Crosshair, MagnifyingGlass, Wrench } from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";
import { useMouseParallax } from "../../hooks/useMouseParallax";
import { AnimatedBorder } from "./AnimatedBorder";

type StepKey = "scope" | "identify" | "build";

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
    <>
      {/* Mobile Version - Simple & Compact */}
      <div className="md:hidden process-card opacity-0">
        <div className="bg-neutral-bg dark:bg-dark-bg border-2 border-neutral-stroke dark:border-dark-stroke rounded-xl p-4 hover:border-primary dark:hover:border-[#f3ff5a] transition-all">
          {/* Header with Icon and Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-[#f3ff5a]/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary dark:text-[#f3ff5a]" weight="duotone" />
            </div>
            <span className="text-xs font-medium text-primary dark:text-[#f3ff5a] bg-primary/10 dark:bg-[#f3ff5a]/10 px-2 py-1 rounded-full">
              Step {index + 1}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-neutral-ink dark:text-dark-text mb-2">
            {t(`home:process.steps.${stepKey}.title`)}
          </h3>

          {/* Description */}
          <p className="text-sm text-neutral-ink/70 dark:text-dark-text/70 leading-relaxed">
            {t(`home:process.steps.${stepKey}.description`)}
          </p>
        </div>
      </div>

      {/* Desktop Version - 3D Card with Animation */}
      <div className="hidden md:block process-card opacity-0" style={{ perspective: 1000 }}>
        <motion.div
          ref={cardRef}
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-[#f3ff5a] focus-visible:ring-offset-2 rounded-2xl cursor-default"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          tabIndex={0}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...handlers}
        >
          <AnimatedBorder isHovered={isHovered} isFocused={isFocused}>
            <div className="p-12 flex flex-col items-center text-center min-h-[400px] justify-between">
              {/* Step Badge */}
              <div className="flex items-center justify-center w-full">
                <span className="text-sm font-medium text-primary dark:text-[#f3ff5a] bg-primary/10 dark:bg-[#f3ff5a]/10 px-3 py-1 rounded-full">
                  Step {index + 1}
                </span>
              </div>

              {/* Title */}
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-neutral-ink dark:text-dark-text mb-2">
                  {t(`home:process.steps.${stepKey}.title`)}
                </h3>
                {/* Hand-drawn underline */}
                <svg
                  width="80"
                  height="8"
                  viewBox="0 0 80 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-60"
                >
                  <path
                    d="M2 6C20 3 40 2 60 3C70 4 75 5.5 78 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="text-primary dark:text-[#f3ff5a]"
                  />
                </svg>
              </div>

              {/* Description */}
              <p className="text-neutral-ink/70 dark:text-dark-text/70 leading-relaxed">
                {t(`home:process.steps.${stepKey}.description`)}
              </p>
            </div>
          </AnimatedBorder>
        </motion.div>
      </div>
    </>
  );
}
