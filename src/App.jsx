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
import { fadeIn } from './lib/motion';

function App() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn()}
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
  );
}

export default App; 
