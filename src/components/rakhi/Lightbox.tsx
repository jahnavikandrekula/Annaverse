import { useEffect } from "react";
import { createPortal } from "react-dom";
import { getAssetUrl } from "@/lib/assets";

export function Lightbox({
  file,
  label,
  caption,
  onClose,
}: {
  file: string;
  label: string;
  caption?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const src = getAssetUrl(file);

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
      className="fixed inset-0 z-[100000] flex animate-rise flex-col items-center justify-center bg-ink/85 p-5 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className="absolute top-5 right-5 text-3xl leading-none text-paper/80 transition-colors hover:text-paper"
      >
        ×
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[78vh] w-full max-w-3xl overflow-hidden bg-paper p-3 shadow-lift"
      >
        {src ? (
          <img
            src={src}
            alt={label}
            className="max-h-[64vh] w-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-[40vh] flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Missing asset</span>
            <code className="rounded-sm bg-secondary px-2 py-1 font-mono text-sm text-foreground/80">
              src/assets/{file}
            </code>
          </div>
        )}
        <p className="px-1 pt-3 pb-1 text-center font-hand text-2xl text-ink">{caption ?? label}</p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

