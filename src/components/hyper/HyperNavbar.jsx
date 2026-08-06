import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Bell, Search, Menu, Settings } from 'lucide-react';
import { SoundEngine } from '../../utils/SoundEngine';

export default function HyperNavbar({ 
  userRole, 
  notifications, 
  setShowNotifPanel, 
  activeTab,
  onLogout 
}) {
  const { scrollY } = useScroll();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic values based on scroll
  const navWidth = useTransform(scrollY, [0, 100], ['100%', '80%']);
  const navY = useTransform(scrollY, [0, 100], [0, 10]);
  const navBorderRadius = useTransform(scrollY, [0, 100], ['0px', '24px']);
  const navBackdropBlur = useTransform(scrollY, [0, 100], ['blur(10px)', 'blur(30px)']);

  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

  const handleMouseEnter = () => {
    setIsHovered(true);
    SoundEngine.hover();
  };

  return (
    <motion.div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 20px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: navWidth,
          y: navY,
          borderRadius: navBorderRadius,
          background: isHovered ? 'rgba(10, 15, 25, 0.7)' : 'rgba(10, 15, 25, 0.4)',
          backdropFilter: navBackdropBlur,
          WebkitBackdropFilter: navBackdropBlur,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          transition: 'background 0.3s ease'
        }}
      >
        {/* Left Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '600',
            background: 'linear-gradient(90deg, #fff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {activeTab.replace('platform_', '').toUpperCase() || 'DASHBOARD'}
          </h2>
          <span style={{
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#3b82f6',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {userRole}
          </span>
        </div>

        {/* Center / Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Dynamic Search Bar */}
          <motion.div
            animate={{ width: isSearchFocused ? 300 : 200 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12 }} />
            <input 
              type="text" 
              placeholder="Command Palette (Ctrl+K)"
              onFocus={() => { setIsSearchFocused(true); SoundEngine.toggle(); }}
              onBlur={() => setIsSearchFocused(false)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '8px 16px 8px 36px',
                borderRadius: '16px',
                color: 'white',
                outline: 'none',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            />
          </motion.div>

          {/* Notifications */}
          <div 
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => {
              SoundEngine.toggle();
              setShowNotifPanel(true);
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              style={{ color: '#94a3b8' }}
            >
              <Bell size={20} />
            </motion.div>
            
            <AnimatePresence>
              {unreadCount > 0 && (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 2
                    }}
                  >
                    {unreadCount}
                  </motion.div>
                  {/* Pulsing glow */}
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      background: '#ef4444',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      zIndex: 1
                    }}
                  />
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
            }}
            onClick={() => {
              SoundEngine.toggle();
              onLogout();
            }}
          >
            <Settings size={18} color="white" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
