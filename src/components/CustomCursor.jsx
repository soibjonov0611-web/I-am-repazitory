import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/useTheme';

const TRAIL_LIFETIME = 240; // ms
const MAX_POINTS = 24;

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [ripples, setRipples] = useState([]);

  const { isDark } = useTheme();

  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const isLoopRunningRef = useRef(false);

  // Exact mouse coordinates (instant lead pointer)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth, snappy spring physics for the outer HUD reticle
  const springX = useSpring(mouseX, { stiffness: 420, damping: 28, mass: 0.35 });
  const springY = useSpring(mouseY, { stiffness: 420, damping: 28, mass: 0.35 });

  // Draw the smooth glowing trail on the canvas
  const renderTrail = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      isLoopRunningRef.current = false;
      return;
    }

    const ctx = canvas.getContext('2d');
    const now = performance.now();
    const points = pointsRef.current;

    // Prune expired points
    while (points.length > 0 && now - points[0].time > TRAIL_LIFETIME) {
      points.shift();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length >= 2) {
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);

      // Glowing stroke setup
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = isDark ? 9 : 6;
      ctx.shadowColor = isDark ? 'rgba(34, 211, 238, 0.45)' : 'rgba(79, 70, 229, 0.35)';

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        const progress = (i + 1) / points.length; // 0 at tail, 1 at head
        const age = (now - p1.time) / TRAIL_LIFETIME;
        const alpha = Math.max(0, (1 - age) * 0.42 * progress);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        // Smooth color transition along trail
        if (isDark) {
          // Cyan -> Violet -> Indigo
          if (progress > 0.6) {
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
          } else if (progress > 0.3) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          } else {
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          }
        } else {
          // Cyan/Teal -> Deep Indigo
          if (progress > 0.5) {
            ctx.strokeStyle = `rgba(8, 145, 178, ${alpha})`;
          } else {
            ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
          }
        }

        ctx.lineWidth = 0.6 + progress * 2.6; // tapers from 0.6px to 3.2px
        ctx.stroke();
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(renderTrail);
    } else {
      // Trail has fully faded; stop the loop to save 100% CPU/GPU when idle
      isLoopRunningRef.current = false;
      animFrameIdRef.current = null;
    }
  }, [isDark]);

  // Start animation loop when new points are recorded
  const startTrailLoop = useCallback(() => {
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      animFrameIdRef.current = requestAnimationFrame(renderTrail);
    }
  }, [renderTrail]);

  useEffect(() => {
    // Check fine pointer (mouse) and accessibility preferences
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateCapabilities = () => {
      const isFine = finePointerQuery.matches;
      const isReduced = reducedMotionQuery.matches;
      setEnabled(isFine && !isReduced);
    };

    updateCapabilities();

    finePointerQuery.addEventListener('change', updateCapabilities);
    reducedMotionQuery.addEventListener('change', updateCapabilities);

    return () => {
      finePointerQuery.removeEventListener('change', updateCapabilities);
      reducedMotionQuery.removeEventListener('change', updateCapabilities);
    };
  }, []);

  // Resize canvas to match window size and DPR
  useEffect(() => {
    if (!enabled) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [enabled]);

  // Main mouse listeners
  useEffect(() => {
    if (!enabled) return;

    let lastX = -100;
    let lastY = -100;

    const onMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      mouseX.set(x);
      mouseY.set(y);

      if (!visible) setVisible(true);

      // Only add point if mouse moved at least 2px
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist >= 2) {
        lastX = x;
        lastY = y;
        pointsRef.current.push({ x, y, time: performance.now() });
        if (pointsRef.current.length > MAX_POINTS) {
          pointsRef.current.shift();
        }
        startTrailLoop();
      }
    };

    const onMouseDown = (e) => {
      setClicked(true);
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev.slice(-4), { id, x: e.clientX, y: e.clientY }]);
    };

    const onMouseUp = () => setClicked(false);

    const onMouseLeave = () => {
      setVisible(false);
      pointsRef.current = [];
    };

    const onMouseEnter = () => setVisible(true);

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('.project-card') ||
        target.closest('.github-card') ||
        target.closest('.skill-card') ||
        target.closest('.social-btn') ||
        target.closest('.nav-link') ||
        target.closest('.btn') ||
        target.closest('.interactive')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [enabled, visible, mouseX, mouseY, startTrailLoop]);

  // Clean up ripples after animation duration
  const removeRipple = useCallback((id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Silky glowing energy trail */}
      <canvas ref={canvasRef} className="cursor-trail-canvas" aria-hidden="true" />

      {/* Instant Lead Core (Futuristic Diamond Point) */}
      <motion.div
        className={`cursor-core ${hovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''} ${!visible ? 'hidden' : ''}`}
        style={{
          x: mouseX,
          y: mouseY,
        }}
        aria-hidden="true"
      >
        <span className="cursor-core-diamond" />
      </motion.div>

      {/* Futuristic HUD Reticle (Snappy Spring Trailing) */}
      <motion.div
        className={`cursor-reticle ${hovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''} ${!visible ? 'hidden' : ''}`}
        style={{
          x: springX,
          y: springY,
        }}
        aria-hidden="true"
      >
        <span className="reticle-corner reticle-tl" />
        <span className="reticle-corner reticle-tr" />
        <span className="reticle-corner reticle-bl" />
        <span className="reticle-corner reticle-br" />
        <span className="reticle-glow" />
      </motion.div>

      {/* Click Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="cursor-ripple"
          style={{ left: r.x, top: r.y }}
          onAnimationEnd={() => removeRipple(r.id)}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
