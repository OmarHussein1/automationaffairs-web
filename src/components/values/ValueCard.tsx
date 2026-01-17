import { cn } from '../../lib/utils';
import {
  HumanLedVector,
  OutcomesVector,
  PrecisionVector,
  PrivacyVector,
  PartnerVector,
} from './vectors';

export type ValueKey = 'humanLed' | 'outcomes' | 'precision' | 'privacy' | 'partner';

interface ValueCardProps {
  valueKey: ValueKey;
  title: string;
  description: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

const vectorComponents: Record<ValueKey, React.ComponentType<{ className?: string }>> = {
  humanLed: HumanLedVector,
  outcomes: OutcomesVector,
  precision: PrecisionVector,
  privacy: PrivacyVector,
  partner: PartnerVector,
};

export function ValueCard({
  valueKey,
  title,
  description,
  isActive,
  onClick,
  className,
}: ValueCardProps) {
  const VectorComponent = vectorComponents[valueKey];

  return (
    <button
      onClick={onClick}
      className={cn(
        'value-card group flex flex-col items-center text-center h-full',
        'bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8',
        'border-2 transition-all duration-300',
        'cursor-pointer',
        isActive
          ? 'border-primary dark:border-[#f3ff5a] shadow-xl'
          : 'border-gray-200 dark:border-gray-600 shadow-md',
        'hover:border-primary/70 dark:hover:border-[#f3ff5a]/70',
        'focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-[#f3ff5a] focus:ring-offset-2',
        className
      )}
    >
      {/* Vector illustration */}
      <div
        className={cn(
          'w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-5 transition-colors duration-300',
          isActive
            ? 'text-primary dark:text-[#f3ff5a]'
            : 'text-gray-400 dark:text-gray-500 group-hover:text-primary/70 dark:group-hover:text-[#f3ff5a]/70'
        )}
      >
        <VectorComponent className="w-full h-full" />
      </div>

      {/* Title */}
      <h3
        className={cn(
          'font-heading font-semibold text-base sm:text-lg mb-2 transition-colors duration-300',
          isActive
            ? 'text-neutral-ink dark:text-dark-text'
            : 'text-gray-500 dark:text-gray-400'
        )}
      >
        {title}
      </h3>

      {/* Description - only show on active card */}
      <p
        className={cn(
          'text-sm sm:text-base leading-relaxed transition-all duration-300',
          isActive
            ? 'text-neutral-ink/70 dark:text-dark-text/70 max-h-40 opacity-100'
            : 'text-gray-400 dark:text-gray-500 max-h-0 opacity-0 overflow-hidden'
        )}
      >
        {description}
      </p>
    </button>
  );
}
