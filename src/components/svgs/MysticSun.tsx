import React from 'react';
import { motion } from 'motion/react';

interface MysticSunProps {
  className?: string;
  size?: number;
}

export const MysticSun: React.FC<MysticSunProps> = ({
  className = "w-10 h-10",
  size = 40
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffeeaa" />
            <stop offset="60%" stopColor="#fccf65" />
            <stop offset="100%" stopColor="#be8d2c" />
          </radialGradient>
        </defs>

        {/* Disco central */}
        <circle cx="32" cy="32" r="14" fill="url(#sunGrad)" />

        {/* Rayos solares místicos */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 32 32)`}>
            <path
              d="M32 4L35 14H29L32 4Z"
              fill="url(#sunGrad)"
            />
            <circle cx="32" cy="16" r="1.5" fill="#ffeeaa" />
          </g>
        ))}
      </motion.svg>
    </div>
  );
};
