import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  const messages = [
    "lacing threads of love...",
    "weaving shared memories...",
    "unwrapping sisterly wishes...",
    "connecting across miles..."
  ];

  useEffect(() => {
    // Smooth progress loading bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Cycle subtext messages
    const messageInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 700);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-gradient-to-br from-[#fdfbf7] via-[#fff0f2] to-[#fbf7ef] bg-[length:400%_400%] animate-[gradient-drift_15s_ease_infinite] text-ink select-none overflow-hidden">
      {/* Dynamic Ambient Blur Blobs */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-gold/10 blur-[80px] animate-pulse pointer-events-none z-0" style={{ animationDuration: '10s' }} />
      <div className="absolute -top-[10%] -left-[10%] w-[350px] h-[350px] rounded-full bg-rose/6 blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute -bottom-[10%] -right-[10%] w-[400px] h-[400px] rounded-full bg-gold/8 blur-[110px] animate-pulse pointer-events-none" style={{ animationDuration: '12s', animationDelay: '2s' }} />

      {/* Decorative Gold Corner Borders */}
      <div className="absolute inset-4 border border-amber-600/10 pointer-events-none rounded-2xl" />
      <div className="absolute inset-5 border border-dashed border-amber-600/5 pointer-events-none rounded-2xl" />

      {/* Floating Rose Petals (Loader Details) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[
          { id: 1, left: "25%", top: "25%", delay: "0s", duration: 8, sway: 20 },
          { id: 2, left: "75%", top: "40%", delay: "3s", duration: 10, sway: -25 },
          { id: 3, left: "45%", top: "65%", delay: "1.5s", duration: 9, sway: 15 },
        ].map((petal) => (
          <svg
            key={petal.id}
            className="absolute pointer-events-none"
            style={{
              left: petal.left,
              top: petal.top,
              width: "12px",
              height: "15px",
              fill: "var(--rose)",
              animation: `dynamic-float ${petal.duration}s linear infinite ${petal.delay}`,
              opacity: 0.15,
              "--sway-dx": `${petal.sway}px`,
              "--max-opacity": 0.2,
            } as React.CSSProperties}
            viewBox="0 0 30 40"
          >
            <path d="M15,0 C25,10 30,25 25,35 C20,40 10,40 5,35 C0,25 5,10 15,0 Z" />
          </svg>
        ))}
      </div>

      {/* Typography Content Container */}
      <div className="relative flex flex-col items-center gap-8 max-w-sm px-6 text-center z-10">
        {/* Cursive Branding Title */}
        <div className="space-y-1">
          <h1 className="font-hand text-7xl md:text-8xl text-rose filter drop-shadow-[0_2px_8px_rgba(225,29,72,0.12)] animate-pulse">
            Annaverse
          </h1>
          <p className="font-sans text-[9px] tracking-[0.35em] text-ink/30 uppercase pl-1.5">
            A surprise by Jaanu
          </p>
        </div>

        {/* Minimalist Golden Progress Line */}
        <div className="w-40 flex flex-col items-center gap-2 pt-2">
          <div className="w-full h-[2px] bg-amber-600/10 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-rose to-gold transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[8px] text-ink/30 tracking-widest uppercase">
            Loading {progress}%
          </span>
        </div>

        {/* Cycling Scrapbook Subtitles */}
        <div className="h-6 mt-1 overflow-hidden">
          <p 
            key={msgIndex} 
            className="font-sans text-xs tracking-wider text-rose/70 font-light italic animate-rise"
          >
            {messages[msgIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
