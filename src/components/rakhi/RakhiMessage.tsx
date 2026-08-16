import { useState, useEffect } from "react";
import { Reveal } from "./Reveal";
import { Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useFirebase } from "../../context/FirebaseDataContext";

export function RakhiMessage() {
  const { data } = useFirebase();
  const rakhi = data.rakhi;
  const [isTied, setIsTied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; scale: number }[]>([]);

  // Load tied status on mount
  useEffect(() => {
    const saved = localStorage.getItem("rakhi_tied_status");
    if (saved === "true") {
      setIsTied(true);
    }
  }, []);

  const triggerHearts = () => {
    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      left: 10 + Math.random() * 80,
      delay: i * 0.12,
      scale: 0.8 + Math.random() * 0.7,
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 4500);
  };

  const handleTieRakhi = () => {
    setIsAnimating(true);
    toast.info("Performing Aarti & drawing the sacred thread... ✨");

    setTimeout(() => {
      setIsTied(true);
      setIsAnimating(false);
      localStorage.setItem("rakhi_tied_status", "true");
      triggerHearts();
      toast.success("Your virtual Rakhi is tied! 💖 Tilak applied on Nani's forehead!");
    }, 3000);
  };

  const handleReset = () => {
    setIsTied(false);
    localStorage.removeItem("rakhi_tied_status");
    toast.info("Ceremony reset! You can tie the Rakhi again.");
  };

  return (
    <section id="rakhi" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <Reveal className="text-center">
        <p className="eyebrow">{rakhi.eyebrow}</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-tight">
          {rakhi.title}
        </h2>
      </Reveal>

      <div className="mt-14 grid items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* Left Column: Virtual Ceremony Arena */}
        <Reveal as="figure" delay={100}>
          <div className="relative w-full aspect-auto min-h-[360px] sm:aspect-[4/3] max-w-lg mx-auto bg-paper border border-amber-600/10 rounded-2xl p-6 shadow-lift overflow-hidden flex flex-col justify-between select-none">
            {/* Double Border Frame */}
            <div className="absolute inset-2.5 border-2 border-double border-amber-600/10 pointer-events-none rounded-xl" />

            {/* Floating Hearts Container */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-30">
              {hearts.map(h => (
                <span
                  key={h.id}
                  className="absolute bottom-16 text-rose/65 font-hand select-none text-2xl transition-all"
                  style={{
                    left: `${h.left}%`,
                    transform: `scale(${h.scale})`,
                    animation: `float-heart 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${h.delay}s forwards`,
                  }}
                >
                  {h.id % 2 === 0 ? "❤" : "🌸"}
                </span>
              ))}
            </div>

            {/* Aarti Light Blessings Effect Overlay */}
            {isAnimating && (
              <div className="absolute inset-0 bg-yellow-500/5 mix-blend-color-burn pointer-events-none z-20 animate-aarti-bless flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-yellow-400/40 bg-radial from-yellow-300/10 to-transparent blur-md" />
              </div>
            )}

            {/* SVG Connecting Thread */}
            {isAnimating && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <path
                  d="M 100, 240 C 150, 160, 280, 160, 360, 240"
                  fill="none"
                  stroke="url(#rakhi-thread-gradient)"
                  strokeWidth="4.5"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  className="animate-draw-thread animate-rakhi-glow"
                />
                <defs>
                  <linearGradient id="rakhi-thread-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9B1C31" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#9B1C31" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {/* Ceremony Center (Plate or Tied Wrist) */}
            <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
              {!isTied ? (
                /* Traditional Aarti Plate Representation */
                <div className="relative w-48 h-48 rounded-full bg-amber-500/5 border-4 border-double border-amber-500/25 p-4 shadow-inner flex items-center justify-center animate-plate-shimmer z-0">
                  {/* Candle/Diya with flame */}
                  <div className="absolute top-6 left-10 flex flex-col items-center">
                    <span className="text-xl">🪔</span>
                    <span className="w-2.5 h-3.5 bg-orange-500 rounded-full blur-[1px] absolute -top-1 animate-flame origin-bottom" />
                  </div>

                  {/* Sweets */}
                  <div className="absolute bottom-6 left-8 flex gap-0.5">
                    <span className="text-lg">🟠</span>
                    <span className="text-lg -ml-2 -mt-1">🟠</span>
                    <span className="text-lg -ml-1">🟠</span>
                  </div>

                  {/* Kumkum (Tilak Bowl) */}
                  <div className="absolute top-10 right-10 flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-red-800 border border-amber-600 flex items-center justify-center p-1 shadow-sm">
                      <div className="w-full h-full rounded-full bg-red-600" />
                    </div>
                    <span className="text-[8px] font-bold text-amber-800/50 uppercase mt-0.5">Kumkum</span>
                  </div>

                  {/* Sacred Thread */}
                  <div className="absolute bottom-6 right-10 flex flex-col items-center rotate-12">
                    <div className="w-9 h-9 rounded-full bg-red-700 border-2 border-amber-400 shadow-md flex items-center justify-center text-xs text-white">
                      ✨
                    </div>
                    <span className="h-0.5 w-14 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 absolute bottom-4.5 -z-10" />
                  </div>

                  <span className="font-hand text-sm text-amber-900/40 font-semibold uppercase tracking-wider">Aarti Platter</span>
                </div>
              ) : (
                /* Tied Rakhi Wrist close-up illustration */
                <div className="flex flex-col items-center justify-center relative w-full h-full animate-rise">
                  <div className="w-14 h-36 bg-amber-100/40 border-x-2 border-amber-800/10 rounded-xl relative shadow-inner flex items-center justify-center">
                    {/* Tied Rakhi on Wrist */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full flex flex-col items-center">
                      <span className="h-1.5 w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent absolute top-5 -z-10" />
                      <span className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent absolute top-5.5 -z-10 rotate-3" />
                      
                      <div className="w-11 h-11 rounded-full bg-rose border-4 border-gold shadow-lift flex items-center justify-center text-white text-base animate-rakhi-glow">
                        ❤️
                      </div>
                    </div>
                  </div>
                  <span className="font-display text-[10px] font-bold text-rose uppercase tracking-[0.25em] mt-3">
                    {rakhi.avatarBrother}'s Wrist
                  </span>
                </div>
              )}
            </div>

            {/* Sibling Avatars Floor */}
            <div className="flex items-center justify-between px-4 mt-2">
              {/* Jaanu (Sister) */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-full bg-rose/10 border border-rose/20 flex items-center justify-center text-3xl shadow-soft">
                  <span>{isTied ? "🥰" : "👧"}</span>
                </div>
                <span className="font-display text-xs font-semibold text-rose">{rakhi.avatarSister}</span>
              </div>

              {/* Action Button */}
              <div className="flex-1 flex justify-center px-4">
                {!isTied ? (
                  <button
                    type="button"
                    disabled={isAnimating}
                    onClick={handleTieRakhi}
                    className="rounded-full bg-primary hover:bg-rose px-5 py-2.5 text-xs tracking-wider text-primary-foreground uppercase shadow-soft transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5 font-sans font-semibold"
                  >
                    {isAnimating ? "Tying... ✨" : rakhi.buttonText}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full border border-dashed border-border/80 hover:border-rose/50 bg-paper px-4 py-2.5 text-[10px] tracking-wider text-muted-foreground hover:text-rose uppercase shadow-soft transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>{rakhi.buttonTiedText}</span>
                  </button>
                )}
              </div>

              {/* Nani (Brother) */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-3xl shadow-soft">
                  <span>{isTied ? "🤗" : "👦"}</span>
                  {/* Tilak Red Dot on Forehead */}
                  {isTied && (
                    <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-red-600 rounded-full animate-rise shadow-sm" title="Tilak Applied" />
                  )}
                </div>
                <span className="font-display text-xs font-semibold text-gold">{rakhi.avatarBrother}</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Custom Message Card */}
        <Reveal delay={220}>
          <div className="relative bg-paper px-7 py-10 shadow-soft sm:px-10 border border-amber-600/5 rounded-sm">
            <div className="absolute inset-3 border border-double border-amber-600/10 pointer-events-none rounded-xs" />
            <span className="absolute top-6 left-7 font-display text-6xl leading-none text-rose/25 select-none pointer-events-none">
              “
            </span>

            {/* Dynamic Message Box */}
            <div className="min-h-[140px] flex items-center">
              {!isTied ? (
                <p className="relative font-hand text-[clamp(1.4rem,4vw,1.9rem)] leading-relaxed text-ink/90 transition-all duration-500">
                  {rakhi.messageUntied}
                </p>
              ) : (
                <p className="relative font-hand text-[clamp(1.4rem,4vw,1.9rem)] leading-relaxed text-rose transition-all duration-500 animate-rise font-medium">
                  {rakhi.messageTied}
                </p>
              )}
            </div>

            <p className="mt-8 border-t border-border pt-6 text-sm tracking-[0.2em] text-rose uppercase font-medium">
              {rakhi.greeting}
            </p>
            <p className="mt-3 font-hand text-xl text-rose">
              {rakhi.signature}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
