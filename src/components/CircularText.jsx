import { useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'motion/react';

import './CircularText.css';

const getRotationTransition = (duration, from, loop = true) => ({
  from,
  to: from + 360,
  ease: 'linear',
  duration,
  type: 'tween',
  repeat: loop ? Infinity : 0
});

const getTransition = (duration, from) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring',
    damping: 20,
    stiffness: 300
  }
});

// Theme colors with different shades
const getLetterColor = (index, total) => {
  // Theme colors: magenta (#ff00ff, #9d00ff) and blue (#00bfff, #0066ff)
  const colors = [
    '#ff00ff', // Bright magenta
    '#e600e6', // Magenta shade 1
    '#cc00cc', // Magenta shade 2
    '#b300b3', // Magenta shade 3
    '#9d00ff', // Deep magenta
    '#8c00e6', // Purple-magenta
    '#7a00cc', // Purple shade 1
    '#6900b3', // Purple shade 2
    '#5800ff', // Deep purple
    '#4d00e6', // Purple-blue
    '#4200cc', // Purple-blue shade 1
    '#3700b3', // Purple-blue shade 2
    '#2b00ff', // Blue-purple
    '#1f00e6', // Blue-purple shade 1
    '#1300cc', // Blue-purple shade 2
    '#0700b3', // Blue-purple shade 3
    '#0066ff', // Deep blue
    '#0080ff', // Blue shade 1
    '#0099ff', // Blue shade 2
    '#00b3ff', // Blue shade 3
    '#00bfff', // Bright blue
    '#00ccff', // Cyan-blue
    '#00d9ff', // Cyan-blue shade 1
    '#00e6ff', // Cyan-blue shade 2
  ];
  
  // Cycle through colors based on index
  return colors[index % colors.length];
};

const CircularText = ({ text, spinDuration = 20, onHover = 'speedUp', className = '' }) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();
    if (!onHover) return;

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 }
        };
        scaleVal = 1;
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  };

  return (
    <motion.div
      className={`circular-text ${className}`}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const factor = Math.PI / letters.length;
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;
        const letterColor = getLetterColor(i, letters.length);

        return (
          <span 
            key={i} 
            style={{ 
              transform, 
              WebkitTransform: transform,
              color: letterColor,
              textShadow: `0 0 10px ${letterColor}, 0 0 20px ${letterColor}40`
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
