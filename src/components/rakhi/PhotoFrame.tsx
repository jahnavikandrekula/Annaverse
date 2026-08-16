/**
 * PhotoFrame — a labelled photo slot.
 *
 * ▸ HOW TO ADD YOUR OWN PHOTOS
 *   1. Drop your image into  src/assets/  using the exact file name shown
 *      on the placeholder (e.g. src/assets/memory-01.jpg).
 *   2. That's it — the photo appears automatically, placeholder disappears.
 *
 * File names used across the site:
 *   brother-hero.jpg, memory-01.jpg ... memory-06.jpg, final-photo.jpg,
 *   timeline-01.jpg ... timeline-05.jpg
 */
import { useEffect, useRef, useState } from "react";
import { getAssetUrl } from "@/lib/assets";

export function PhotoFrame({
  file,
  label,
  caption,
  className = "",
  imgClassName = "",
  priority = false,
  onClick,
}: {
  file: string;
  label: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  onClick?: () => void;
}) {
  const src = getAssetUrl(file);
  const [missing, setMissing] = useState(!src);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Sync state if file prop or resolved src changes
  useEffect(() => {
    setMissing(!src);
  }, [src]);

  // Catch images that already failed before hydration (SSR-rendered markup).
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setMissing(true);
  }, []);

  return (
    <div
      className={`group relative overflow-hidden bg-secondary ${className}`}
      onClick={onClick}
    >
      {!missing && src ? (
        <img
          ref={imgRef}
          src={src}
          alt={label}
          loading={priority ? "eager" : "lazy"}
          onError={() => setMissing(true)}
          className={`h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] ${imgClassName}`}
        />
      ) : (
        <div className="paper-grain flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
            Add photo
          </span>
          <span className="font-display text-2xl leading-tight text-foreground/80">{label}</span>
          <code className="rounded-sm bg-background/70 px-2 py-1 font-mono text-[0.65rem] text-muted-foreground">
            src/assets/{file}
          </code>
        </div>
      )}
      {caption ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/55 to-transparent p-4 text-left font-hand text-lg text-paper opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {caption}
        </span>
      ) : null}
    </div>
  );
}

