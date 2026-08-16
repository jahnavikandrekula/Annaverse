import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/rakhi/Nav";
import { Letter } from "@/components/rakhi/Letter";

const title = "A Letter For My Annayyya — Raksha Bandhan";
const description =
  "A handwritten letter from a sister to her elder brother across the distance — every word kept where he can return to it.";

export const Route = createFileRoute("/letter")({
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
  component: LetterPage,
});

function LetterPage() {
  return (
    <main className="bg-transparent">
      <Nav />
      <Letter />
    </main>
  );
}
