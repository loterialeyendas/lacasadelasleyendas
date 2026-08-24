import React from 'react';
import { motion } from 'motion/react';

interface MysticLockProps {
  isUnlocked?: boolean;
  className?: string;
  size?: number;
}

export const MysticLock: React.FC<MysticLockProps> = ({
  isUnlocked = false,
  className = "w-8 h-8",
  size = 32
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="goldLockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffeeaa" />
            <stop offset="50%" stopColor="#be8d2c" />
            <stop offset="100%" stopColor="#7a3108" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fccf65" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c83737" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Arco del candado animado */}
        <motion.path
          d="M16 22V14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14V22"
          stroke="url(#goldLockGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          animate={{
            y: isUnlocked ? -6 : 0,
            rotate: isUnlocked ? -18 : 0,
            transformOrigin: "16px 22px"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />

        {/* Cuerpo del candado */}
        <rect
          x="10"
          y="20"
          width="28"
          height="22"
          rx="5"
          fill="url(#goldLockGrad)"
          stroke="#7a4d0a"
          strokeWidth="1"
          className="drop-shadow-md"
        />

        {/* Detalles grabados internos */}
        <rect
          x="13"
          y="23"
          width="22"
          height="16"
          rx="3"
          fill="#000000"
          fillOpacity="0.3"
        />

        {/* Cerradura / Ojo de la llave */}
        <circle cx="24" cy="29" r="2.5" fill="#000000" />
        <path d="M22.5 29.5L21.5 35H26.5L25.5 29.5H22.5Z" fill="#000000" />

        {/* Brillo místico si está desbloqueado */}
        {isUnlocked && (
          <circle
            cx="24"
            cy="31"
            r="14"
            fill="url(#glowGrad)"
            className="animate-pulse pointer-events-none"
          />
        )}
      </svg>
    </div>
  );
};
