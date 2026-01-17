import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface Section {
  id: string;
  label: string;
}

interface SectionNavigatorProps {
  sections: Section[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export function SectionNavigator({ sections, activeIndex, onNavigate }: SectionNavigatorProps) {
  // Calculate progress height based on dot positions (center to center)
  const progressHeight = sections.length > 1
    ? (activeIndex / (sections.length - 1)) * 100
    : 0;

  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => onNavigate(index)}
          className="group relative flex items-center"
          aria-label={`Go to ${section.label}`}
          aria-current={activeIndex === index ? 'true' : undefined}
        >
          {/* Tooltip */}
          <span
            className={cn(
              'absolute right-8 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap',
              'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none',
              'text-neutral-ink dark:text-dark-text'
            )}
          >
            {section.label}
          </span>

          {/* Dot */}
          <motion.div
            className={cn(
              'w-3 h-3 rounded-full border-2 transition-colors duration-300',
              activeIndex === index
                ? 'bg-primary dark:bg-[#f3ff5a] border-primary dark:border-[#f3ff5a]'
                : 'bg-transparent border-gray-400 dark:border-gray-500 hover:border-primary dark:hover:border-[#f3ff5a]'
            )}
            animate={{
              scale: activeIndex === index ? 1.25 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        </button>
      ))}

      {/* Background progress line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1.5 bottom-1.5 w-px bg-gray-300 dark:bg-gray-600 -z-10" />

      {/* Active progress line */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-1.5 w-px bg-primary dark:bg-[#f3ff5a] -z-10 origin-top"
        initial={false}
        animate={{
          height: `${progressHeight}%`,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      />
    </motion.nav>
  );
}
