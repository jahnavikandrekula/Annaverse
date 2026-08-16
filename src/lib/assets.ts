const images = import.meta.glob<{ default: string }>("/src/assets/*.{png,jpg,jpeg,svg,webp}", { eager: true });

/**
 * Dynamically resolves the compiled/hashed asset URL for a given image filename
 * located inside the `src/assets` directory.
 *
 * @param file The filename of the asset (e.g. 'memory-01.jpg')
 * @returns The resolved asset URL, or undefined if not found
 */
export function getAssetUrl(file: string): string | undefined {
  if (!file) return undefined;

  if (file.startsWith("http://") || file.startsWith("https://") || file.startsWith("data:")) {
    return file;
  }

  // Try direct match first (fast path)
  const path = `/src/assets/${file}`;
  if (images[path]) {
    return images[path].default;
  }

  // Extract requested base name (e.g. "brother-hero" from "brother-hero.png")
  const dotIndex = file.lastIndexOf(".");
  const baseName = dotIndex !== -1 ? file.substring(0, dotIndex).toLowerCase() : file.toLowerCase();

  // Dynamic search across all bundle matches
  for (const globPath in images) {
    const filename = globPath.split("/").pop() || "";
    const currentDotIndex = filename.lastIndexOf(".");
    const currentBase = currentDotIndex !== -1 ? filename.substring(0, currentDotIndex).toLowerCase() : filename.toLowerCase();

    if (currentBase === baseName) {
      return images[globPath]?.default;
    }
  }

  return undefined;
}
