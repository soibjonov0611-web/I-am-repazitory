import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../lib/motion';

export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp()}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </motion.div>
  );
}