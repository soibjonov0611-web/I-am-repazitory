import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AWWWARDS_EASE } from '../lib/motion';

export default function PageIntro({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: start, 1: monogram, 2: sweep, 3: exit

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }

    const t1 = setTimeout(() => setStage(1), 100);
    const t2 = setTimeout(() => setStage(2), 650);
    const t3 = setTimeout(() => {
      setStage(3);
      setTimeout(() => onComplete?.(), 450);
    }, 1150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 3 && (
        <motion.div
          className="page-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(10px)',
            transition: { duration: 0.5, ease: AWWWARDS_EASE },
          }}
        >
          <div className="page-intro-bg">
            <motion.div
              className="intro-glow"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.2, 1], opacity: [0, 0.7, 0.4] }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          </div>

          <div className="intro-center">
            {/* Logo / Monogram Container */}
            <motion.div
              className="intro-logo-box"
              initial={{ scale: 0.7, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: AWWWARDS_EASE }}
            >
              <span className="intro-symbol">&lt;/&gt;</span>
              <span className="intro-initials">SA</span>
            </motion.div>

            {/* Name / Subtitle */}
            <motion.div
              className="intro-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 10 }}
              transition={{ duration: 0.4, ease: AWWWARDS_EASE }}
            >
              <h1 className="intro-name">Soibjonov Abduraxmon</h1>
              <p className="intro-role">Frontend Developer &amp; UI Engineer</p>
            </motion.div>

            {/* Progress Sweep Line */}
            <div className="intro-line-track">
              <motion.div
                className="intro-line-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: stage >= 2 ? 1 : stage >= 1 ? 0.6 : 0.1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
