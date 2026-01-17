import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ProcessCard } from './ProcessCard';
import { CircuitBackground } from './CircuitBackground';

const steps = ['scope', 'identify', 'build'] as const;

export const ProcessSection = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useTranslation();

  return (
    <section ref={ref} id="process" className="relative">
      <div className="process-content hero-grid-bg min-h-screen flex items-center justify-center">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70" />

        {/* Circuit particle background */}
        <CircuitBackground particleCount={12} className="z-0" />

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-neutral-ink dark:text-dark-text mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {t('home:process.title')}
            </motion.h2>
            <motion.p
              className="text-xl text-neutral-ink/70 dark:text-dark-text/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {t('home:process.subtitle')}
            </motion.p>
          </div>

          {/* Process Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((stepKey, index) => (
              <ProcessCard key={stepKey} stepKey={stepKey} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ProcessSection.displayName = 'ProcessSection';
