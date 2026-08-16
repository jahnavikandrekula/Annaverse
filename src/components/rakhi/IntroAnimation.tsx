import { useState, useEffect } from "react";
import { Tv, Sparkles, SkipForward } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

interface StepData {
  dialogue: string;
  speaker: "jaanu" | "annayyya" | null;
  remoteAnimation: string;
  jaanuEmoji: string;
  annayyyaEmoji: string;
  jaanuAnimatingClass: string;
  annayyyaAnimatingClass: string;
  title: string;
}

const STEPS: StepData[] = [
  {
    title: "A typical day in our childhood...",
    dialogue: "",
    speaker: null,
    remoteAnimation: "",
    jaanuEmoji: "👧",
    annayyyaEmoji: "👦",
    jaanuAnimatingClass: "",
    annayyyaAnimatingClass: "",
  },
  {
    title: "Fight Over the TV Remote!",
    dialogue: "I want to watch cartoons! 📺 Give me the remote!",
    speaker: "jaanu",
    remoteAnimation: "animate-remote-pull-left",
    jaanuEmoji: "👧",
    annayyyaEmoji: "👦",
    jaanuAnimatingClass: "animate-avatar-pull-left",
    annayyyaAnimatingClass: "",
  },
  {
    title: "Annayyya Fights Back",
    dialogue: "No way! The cricket match is starting! 🏏",
    speaker: "annayyya",
    remoteAnimation: "animate-remote-pull-right",
    jaanuEmoji: "👧",
    annayyyaEmoji: "👦",
    jaanuAnimatingClass: "",
    annayyyaAnimatingClass: "animate-avatar-pull-right",
  },
  {
    title: "Tug of War!",
    dialogue: "Please Annayyya, just 10 minutes! 🥺",
    speaker: "jaanu",
    remoteAnimation: "animate-remote-tug",
    jaanuEmoji: "🥺",
    annayyyaEmoji: "😜",
    jaanuAnimatingClass: "animate-avatar-pull-left",
    annayyyaAnimatingClass: "animate-avatar-pull-right",
  },
  {
    title: "Annayyya Yields",
    dialogue: "Haha okay, you win. Go watch your cartoons! 🧸",
    speaker: "annayyya",
    remoteAnimation: "animate-remote-win",
    jaanuEmoji: "😄",
    annayyyaEmoji: "😊",
    jaanuAnimatingClass: "",
    annayyyaAnimatingClass: "",
  },
  {
    title: "The Sibling Bond ❤️",
    dialogue: "",
    speaker: null,
    remoteAnimation: "animate-remote-win opacity-50",
    jaanuEmoji: "🥰",
    annayyyaEmoji: "🤗",
    jaanuAnimatingClass: "",
    annayyyaAnimatingClass: "",
  },
];

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timings = [
      1800, // Step 0: Intro Title (1.8s)
      2500, // Step 1: Jaanu dialogue (2.5s)
      2500, // Step 2: Annayyya dialogue (2.5s)
      2500, // Step 3: Pleading & Tug (2.5s)
      2500, // Step 4: Yielding (2.5s)
      3500, // Step 5: Resolution message (3.5s)
    ];

    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        if (currentStep === STEPS.length - 1) {
          handleFinish();
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      }, timings[currentStep]);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600); // match animation duration of animate-fade-out-intro
  };

  const step = STEPS[currentStep] || STEPS[0];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background paper-grain px-6 text-foreground select-none ${
        isFadingOut ? "animate-fade-out-intro" : ""
      }`}
    >
      {/* Skip Button */}
      <button
        onClick={handleFinish}
        className="absolute top-6 right-6 flex items-center gap-2 rounded-full border border-border bg-paper/60 px-4 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase shadow-soft hover:text-rose hover:border-rose/50 transition-all duration-300 backdrop-blur-xs cursor-pointer z-10"
      >
        <span>Skip Intro</span>
        <SkipForward className="h-3 w-3" />
      </button>

      {/* Main Container */}
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Title */}
        <h2 className="font-display text-[clamp(1.4rem,4.5vw,2.2rem)] leading-tight text-center text-ink/80 transition-all duration-500 min-h-[3rem]">
          {step.title}
        </h2>

        {/* Scene Box */}
        <div className="relative w-full aspect-auto min-h-[350px] sm:aspect-[4/3] max-w-md bg-paper border border-amber-600/10 rounded-2xl p-6 mt-6 shadow-lift flex flex-col justify-between overflow-hidden">
          {/* Double Border Frame */}
          <div className="absolute inset-2.5 border-2 border-double border-amber-600/10 pointer-events-none rounded-xl" />

          {/* Dialogue Bubbles Area */}
          <div className="h-24 flex items-center justify-center relative">
            {step.dialogue && step.speaker === "jaanu" && (
              <div className="absolute left-4 top-2 max-w-[70%] bg-rose text-white text-sm px-4 py-3 rounded-2xl rounded-tl-none shadow-soft animate-speech-bubble font-sans font-medium">
                {step.dialogue}
                <div className="absolute top-0 left-0 w-0 h-0 border-8 border-transparent border-r-rose -translate-x-[7px] rotate-45" />
              </div>
            )}
            {step.dialogue && step.speaker === "annayyya" && (
              <div className="absolute right-4 top-2 max-w-[70%] bg-gold text-white text-sm px-4 py-3 rounded-2xl rounded-tr-none shadow-soft animate-speech-bubble font-sans font-medium">
                {step.dialogue}
                <div className="absolute top-0 right-0 w-0 h-0 border-8 border-transparent border-l-gold translate-x-[7px] -rotate-45" />
              </div>
            )}
          </div>

          {/* Characters and Tug of War Arena */}
          <div className="flex items-center justify-between px-6 pb-8 relative">
            {/* SISTER (Jaanu) */}
            <div className={`flex flex-col items-center gap-2 ${step.jaanuAnimatingClass} transition-transform duration-300`}>
              <div className="relative w-20 h-20 rounded-full bg-rose/10 border-2 border-rose/30 flex items-center justify-center text-4xl shadow-soft">
                <span>{step.jaanuEmoji}</span>
                <span className="absolute -bottom-1 -right-1 bg-rose text-[9px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wider scale-90">
                  Sister
                </span>
              </div>
              <span className="font-display text-sm font-semibold text-rose mt-1">Jaanu</span>
            </div>

            {/* TV REMOTE (The Prize) */}
            <div className="absolute inset-x-0 bottom-14 flex justify-center z-10">
              {currentStep > 0 && currentStep < 5 ? (
                <div
                  className={`flex flex-col items-center justify-center w-14 h-6 bg-slate-800 rounded-full border border-slate-700 shadow-lift transition-all duration-300 ${step.remoteAnimation}`}
                >
                  <div className="flex gap-1 items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="w-4 h-1 bg-slate-600 rounded-xs" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  </div>
                </div>
              ) : null}

              {currentStep === 0 && (
                <div className="animate-bounce flex flex-col items-center text-amber-600/40">
                  <Tv className="h-10 w-10 stroke-1" />
                </div>
              )}
            </div>

            {/* BROTHER (Annayyya) */}
            <div className={`flex flex-col items-center gap-2 ${step.annayyyaAnimatingClass} transition-transform duration-300`}>
              <div className="relative w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center text-4xl shadow-soft">
                <span>{step.annayyyaEmoji}</span>
                <span className="absolute -bottom-1 -left-1 bg-gold text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                  Brother
                </span>
              </div>
              <span className="font-display text-sm font-semibold text-gold mt-1">Annayyya</span>
            </div>
          </div>
        </div>

        {/* Resolution Message Overlay */}
        <div className="h-28 mt-8 text-center flex flex-col items-center justify-center">
          {currentStep === 5 && (
            <div className="animate-rise space-y-3 px-4">
              <p className="font-hand text-[clamp(1.4rem,4.5vw,1.9rem)] leading-relaxed text-rose font-semibold flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-gold animate-spin-slow" />
                <span>Even when we fight, you always let me win...</span>
              </p>
              <p className="font-display text-xs tracking-[0.25em] text-muted-foreground uppercase">
                Welcome to your surprise 🌸
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
