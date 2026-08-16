import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PhotoFrame } from "./PhotoFrame";
import { useFirebase } from "../../context/FirebaseDataContext";
import ornament from "@/assets/ornament.png";

export function Hero() {
  const [offset, setOffset] = useState(0);
  const { data } = useFirebase();
  const home = data.home;

  useEffect(() => {
    const onScroll = () => setOffset(Math.min(window.scrollY, 500) * 0.06);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="paper-grain relative min-h-[100svh] overflow-hidden">
      <div className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-5 pt-24 pb-16 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        <div className="order-2 md:order-1">
          <p className="eyebrow animate-rise" style={{ animationDelay: "200ms" }}>
            {home.eyebrow}
          </p>
          <h1
            className="animate-rise mt-5 font-display text-[clamp(2.9rem,9vw,5.4rem)] leading-[0.98] text-foreground"
            style={{ animationDelay: "420ms" }}
          >
            {home.title === "For My Annayyya" ? (
              <>
                For My{" "}
                <span className="whitespace-nowrap">
                  Annayyya <span className="align-middle text-[0.45em] text-rose">❤️</span>
                </span>
              </>
            ) : (
              home.title
            )}
          </h1>
          <p
            className="animate-rise mt-5 max-w-md font-display text-[clamp(1.25rem,3.4vw,1.75rem)] leading-snug text-muted-foreground italic"
            style={{ animationDelay: "700ms" }}
          >
            {home.subtitle}
          </p>

          <img
            src={ornament}
            alt=""
            aria-hidden="true"
            width={1024}
            height={512}
            className="animate-rise mt-6 h-16 w-56 object-cover object-center opacity-80"
            style={{ animationDelay: "900ms" }}
          />

          <Link
            to="/rakhi"
            className="animate-rise mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm tracking-[0.16em] text-primary-foreground uppercase shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:bg-rose"
            style={{ animationDelay: "1150ms" }}
          >
            {home.buttonText}
          </Link>
        </div>

        <div
          className="animate-rise order-1 md:order-2"
          style={{ animationDelay: "80ms", transform: `translateY(${-offset}px)` }}
        >
          <div className="bg-paper p-3 shadow-lift sm:p-4">
            <PhotoFrame
              file={home.heroImage}
              label="A photo of us"
              priority
              className="aspect-[4/5] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
