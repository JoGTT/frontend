import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  sectionId: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * Componente para envolver secciones con animaciones profesionales
 * Soluciona el problema de que React reutiliza nodos del DOM
 */
const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  sectionId,
  direction = 'up' 
}) => {
  // Definir variantes de animación según dirección
  const variants = {
    up: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    down: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    left: {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -40 },
    },
    right: {
      initial: { opacity: 0, x: -40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 40 },
    },
  };

  const selectedVariant = variants[direction];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sectionId}
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        exit={selectedVariant.exit}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1], // cubic-bezier personalizado para efecto suave
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedSection;
