import { useState } from "react";
import { PhotoFrame } from "./PhotoFrame";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";
import { useFirebase } from "../../context/FirebaseDataContext";

export function Memories() {
  const { data } = useFirebase();
  const memoriesList = data.memories;
  const [active, setActive] = useState<any>(null);

  return (
    <section id="memories" className="paper-grain py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <p className="eyebrow">The album</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-tight">
            Our Memories
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            A few pages from our story — tap any photo to see it a little bigger.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {memoriesList.map((m: any, i: number) => (
            <Reveal key={m.file + i} delay={i * 90}>
              <button
                type="button"
                onClick={() => setActive(m)}
                aria-label={`Open ${m.label}`}
                className="block w-full bg-paper p-3 pb-12 text-left shadow-soft transition-all duration-700 hover:-translate-y-1 hover:shadow-lift"
              >
                <PhotoFrame
                  file={m.file}
                  label={m.label}
                  className="aspect-[4/5] w-full"
                  imgClassName={m.imgClassName}
                />
                <span className="mt-3 block px-1 font-hand text-xl text-ink/80">{m.label}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active ? (
        <Lightbox
          file={active.file}
          label={active.label}
          caption={active.caption}
          onClose={() => setActive(null)}
        />
      ) : null}
    </section>
  );
}

