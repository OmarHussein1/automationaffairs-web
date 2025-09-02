import { motion } from 'framer-motion';
import { Users, Target, Zap, Lock, Handshake } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ValuesWheelProps {
  currentValueIndex: number;
  onValueChange?: (index: number) => void;
}

export function ValuesWheel({ currentValueIndex, onValueChange }: ValuesWheelProps) {
  const { t } = useTranslation();

  const values = [
    { key: 'humanLed', icon: Users, index: 0 },
    { key: 'outcomes', icon: Target, index: 1 },
    { key: 'precision', icon: Zap, index: 2 },
    { key: 'privacy', icon: Lock, index: 3 },
    { key: 'partner', icon: Handshake, index: 4 }
  ];

  const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 180 : 300;
  const centerX = 0;
  const centerY = 0;

  // Calculate positions for wheel layout
  const getPosition = (index: number, currentIndex: number) => {
    const totalValues = values.length;
    const angleStep = (2 * Math.PI) / totalValues;
    const currentAngle = angleStep * (index - currentIndex);
    
    return {
      x: centerX + radius * Math.cos(currentAngle - Math.PI / 2),
      y: centerY + radius * Math.sin(currentAngle - Math.PI / 2),
      scale: index === currentIndex ? 1.2 : 0.8,
      opacity: index === currentIndex ? 1 : 0.6,
      zIndex: index === currentIndex ? 10 : 1
    };
  };

  return (
    <div className="relative flex items-center justify-center min-h-[600px] md:min-h-[800px] w-full py-8 md:py-16 overflow-hidden">
      {/* Central area for active value content */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
        key={`content-${currentValueIndex}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="text-center max-w-xs md:max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl mx-4 border border-gray-200/50 dark:border-gray-600/50">
          <motion.h3 
            className="text-lg md:text-2xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t(`home:values.items.${values[currentValueIndex].key}.title`)}
          </motion.h3>
          <motion.p 
            className="text-sm md:text-lg text-neutral-ink/70 dark:text-dark-text/70 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t(`home:values.items.${values[currentValueIndex].key}.description`)}
          </motion.p>
        </div>
      </motion.div>

      {/* Wheel with value icons */}
      <div className="relative w-full h-full flex items-center justify-center max-w-4xl mx-auto z-30">
        {values.map((value, index) => {
          const position = getPosition(index, currentValueIndex);
          const IconComponent = value.icon;
          
          return (
            <motion.button
              key={value.key}
              className={`absolute flex flex-col items-center w-16 h-16 md:w-20 md:h-20 rounded-full justify-center shadow-lg transition-colors duration-300 cursor-pointer ${
                index === currentValueIndex 
                  ? 'bg-gradient-to-br from-primary to-primary/80 dark:from-[#f3ff5a] dark:to-[#f3ff5a]/80' 
                  : 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-500 hover:border-primary dark:hover:border-[#f3ff5a]'
              }`}
              animate={{
                x: position.x,
                y: position.y,
                scale: position.scale,
                opacity: position.opacity,
                zIndex: position.zIndex
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeInOut",
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              style={{
                transform: `translate(-50%, -50%)`
              }}
              whileHover={{ scale: position.scale * 1.1 }}
              whileTap={{ scale: position.scale * 0.95 }}
              onClick={() => onValueChange?.(index)}
            >
              <IconComponent 
                size={24} 
                className={`md:w-8 md:h-8 transition-colors duration-300 ${
                  index === currentValueIndex 
                    ? 'text-white dark:text-black' 
                    : 'text-primary dark:text-[#f3ff5a]'
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Connection lines (optional visual enhancement) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-10 dark:opacity-25">
        <defs>
          <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        <circle 
          cx="50%" 
          cy="50%" 
          r={radius} 
          fill="url(#wheelGradient)" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeDasharray="5,5"
          className="text-primary dark:text-[#f3ff5a]"
        />
      </svg>

    </div>
  );
}
