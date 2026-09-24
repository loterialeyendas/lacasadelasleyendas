import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children,
  ...props 
}) => {
  const variants = {
    primary: 'bg-earth-brown hover:bg-gold text-candle border-gold/50 shadow-[0_0_15px_rgba(122,49,8,0.25)]',
    secondary: 'bg-maya-red hover:bg-maya-red/85 text-candle border-maya-red/50 shadow-[0_0_15px_rgba(168,39,39,0.2)]',
    outline: 'bg-transparent border-gold text-gold hover:bg-gold/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'font-display rounded-lg border transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

export interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ className, children, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    onClick={onClick}
    className={cn('mystical-card border-none bg-black/60 p-6 relative group', className)}
  >
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(252,207,101,0.04),transparent_70%)] pointer-events-none" />
    <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export const MysticalTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h1 className={cn('text-3xl font-display text-center mb-6 text-gold drop-shadow-[0_2px_4px_rgba(51,33,10,0.25)]', className)}>
    {children}
  </h1>
);

export const MysticLoader: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full flex flex-col items-center justify-center py-24 gap-4"
  >
    <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    <span className="text-[10px] font-display text-gold uppercase tracking-[0.3em]">
      Invocando...
    </span>
  </motion.div>
);
