import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { useFirebase } from "../../context/FirebaseDataContext";
import { ref, push, set } from "firebase/database";
import { database } from "../../firebase";
import ornament from "@/assets/ornament.png";
import { toast } from "sonner";

const CornerOrnament = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute w-8 h-8 text-amber-600/25 pointer-events-none ${className}`}
    viewBox="0 0 100 100"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M 0 0 L 100 0 L 100 10 C 70 10, 40 20, 20 40 C 10 50, 10 70, 10 100 L 0 100 Z" />
    <path d="M 15 15 C 25 15, 35 25, 35 35 C 25 35, 15 25, 15 15 Z" />
    <circle cx="20" cy="20" r="4" />
    <circle cx="50" cy="15" r="2" />
    <circle cx="15" cy="50" r="2" />
  </svg>
);

export function Letter() {
  const { data } = useFirebase();
  const letter = data.letter;
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; scale: number }[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Load saved reply on mount
  useEffect(() => {
    const saved = localStorage.getItem("brother_reply");
    if (saved) {
      setReplyText(saved);
      setIsSaved(true);
    }
  }, []);

  const triggerHearts = () => {
    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      left: 10 + Math.random() * 80,
      delay: i * 0.15,
      scale: 0.7 + Math.random() * 0.6,
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 5000);
  };

  const handleSave = () => {
    if (!replyText.trim()) {
      toast.error("Please write something first!");
      return;
    }
    localStorage.setItem("brother_reply", replyText);
    
    // Write reply to Firebase Realtime Database
    try {
      const repliesRef = ref(database, "replies");
      const newReplyRef = push(repliesRef);
      set(newReplyRef, {
        text: replyText,
        timestamp: Date.now(),
        date: new Date().toLocaleString()
      });
    } catch (err) {
      console.warn("Failed to write reply to database:", err);
    }

    setIsSaved(true);
    triggerHearts();
    toast.success("Your reply is sealed with love! 💝");
  };

  const handleEdit = () => {
    setIsSaved(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(replyText);
    toast.success("Copied to clipboard!");
  };

  const getWhatsAppShareUrl = () => {
    const siteUrl = window.location.origin;
    const message = `Hey Jaanu, I read your beautiful surprise! Here is my reply to your letter:\n\n"${replyText}"\n\nRead it here: ${siteUrl}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="paper-grain py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">{letter.eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-tight">
            {letter.title}
          </h2>
          <img
            src={ornament}
            alt=""
            aria-hidden="true"
            className="mx-auto mt-6 h-12 w-44 object-cover object-center opacity-70"
          />
        </Reveal>

        <Reveal delay={150}>
          <article className="relative mt-12 bg-paper px-5 py-12 xs:px-8 xs:py-16 sm:px-16 sm:py-20 shadow-lift rounded-md border border-amber-800/10 transition-shadow duration-500 hover:shadow-2xl">
            {/* Double Border Detail */}
            <div className="absolute inset-3 border-2 border-double border-amber-600/20 pointer-events-none rounded-sm" />

            {/* Gold Corner Accents */}
            <CornerOrnament className="top-5 left-5" />
            <CornerOrnament className="top-5 right-5 rotate-90" />
            <CornerOrnament className="bottom-5 left-5 -rotate-90" />
            <CornerOrnament className="bottom-5 right-5 rotate-180" />

            {/* Floating Hearts Container */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
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

            <span className="absolute top-10 left-10 font-display text-8xl leading-none text-rose/15 select-none pointer-events-none">
              “
            </span>

            <div className="relative space-y-6 font-hand text-[clamp(1.35rem,3.6vw,1.8rem)] leading-[1.7] text-ink">
              {letter.paragraphs.map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
              
              <div className="pt-6 flex justify-between items-end flex-wrap gap-6">
                <div>
                  <p className="text-rose whitespace-pre-line">
                    {letter.signature}
                  </p>
                </div>

                {/* Wax Seal Button */}
                <div className="flex flex-col items-center select-none mr-2 sm:mr-6">
                  <button
                    type="button"
                    onClick={triggerHearts}
                    aria-label="Seal of love"
                    className="relative cursor-pointer transition-transform duration-500 hover:scale-110 active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                  >
                    <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 100 100">
                      <path
                        d="M50 8 C65 6, 80 12, 85 25 C90 38, 92 55, 85 70 C78 85, 60 92, 45 90 C30 88, 12 80, 8 65 C4 50, 10 30, 20 18 C30 6, 35 10, 50 8 Z"
                        fill="#9B1C31"
                        className="transition-colors duration-500 group-hover:fill-[#B22234]"
                      />
                      <circle cx="50" cy="50" r="32" fill="#801122" opacity="0.6" />
                      <circle cx="50" cy="50" r="28" fill="#D4AF37" className="transition-all duration-500 group-hover:fill-[#F3E5AB]" />
                      <path
                        d="M50 35 C52 42, 58 45, 65 45 C58 45, 52 48, 50 55 C48 48, 42 45, 35 45 C42 45, 48 42, 50 35 Z"
                        fill="#801122"
                      />
                      <circle cx="50" cy="50" r="6" fill="#801122" />
                      <circle cx="50" cy="50" r="3" fill="#D4AF37" />
                      <circle cx="50" cy="27" r="1.5" fill="#801122" />
                      <circle cx="50" cy="63" r="1.5" fill="#801122" />
                      <circle cx="32" cy="45" r="1.5" fill="#801122" />
                      <circle cx="68" cy="45" r="1.5" fill="#801122" />
                    </svg>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 scale-0 rounded bg-ink/90 px-2 py-0.5 text-[9px] text-paper transition-all duration-300 group-hover:scale-100 whitespace-nowrap tracking-widest font-body uppercase shadow-sm">
                      Press to Seal 💌
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-12 border-t border-border/60 pt-6 text-center text-xs tracking-[0.25em] text-muted-foreground uppercase">
              Happy Raksha Bandhan
            </div>
          </article>
        </Reveal>

        {/* Reply Section */}
        <Reveal delay={180} className="mt-16">
          <div className="relative overflow-hidden bg-paper px-8 py-12 shadow-soft sm:px-12 sm:py-16 rounded-md border border-amber-800/10 transition-shadow duration-500 hover:shadow-lift">
            <div className="absolute inset-3 border border-dashed border-amber-600/15 pointer-events-none rounded-sm" />
            
            <h3 className="text-center font-display text-3xl leading-tight text-foreground/90">
              A Reply For Your Sister
            </h3>
            
            <div className="mt-8 relative z-10">
              {!isSaved ? (
                <div className="space-y-6">
                  <p className="text-center text-sm text-muted-foreground font-body max-w-md mx-auto">
                    Type a heartfelt message for your sister here. When you save it, you can copy or send it directly to her via WhatsApp!
                  </p>
                  
                  <div className="relative">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Dearest Jaanu, I read your beautiful surprise. Thank you so much for this... I love you!"
                      className="w-full min-h-[180px] bg-secondary/30 border border-border/80 rounded-md p-6 font-hand text-xl focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose/50 transition-all resize-y text-ink placeholder:text-muted-foreground/50 leading-relaxed"
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm tracking-[0.16em] text-primary-foreground uppercase shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:bg-rose active:scale-98 cursor-pointer"
                    >
                      Save & Seal Reply 💝
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-rise">
                  <div className="border-l-4 border-rose pl-4 py-2 bg-secondary/15 rounded-r">
                    <p className="font-mono text-xs tracking-wider text-rose uppercase font-medium">Your sealed reply to Jaanu:</p>
                  </div>
                  
                  <div className="bg-secondary/10 p-6 rounded-md border border-border/50">
                    <p className="font-hand text-2xl leading-relaxed text-ink/90 whitespace-pre-line">
                      {replyText}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center items-center">
                    <a
                      href={getWhatsAppShareUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20BA56] px-6 py-3 text-sm tracking-[0.15em] text-white font-medium shadow-soft transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <span>Share on WhatsApp 💬</span>
                    </a>
                    
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 rounded-full bg-paper border border-border px-6 py-3 text-sm tracking-[0.15em] text-foreground hover:text-rose hover:border-rose transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Copy Message 📋
                    </button>

                    <button
                      type="button"
                      onClick={handleEdit}
                      className="inline-flex items-center gap-2 rounded-full bg-paper border border-dashed border-border/80 px-6 py-3 text-sm tracking-[0.15em] text-muted-foreground hover:text-foreground transition-all duration-300"
                    >
                      Edit Letter ✏️
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-12 text-center">
          <Link
            to="/timeline"
            className="inline-flex items-center gap-3 rounded-full border border-border bg-paper px-7 py-3 text-sm tracking-[0.16em] text-foreground uppercase shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:border-rose hover:text-rose"
          >
            Walk through our timeline →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
