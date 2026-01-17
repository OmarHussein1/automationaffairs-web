import { useTranslation } from "react-i18next";
import type { ComponentType } from "react";
import { Crosshair, MagnifyingGlass, Wrench } from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";

type StepKey = "scope" | "identify" | "build";

interface ProcessCardMobileProps {
  stepKey: StepKey;
  index: number;
}

// Icon mapping
const iconConfig: Record<StepKey, ComponentType<IconProps>> = {
  scope: Crosshair,
  identify: MagnifyingGlass,
  build: Wrench,
};

export function ProcessCardMobile({ stepKey, index }: ProcessCardMobileProps) {
  const { t } = useTranslation();
  const Icon = iconConfig[stepKey];

  return (
    <div className="bg-white dark:bg-dark-bg border-2 border-primary/20 dark:border-accent/20 rounded-2xl p-6 transition-all duration-300 hover:border-primary dark:hover:border-accent hover:shadow-lg">
      {/* Step Badge */}
      <div className="flex items-center justify-center mb-6">
        <span className="text-xs font-medium text-primary dark:text-accent bg-primary/10 dark:bg-accent/10 px-4 py-1.5 rounded-full">
          Step {index + 1}
        </span>
      </div>

      {/* Icon - Optional, can be hidden if you prefer the minimal look from screenshot */}
      <div className="flex items-center justify-center mb-4">
        <Icon className="w-12 h-12 text-primary dark:text-accent" weight="duotone" />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center mb-4">
        <h3 className="text-2xl font-bold text-neutral-ink dark:text-dark-text mb-2">
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
            className="text-primary dark:text-accent"
          />
        </svg>
      </div>

      {/* Description */}
      <p className="text-center text-neutral-ink/70 dark:text-dark-text/70 leading-relaxed">
        {t(`home:process.steps.${stepKey}.description`)}
      </p>
    </div>
  );
}
