import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function TiltCard({ children, maxTilt = 8, className = '', style = {} }) {
  const ref = useRef(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 25 });

  const handleMouseMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const { clientX, clientY } = e;

    const width = rect.width;
    const height = rect.height;

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const rX = ((height / 2 - mouseY) / (height / 2)) * maxTilt;
    const rY = ((mouseX - width / 2) / (width / 2)) * maxTilt;

    rawRotateX.set(rX);
    rawRotateY.set(rY);

    // Glare position
    setGlarePos({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.2,
    });
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    setGlarePos((p) => ({ ...p, opacity: 0 }));
  };

  return (
    <motion.div
      ref={ref}
      className={'tilt-card-container ' + className}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="tilt-card-inner"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* Dynamic Sheen Glare */}
        <div
          className="tilt-card-glare"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`,
            opacity: glarePos.opacity,
          }}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}
