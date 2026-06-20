import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, style = {}, hover = true, glow, onClick, className = '' }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`glass ${className}`}
      style={{
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: glow
          ? `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${glow}`
          : '0 8px 32px rgba(0,0,0,0.3)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
