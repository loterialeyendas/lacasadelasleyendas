import React from 'react';
import { motion } from 'motion/react';
import { KeyType } from '../../types/game';

interface MysticKeyProps {
  isTurned?: boolean;
  className?: string;
  size?: number;
  variant?: KeyType;
}

export const MysticKey: React.FC<MysticKeyProps> = ({
  isTurned = false,
  className = "w-6 h-6",
  size = 24,
  variant = 'gold'
}) => {
  const gradId = `keyGrad_${variant}`;

  const renderGradient = () => {
    switch (variant) {
      case 'jade':
        return (
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        );
      case 'silver':
        return (
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        );
      case 'obsidian':
        return (
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
        );
      case 'gold':
      default:
        return (
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff1a8" />
            <stop offset="50%" stopColor="#fccf65" />
            <stop offset="100%" stopColor="#be8d2c" />
          </linearGradient>
        );
    }
  };

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
          {renderGradient()}
        </defs>

        {/* Anillo ornamental de la llave */}
        <circle
          cx="10"
          cy="18"
          r="7"
          stroke={`url(#${gradId})`}
          strokeWidth="2.5"
          fill="none"
        />
        <circle
          cx="10"
          cy="18"
          r="3"
          fill={`url(#${gradId})`}
        />

        {/* Vástago de la llave */}
        <path
          d="M17 18H32"
          stroke={`url(#${gradId})`}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Dientes de la llave */}
        <path
          d="M26 18V24M30 18V22"
          stroke={`url(#${gradId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

