import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  asChild = false,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-ring disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 dark:bg-[#f3ff5a] dark:text-black dark:hover:bg-[#f3ff5a]/90',
    secondary: 'bg-accent text-neutral-ink hover:bg-accent/90',
    outline: 'border border-neutral-ink/20 text-neutral-ink hover:bg-neutral-ink/5 dark:border-dark-text/20 dark:text-dark-text dark:hover:bg-dark-text/5',
    ghost: 'text-neutral-ink hover:bg-neutral-ink/5 dark:text-dark-text dark:hover:bg-dark-text/5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-pill',
    md: 'px-6 py-3 text-base rounded-pill',
    lg: 'px-8 py-4 text-lg rounded-pill',
  };

  const buttonClasses = cn(baseClasses, variants[variant], sizes[size], className);

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as { className?: string };
    return React.cloneElement(children, {
      ...childProps,
      className: cn(buttonClasses, childProps.className || ''),
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClasses}
      {...props}
    >
      {children}
    </motion.button>
  );
}
