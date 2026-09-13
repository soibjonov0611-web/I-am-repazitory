import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/useTheme';

const NUM_PAIRS = 20; // Exactly 20 pairs = EXACTLY 40 legs (20 left, 20 right)
const BODY_LENGTH = 33; // 1.5x larger body

// ── Angle lerp helper (handles wraparound) ───────────────────────────────────
function lerpAngle(current, target, t) {
  let diff = target - current;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff >  Math.PI) diff -= Math.PI * 2;
  return current + diff * t;
}

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

  // ── Mobile Full-Screen 2D Wander State ──────────────────────────────────────
  const wanderRef = useRef({
    heading: 0,          // Current movement heading (radians)
    targetHeading: 0,    // Smoothly steered towards this heading
    speed: 38,           // Current px/s
    targetSpeed: 38,     // Speed we're lerping towards
    waypointX: 200,      // Current target waypoint X
    waypointY: 300,      // Current target waypoint Y
    waypointTimer: 2.0,  // Countdown before nudging heading (seconds)
    state: 'walking',    // 'walking' | 'pausing'
    pauseTimer: 0,       // Pause countdown
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

  // Helper: pick a fresh random waypoint within safe viewport bounds
  const pickWaypoint = () => {
    const pad = 55;
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x: pad + Math.random() * Math.max(0, w - pad * 2),
      y: pad + Math.random() * Math.max(0, h - pad * 2),
    };
  };

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

      // On mobile, insect starts at a random viewport position and wanders freely
      if (mobile) {
        setVisible(true);
        const w = window.innerWidth;
        const h = window.innerHeight;
        const startX = w * 0.2 + Math.random() * w * 0.6;
        const startY = h * 0.2 + Math.random() * h * 0.6;
        insectPos.current.x = startX;
        insectPos.current.y = startY;

        const wp = { x: w * 0.2 + Math.random() * w * 0.6, y: h * 0.2 + Math.random() * h * 0.6 };
        const initHeading = Math.atan2(wp.y - startY, wp.x - startX);

        wanderRef.current.heading = initHeading;
        wanderRef.current.targetHeading = initHeading;
        wanderRef.current.waypointX = wp.x;
        wanderRef.current.waypointY = wp.y;
        wanderRef.current.waypointTimer = 2.0 + Math.random() * 2.0;
        wanderRef.current.speed = 35 + Math.random() * 20;
        wanderRef.current.targetSpeed = wanderRef.current.speed;
        wanderRef.current.state = 'walking';
        wanderRef.current.pauseTimer = 0;
        angleRef.current = initHeading;
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

      // Clamp insect position to new viewport bounds on resize / orientation change
      if (isMobileRef.current) {
        const pad = 55;
        insectPos.current.x = Math.max(pad, Math.min(window.innerWidth  - pad, insectPos.current.x));
        insectPos.current.y = Math.max(pad, Math.min(window.innerHeight - pad, insectPos.current.y));
        // Pick a fresh waypoint inside the new bounds
        const pad2 = 55;
        wanderRef.current.waypointX = pad2 + Math.random() * Math.max(0, window.innerWidth  - pad2 * 2);
        wanderRef.current.waypointY = pad2 + Math.random() * Math.max(0, window.innerHeight - pad2 * 2);
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

    // Mobile touch interaction: startle — burst of speed + new direction
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
      // Startle: pick new random waypoint and burst speed
      const pad = 55;
      wanderRef.current.waypointX = pad + Math.random() * Math.max(0, window.innerWidth  - pad * 2);
      wanderRef.current.waypointY = pad + Math.random() * Math.max(0, window.innerHeight - pad * 2);
      wanderRef.current.targetHeading = Math.atan2(
        wanderRef.current.waypointY - insectPos.current.y,
        wanderRef.current.waypointX - insectPos.current.x
      );
      wanderRef.current.targetSpeed = 65 + Math.random() * 25;
      wanderRef.current.state = 'walking';
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
          // ── Full-Screen 2D Autonomous Wander ─────────────────────────────
          const wander = wanderRef.current;
          const pad = 55;
          const W = window.innerWidth;
          const H = window.innerHeight;

          if (wander.state === 'walking') {
            // Smoothly lerp speed towards target speed
            wander.speed += (wander.targetSpeed - wander.speed) * Math.min(dt * 2.5, 1);
            speed = wander.speed;

            // Compute direction to current waypoint
            const dxWP = wander.waypointX - insect.x;
            const dyWP = wander.waypointY - insect.y;
            const distWP = Math.hypot(dxWP, dyWP);

            if (distWP < 28) {
              // Reached waypoint — pick a new one anywhere in viewport
              wander.waypointX = pad + Math.random() * Math.max(0, W - pad * 2);
              wander.waypointY = pad + Math.random() * Math.max(0, H - pad * 2);
              // Occasional pause (30% chance)
              if (Math.random() < 0.30) {
                wander.state = 'pausing';
                wander.pauseTimer = 0.55 + Math.random() * 1.1;
                wander.targetSpeed = 0;
              } else {
                wander.targetSpeed = 28 + Math.random() * 32;
                wander.targetHeading = Math.atan2(
                  wander.waypointY - insect.y,
                  wander.waypointX - insect.x
                );
              }
            } else {
              // Steer smoothly towards waypoint
              wander.targetHeading = Math.atan2(dyWP, dxWP);
            }

            // Boundary repulsion: gently steer away from all four edges
            const margin = 30;
            if (insect.x < pad + margin)          wander.targetHeading = lerpAngle(wander.targetHeading, 0,            0.22);
            if (insect.x > W - pad - margin)       wander.targetHeading = lerpAngle(wander.targetHeading, Math.PI,      0.22);
            if (insect.y < pad + margin)           wander.targetHeading = lerpAngle(wander.targetHeading, Math.PI / 2,  0.22);
            if (insect.y > H - pad - margin)       wander.targetHeading = lerpAngle(wander.targetHeading, -Math.PI / 2, 0.22);

            // Smoothly rotate heading
            wander.heading = lerpAngle(wander.heading, wander.targetHeading, Math.min(dt * 3.5, 1));

            // Move insect
            insect.x += Math.cos(wander.heading) * speed * dt;
            insect.y += Math.sin(wander.heading) * speed * dt;

            // Hard clamp to viewport
            insect.x = Math.max(pad, Math.min(W - pad, insect.x));
            insect.y = Math.max(pad, Math.min(H - pad, insect.y));

            // Body angle tracks movement heading
            angleRef.current = lerpAngle(angleRef.current, wander.heading, Math.min(dt * 8, 1));

            // Leg stepping phase scales with speed
            walkPhaseRef.current += dt * (6 + speed * 0.18);

            // Random heading nudge timer (keeps path non-repetitive)
            wander.waypointTimer -= dt;
            if (wander.waypointTimer <= 0) {
              wander.waypointTimer = 1.6 + Math.random() * 2.2;
              wander.targetHeading += (Math.random() - 0.5) * 1.0;
            }

          } else if (wander.state === 'pausing') {
            // Idle: antennae twitch, gentle leg sway
            speed = 1.5;
            walkPhaseRef.current += dt * 2.5;
            wander.speed += (0 - wander.speed) * Math.min(dt * 6, 1);

            wander.pauseTimer -= dt;
            if (wander.pauseTimer <= 0) {
              // Resume walking towards a fresh waypoint
              wander.waypointX = pad + Math.random() * Math.max(0, W - pad * 2);
              wander.waypointY = pad + Math.random() * Math.max(0, H - pad * 2);
              wander.targetHeading = Math.atan2(
                wander.waypointY - insect.y,
                wander.waypointX - insect.x
              );
              wander.targetSpeed = 30 + Math.random() * 30;
              wander.state = 'walking';
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
            angleRef.current = lerpAngle(angleRef.current, targetAngle, 0.28);
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
