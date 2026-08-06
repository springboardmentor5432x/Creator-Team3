export const useHyperPhysics = () => {
  return {
    // Heavy elements (cards, panels)
    heavySpring: { type: 'spring', damping: 25, stiffness: 120, mass: 1 },
    
    // UI elements (buttons, inputs)
    uiSpring: { type: 'spring', damping: 20, stiffness: 300, mass: 0.5 },
    
    // Quick snappiness (cursors, small hovers)
    snappySpring: { type: 'spring', damping: 15, stiffness: 400, mass: 0.2 },
    
    // Fluid morphing (graphs, continuous data)
    fluidSpring: { type: 'spring', damping: 30, stiffness: 100, mass: 1 },

    // Data stream inertia
    dataStreamSpring: { type: 'spring', damping: 40, stiffness: 50, mass: 2 }
  };
};
