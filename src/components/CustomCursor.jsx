import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/useTheme';

const TRAIL_LIFETIME = 170; // ms - short and delicate
const MAX_POINTS = 16;

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

  // Exact coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Buttery-smooth, responsive spring follow
  const springX = useSpring(mouseX, { stiffness: 520, damping: 30, mass: 0.22 });
  const springY = useSpring(mouseY, { stiffness: 520, damping: 30, mass: 0.22 });

  // Render short, delicate glowing trail on canvas
  const renderTrail = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      isLoopRunningRef.current = false;
      return;
    }

    const ctx = canvas.getContext('2d');
    const now = performance.now();
    const points = pointsRef.current;

    while (points.length > 0 && now - points[0].time > TRAIL_LIFETIME) {
      points.shift();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length >= 2) {
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = isDark ? 6 : 4;
      ctx.shadowColor = isDark ? 'rgba(34, 211, 238, 0.45)' : 'rgba(79, 70, 229, 0.35)';

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        const progress = (i + 1) / points.length; // 0 at tail, 1 at head
        const age = (now - p1.time) / TRAIL_LIFETIME;
        const alpha = Math.max(0, (1 - age) * 0.38 * progress);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (isDark) {
          if (progress > 0.6) {
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
          } else if (progress > 0.3) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          } else {
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          }
        } else {
          if (progress > 0.5) {
            ctx.strokeStyle = `rgba(8, 145, 178, ${alpha})`;
          } else {
            ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
          }
        }

        ctx.lineWidth = 0.4 + progress * 1.8; // delicate 0.4px to 2.2px
        ctx.stroke();
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(renderTrail);
    } else {
      isLoopRunningRef.current = false;
      animFrameIdRef.current = null;
    }
  }, [isDark]);

  const startTrailLoop = useCallback(() => {
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      animFrameIdRef.current = requestAnimationFrame(renderTrail);
    }
  }, [renderTrail]);

  // Check pointer and motion preferences
  useEffect(() => {
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

  // Toggle native cursor hiding via html class when desktop custom cursor is active
  useEffect(() => {
    if (enabled && visible) {
      document.documentElement.classList.add('has-custom-cursor');
    } else {
      document.documentElement.classList.remove('has-custom-cursor');
    }

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled, visible]);

  // Handle canvas sizing
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

  // Mouse listeners
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
      setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);
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
        target.closest('.interactive') ||
        target.closest('label')
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

  const removeRipple = useCallback((id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Short, delicate glowing trail */}
      <canvas ref={canvasRef} className="cursor-trail-canvas" aria-hidden="true" />

      {/* Main Coding Symbol </ > Cursor */}
      <motion.div
        className={`cursor-code-symbol ${hovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''} ${!visible ? 'hidden' : ''}`}
        style={{
          x: springX,
          y: springY,
        }}
        aria-hidden="true"
      >
        <span className="cursor-code-glow" />
        <svg
          className="cursor-code-svg"
          viewBox="0 0 30 18"
          width="26"
          height="16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="codeGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>

          {/* Left bracket < */}
          <path
            className="code-bracket code-bracket-left"
            d="M 8 3.5 L 2.5 9 L 8 14.5"
            stroke={isDark ? 'url(#codeGrad)' : 'url(#codeGradLight)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Slash / */}
          <path
            className="code-slash"
            d="M 12 15.5 L 18 2.5"
            stroke={isDark ? 'url(#codeGrad)' : 'url(#codeGradLight)'}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Right bracket > */}
          <path
            className="code-bracket code-bracket-right"
            d="M 22 3.5 L 27.5 9 L 22 14.5"
            stroke={isDark ? 'url(#codeGrad)' : 'url(#codeGradLight)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* Click Pulse Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="cursor-code-ripple"
          style={{ left: r.x, top: r.y }}
          onAnimationEnd={() => removeRipple(r.id)}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
