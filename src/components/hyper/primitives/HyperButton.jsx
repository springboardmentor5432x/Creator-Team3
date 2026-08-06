import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useHyperPhysics } from '../../../hooks/hyper/useHyperPhysics';
import { useTheme } from '../../../context/ThemeContext';

export default function HyperButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const buttonRef = useRef(null);
  const { isHyperUI, performanceMode } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { springConfigs } = useHyperPhysics();

  const handleMouseMove = (e) => {
    if (!buttonRef.current || performanceMode === 'battery') return;
    const { left, top } = buttonRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  if (!isHyperUI) {
    // Fallback professional mode button
    const bg = variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700';
    return (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${bg} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  // HyperUI Button
  const isBattery = performanceMode === 'battery';
  const baseColor = variant === 'primary' ? '59, 130, 246' : '139, 92, 246'; // blue or purple

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={springConfigs.tight}
      className={`relative px-6 py-3 rounded-xl font-semibold overflow-hidden group ${className}`}
      style={{
        background: `rgba(15, 23, 42, 0.4)`,
        backdropFilter: 'blur(12px)',
        border: `1px solid rgba(${baseColor}, 0.3)`,
        color: '#f8fafc',
        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(${baseColor}, 0.1)`,
      }}
      {...props}
    >
      {/* Dynamic Hover Glow */}
      {!isBattery && (
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useMotionTemplate`radial-gradient(100px circle at ${mouseX}px ${mouseY}px, rgba(${baseColor}, 0.4), transparent 80%)`,
          }}
        />
      )}

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Edge highlight on hover */}
      <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/20 transition-colors duration-500 z-20 pointer-events-none" />
    </motion.button>
  );
}
