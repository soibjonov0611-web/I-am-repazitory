// Shared Framer Motion variants — consistent, premium easing throughout.

export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = (i = 0) => ({
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE },
  },
});

export const fadeIn = (i = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  },
});

export const scaleIn = (i = 0) => ({
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE },
  },
});

export const staggerContainer = (stagger = 0.08, delayChildren = 0.12) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

export const viewportOnce = { once: true, margin: '-80px' };