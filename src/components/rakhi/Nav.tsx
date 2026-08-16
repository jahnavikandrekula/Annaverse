import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const homeSections = [
  { hash: "home", label: "Home" },
  { hash: "memories", label: "Memories" },
  { hash: "bond", label: "Our Bond" },
  { hash: "surprise", label: "Surprise" },
];

const pages = [
  { to: "/rakhi", label: "Rakhi" },
  { to: "/timeline", label: "Timeline" },
  { to: "/letter", label: "Letter" },
  { to: "/gallery", label: "Gallery" },
  { to: "/wishes", label: "Wishes" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-background/85 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          hash="home"
          className="font-display text-xl tracking-tight text-foreground"
        >
          For Annayyya <span className="text-rose">❤</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {homeSections.map((l) => (
            <li key={l.hash}>
              <Link
                to="/"
                hash={l.hash}
                className="text-[0.8rem] tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-rose"
              >
                {l.label}
              </Link>
            </li>
          ))}
          {pages.map((p) => (
            <li key={p.to}>
              <Link
                to={p.to}
                activeProps={{ className: "text-rose" }}
                className="text-[0.8rem] tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-rose"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={`h-px w-5 bg-foreground transition-transform duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <span className={`h-px w-5 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-5 bg-foreground transition-transform duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <div
        className={`overflow-y-auto bg-background/95 backdrop-blur-sm transition-[max-height] duration-500 md:hidden ${
          open ? "max-h-[calc(100vh-5rem)]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 pb-6">
          {homeSections.map((l) => (
            <li key={l.hash}>
              <Link
                to="/"
                hash={l.hash}
                onClick={() => setOpen(false)}
                className="block py-2.5 font-display text-xl text-foreground transition-colors hover:text-rose"
              >
                {l.label}
              </Link>
            </li>
          ))}
          {pages.map((p) => (
            <li key={p.to}>
              <Link
                to={p.to}
                onClick={() => setOpen(false)}
                className="block py-2.5 font-display text-xl text-foreground transition-colors hover:text-rose"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
