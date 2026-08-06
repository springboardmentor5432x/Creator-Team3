import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'midnight', name: 'Slate Midnight', description: 'Professional corporate dark navy with blue accents', category: 'Corporate' },
  { id: 'navy', name: 'Dark Navy', description: 'Deep oceanic navy with electric cyan highlights', category: 'Minimal' },
  { id: 'aurora', name: 'Emerald Aurora', description: 'Dark emerald green with organic glass glow', category: 'Nature' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', description: 'Neon electric blue, pink, yellow with cyber grid', category: 'Futuristic' },
  { id: 'rose', name: 'Sunset Rose', description: 'Warm charcoal with rose and orange gradients', category: 'Warm' },
  { id: 'light', name: 'Snow Alabaster', description: 'Premium clean light mode inspired by Apple UI', category: 'Light' },
  { id: 'amethyst', name: 'Amethyst Neon', description: 'Deep violet with glowing neon purple accents', category: 'Glass' }
];

export const ThemeProvider = ({ children, token }) => {
  const [theme, setThemeState] = useState(() => localStorage.getItem('creatoriq_theme') || 'midnight');
  const [isHyperUI, setIsHyperUI] = useState(() => localStorage.getItem('creatoriq_hyperui') === 'true');
  const [performanceMode, setPerformanceMode] = useState(() => localStorage.getItem('creatoriq_perf') || 'ultra'); // ultra, balanced, battery

  const [chartColors, setChartColors] = useState({
    c1: '#3b82f6',
    c2: '#ec4899',
    c3: '#10b981',
    c4: '#f59e0b',
    c5: '#8b5cf6',
    bgCard: '#131b2e',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    borderColor: 'rgba(255, 255, 255, 0.08)'
  });

  const updateComputedColors = (themeId) => {
    document.documentElement.setAttribute('data-theme', themeId);
    
    // Read computed style
    setTimeout(() => {
      const styles = getComputedStyle(document.documentElement);
      setChartColors({
        c1: styles.getPropertyValue('--chart-1').trim() || '#3b82f6',
        c2: styles.getPropertyValue('--chart-2').trim() || '#ec4899',
        c3: styles.getPropertyValue('--chart-3').trim() || '#10b981',
        c4: styles.getPropertyValue('--chart-4').trim() || '#f59e0b',
        c5: styles.getPropertyValue('--chart-5').trim() || '#8b5cf6',
        accentPrimary: styles.getPropertyValue('--accent-primary').trim() || '#3b82f6',
        bgCard: styles.getPropertyValue('--bg-card').trim() || '#131b2e',
        textPrimary: styles.getPropertyValue('--text-primary').trim() || '#f8fafc',
        textSecondary: styles.getPropertyValue('--text-secondary').trim() || '#94a3b8',
        borderColor: styles.getPropertyValue('--border-primary').trim() || 'rgba(255,255,255,0.1)'
      });
    }, 50);
  };

  useEffect(() => {
    updateComputedColors(theme);
    localStorage.setItem('creatoriq_theme', theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('creatoriq_theme', newTheme);
    updateComputedColors(newTheme);

    // Sync setting with backend if logged in
    if (token) {
      fetch('http://127.0.0.1:8000/api/revenue/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active_theme: newTheme })
      }).catch(() => {});
    }
  };

  const setHyperUI = (val) => {
    setIsHyperUI(val);
    localStorage.setItem('creatoriq_hyperui', val);
  };

  const setPerfMode = (val) => {
    setPerformanceMode(val);
    localStorage.setItem('creatoriq_perf', val);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, setTheme, 
      themes: THEMES, 
      chartColors,
      isHyperUI, setHyperUI,
      performanceMode, setPerfMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
