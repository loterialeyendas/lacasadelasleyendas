import React from 'react';
import { motion } from 'motion/react';

interface MysticKeyProps {
  isTurned?: boolean;
  className?: string;
  size?: number;
}

export const MysticKey: React.FC<MysticKeyProps> = ({
  isTurned = false,
  className = "w-6 h-6",
  size = 24
}) => {
  return (
    <motion.div
      animate={{ rotate: isTurned ? 90 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldKeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fccf65" />
            <stop offset="50%" stopColor="#fccf65" />
            <stop offset="100%" stopColor="#be8d2c" />
          </linearGradient>
        </defs>

        {/* Anillo ornamental de la llave */}
        <circle
          cx="10"
          cy="18"
          r="7"
          stroke="url(#goldKeyGrad)"
          strokeWidth="2.5"
          fill="none"
        />
        <circle
          cx="10"
          cy="18"
          r="3"
          fill="url(#goldKeyGrad)"
        />

        {/* Vástago de la llave */}
        <path
          d="M17 18H32"
          stroke="url(#goldKeyGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Dientes de la llave */}
        <path
          d="M26 18V24M30 18V22"
          stroke="url(#goldKeyGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};
