import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/useTheme';

const NUM_PAIRS = 20; // 20 pairs = EXACTLY 40 legs (20 left, 20 right)
const BODY_LENGTH = 22;

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { isDark } = useTheme();

  const canvasRef = useRef(null);
  const hoveredRef = useRef(false);
  const isDarkRef = useRef(isDark);

  // Mouse and insect kinematics state (kept in refs for 120 FPS without React re-renders)
  const targetPos = useRef({ x: -100, y: -100 });
  const insectPos = useRef({ x: -100, y: -100 });
  const angleRef = useRef(0);
  const speedRef = useRef(0);
  const walkPhaseRef = useRef(0);
  const contractRef = useRef(1.0); // 1.0 = normal, 0.2 = contracted on click
  const trailRef = useRef([]); // Short micro-glow trail points
  const ripplesRef = useRef([]); // Click shockwaves
  const animFrameRef = useRef(null);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  // Check fine pointer (desktop mouse) & reduced motion
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

  // Native cursor hiding on desktop
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

  // Handle canvas sizing & DPR
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

  // Mouse event listeners
  useEffect(() => {
    if (!enabled) return;

    const onMouseMove = (e) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;

      if (!visible) {
        setVisible(true);
        insectPos.current.x = e.clientX;
        insectPos.current.y = e.clientY;
      }
    };

    const onMouseDown = () => {
      // Contract all 40 legs tightly into the body
      contractRef.current = 0.22;
      ripplesRef.current.push({
        x: targetPos.current.x,
        y: targetPos.current.y,
        radius: 4,
        maxRadius: 36,
        alpha: 0.9,
      });
    };

    const onMouseLeave = () => {
      setVisible(false);
      trailRef.current = [];
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
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseover', onMouseOver);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [enabled, visible]);

  // Main high-performance procedural animation loop
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

      // Delta time in seconds
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (visible) {
        ctx.save();
        ctx.scale(dpr, dpr);

        const target = targetPos.current;
        const insect = insectPos.current;
        const isDarkTheme = isDarkRef.current;
        const isHovered = hoveredRef.current;

        // Smoothly follow mouse pointer
        const dx = target.x - insect.x;
        const dy = target.y - insect.y;
        const dist = Math.hypot(dx, dy);

        // Follow speed: fast enough to be accurate, smooth enough to feel organic
        const followSpeed = isHovered ? 0.52 : 0.46;
        insect.x += dx * followSpeed;
        insect.y += dy * followSpeed;

        speedRef.current = dist;

        // Smooth orientation heading
        if (dist > 0.8) {
          const targetAngle = Math.atan2(dy, dx);
          let diff = targetAngle - angleRef.current;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          angleRef.current += diff * 0.3;
        }

        const angle = angleRef.current;
        const speed = speedRef.current;

        // Step wave phase (faster when moving, gentle breathing when stopped)
        const stepRate = isHovered ? Math.max(speed * 0.22, 0.08) : Math.max(speed * 0.14, 0.035);
        walkPhaseRef.current += stepRate;
        const walkPhase = walkPhaseRef.current;

        // Rebound leg contraction back to 1.0 (spring physics on click)
        contractRef.current += (1.0 - contractRef.current) * 0.14;
        const contract = contractRef.current;

        // Add subtle trail point if moving fast
        if (speed > 2.5) {
          const tailDist = BODY_LENGTH * 0.95;
          const tailX = insect.x - Math.cos(angle) * tailDist;
          const tailY = insect.y - Math.sin(angle) * tailDist;
          trailRef.current.push({ x: tailX, y: tailY, alpha: 0.45, radius: 1.6 });
        }

        // Draw and update micro glowing trail
        for (let i = trailRef.current.length - 1; i >= 0; i--) {
          const tp = trailRef.current[i];
          tp.alpha -= dt * 2.2;
          if (tp.alpha <= 0) {
            trailRef.current.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, tp.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDarkTheme
            ? `rgba(34, 211, 238, ${tp.alpha * 0.5})`
            : `rgba(79, 70, 229, ${tp.alpha * 0.4})`;
          ctx.fill();
        }

        // Draw and update click ripples
        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const rip = ripplesRef.current[i];
          rip.radius += dt * 65;
          rip.alpha -= dt * 2.4;
          if (rip.alpha <= 0) {
            ripplesRef.current.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
          ctx.strokeStyle = isDarkTheme
            ? `rgba(34, 211, 238, ${rip.alpha})`
            : `rgba(79, 70, 229, ${rip.alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // ── Render 40 Procedural Cyber Legs (20 Left, 20 Right) ─────────────
        // Drag angle when moving fast (legs stream back like an agile cyber millipede)
        const lagAngle = -Math.min(speed * 0.035, 0.45);
        const stretch = 1 + Math.min(speed * 0.02, 0.25);
        const spreadFactor = (isHovered ? 1.22 : 1.0) * contract;

        ctx.lineWidth = 1.1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < NUM_PAIRS; i++) {
          const t = i / (NUM_PAIRS - 1); // 0 (front near head) -> 1 (rear at tail)

          // Distance along spine from head (2px to 21px)
          const spineDist = 2.5 + t * (BODY_LENGTH - 3.5);
          const sx = insect.x - Math.cos(angle) * spineDist;
          const sy = insect.y - Math.sin(angle) * spineDist;

          // Carapace width at this segment (curved, tapered body)
          const w = (Math.sin(t * Math.PI) * 2.8 + 1.2) * (isHovered ? 1.05 : 1.0);

          // Base attachment points on left and right side of carapace
          const perpX = -Math.sin(angle);
          const perpY = Math.cos(angle);

          const leftBaseX = sx + perpX * w;
          const leftBaseY = sy + perpY * w;

          const rightBaseX = sx - perpX * w;
          const rightBaseY = sy - perpY * w;

          // Metachronal wave procedural swing across legs
          const segmentPhase = walkPhase - i * 0.48;
          const swing = Math.sin(segmentPhase) * (Math.min(speed * 0.07, 0.35) + (isHovered ? 0.32 : 0.12));

          // Base leg length (slightly longer in middle segments)
          const baseLen = (Math.sin(t * Math.PI) * 3.5 + 6.5) * stretch * spreadFactor;
          const femurLen = baseLen * 0.52;
          const tibiaLen = baseLen * 0.58;

          // Directional angle offset (front legs angle forward, rear angle backward)
          const angleOffset = (t - 0.45) * 0.35;

          // Left Leg (1)
          const leftKneeAngle = angle + Math.PI / 2 + angleOffset + swing + lagAngle;
          const lkx = leftBaseX + Math.cos(leftKneeAngle) * femurLen;
          const lky = leftBaseY + Math.sin(leftKneeAngle) * femurLen;

          const leftFootAngle = leftKneeAngle + 0.38 + swing * 0.4;
          const lfx = lkx + Math.cos(leftFootAngle) * tibiaLen;
          const lfy = lky + Math.sin(leftFootAngle) * tibiaLen;

          // Right Leg (2)
          const rightKneeAngle = angle - Math.PI / 2 - angleOffset - swing + lagAngle;
          const rkx = rightBaseX + Math.cos(rightKneeAngle) * femurLen;
          const rky = rightBaseY + Math.sin(rightKneeAngle) * femurLen;

          const rightFootAngle = rightKneeAngle - 0.38 - swing * 0.4;
          const rfx = rkx + Math.cos(rightFootAngle) * tibiaLen;
          const rfy = rky + Math.sin(rightFootAngle) * tibiaLen;

          // Leg stroke styling (futuristic cyber gradient look)
          const legAlpha = 0.55 + Math.sin(t * Math.PI) * 0.35;
          ctx.strokeStyle = isDarkTheme
            ? `rgba(34, 211, 238, ${isHovered ? 0.95 : legAlpha})`
            : `rgba(8, 145, 178, ${isHovered ? 0.9 : legAlpha})`;

          // Draw Left Leg
          ctx.beginPath();
          ctx.moveTo(leftBaseX, leftBaseY);
          ctx.lineTo(lkx, lky);
          ctx.lineTo(lfx, lfy);
          ctx.stroke();

          // Draw Right Leg
          ctx.beginPath();
          ctx.moveTo(rightBaseX, rightBaseY);
          ctx.lineTo(rkx, rky);
          ctx.lineTo(rfx, rfy);
          ctx.stroke();

          // Tiny glowing foot claw node
          ctx.fillStyle = isDarkTheme ? '#22d3ee' : '#0891b2';
          ctx.fillRect(lfx - 0.6, lfy - 0.6, 1.2, 1.2);
          ctx.fillRect(rfx - 0.6, rfy - 0.6, 1.2, 1.2);
        }

        // ── Render Central Cybernetic Body (Carapace) ───────────────────────
        const bodyCenterDist = BODY_LENGTH * 0.48;
        const bcx = insect.x - Math.cos(angle) * bodyCenterDist;
        const bcy = insect.y - Math.sin(angle) * bodyCenterDist;

        ctx.save();
        ctx.translate(bcx, bcy);
        ctx.rotate(angle);

        // Ambient cyber glow behind carapace
        ctx.shadowBlur = isDarkTheme ? (isHovered ? 12 : 7) : 5;
        ctx.shadowColor = isDarkTheme ? '#22d3ee' : '#6366f1';

        // Carapace shell
        ctx.beginPath();
        const halfLen = BODY_LENGTH * 0.48;
        const halfWidth = isHovered ? 3.4 : 3.0;
        ctx.ellipse(0, 0, halfLen, halfWidth, 0, 0, Math.PI * 2);

        ctx.fillStyle = isDarkTheme ? '#0b0f19' : '#1e2238';
        ctx.fill();

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = isDarkTheme
          ? (isHovered ? '#22d3ee' : 'rgba(34, 211, 238, 0.75)')
          : (isHovered ? '#0891b2' : 'rgba(79, 70, 229, 0.75)');
        ctx.stroke();

        // Cybernetic segment panel lines along carapace
        ctx.strokeStyle = isDarkTheme ? 'rgba(168, 85, 247, 0.5)' : 'rgba(99, 102, 241, 0.4)';
        ctx.lineWidth = 0.8;
        for (let s = -halfLen + 3; s < halfLen - 2; s += 3.5) {
          ctx.beginPath();
          ctx.moveTo(s, -halfWidth * 0.75);
          ctx.lineTo(s, halfWidth * 0.75);
          ctx.stroke();
        }

        // Thorax Core Reactor (Pulsing cyber crystal)
        const corePulse = 0.8 + Math.sin(time * 0.006) * 0.25;
        ctx.beginPath();
        ctx.arc(0, 0, 1.4 * corePulse, 0, Math.PI * 2);
        ctx.fillStyle = isDarkTheme ? '#ffffff' : '#22d3ee';
        ctx.fill();

        ctx.restore();

        // ── Render Head, Eyes, and Antennae ─────────────────────────────────
        ctx.save();
        ctx.translate(insect.x, insect.y);
        ctx.rotate(angle);

        // Head plate
        ctx.beginPath();
        ctx.ellipse(0, 0, 3.2, 2.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = isDarkTheme ? '#101626' : '#1e2238';
        ctx.fill();
        ctx.strokeStyle = isDarkTheme ? '#22d3ee' : '#0891b2';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Two glowing cybernetic eyes/sensors
        const eyeColor = isHovered ? '#ffffff' : (isDarkTheme ? '#22d3ee' : '#0891b2');
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(1.6, -1.3, 0.85, 0, Math.PI * 2);
        ctx.arc(1.6, 1.3, 0.85, 0, Math.PI * 2);
        ctx.fill();

        // Dual Antennae (Curving forward sensors)
        ctx.strokeStyle = isDarkTheme ? 'rgba(34, 211, 238, 0.8)' : 'rgba(79, 70, 229, 0.8)';
        ctx.lineWidth = 0.9;

        const antWave = Math.sin(time * 0.008) * 0.15;

        // Left antenna
        ctx.beginPath();
        ctx.moveTo(2.4, -1.0);
        ctx.quadraticCurveTo(5.0, -3.2 + antWave * 4, 7.5, -4.2 + antWave * 2);
        ctx.stroke();

        // Right antenna
        ctx.beginPath();
        ctx.moveTo(2.4, 1.0);
        ctx.quadraticCurveTo(5.0, 3.2 - antWave * 4, 7.5, 4.2 - antWave * 2);
        ctx.stroke();

        // Antenna tip sensory dots
        ctx.fillStyle = isHovered ? '#ffffff' : (isDarkTheme ? '#a855f7' : '#4f46e5');
        ctx.fillRect(7.5 - 0.5, -4.2 + antWave * 2 - 0.5, 1.0, 1.0);
        ctx.fillRect(7.5 - 0.5, 4.2 - antWave * 2 - 0.5, 1.0, 1.0);

        ctx.restore();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="cyber-insect-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10000,
      }}
    />
  );
}
