import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHyperDataStream } from '../../../hooks/hyper/useHyperDataStream';
import { useHyperLighting } from '../../../hooks/hyper/useHyperLighting';
import { useTheme } from '../../../context/ThemeContext';

const PADDING = { top: 20, right: 20, bottom: 20, left: 20 };

export default function HyperLineChart({ 
  data, 
  lines = [{ dataKey: 'v', color: '#3b82f6' }], 
  height = 200, 
  width = 600, // typically 100% width via ResizeObserver in prod, hardcoded for now
  showArea = true 
}) {
  const containerRef = useRef(null);
  const { isHyperUI, performanceMode } = useTheme();
  
  // Use our centralized data stream hook to smoothly interpolate values
  const streamedData = useHyperDataStream(data, isHyperUI);
  
  // Use our centralized lighting hook
  const { getRelativeGlow } = useHyperLighting(containerRef);
  const backgroundGlow = getRelativeGlow();

  // 1. Calculate min/max for scaling across all lines
  const maxVal = useMemo(() => {
    if (!streamedData || !streamedData.length) return 100;
    let max = 0;
    streamedData.forEach(point => {
      lines.forEach(line => {
        if (point[line.dataKey] > max) max = point[line.dataKey];
      });
    });
    return max * 1.2; // 20% headroom
  }, [streamedData, lines]);

  // 2. Generate SVG Path
  const generatePath = (points, key) => {
    if (!points || points.length === 0) return '';
    const innerWidth = width - PADDING.left - PADDING.right;
    const innerHeight = height - PADDING.top - PADDING.bottom;
    const stepX = innerWidth / Math.max(1, points.length - 1);

    let d = '';
    points.forEach((point, i) => {
      const val = point[key] || 0;
      const x = PADDING.left + i * stepX;
      const y = PADDING.top + innerHeight - (val / maxVal) * innerHeight;

      if (i === 0) {
        d += `M ${x},${y}`;
      } else {
        const prevPoint = points[i - 1];
        const prevX = PADDING.left + (i - 1) * stepX;
        const prevY = PADDING.top + innerHeight - ((prevPoint[key] || 0) / maxVal) * innerHeight;
        
        const controlX1 = prevX + stepX / 2;
        const controlY1 = prevY;
        const controlX2 = x - stepX / 2;
        const controlY2 = y;

        d += ` C ${controlX1},${controlY1} ${controlX2},${controlY2} ${x},${y}`;
      }
    });
    return d;
  };

  const pathStrings = useMemo(() => {
    return lines.reduce((acc, line) => {
      acc[line.dataKey] = generatePath(streamedData, line.dataKey);
      return acc;
    }, {});
  }, [streamedData, maxVal, width, height, lines]);
  
  // Generate Area Path (same as line but closed at bottom)
  const areaStrings = useMemo(() => {
    const innerWidth = width - PADDING.left - PADDING.right;
    const innerHeight = height - PADDING.top - PADDING.bottom;
    return lines.reduce((acc, line) => {
      const path = pathStrings[line.dataKey];
      if (path) {
        acc[line.dataKey] = `${path} L ${PADDING.left + innerWidth},${PADDING.top + innerHeight} L ${PADDING.left},${PADDING.top + innerHeight} Z`;
      }
      return acc;
    }, {});
  }, [pathStrings, width, height, lines]);

  if (!isHyperUI) {
    return <div>HyperLineChart requires HyperUI mode</div>;
  }

  const isBattery = performanceMode === 'battery';

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px'
      }}
    >
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

      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: 'absolute', zIndex: 1 }}>
        <defs>
          {lines.map((line, idx) => (
            <React.Fragment key={idx}>
              <linearGradient id={`gradient-${line.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={line.color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={line.color} stopOpacity={0} />
              </linearGradient>
              <filter id={`glow-${line.dataKey}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </React.Fragment>
          ))}
        </defs>

        {lines.map(line => (
          <React.Fragment key={line.dataKey}>
            {showArea && (
              <motion.path
                d={areaStrings[line.dataKey]}
                fill={`url(#gradient-${line.dataKey})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />
            )}
            <motion.path
              d={pathStrings[line.dataKey]}
              fill="none"
              stroke={line.color}
              strokeWidth={line.strokeWidth || 3}
              filter={!isBattery ? `url(#glow-${line.dataKey})` : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {!isBattery && streamedData.map((point, i) => {
              const innerWidth = width - PADDING.left - PADDING.right;
              const innerHeight = height - PADDING.top - PADDING.bottom;
              const stepX = innerWidth / Math.max(1, streamedData.length - 1);
              const x = PADDING.left + i * stepX;
              const y = PADDING.top + innerHeight - ((point[line.dataKey] || 0) / maxVal) * innerHeight;

              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={4}
                  fill="#fff"
                  stroke={line.color}
                  strokeWidth={2}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  whileHover={{ scale: 2, fill: line.color }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
}
