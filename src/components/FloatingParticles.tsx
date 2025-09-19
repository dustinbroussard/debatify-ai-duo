import { useEffect } from "react";

export const FloatingParticles = () => {
  useEffect(() => {
    const createParticles = () => {
      const particleContainer = document.querySelector('.floating-particles');
      if (!particleContainer) return;

      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle animate-float';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';

        particleContainer.appendChild(particle);
      }
    };

    createParticles();

    return () => {
      const particles = document.querySelectorAll('.particle');
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return <div className="floating-particles" />;
};