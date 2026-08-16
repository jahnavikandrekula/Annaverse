import { useState } from "react";
import { PhotoFrame } from "./PhotoFrame";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";
import { useFirebase } from "../../context/FirebaseDataContext";

export function Gallery() {
  const { data } = useFirebase();
  const shots = data.gallery;
  const [active, setActive] = useState<any>(null);

  return (
    <section className="paper-grain py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <p className="eyebrow">Every picture</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-tight">
            The Gallery
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            All of us, in one place — from the very first photo to the most recent. Tap any to see
            it a little bigger.
          </p>
        </Reveal>

        <div className="mt-14 columns-2 gap-4 sm:gap-5 md:columns-3 [&>*]:mb-4 sm:[&>*]:mb-5">
          {shots.map((s, i) => (
            <Reveal key={s.file + i} delay={(i % 6) * 70}>
              <button
                type="button"
                onClick={() => setActive(s)}
                aria-label={`Open ${s.label}`}
                className="block w-full bg-paper p-2 text-left shadow-soft transition-all duration-700 hover:-translate-y-1 hover:shadow-lift"
              >
                <PhotoFrame
                  file={s.file}
                  label={s.label}
                  className="aspect-[4/5] w-full"
                  imgClassName={s.imgClassName}
                />
                <span className="mt-2 block px-1 font-hand text-base text-ink/70">{s.caption}</span>
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
