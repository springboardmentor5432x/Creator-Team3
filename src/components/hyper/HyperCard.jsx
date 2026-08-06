import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SoundEngine } from '../../utils/SoundEngine';

export default function HyperCard({ children, style, className = '' }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for a fluid, physical feel
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  // Map mouse position to rotation
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  // Lighting calculations
  const glowOpacity = useTransform(mouseY, [-0.5, 0.5], [0.1, 0.4]);
  const background = useTransform(
    [mouseX, mouseY],
    ([mx, my]) => `radial-gradient(
      800px circle at ${mx * 100 + 50}% ${my * 100 + 50}%, 
      rgba(255,255,255,0.06),
      transparent 40%
    )`
  );

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    // Normalize to -0.5 to 0.5
    const xPct = (mouseXPos / width) - 0.5;
    const yPct = (mouseYPos / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    SoundEngine.hover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        ...style
      }}
      className={className}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'rgba(10, 15, 25, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          boxShadow: isHovered 
            ? '0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.2)'
            : '0 10px 30px rgba(0,0,0,0.3)',
          transition: 'box-shadow 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        {/* Interactive Highlight Layer */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Content Layer */}
        <div style={{ position: 'relative', zIndex: 2, height: '100%', transform: 'translateZ(30px)' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
