// Shared Framer Motion variants — consistent, premium easing throughout.

export const EASE = [0.22, 1, 0.36, 1];
export const AWWWARDS_EASE = [0.16, 1, 0.3, 1];

export const SPRING_SNAPPY = { type: 'spring', stiffness: 380, damping: 28 };
export const SPRING_BOUNCY = { type: 'spring', stiffness: 260, damping: 20 };

export const fadeUp = (i = 0) => ({
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE },
  },
});

export const blurFadeUp = (i = 0) => ({
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, delay: i * 0.08, ease: AWWWARDS_EASE },
  },
});

export const wordReveal = (i = 0) => ({
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, delay: i * 0.04, ease: AWWWARDS_EASE },
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
