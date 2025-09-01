import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, Sparkle } from '@phosphor-icons/react';
import { useI18n } from '@/contexts/I18nContext';

interface TaskCompletionAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  taskTitle: string;
}

export function TaskCompletionAnimation({ isVisible, onComplete, taskTitle }: TaskCompletionAnimationProps) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<'initial' | 'celebration' | 'complete'>('initial');

  useEffect(() => {
    if (isVisible) {
      setPhase('initial');
      
      // Progress through animation phases
      const timer1 = setTimeout(() => setPhase('celebration'), 200);
      const timer2 = setTimeout(() => {
        setPhase('complete');
        onComplete();
      }, 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        
        {/* Main celebration container */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center text-center max-w-md mx-4"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            damping: 15, 
            stiffness: 200,
            delay: 0.1 
          }}
        >
          {/* Main checkmark */}
          <motion.div
            className="relative mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              damping: 12, 
              stiffness: 200,
              delay: 0.2 
            }}
          >
            <motion.div
              className="relative p-6 bg-accent/90 backdrop-blur-sm rounded-full shadow-2xl border-2 border-accent-foreground/20"
              animate={phase === 'celebration' ? {
                boxShadow: [
                  "0 0 0 0px rgba(34, 197, 94, 0.7)",
                  "0 0 0 20px rgba(34, 197, 94, 0)",
                  "0 0 0 40px rgba(34, 197, 94, 0)"
                ]
              } : {}}
              transition={{ 
                duration: 1.5, 
                repeat: phase === 'celebration' ? Infinity : 0,
                repeatType: "loop" 
              }}
            >
              <CheckCircle 
                size={48} 
                weight="fill" 
                className="text-accent-foreground"
              />
            </motion.div>
          </motion.div>

          {/* Success message */}
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('taskCompleted')}!
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              "{taskTitle}" {t('hasBeenCompleted')}
            </p>
          </motion.div>

          {/* Floating particles */}
          {phase === 'celebration' && (
            <>
              {/* Stars */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute"
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.8],
                    x: Math.cos((i / 6) * Math.PI * 2) * (100 + Math.random() * 50),
                    y: Math.sin((i / 6) * Math.PI * 2) * (100 + Math.random() * 50),
                    rotate: 360
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.3 + i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <Star 
                    size={16 + Math.random() * 8} 
                    weight="fill"
                    className="text-yellow-400"
                  />
                </motion.div>
              ))}

              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute"
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.5 + i * 0.08,
                    ease: "easeOut"
                  }}
                >
                  <Sparkle 
                    size={12 + Math.random() * 6} 
                    weight="fill"
                    className="text-primary"
                  />
                </motion.div>
              ))}

              {/* Confetti-like dots */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: [
                      '#3b82f6', '#ef4444', '#10b981', 
                      '#f59e0b', '#8b5cf6', '#ec4899'
                    ][i % 6]
                  }}
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5],
                    x: (Math.random() - 0.5) * 300,
                    y: -150 - Math.random() * 100,
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.2 + i * 0.05,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}