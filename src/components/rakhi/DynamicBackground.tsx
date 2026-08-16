import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  size: number;
  isPetal: boolean;
  delay: number;
  duration: number;
  sway: number;
  opacity: number;
  spinDir: number;
};

export function DynamicBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles with deterministic random properties
    const items = Array.from({ length: 28 }).map((_, i) => {
      const isPetal = i % 3 === 0;
      return {
        id: i,
        x: Math.random() * 100,
        size: isPetal ? 8 + Math.random() * 10 : 3 + Math.random() * 5,
        isPetal,
        delay: Math.random() * -35, // negative delay so they start already scattered
        duration: 20 + Math.random() * 25,
        sway: 15 + Math.random() * 35,
        opacity: isPetal ? 0.15 + Math.random() * 0.2 : 0.25 + Math.random() * 0.3,
        spinDir: Math.random() > 0.5 ? 1 : -1,
      };
    });
    setParticles(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Ambient Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose/8 blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gold/8 blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '14s', animationDelay: '2s' }} />
      <div className="absolute top-[35%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-rose/6 blur-[110px] animate-pulse pointer-events-none" style={{ animationDuration: '12s', animationDelay: '4s' }} />

      {particles.map((p) => {
        if (p.isPetal) {
          return (
            <svg
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                left: `${p.x}%`,
                width: `${p.size}px`,
                height: `${p.size * 1.2}px`,
                fill: "var(--rose)",
                animation: `dynamic-float ${p.duration}s linear infinite ${p.delay}s`,
                opacity: p.opacity,
                "--sway-dx": `${p.sway}px`,
                "--max-opacity": p.opacity,
              } as React.CSSProperties}
              viewBox="0 0 30 40"
              aria-hidden="true"
            >
              <g
                style={{
                  animation: `petal-spin ${p.duration * 0.4}s linear infinite`,
                  transformOrigin: "center center",
                }}
              >
                <path d="M15,0 C25,10 30,25 25,35 C20,40 10,40 5,35 C0,25 5,10 15,0 Z" />
              </g>
            </svg>
          );
        } else {
          return (
            <div
              key={p.id}
              className="absolute rounded-full pointer-events-none blur-[0.5px]"
              style={{
                left: `${p.x}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: "var(--gold)",
                animation: `dynamic-float ${p.duration}s linear infinite ${p.delay}s`,
                opacity: p.opacity,
                "--sway-dx": `${p.sway}px`,
                "--max-opacity": p.opacity,
              } as React.CSSProperties}
              aria-hidden="true"
            />
          );
        }
      })}
    </div>
  );
}
