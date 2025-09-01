import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface CheckboxAnimationProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AnimatedCheckbox({ 
  checked, 
  onChange, 
  disabled = false, 
  size = 'md',
  className 
}: CheckboxAnimationProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative border-2 rounded-md transition-all duration-200 flex items-center justify-center",
        "hover:scale-105 active:scale-95",
        sizeClasses[size],
        checked 
          ? "bg-accent border-accent text-accent-foreground shadow-lg" 
          : "border-border hover:border-accent/50 bg-background",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100 active:scale-100",
        className
      )}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
    >
      <AnimatePresence mode="wait">
        {checked && (
          <motion.div
            key="checkmark"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0, 
              opacity: 1,
            }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 15, 
              stiffness: 300,
              duration: 0.3
            }}
          >
            <CheckCircle 
              size={iconSizes[size]} 
              weight="fill" 
              className="text-accent-foreground"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple effect on click */}
      {checked && (
        <motion.div
          className="absolute inset-0 rounded-md border-2 border-accent"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.8, 0, 0]
          }}
          transition={{ 
            duration: 0.6,
            times: [0, 0.6, 1],
            ease: "easeOut"
          }}
        />
      )}
    </motion.button>
  );
}