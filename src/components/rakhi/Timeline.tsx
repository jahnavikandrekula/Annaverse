import { Link } from "@tanstack/react-router";
import { PhotoFrame } from "./PhotoFrame";
import { Reveal } from "./Reveal";
import { useFirebase } from "../../context/FirebaseDataContext";
import ornament from "@/assets/ornament.png";

export function Timeline() {
  const { data } = useFirebase();
  const milestones = data.timeline;
  return (
    <section className="paper-grain py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-tight">
            The Timeline of Us
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            From the day you became my annayyya to the miles between us today —
            every step made us who we are.
          </p>
        </Reveal>

        <img
          src={ornament}
          alt=""
          aria-hidden="true"
          className="mt-10 h-12 w-44 object-cover object-center opacity-70"
        />

        <ol className="relative mt-14">
          {/* the spine */}
          <span
            aria-hidden="true"
            className="absolute left-4 top-0 h-full w-px bg-linear-to-b from-gold/60 via-rose/40 to-gold/60 md:left-1/2 md:-translate-x-1/2"
          />

          {milestones.map((m, i) => {
            const left = i % 2 === 0;
            return (
              <Reveal as="li" key={m.file} delay={i * 80} className="relative mb-20 last:mb-0">
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-rose ring-4 ring-background md:left-1/2"
                />
                <div className="pl-12 md:grid md:grid-cols-2 md:gap-12 md:pl-0">
                  {/* text */}
                  <div
                    className={`${
                      left ? "md:order-1 md:pr-10 md:text-right" : "md:order-2 md:pl-10"
                    }`}
                  >
                    <p className="font-hand text-2xl text-rose">{m.era}</p>
                    <h3 className="mt-1 font-display text-[clamp(1.5rem,3.5vw,2.1rem)] leading-tight">
                      {m.title}
                    </h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                      {m.note}
                    </p>
                  </div>

                  {/* photo */}
                  <div
                    className={`mt-6 md:mt-0 ${
                      left ? "md:order-2" : "md:order-1 md:pr-10"
                    }`}
                  >
                    <div className="bg-paper p-3 shadow-soft transition-all duration-700 hover:-translate-y-1 hover:shadow-lift">
                      <PhotoFrame
                        file={m.file}
                        label={m.label}
                        className="aspect-[4/3] w-full"
                        imgClassName={m.imgClassName}
                      />
                      <p className="mt-3 px-1 font-hand text-lg text-ink/70">{m.label}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>

        <Reveal className="mt-20 text-center">
          <p className="mx-auto max-w-md font-display text-xl italic leading-relaxed text-muted-foreground">
            “Brothers and sisters are joined at the heart — and distance only
            stretches the thread, never breaks it.”
          </p>
          <Link
            to="/"
            hash="surprise"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm tracking-[0.16em] text-primary-foreground uppercase shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:bg-rose"
          >
            Back to your surprise 💌
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
