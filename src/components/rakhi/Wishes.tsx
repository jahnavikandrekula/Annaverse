import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { useFirebase } from "../../context/FirebaseDataContext";

export function Wishes() {
  const { data } = useFirebase();
  const cards = data.wishes;
  return (
    <section className="paper-grain py-28 md:py-36">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <p className="eyebrow">From me to you</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-tight">
            Wishes & Promises
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            A few things I wish for you, and a few I promise to keep — for every Rakhi, near or far.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 80}>
              <div className="h-full bg-paper px-7 py-8 shadow-soft transition-transform duration-700 hover:-translate-y-1">
                <span
                  className={`font-mono text-[0.7rem] tracking-[0.25em] uppercase ${
                    c.kind === "wish" ? "text-rose" : "text-gold"
                  }`}
                >
                  {c.kind === "wish" ? "A Wish" : "A Promise"}
                </span>
                <h3 className="mt-3 font-display text-2xl text-foreground">{c.title}</h3>
                <p className="mt-3 font-hand text-xl leading-snug text-muted-foreground">
                  {c.note}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200} className="mt-16 text-center">
          <p className="mx-auto max-w-md font-display text-xl italic leading-relaxed text-muted-foreground">
            “A sister's wish doesn't need a thread to reach you — it already lives in your heart.”
          </p>
          <Link
            to="/"
            hash="surprise"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm tracking-[0.16em] text-primary-foreground uppercase shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:bg-rose"
          >
            Open your surprise 💌
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
