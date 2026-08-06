import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useHyperPhysics } from '../../../hooks/hyper/useHyperPhysics';
import { useTheme } from '../../../context/ThemeContext';

export default function HyperInput({
  label,
  icon: Icon,
  className = '',
  ...props
}) {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const { isHyperUI, performanceMode } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { springConfigs } = useHyperPhysics();

  const handleMouseMove = (e) => {
    if (!containerRef.current || performanceMode === 'battery') return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  if (!isHyperUI) {
    // Professional Mode Input
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon size={18} />
            </div>
          )}
          <input 
            className={`w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${Icon ? 'pl-10' : ''}`}
            {...props}
          />
        </div>
      </div>
    );
  }

  // HyperUI Input
  const isBattery = performanceMode === 'battery';
  const baseColor = '59, 130, 246'; // blue theme for inputs

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <motion.label 
          animate={{ color: isFocused ? `rgba(${baseColor}, 1)` : '#94a3b8' }}
          className="text-sm font-semibold tracking-wide"
        >
          {label}
        </motion.label>
      )}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        animate={{ 
          scale: isFocused ? 1.02 : 1,
          borderColor: isFocused ? `rgba(${baseColor}, 0.6)` : 'rgba(255,255,255,0.1)'
        }}
        transition={springConfigs.gentle}
        className="relative group rounded-xl overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/10"
      >
        {/* Dynamic Glow following cursor */}
        {!isBattery && (
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
            style={{
              background: useMotionTemplate`radial-gradient(120px circle at ${mouseX}px ${mouseY}px, rgba(${baseColor}, 0.15), transparent 80%)`,
            }}
          />
        )}
        
        {/* Focus Glow */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          initial={false}
          animate={{ opacity: isFocused ? 1 : 0 }}
          style={{
            boxShadow: `inset 0 0 15px rgba(${baseColor}, 0.2)`
          }}
        />

        <div className="relative z-10 flex items-center">
          {Icon && (
            <motion.div 
              animate={{ color: isFocused ? `rgba(${baseColor}, 1)` : '#64748b' }}
              className="pl-4 pr-2"
            >
              <Icon size={18} />
            </motion.div>
          )}
          <input
            ref={inputRef}
            onFocus={(e) => {
              setIsFocused(true);
              if (props.onFocus) props.onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (props.onBlur) props.onBlur(e);
            }}
            className={`w-full bg-transparent text-slate-200 placeholder-slate-500 py-3 focus:outline-none ${!Icon ? 'px-4' : 'pr-4'}`}
            {...props}
          />
        </div>
      </motion.div>
    </div>
  );
}
