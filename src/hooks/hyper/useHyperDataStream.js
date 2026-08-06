import { useState, useEffect } from 'react';
import { animate, useMotionValue } from 'framer-motion';

/**
 * A custom hook to smoothly transition between datasets when API data changes.
 * Instead of numbers "snapping", this hook interpolates between the old and new arrays.
 * 
 * @param {Array} currentData - The incoming dataset (e.g. [{v: 10}, {v: 20}])
 * @param {Boolean} isHyperUI - Whether to animate or snap
 * @returns {Array} - The smoothly morphing dataset
 */
export const useHyperDataStream = (currentData, isHyperUI = true) => {
  const [displayData, setDisplayData] = useState(currentData);

  useEffect(() => {
    if (!currentData || !currentData.length) return;
    
    if (!isHyperUI) {
      setDisplayData(currentData);
      return;
    }

    // Determine the transition duration based on length of data (simulating physical limits)
    const duration = Math.min(1.5, Math.max(0.5, currentData.length * 0.1));

    // For every value in the incoming array, create an animation from the current display value
    // to the new incoming value.
    const controls = currentData.map((newItem, index) => {
      const oldItem = displayData[index] || { v: 0 };
      
      return animate(oldItem.v, newItem.v, {
        type: 'spring',
        damping: 30,
        stiffness: 100,
        mass: 1,
        onUpdate: (latest) => {
          setDisplayData((prev) => {
            const next = [...prev];
            // Initialize if missing
            if (!next[index]) next[index] = { ...newItem };
            next[index] = { ...next[index], v: latest };
            return next;
          });
        }
      });
    });

    return () => {
      controls.forEach(control => control.stop());
    };
    // We intentionally don't include displayData in deps to avoid infinite loops,
    // we only care when the incoming source data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, isHyperUI]);

  return displayData;
};
