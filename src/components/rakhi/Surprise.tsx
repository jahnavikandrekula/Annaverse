import { useState } from "react";
import { Reveal } from "./Reveal";
import { useFirebase } from "../../context/FirebaseDataContext";

export function Surprise() {
  const [open, setOpen] = useState(false);
  const { data } = useFirebase();
  const surprise = data.surprise;

  return (
    <section id="surprise" className="relative overflow-hidden bg-accent/40 py-24 md:py-32">
      {open ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[12, 30, 48, 66, 84].map((left, i) => (
            <span
              key={left}
              className="absolute bottom-16 text-lg text-rose/60"
              style={{
                left: `${left}%`,
                animation: `float-heart ${7 + i}s ease-in ${i * 1.4}s infinite`,
              }}
            >
              ❤
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow">{surprise.eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.2rem)] leading-tight">
            {surprise.title}
          </h2>
        </Reveal>

        {!open ? (
          <Reveal delay={150}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-10 rounded-full bg-primary px-9 py-4 text-sm tracking-[0.16em] text-primary-foreground uppercase shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:bg-rose"
            >
              {surprise.buttonText}
            </button>
          </Reveal>
        ) : (
          <div className="animate-rise mt-10 bg-paper px-7 py-12 shadow-lift sm:px-12">
            <p className="font-hand text-[clamp(1.5rem,4.2vw,2.1rem)] leading-relaxed text-ink">
              {surprise.message}
            </p>
            <p className="mt-8 font-display text-2xl text-rose">{surprise.heading}</p>
            <p className="mt-3 font-hand text-xl text-rose">{surprise.signature}</p>
          </div>
        )}
      </div>
    </section>
  );
}
