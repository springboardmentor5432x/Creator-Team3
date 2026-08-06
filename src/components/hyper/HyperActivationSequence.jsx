import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundEngine } from '../../utils/SoundEngine';
import { useTheme } from '../../context/ThemeContext';

export default function HyperActivationSequence({ onComplete }) {
  const [stage, setStage] = useState(0); 
  // Stages: 
  // 0 = Initial render, start Sequence
  // 1 = Freeze & Darken
  // 2 = Glitch & Scanlines
  // 3 = Disassemble / Particles
  // 4 = Camera Travel
  // 5 = Assemble & Complete
  
  const { performanceMode } = useTheme();

  useEffect(() => {
    SoundEngine.startup();

    // Stage 1: Freeze (0-500ms)
    setTimeout(() => setStage(1), 100);
    
    // Stage 2: Glitch (500ms - 1500ms)
    setTimeout(() => setStage(2), 500);
    
    // Stage 3: Disassemble (1500ms - 2500ms)
    setTimeout(() => setStage(3), 1500);

    // Stage 4: Camera Travel (2500ms - 3500ms)
    setTimeout(() => setStage(4), 2500);

    // Stage 5: Done (3500ms)
    setTimeout(() => {
      setStage(5);
      if (onComplete) onComplete();
    }, 3500);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 5 && (
        <motion.div
          key="hyper-transition"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: stage >= 1 ? 1 : 0,
            backgroundColor: stage >= 1 ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)'
          }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            pointerEvents: 'all', // Freeze interaction
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Stage 2: Glitch Layer */}
          {stage === 2 && performanceMode !== 'battery' && (
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.05) 2px, rgba(0, 255, 255, 0.05) 4px)',
                pointerEvents: 'none',
              }}
              animate={{
                x: [0, -5, 5, -2, 2, 0],
                opacity: [0.5, 0.8, 0.3, 0.9, 0.5]
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          )}
          
          {/* Stage 3/4: Disassemble & Travel */}
          {stage >= 3 && performanceMode !== 'battery' && (
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 20, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                width: 100,
                height: 100,
                border: '2px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '50%',
                boxShadow: '0 0 50px rgba(59, 130, 246, 0.8)',
              }}
            />
          )}

          {stage >= 3 && performanceMode !== 'battery' && (
             <motion.div
             initial={{ scale: 1, opacity: 0 }}
             animate={{ scale: 15, opacity: [0, 1, 0] }}
             transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
             style={{
               position: 'absolute',
               width: 150,
               height: 150,
               border: '1px solid rgba(236, 72, 153, 0.5)',
               borderRadius: '50%',
               boxShadow: '0 0 50px rgba(236, 72, 153, 0.8)',
             }}
           />
          )}

          <div style={{ position: 'absolute', bottom: 40, fontFamily: 'monospace', color: '#3b82f6', letterSpacing: '2px', fontSize: '12px' }}>
            {stage === 1 && "INITIATING HYPER-THREADING..."}
            {stage === 2 && "CALIBRATING WEBGL CONTEXT..."}
            {stage === 3 && "DISASSEMBLING UI MATRIX..."}
            {stage === 4 && "ASSEMBLING HYPER UI..."}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
