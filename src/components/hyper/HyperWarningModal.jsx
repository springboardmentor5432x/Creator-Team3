import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundEngine } from '../../utils/SoundEngine';

export default function HyperWarningModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    SoundEngine.success();
    onConfirm();
  };

  const handleCancel = () => {
    SoundEngine.error();
    onCancel();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100000,
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.2)',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              background: 'rgba(59, 130, 246, 0.2)', 
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              color: '#3b82f6'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Warning: High Hardware Requirements</h2>
          </div>
          
          <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
            HyperUI is an experimental, GPU-intensive 3D interface. It intentionally prioritizes visual experience over universal compatibility.
          </p>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', marginBottom: '32px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#e2e8f0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Recommended Specs</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <li>Desktop / Laptop (Not recommended for Mobile)</li>
              <li>Dedicated GPU (NVIDIA / AMD / Apple Silicon)</li>
              <li>120Hz+ Display</li>
              <li>Latest WebGL Support</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleCancel}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
              onMouseOut={e => e.target.style.background = 'transparent'}
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              style={{
                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.target.style.transform = 'translateY(0)'}
            >
              Enable HyperUI
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
