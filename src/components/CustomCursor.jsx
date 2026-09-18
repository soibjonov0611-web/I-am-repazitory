import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/useTheme';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { isDark } = useTheme();

  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorDot = useRef({ x: -100, y: -100 });
  const cursorRing = useRef({ x: -100, y: -100 });
  const ringScale = useRef(1);
  const targetScale = useRef(1);
  const ripplesRef = useRef([]);
  const animFrameRef = useRef(null);
  const hoveredRef = useRef(false);
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    hoveredRef.current = hovered;
    targetScale.current = hovered ? 1.85 : 1.0;
  }, [hovered]);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const checkEnabled = () => {
      const isFine = finePointerQuery.matches;
      const isReduced = reducedMotionQuery.matches;
      setEnabled(isFine && !isReduced);
    };

    checkEnabled();
    finePointerQuery.addEventListener('change', checkEnabled);
    reducedMotionQuery.addEventListener('change', checkEnabled);

    return () => {
      finePointerQuery.removeEventListener('change', checkEnabled);
      reducedMotionQuery.removeEventListener('change', checkEnabled);
    };
  }, []);

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

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
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

  useEffect(() => {
    if (!enabled) return;

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!visible) {
        setVisible(true);
        cursorDot.current.x = e.clientX;
        cursorDot.current.y = e.clientY;
        cursorRing.current.x = e.clientX;
        cursorRing.current.y = e.clientY;
      }
    };

    const onMouseDown = () => {
      targetScale.current = hoveredRef.current ? 1.5 : 0.8;
      ripplesRef.current.push({
        x: mousePos.current.x,
        y: mousePos.current.y,
        radius: 4,
        alpha: 0.9,
      });
    };

    const onMouseUp = () => {
      targetScale.current = hoveredRef.current ? 1.85 : 1.0;
    };

    const onMouseLeave = () => setVisible(false);
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
    };
  }, [enabled, visible]);

  useEffect(() => {
    if (!enabled) return;

    let lastTime = performance.now();

    const render = (time) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (visible) {
        ctx.save();
        ctx.scale(dpr, dpr);

        const target = mousePos.current;
        const isHover = hoveredRef.current;
        const isDarkTheme = isDarkRef.current;

        cursorDot.current.x += (target.x - cursorDot.current.x) * 0.55;
        cursorDot.current.y += (target.y - cursorDot.current.y) * 0.55;

        cursorRing.current.x += (target.x - cursorRing.current.x) * 0.22;
        cursorRing.current.y += (target.y - cursorRing.current.y) * 0.22;

        ringScale.current += (targetScale.current - ringScale.current) * 0.18;

        const cyanColor = isDarkTheme ? '#00f0ff' : '#0284c7';
        const ringColor = isDarkTheme ? 'rgba(0, 240, 255, 0.45)' : 'rgba(2, 132, 199, 0.45)';

        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const rip = ripplesRef.current[i];
          rip.radius += dt * 65;
          rip.alpha -= dt * 2.5;

          if (rip.alpha <= 0) {
            ripplesRef.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
          ctx.strokeStyle = isDarkTheme ? `rgba(0, 240, 255, ${rip.alpha})` : `rgba(2, 132, 199, ${rip.alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        const ringRadius = 14 * ringScale.current;
        ctx.beginPath();
        ctx.arc(cursorRing.current.x, cursorRing.current.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = isHover ? 1.5 : 1;
        ctx.stroke();

        if (isHover) {
          const arm = 4;
          const dist = ringRadius + 2;
          ctx.strokeStyle = cyanColor;
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          ctx.moveTo(cursorRing.current.x, cursorRing.current.y - dist);
          ctx.lineTo(cursorRing.current.x, cursorRing.current.y - dist - arm);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cursorRing.current.x, cursorRing.current.y + dist);
          ctx.lineTo(cursorRing.current.x, cursorRing.current.y + dist + arm);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cursorRing.current.x - dist, cursorRing.current.y);
          ctx.lineTo(cursorRing.current.x - dist - arm, cursorRing.current.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cursorRing.current.x + dist, cursorRing.current.y);
          ctx.lineTo(cursorRing.current.x + dist + arm, cursorRing.current.y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(cursorDot.current.x, cursorDot.current.y, isHover ? 2.5 : 3.0, 0, Math.PI * 2);
        ctx.fillStyle = cyanColor;
        ctx.shadowColor = cyanColor;
        ctx.shadowBlur = isDarkTheme ? 8 : 4;
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="custom-developer-cursor"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
