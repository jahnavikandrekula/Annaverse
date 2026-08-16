import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/rakhi/Nav";
import { Gallery } from "@/components/rakhi/Gallery";

const title = "The Gallery — For My Annayyya";
const description =
  "Every photo of us in one place: from our very first picture to the most recent, a sister's gift for her brother.";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <main className="bg-transparent">
      <Nav />
      <Gallery />
    </main>
  );
}
