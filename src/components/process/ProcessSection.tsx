import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { ProcessCard } from "./ProcessCard";
import { CircuitBackground } from "./CircuitBackground";

const steps = ["scope", "identify", "build"] as const;

export const ProcessSection = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();

  return (
    <div ref={ref} className="relative h-full">
      <div className="process-content hero-grid-bg h-full flex items-center justify-center">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70" />

        {/* Circuit particle background */}
        <CircuitBackground className="z-0" />

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="process-title text-xl sm:text-2xl md:text-3xl font-bold text-neutral-ink dark:text-dark-text mb-3 sm:mb-4 md:mb-6 opacity-0">
              {t("home:process.title")}
            </h2>
            <p className="process-subtitle text-base sm:text-lg md:text-xl text-neutral-ink/70 dark:text-dark-text/70 max-w-2xl mx-auto opacity-0">
              {t("home:process.subtitle")}
            </p>
          </div>

          {/* Process Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            {steps.map((stepKey, index) => (
              <ProcessCard key={stepKey} stepKey={stepKey} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ProcessSection.displayName = "ProcessSection";
