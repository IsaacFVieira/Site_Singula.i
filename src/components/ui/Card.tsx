'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' } : {}}
      className={`bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
