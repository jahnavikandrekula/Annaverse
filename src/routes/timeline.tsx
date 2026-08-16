import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/rakhi/Nav";
import { Timeline } from "@/components/rakhi/Timeline";

const title = "The Timeline of Us — For My Annayyya";
const description =
  "A timeline of our story: from the day you became my annayyya to the miles between us today. Every step made us who we are.";

export const Route = createFileRoute("/timeline")({
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
  component: TimelinePage,
});

function TimelinePage() {
  return (
    <main className="bg-transparent">
      <Nav />
      <Timeline />
    </main>
  );
}
