import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   Premium Developer Cursor
   Design: cyan ring + </> symbol + crosshair ticks + circuit traces + glow
   States: NORMAL → small elegant | HOVER → expanded ring + stronger glow
   ───────────────────────────────────────────────────────────────────────── */

const CYAN = '#00f0ff';
const CYAN_DIM = 'rgba(0, 240, 255, 0.55)';
const DARK_FILL = 'rgba(4, 8, 18, 0.82)';

// Circuit trace directions (angle, length, branch offset)
const TRACES = [
  { angle: -45,  len: 18, branch: false },
  { angle:  45,  len: 16, branch: true  },
  { angle: 135,  len: 18, branch: false },
  { angle: 225,  len: 16, branch: true  },
];

function drawCursor(ctx, x, y, radius, alpha, hoverProgress, clickProgress) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);

  const glowStrength = 0.45 + hoverProgress * 0.35;
  const traceAlpha   = 0.55 + hoverProgress * 0.35;

  // ── 1. Outer aura ──────────────────────────────────────────────────────
  const auraR = radius + 8 + hoverProgress * 6;
  const aura = ctx.createRadialGradient(0, 0, radius * 0.6, 0, 0, auraR);
  aura.addColorStop(0, `rgba(0, 240, 255, ${glowStrength * 0.18})`);
  aura.addColorStop(1, 'rgba(0, 240, 255, 0)');
  ctx.beginPath();
  ctx.arc(0, 0, auraR, 0, Math.PI * 2);
  ctx.fillStyle = aura;
  ctx.fill();

  // ── 2. Dark fill inside ring ────────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(0, 0, radius - 0.5, 0, Math.PI * 2);
  ctx.fillStyle = DARK_FILL;
  ctx.fill();

  // ── 3. Main ring (glow shadow + crisp stroke) ───────────────────────────
  ctx.shadowColor = CYAN;
  ctx.shadowBlur  = 6 + hoverProgress * 8;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.strokeStyle = CYAN;
  ctx.lineWidth   = 1.5;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // ── 4. Crosshair tick marks (4 cardinal points) ─────────────────────────
  const tickOuter = radius - 1;
  const tickLen   = 5 + hoverProgress * 2;
  ctx.strokeStyle = CYAN;
  ctx.lineWidth   = 1;
  ctx.globalAlpha = alpha * (0.7 + hoverProgress * 0.3);
  [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => {
    const x1 = dx * (tickOuter - tickLen);
    const y1 = dy * (tickOuter - tickLen);
    const x2 = dx * tickOuter;
    const y2 = dy * tickOuter;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  ctx.globalAlpha = alpha;

  // ── 5. </> symbol in center ─────────────────────────────────────────────
  const fontSize = 7 + hoverProgress * 2.5;
  ctx.font        = `600 ${fontSize}px "JetBrains Mono", "Consolas", monospace`;
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = CYAN;
  ctx.shadowBlur  = 4 + hoverProgress * 6;
  ctx.fillStyle   = CYAN;
  ctx.fillText('</>', 0, 0);
  ctx.shadowBlur  = 0;

  // ── 6. Circuit traces with square endpoint nodes ─────────────────────────
  ctx.globalAlpha = alpha * traceAlpha;
  const traceStart = radius + 2;

  TRACES.forEach(({ angle, len, branch }) => {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const traceLen = len + hoverProgress * 6;

    // Main trace line
    const x1 = cos * traceStart;
    const y1 = sin * traceStart;
    const x2 = cos * (traceStart + traceLen);
    const y2 = sin * (traceStart + traceLen);

    ctx.shadowColor = CYAN;
    ctx.shadowBlur  = 2 + hoverProgress * 3;
    ctx.strokeStyle = CYAN_DIM;
    ctx.lineWidth   = 0.8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Endpoint square node
    const nodeSize = 2.5 + hoverProgress * 1;
    ctx.fillStyle   = CYAN;
    ctx.shadowBlur  = 3 + hoverProgress * 4;
    ctx.fillRect(x2 - nodeSize / 2, y2 - nodeSize / 2, nodeSize, nodeSize);

    // Optional branch on hover
    if (branch && hoverProgress > 0.1) {
      const branchProgress = (hoverProgress - 0.1) / 0.9;
      const bRad = rad + Math.PI / 4;
      const bLen = 6 * branchProgress;
      const bx1 = x2;
      const by1 = y2;
      const bx2 = bx1 + Math.cos(bRad) * bLen;
      const by2 = by1 + Math.sin(bRad) * bLen;

      ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 * branchProgress})`;
      ctx.lineWidth   = 0.6;
      ctx.shadowBlur  = 1;
      ctx.beginPath();
      ctx.moveTo(bx1, by1);
      ctx.lineTo(bx2, by2);
      ctx.stroke();

      const bNodeSize = 1.8 * branchProgress;
      ctx.shadowBlur = 2;
      ctx.fillRect(bx2 - bNodeSize / 2, by2 - bNodeSize / 2, bNodeSize, bNodeSize);
    }
    ctx.shadowBlur = 0;
  });

  ctx.globalAlpha = alpha;

  // ── 7. Click ripple ──────────────────────────────────────────────────────
  if (clickProgress > 0) {
    const rippleR = radius + clickProgress * 28;
    const rippleA = (1 - clickProgress) * 0.6;
    ctx.beginPath();
    ctx.arc(0, 0, rippleR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 240, 255, ${rippleA})`;
    ctx.lineWidth   = 1.5 * (1 - clickProgress);
    ctx.stroke();
  }

  ctx.restore();
}

export default function CustomCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Disable on touch/coarse pointer or reduced-motion
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // State
    let mouseX = -200, mouseY = -200;
    let curX    = -200, curY    = -200;
    let isHovering = false;
    let hoverProgress  = 0; // 0 → 1 animated
    let clickProgress  = 0; // 0 → 1 one-shot
    let clickActive    = false;
    let rafId = null;
    let mounted = true;

    const NORMAL_RADIUS = 13;
    const HOVER_RADIUS  = 18;
    const EASE = 0.12;
    const HOVER_EASE = 0.1;

    function resize() {
      canvas.width  = window.innerWidth  * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width  = window.innerWidth  + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      isHovering = !!(el && (
        el.matches('a, button, [role="button"], input, textarea, select, label, [tabindex]') ||
        el.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]')
      ));
    }

    function onMouseDown() {
      clickActive   = true;
      clickProgress = 0;
    }

    function loop() {
      if (!mounted) return;

      // Smooth follow
      curX += (mouseX - curX) * EASE;
      curY += (mouseY - curY) * EASE;

      // Hover interpolation
      const targetHover = isHovering ? 1 : 0;
      hoverProgress += (targetHover - hoverProgress) * HOVER_EASE;

      // Click animation
      if (clickActive) {
        clickProgress += 0.06;
        if (clickProgress >= 1) {
          clickProgress = 0;
          clickActive   = false;
        }
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);

      const radius = NORMAL_RADIUS + (HOVER_RADIUS - NORMAL_RADIUS) * hoverProgress;
      drawCursor(ctx, curX, curY, radius, 1, hoverProgress, clickProgress);

      rafId = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    document.documentElement.classList.add('has-custom-cursor');

    rafId = requestAnimationFrame(loop);

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="custom-developer-cursor"
      aria-hidden="true"
    />
  );
}
