import { useEffect } from "react";

export const FloatingParticles = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const container = document.querySelector<HTMLDivElement>(".floating-particles");
    if (!container) return;

    const particleCount = 36;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle animate-float";
      const size = Math.random() * 3 + 2;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.animationDelay = `${Math.random() * 18}s`;
      particle.style.animationDuration = `${Math.random() * 14 + 18}s`;
      particles.push(particle);
      container.appendChild(particle);
    }

    return () => {
      particles.forEach((particle) => particle.remove());
    };
  }, []);

  return <div className="floating-particles" />;
};
