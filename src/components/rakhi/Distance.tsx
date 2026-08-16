import { Reveal } from "./Reveal";
import { useFirebase } from "../../context/FirebaseDataContext";

export function Distance() {
  const { data } = useFirebase();
  const bond = data.ourBond;

  return (
    <section id="bond" className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 md:py-32">
      <Reveal>
        <p className="eyebrow">{bond.eyebrow}</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-tight">
          {bond.title}
        </h2>
      </Reveal>

      <Reveal delay={150}>
        <div className="mt-14 flex items-center justify-between gap-3 sm:gap-6">
          <Point label={bond.point1} />
          <svg
            viewBox="0 0 200 60"
            className="h-16 flex-1"
            role="img"
            aria-label="A dotted line travelling between us with a heart"
          >
            <path
              id="route"
              d="M2,42 C50,-6 150,-6 198,42"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            <text fontSize="12" fill="var(--rose)">
              <textPath href="#route" startOffset="0%">
                ❤
                <animate
                  attributeName="startOffset"
                  values="0%;96%"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </textPath>
            </text>
          </svg>
          <Point label={bond.point2} />
        </div>
      </Reveal>

      <Reveal delay={280}>
        <p className="mx-auto mt-12 max-w-xl font-display text-[clamp(1.2rem,3.2vw,1.6rem)] leading-relaxed text-muted-foreground italic">
          {bond.subtitle}
        </p>
      </Reveal>
    </section>
  );
}

function Point({ label }: { label: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose/40" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-rose" />
      </span>
      <span className="font-display text-lg text-foreground">{label}</span>
    </div>
  );
}
