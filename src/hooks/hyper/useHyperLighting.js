import { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// Global singletons for mouse position so all components share the exact same coordinates
let globalMouseX;
let globalMouseY;

export const useHyperLighting = (containerRef) => {
  const { isHyperUI } = useTheme();
  
  if (!globalMouseX) {
    globalMouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
    globalMouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  }

  // Add global mouse listener only once
  useEffect(() => {
    if (!isHyperUI) return;
    
    const handleGlobalMouseMove = (e) => {
      globalMouseX.set(e.clientX);
      globalMouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [isHyperUI]);

  // Smooth springs for lighting movement
  const springConfig = { damping: 30, stiffness: 200, mass: 1 };
  const smoothX = useSpring(globalMouseX, springConfig);
  const smoothY = useSpring(globalMouseY, springConfig);

  // Generate a dynamic radial gradient background based on mouse proximity to a container
  // Usage: <motion.div style={{ background: useHyperLighting(ref).glow }} />
  const getRelativeGlow = () => {
    return useTransform(
      [smoothX, smoothY],
      ([x, y]) => {
        if (!containerRef || !containerRef.current) return 'transparent';
        const rect = containerRef.current.getBoundingClientRect();
        
        // Calculate mouse position relative to the container
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;
        
        // Convert to percentage
        const xPct = (relativeX / rect.width) * 100;
        const yPct = (relativeY / rect.height) * 100;
        
        return `radial-gradient(
          800px circle at ${xPct}% ${yPct}%, 
          rgba(255, 255, 255, 0.08),
          transparent 40%
        )`;
      }
    );
  };

  return {
    mouseX: smoothX,
    mouseY: smoothY,
    getRelativeGlow
  };
};
