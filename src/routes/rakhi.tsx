import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/rakhi/Nav";
import { RakhiMessage } from "@/components/rakhi/RakhiMessage";

const title = "Your Rakhi — Happy Raksha Bandhan";
const description =
  "A virtual Rakhi tied with love, prayers, and blessings from your sister across the miles.";

export const Route = createFileRoute("/rakhi")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RakhiPage,
});

function RakhiPage() {
  return (
    <main className="bg-transparent">
      <Nav />
      <div className="pt-16">
        <RakhiMessage />
      </div>
    </main>
  );
}
