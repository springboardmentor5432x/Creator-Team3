import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Users, DollarSign, Plug, Bell, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import { SoundEngine } from '../../utils/SoundEngine';

export default function HyperSidebar({ activeTab, setActiveTab }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'growth', icon: <TrendingUp size={20} />, label: 'Growth & Trends' },
    { id: 'audience', icon: <Users size={20} />, label: 'Audience Insights' },
    { id: 'revenue', icon: <DollarSign size={20} />, label: 'Revenue Tracker' },
    { id: 'connections', icon: <Plug size={20} />, label: 'Connections' },
    { id: 'reports', icon: <Bell size={20} />, label: 'Reports' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' }
  ];

  const handleToggle = () => {
    SoundEngine.toggle();
    setIsExpanded(!isExpanded);
  };

  const handleNavClick = (id) => {
    SoundEngine.toggle();
    setActiveTab(id);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Invisible hover area to auto-expand */}
      <div 
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 20, zIndex: 9998 }}
        onMouseEnter={() => setIsExpanded(true)}
      />

      <motion.div
        onMouseLeave={() => setIsExpanded(false)}
        animate={{ width: isExpanded ? 260 : 70 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: 'rgba(10, 15, 25, 0.4)',
          backdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: isExpanded ? '20px 0 50px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: 24, height: 24, borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', flexShrink: 0 }} />
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                style={{ fontWeight: 'bold', fontSize: '18px', color: 'white', whiteSpace: 'nowrap' }}
              >
                CreatorIQ
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.div
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: isActive ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  color: isActive ? 'white' : '#94a3b8',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 24, color: isActive ? '#3b82f6' : 'inherit' }}>
                  {item.icon}
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      style={{ whiteSpace: 'nowrap', fontWeight: isActive ? '600' : '400', fontSize: '14px' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Glow effect when active */}
                {isActive && isExpanded && (
                  <motion.div 
                    layoutId="activeGlow"
                    style={{
                      position: 'absolute',
                      right: 12,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#3b82f6',
                      boxShadow: '0 0 10px #3b82f6'
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Toggle Button */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: isExpanded ? 'flex-end' : 'center' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8',
              width: 32,
              height: 32,
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
