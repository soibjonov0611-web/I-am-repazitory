import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/useTheme';

const NUM_PAIRS = 20; // Exactly 20 pairs = EXACTLY 40 legs (20 left, 20 right)
const BODY_LENGTH = 33; // 1.5x larger body

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { isDark } = useTheme();

  const canvasRef = useRef(null);
  const hoveredRef = useRef(false);
  const isDarkRef = useRef(isDark);
  const isMobileRef = useRef(false);

  // Kinematics state in refs for 120 FPS performance without React re-renders
  const targetPos = useRef({ x: -100, y: -100 });
  const insectPos = useRef({ x: 50, y: 100 });
  const angleRef = useRef(0);
  const speedRef = useRef(0);
  const walkPhaseRef = useRef(0);
  const contractRef = useRef(1.0); // 1.0 = normal, 0.22 = contracted on click/tap
  const trailRef = useRef([]); // Micro-glow trail points
  const ripplesRef = useRef([]); // Shockwave ripples
  const animFrameRef = useRef(null);

  // Mobile autonomous wandering state
  const mobilePatrolRef = useRef({
    dir: 1, // 1 = moving right, -1 = moving left
    state: 'walking', // 'walking' | 'pausing'
    pauseTimer: 0,
    baseY: 0,
    speed: 46, // px per sec
  });

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  // Capability detection: Desktop fine pointer vs Mobile coarse pointer
  useEffect(() => {
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateCapabilities = () => {
      const isFine = finePointerQuery.matches;
      const isReduced = reducedMotionQuery.matches;

      if (isReduced) {
        setEnabled(false);
        return;
      }

      setEnabled(true);
      const mobile = !isFine;
      setIsMobile(mobile);
      isMobileRef.current = mobile;

      // On mobile, insect is always visible and starts near bottom left
      if (mobile) {
        setVisible(true);
        insectPos.current.x = 50;
        const initialY = Math.max(window.innerHeight - 38, 60);
        insectPos.current.y = initialY;
        mobilePatrolRef.current.baseY = initialY;
        mobilePatrolRef.current.dir = 1;
        mobilePatrolRef.current.state = 'walking';
        angleRef.current = 0;
      }
    };

    updateCapabilities();

    finePointerQuery.addEventListener('change', updateCapabilities);
    reducedMotionQuery.addEventListener('change', updateCapabilities);

    return () => {
      finePointerQuery.removeEventListener('change', updateCapabilities);
      reducedMotionQuery.removeEventListener('change', updateCapabilities);
    };
  }, []);

  // Suppress desktop native cursor only on desktop fine pointer
  useEffect(() => {
    if (enabled && visible && !isMobile) {
      document.documentElement.classList.add('has-custom-cursor');
    } else {
      document.documentElement.classList.remove('has-custom-cursor');
    }

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled, visible, isMobile]);

  // Canvas resize with High-DPI support
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

      // Update mobile position bounds on screen resize or orientation change
      if (isMobileRef.current) {
        const paddingX = 40;
        const newBaseY = Math.max(window.innerHeight - 38, 60);
        mobilePatrolRef.current.baseY = newBaseY;
        insectPos.current.y = newBaseY;
        insectPos.current.x = Math.max(paddingX, Math.min(window.innerWidth - paddingX, insectPos.current.x));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [enabled]);

  // Desktop Mouse listeners & Mobile Touch listeners
  useEffect(() => {
    if (!enabled) return;

    // Desktop mouse movement
    const onMouseMove = (e) => {
      if (isMobileRef.current) return;
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;

      if (!visible) {
        setVisible(true);
        insectPos.current.x = e.clientX;
        insectPos.current.y = e.clientY;
      }
    };

    // Click / Tap contraction reaction
    const onMouseDown = () => {
      if (isMobileRef.current) return;
      contractRef.current = 0.22;
      ripplesRef.current.push({
        x: targetPos.current.x,
        y: targetPos.current.y,
        radius: 6,
        maxRadius: 44,
        alpha: 0.95,
      });
    };

    // Mobile touch interaction: tapping causes the 40 legs to flex with a shockwave
    const onTouchStart = () => {
      if (!isMobileRef.current) return;
      contractRef.current = 0.22;
      ripplesRef.current.push({
        x: insectPos.current.x,
        y: insectPos.current.y,
        radius: 6,
        maxRadius: 40,
        alpha: 0.85,
      });
    };

    const onMouseLeave = () => {
      if (isMobileRef.current) return;
      setVisible(false);
      trailRef.current = [];
    };

    const onMouseEnter = () => {
      if (isMobileRef.current) return;
      setVisible(true);
    };

    const onMouseOver = (e) => {
      if (isMobileRef.current) return;
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
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('mouseover', onMouseOver);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [enabled, visible]);

  // Main 120 FPS render loop for both Desktop Cursor & Mobile Walking Character
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

        const insect = insectPos.current;
        const isDarkTheme = isDarkRef.current;
        const isHovered = hoveredRef.current;
        const mobile = isMobileRef.current;

        let speed = 0;

        if (mobile) {
          // ── Mobile Autonomous Patrol Logic (Left <-> Right) ─────────────
          const patrol = mobilePatrolRef.current;
          const paddingX = 40;
          const leftBound = paddingX;
          const rightBound = window.innerWidth - paddingX;

          if (patrol.state === 'walking') {
            speed = patrol.speed;
            insect.x += patrol.dir * speed * dt;

            // Target angle: 0 for walking right, Math.PI for walking left
            const targetAngle = patrol.dir === 1 ? 0 : Math.PI;
            let diff = targetAngle - angleRef.current;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            angleRef.current += diff * 0.18;

            // Metachronal wave stepping
            walkPhaseRef.current += dt * 13;

            // Organic subtle vertical wave
            insect.y = patrol.baseY + Math.sin(walkPhaseRef.current * 0.4) * 3;

            // Check edge boundaries
            if (patrol.dir === 1 && insect.x >= rightBound) {
              insect.x = rightBound;
              patrol.state = 'pausing';
              patrol.pauseTimer = 0.65; // Pause at edge
            } else if (patrol.dir === -1 && insect.x <= leftBound) {
              insect.x = leftBound;
              patrol.state = 'pausing';
              patrol.pauseTimer = 0.65; // Pause at edge
            }
          } else if (patrol.state === 'pausing') {
            speed = 2; // idle
            walkPhaseRef.current += dt * 3; // Gentle breathing idle wave
            patrol.pauseTimer -= dt;

            if (patrol.pauseTimer <= 0) {
              patrol.dir = -patrol.dir; // Switch direction
              patrol.state = 'walking';
            }
          }

          speedRef.current = speed;
        } else {
          // ── Desktop Mouse Follow Logic ────────────────────────────────────
          const target = targetPos.current;
          const dx = target.x - insect.x;
          const dy = target.y - insect.y;
          const dist = Math.hypot(dx, dy);

          const followSpeed = isHovered ? 0.48 : 0.42;
          insect.x += dx * followSpeed;
          insect.y += dy * followSpeed;

          speed = dist;
          speedRef.current = speed;

          if (dist > 0.8) {
            const targetAngle = Math.atan2(dy, dx);
            let diff = targetAngle - angleRef.current;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            angleRef.current += diff * 0.28;
          }

          const stepRate = isHovered ? Math.max(speed * 0.2, 0.08) : Math.max(speed * 0.12, 0.035);
          walkPhaseRef.current += stepRate;
        }

        const angle = angleRef.current;
        const walkPhase = walkPhaseRef.current;

        // Rebound contraction back to 1.0 (spring physics on click)
        contractRef.current += (1.0 - contractRef.current) * 0.14;
        const contract = contractRef.current;

        // Dynamic trail generation when moving fast
        if (speed > (mobile ? 40 : 2.0)) {
          const tailDist = BODY_LENGTH * 0.95;
          const tailX = insect.x - Math.cos(angle) * tailDist;
          const tailY = insect.y - Math.sin(angle) * tailDist;
          trailRef.current.push({ x: tailX, y: tailY, alpha: 0.45, radius: 1.8 });
        }

        // Render micro glowing trail
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
            ? `rgba(34, 211, 238, ${tp.alpha * 0.45})`
            : `rgba(79, 70, 229, ${tp.alpha * 0.35})`;
          ctx.fill();
        }

        // Render click shockwave ripples
        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const rip = ripplesRef.current[i];
          rip.radius += dt * 80;
          rip.alpha -= dt * 2.2;
          if (rip.alpha <= 0) {
            ripplesRef.current.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
          ctx.strokeStyle = isDarkTheme
            ? `rgba(34, 211, 238, ${rip.alpha})`
            : `rgba(79, 70, 229, ${rip.alpha})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }

        // ── Render EXACTLY 40 Long, Elegant Cyber Legs (20 Left, 20 Right) ──
        const lagAngle = -Math.min(speed * (mobile ? 0.005 : 0.045), 0.58);
        const stretch = 1 + Math.min(speed * (mobile ? 0.003 : 0.025), 0.3);
        const spreadFactor = (isHovered ? 1.32 : 1.0) * contract;

        ctx.lineWidth = 1.15;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.shadowBlur = isDarkTheme ? (isHovered ? 10 : 5) : 4;
        ctx.shadowColor = isDarkTheme ? 'rgba(34, 211, 238, 0.5)' : 'rgba(79, 70, 229, 0.4)';

        for (let i = 0; i < NUM_PAIRS; i++) {
          const t = i / (NUM_PAIRS - 1); // 0 (front near head) -> 1 (rear at tail)

          // Spine position along carapace
          const spineDist = 3.5 + t * (BODY_LENGTH - 5.0);
          const sx = insect.x - Math.cos(angle) * spineDist;
          const sy = insect.y - Math.sin(angle) * spineDist;

          // Carapace width at this segment
          const w = (Math.sin(t * Math.PI) * 3.8 + 1.8) * (isHovered ? 1.08 : 1.0);

          // Perpendicular side vectors
          const perpX = -Math.sin(angle);
          const perpY = Math.cos(angle);

          const leftBaseX = sx + perpX * w;
          const leftBaseY = sy + perpY * w;

          const rightBaseX = sx - perpX * w;
          const rightBaseY = sy - perpY * w;

          // Metachronal wave swing per leg
          const segmentPhase = walkPhase - i * 0.44;
          const swing = Math.sin(segmentPhase) * (mobile ? 0.32 : Math.min(speed * 0.08, 0.38) + (isHovered ? 0.35 : 0.12));

          // Long, elegant leg length (16px to 24px)
          const baseLen = (Math.sin(t * Math.PI) * 7.5 + 15.5) * stretch * spreadFactor;
          const femurLen = baseLen * 0.48;
          const tibiaLen = baseLen * 0.62;

          // Directional angle offset (front legs angle forward, rear legs sweep backward)
          const angleOffset = (t - 0.42) * 0.45;

          // Left Leg (1)
          const leftKneeAngle = angle + Math.PI / 2 + angleOffset + swing + lagAngle;
          const lkx = leftBaseX + Math.cos(leftKneeAngle) * femurLen;
          const lky = leftBaseY + Math.sin(leftKneeAngle) * femurLen;

          const leftFootAngle = leftKneeAngle + 0.42 + swing * 0.35;
          const lfx = lkx + Math.cos(leftFootAngle) * tibiaLen;
          const lfy = lky + Math.sin(leftFootAngle) * tibiaLen;

          // Right Leg (2)
          const rightKneeAngle = angle - Math.PI / 2 - angleOffset - swing + lagAngle;
          const rkx = rightBaseX + Math.cos(rightKneeAngle) * femurLen;
          const rky = rightBaseY + Math.sin(rightKneeAngle) * femurLen;

          const rightFootAngle = rightKneeAngle - 0.42 - swing * 0.35;
          const rfx = rkx + Math.cos(rightFootAngle) * tibiaLen;
          const rfy = rky + Math.sin(rightFootAngle) * tibiaLen;

          // Dynamic leg coloring
          const legAlpha = 0.6 + Math.sin(t * Math.PI) * 0.35;
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

          // Glowing foot claw tip node
          ctx.fillStyle = isDarkTheme ? '#22d3ee' : '#0891b2';
          ctx.fillRect(lfx - 0.75, lfy - 0.75, 1.5, 1.5);
          ctx.fillRect(rfx - 0.75, rfy - 0.75, 1.5, 1.5);
        }

        // ── Render Central Cybernetic Carapace (Body) ───────────────────────
        const bodyCenterDist = BODY_LENGTH * 0.48;
        const bcx = insect.x - Math.cos(angle) * bodyCenterDist;
        const bcy = insect.y - Math.sin(angle) * bodyCenterDist;

        ctx.save();
        ctx.translate(bcx, bcy);
        ctx.rotate(angle);

        ctx.shadowBlur = isDarkTheme ? (isHovered ? 14 : 8) : 6;
        ctx.shadowColor = isDarkTheme ? '#22d3ee' : '#6366f1';

        // Carapace shell
        ctx.beginPath();
        const halfLen = BODY_LENGTH * 0.48;
        const halfWidth = isHovered ? 5.2 : 4.5;
        ctx.ellipse(0, 0, halfLen, halfWidth, 0, 0, Math.PI * 2);

        ctx.fillStyle = isDarkTheme ? '#0b0f19' : '#1e2238';
        ctx.fill();

        ctx.lineWidth = 1.3;
        ctx.strokeStyle = isDarkTheme
          ? (isHovered ? '#22d3ee' : 'rgba(34, 211, 238, 0.85)')
          : (isHovered ? '#0891b2' : 'rgba(79, 70, 229, 0.85)');
        ctx.stroke();

        // Futuristic segment paneling lines
        ctx.strokeStyle = isDarkTheme ? 'rgba(168, 85, 247, 0.55)' : 'rgba(99, 102, 241, 0.45)';
        ctx.lineWidth = 0.9;
        for (let s = -halfLen + 4; s < halfLen - 3; s += 4.5) {
          ctx.beginPath();
          ctx.moveTo(s, -halfWidth * 0.75);
          ctx.lineTo(s, halfWidth * 0.75);
          ctx.stroke();
        }

        // Thorax Core Reactor
        const corePulse = 0.85 + Math.sin(time * 0.007) * 0.25;
        ctx.beginPath();
        ctx.arc(0, 0, 2.0 * corePulse, 0, Math.PI * 2);
        ctx.fillStyle = isDarkTheme ? '#ffffff' : '#22d3ee';
        ctx.fill();

        ctx.restore();

        // ── Render Head, Sensory Eyes, and Antennae ─────────────────────────
        ctx.save();
        ctx.translate(insect.x, insect.y);
        ctx.rotate(angle);

        // Head plate
        ctx.beginPath();
        ctx.ellipse(0, 0, 4.5, 3.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = isDarkTheme ? '#101626' : '#1e2238';
        ctx.fill();
        ctx.strokeStyle = isDarkTheme ? '#22d3ee' : '#0891b2';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Two glowing cybernetic eyes
        const eyeColor = isHovered ? '#ffffff' : (isDarkTheme ? '#22d3ee' : '#0891b2');
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(2.2, -1.8, 1.2, 0, Math.PI * 2);
        ctx.arc(2.2, 1.8, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Dual Antennae (Curving forward sensors)
        ctx.strokeStyle = isDarkTheme ? 'rgba(34, 211, 238, 0.85)' : 'rgba(79, 70, 229, 0.85)';
        ctx.lineWidth = 1.0;

        const antWave = Math.sin(time * 0.008) * 0.2;

        // Left antenna
        ctx.beginPath();
        ctx.moveTo(3.2, -1.4);
        ctx.quadraticCurveTo(6.8, -4.5 + antWave * 5, 10.5, -5.8 + antWave * 3);
        ctx.stroke();

        // Right antenna
        ctx.beginPath();
        ctx.moveTo(3.2, 1.4);
        ctx.quadraticCurveTo(6.8, 4.5 - antWave * 5, 10.5, 5.8 - antWave * 3);
        ctx.stroke();

        // Antenna sensory tip dots
        ctx.fillStyle = isHovered ? '#ffffff' : (isDarkTheme ? '#a855f7' : '#4f46e5');
        ctx.fillRect(10.5 - 0.75, -5.8 + antWave * 3 - 0.75, 1.5, 1.5);
        ctx.fillRect(10.5 - 0.75, 5.8 - antWave * 3 - 0.75, 1.5, 1.5);

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
        zIndex: 9990,
      }}
    />
  );
}
