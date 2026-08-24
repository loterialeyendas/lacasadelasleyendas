import React from 'react';
import { motion } from 'motion/react';

interface PassportStampSvgProps {
  code: string;
  name: string;
  isUnlocked?: boolean;
  className?: string;
  size?: number;
}

export const PassportStampSvg: React.FC<PassportStampSvgProps> = ({
  code,
  name,
  isUnlocked = false,
  className = "w-16 h-16",
  size = 64
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="stampUnlockedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffeeaa" />
            <stop offset="50%" stopColor="#be8d2c" />
            <stop offset="100%" stopColor="#7a3108" />
          </linearGradient>
        </defs>

        {/* Anillo exterior decorativo con borde punteado */}
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke={isUnlocked ? "url(#stampUnlockedGrad)" : "rgba(51,33,10,0.35)"}
          strokeWidth="2.5"
          strokeDasharray="4 3"
        />

        {/* Anillo interior */}
        <circle
          cx="40"
          cy="40"
          r="30"
          stroke={isUnlocked ? "#fccf65" : "rgba(51,33,10,0.25)"}
          strokeWidth="1.5"
          fill={isUnlocked ? "rgba(190,141,44,0.15)" : "rgba(143,101,18,0.12)"}
        />

        {/* Texto del Código de la Leyenda */}
        <text
          x="40"
          y="44"
          textAnchor="middle"
          fill={isUnlocked ? "#ffeeaa" : "rgba(51,33,10,0.5)"}
          fontFamily="'Cinzel', serif"
          fontSize="14"
          fontWeight="bold"
          letterSpacing="2"
        >
          {code}
        </text>

        {/* Sello 'GUATEMALA' en arco superior e inferior */}
        <text
          x="40"
          y="22"
          textAnchor="middle"
          fill={isUnlocked ? "#be8d2c" : "rgba(143,101,18,0.6)"}
          fontFamily="'Cinzel', serif"
          fontSize="6"
          letterSpacing="1.5"
        >
          {isUnlocked ? "SELLADO" : "BLOQUEADO"}
        </text>

        <text
          x="40"
          y="62"
          textAnchor="middle"
          fill={isUnlocked ? "#be8d2c" : "rgba(143,101,18,0.6)"}
          fontFamily="'Cinzel', serif"
          fontSize="5.5"
          letterSpacing="1"
        >
          GUATEMALA
        </text>
      </svg>
    </motion.div>
  );
};
