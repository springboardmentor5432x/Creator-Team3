import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundEngine } from '../../utils/SoundEngine';

function OrbMesh({ isHovered, isThinking }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhysicalMaterial 
        color={isThinking ? "#ec4899" : "#3b82f6"}
        emissive={isThinking ? "#ec4899" : "#3b82f6"}
        emissiveIntensity={isHovered ? 2 : 1}
        transparent
        opacity={0.8}
        roughness={0.1}
        transmission={0.9}
        thickness={1}
      />
    </mesh>
  );
}

export default function HyperAIOrb() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleClick = () => {
    SoundEngine.toggle();
    setIsOpen(!isOpen);
    // Simulate thinking state briefly
    if (!isOpen) {
      setIsThinking(true);
      setTimeout(() => setIsThinking(false), 2000);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isOpen) SoundEngine.hover();
  };

  return (
    <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 9999 }}>
      {/* The Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute',
              bottom: '100px',
              right: '0',
              width: '350px',
              height: '500px',
              background: 'rgba(10, 15, 25, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(59, 130, 246, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.2), transparent)' }}>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
                CreatorIQ Hyper Assistant
              </h3>
            </div>
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              {isThinking ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  style={{ color: '#ec4899', fontSize: '14px' }}
                >
                  Neural network processing...
                </motion.div>
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.5 }}>
                  <p>Welcome to HyperUI mode.</p>
                  <p>I can help you analyze CTR, predict growth, or reconfigure your dashboard layout.</p>
                </div>
              )}
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <input 
                type="text" 
                placeholder="Ask me anything... (Press Ctrl+K)" 
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: 'white',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Floating Orb */}
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: '80px',
          height: '80px',
          cursor: 'pointer',
          borderRadius: '50%',
          boxShadow: isHovered 
            ? '0 0 40px rgba(59, 130, 246, 0.6)' 
            : '0 0 20px rgba(59, 130, 246, 0.3)',
          transition: 'box-shadow 0.3s ease',
          background: 'rgba(0,0,0,0.5)'
        }}
      >
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbMesh isHovered={isHovered} isThinking={isThinking} />
        </Canvas>
      </motion.div>
    </div>
  );
}
