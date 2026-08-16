import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/rakhi/Nav";
import { Wishes } from "@/components/rakhi/Wishes";

const title = "Wishes & Promises — For My Annayyya";
const description =
  "The things a sister wishes for her brother, and the promises she keeps — for every Rakhi, near or far.";

export const Route = createFileRoute("/wishes")({
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
  component: WishesPage,
});

function WishesPage() {
  return (
    <main className="bg-transparent">
      <Nav />
      <Wishes />
    </main>
  );
}
