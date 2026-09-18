import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import GithubRepos from './components/GithubRepos';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PageIntro from './components/PageIntro';
import CustomCursor from './components/CustomCursor';
import MouseSpotlight from './components/MouseSpotlight';
import { fadeIn } from './lib/motion';

function App() {
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIntroFinished(true);
      return;
    }
    // Safety timeout: ensure page is visible within 1.5s regardless of animation state
    const timer = setTimeout(() => setIntroFinished(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageIntro onComplete={() => setIntroFinished(true)} />
      <CustomCursor />
      <MouseSpotlight />
      <motion.div
        initial="hidden"
        animate={introFinished ? 'visible' : 'hidden'}
        variants={fadeIn(0)}
        className="app-root"
      >
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <GithubRepos />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </>
  );
}

export default App; 
