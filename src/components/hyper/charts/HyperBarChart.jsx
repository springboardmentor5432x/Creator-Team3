import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHyperDataStream } from '../../../hooks/hyper/useHyperDataStream';
import { useHyperLighting } from '../../../hooks/hyper/useHyperLighting';
import { useTheme } from '../../../context/ThemeContext';

const PADDING = { top: 20, right: 20, bottom: 30, left: 20 };

export default function HyperBarChart({ 
  data, 
  bars = [{ dataKey: 'v', color: '#8b5cf6' }],
  labelKey = 'name',
  height = 300, 
  width = 600, // typically 100% width via ResizeObserver in prod, hardcoded for now
}) {
  const containerRef = useRef(null);
  const { isHyperUI, performanceMode } = useTheme();
  
  // Use our centralized data stream hook to smoothly interpolate values
  const streamedData = useHyperDataStream(data, isHyperUI);
  
  // Use our centralized lighting hook
  const { getRelativeGlow } = useHyperLighting(containerRef);
  const backgroundGlow = getRelativeGlow();

  const maxVal = useMemo(() => {
    if (!streamedData || !streamedData.length) return 100;
    let max = 0;
    streamedData.forEach(point => {
      bars.forEach(b => {
        if (point[b.dataKey] > max) max = point[b.dataKey];
      });
    });
    return max * 1.2;
  }, [streamedData, bars]);

  if (!isHyperUI) {
    return <div>HyperBarChart requires HyperUI mode</div>;
  }

  const isBattery = performanceMode === 'battery';
  const innerWidth = width - PADDING.left - PADDING.right;
  const barGroupCount = Math.max(1, streamedData.length);
  const stepX = innerWidth / barGroupCount;
  
  // Calculate width for individual bars within a group
  const totalBarSpace = stepX * 0.7; // Use 70% of available group width
  const individualBarWidth = Math.min(24, totalBarSpace / bars.length);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Background Interactive Glow */}
      {!isBattery && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: backgroundGlow,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      {/* SVG Axis / Labels */}
      <svg width="100%" height="100%" style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none' }}>
        {streamedData.map((point, i) => {
          const x = PADDING.left + i * stepX + (stepX / 2);
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={height - 10}
              fill="#94a3b8"
              fontSize="12"
              textAnchor="middle"
            >
              {point[labelKey]}
            </text>
          );
        })}
      </svg>

      {/* HTML Bars for better glassmorphism layout */}
      <div style={{ position: 'absolute', inset: 0, padding: `${PADDING.top}px ${PADDING.right}px ${PADDING.bottom}px ${PADDING.left}px`, display: 'flex', zIndex: 2 }}>
        {streamedData.map((point, i) => {
          return (
            <div 
              key={i} 
              style={{ 
                flex: 1, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'flex-end',
                height: '100%',
                position: 'relative',
                gap: '4px' // gap between bars in a group
              }}
            >
              {bars.map((barConf, bIdx) => {
                const val = point[barConf.dataKey] || 0;
                const barHeightPct = (val / maxVal) * 100;
                
                return (
                  <motion.div
                    key={bIdx}
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeightPct}%` }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100, delay: bIdx * 0.05 }}
                    whileHover={{ 
                      scaleX: 1.1,
                      boxShadow: `0 0 30px ${barConf.color}`,
                      background: `linear-gradient(180deg, ${barConf.color} 0%, rgba(255,255,255,0.1) 100%)`
                    }}
                    style={{
                      width: `${individualBarWidth}px`,
                      background: `linear-gradient(180deg, ${barConf.color}80 0%, rgba(255,255,255,0.05) 100%)`,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${barConf.color}40`,
                      borderBottom: 'none',
                      borderRadius: '8px 8px 0 0',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Moving glass reflection line */}
                    {!isBattery && (
                      <motion.div 
                        animate={{ top: ['-50%', '150%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.2 + bIdx * 0.1 }}
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          height: '30%',
                          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.5), transparent)',
                          transform: 'skewY(-20deg)',
                          opacity: 0.5
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
