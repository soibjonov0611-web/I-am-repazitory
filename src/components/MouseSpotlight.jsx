import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MouseSpotlight() {
  const [enabled, setEnabled] = useState(false);

  const rawX = useMotionValue(-500);
  const rawY = useMotionValue(-500);

  const smoothX = useSpring(rawX, { stiffness: 120, damping: 24 });
  const smoothY = useSpring(rawY, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onMouseMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [rawX, rawY]);

  if (!enabled) return null;

  return (
    <motion.div
      className="mouse-spotlight"
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  );
}
