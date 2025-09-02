import React from 'react';
import { motion } from 'framer-motion';

interface FlipchartOverlayProps {
  currentStep: number;
  children: React.ReactNode;
  className?: string;
}

export function FlipchartOverlay({ currentStep, children, className = '' }: FlipchartOverlayProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Flipchart Stand */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-20 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-lg shadow-lg z-0"></div>
      
      {/* Flipchart Paper Stack */}
      <motion.div 
        className="relative max-w-4xl mx-auto"
        animate={{
          rotateX: currentStep * 2, // Subtle 3D tilt based on step
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ perspective: '1000px' }}
      >
        {/* Background papers for depth */}
        <div className="absolute inset-0 bg-white dark:bg-gray-50 rounded-lg shadow-xl transform rotate-1 opacity-30 scale-105"></div>
        <div className="absolute inset-0 bg-white dark:bg-gray-50 rounded-lg shadow-xl transform -rotate-1 opacity-50 scale-102"></div>
        
        {/* Main flipchart paper */}
        <motion.div 
          className="relative bg-white dark:bg-gray-50 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-300 overflow-hidden min-h-[600px]"
          animate={{
            rotateY: currentStep * 3, // Page turn effect
            scale: 1 + (currentStep * 0.02), // Slight scale animation
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Spiral binding holes */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 dark:bg-gray-200 border-b border-gray-300 z-10">
            <div className="flex justify-center items-center h-full space-x-8">
              {[...Array(8)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-3 h-3 bg-gray-400 rounded-full shadow-inner"
                  animate={{
                    scale: currentStep === i % 3 ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Animated Grid Pattern (Kariertes Papier) */}
          <motion.div 
            className="absolute inset-0 opacity-20 pointer-events-none z-0"
            animate={{
              backgroundPosition: `0px ${(currentStep - 1) * 30}px`,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              backgroundImage: `
                linear-gradient(to right, #3b5bdb 1px, transparent 1px),
                linear-gradient(to bottom, #3b5bdb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Dark mode grid overlay */}
          <motion.div 
            className="absolute inset-0 opacity-10 pointer-events-none z-0 dark:block hidden"
            animate={{
              backgroundPosition: `0px ${(currentStep - 1) * 30}px`,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              backgroundImage: `
                linear-gradient(to right, #f3ff5a 1px, transparent 1px),
                linear-gradient(to bottom, #f3ff5a 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Paper texture overlay */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3Ccircle cx='23' cy='23' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Content Area */}
          <div className="relative pt-12 pb-8 px-8 z-10">
            {children}
          </div>

          {/* Page corner fold effect */}
          <motion.div 
            className="absolute top-8 right-0 w-8 h-8 bg-gray-200 dark:bg-gray-300 transform rotate-45 translate-x-4 -translate-y-4 shadow-lg"
            animate={{
              scale: currentStep > 0 ? 1 : 0,
              rotate: 45 + (currentStep * 5),
            }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>

        {/* Shadow */}
        <motion.div 
          className="absolute -bottom-4 left-4 right-4 h-8 bg-black/10 rounded-full blur-lg"
          animate={{
            opacity: 0.1 + (currentStep * 0.05),
            scale: 1 + (currentStep * 0.1),
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </div>
  );
}
