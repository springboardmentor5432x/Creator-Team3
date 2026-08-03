import React from 'react';

export default function PageTransition({ children }) {
  return (
    <div className="ds-page-transition">
      <style>{`
        .ds-page-transition {
          animation: fadeInUp var(--duration-slow) var(--ease-spring) both;
          will-change: opacity, transform;
        }
      `}</style>
      {children}
    </div>
  );
}
