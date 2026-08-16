import { Reveal } from "./Reveal";
import { useFirebase } from "../../context/FirebaseDataContext";

export function ThingsILove() {
  const { data } = useFirebase();
  const things = data.ourBond.things;

  return (
    <section className="paper-grain py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">A short list</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-tight md:whitespace-nowrap">
            Things I Love About You
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {things.map((t, i) => (
            <Reveal as="li" key={t.title} delay={i * 100}>
              <div className="h-full bg-paper px-7 py-8 shadow-soft transition-transform duration-700 hover:-translate-y-1">
                <span className="font-mono text-[0.7rem] tracking-[0.25em] text-gold">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-2xl text-foreground">{t.title}</h3>
                <p className="mt-2 font-hand text-xl leading-snug text-muted-foreground">
                  {t.note}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
