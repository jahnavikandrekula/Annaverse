import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav } from "@/components/rakhi/Nav";
import { Hero } from "@/components/rakhi/Hero";
import { Memories } from "@/components/rakhi/Memories";
import { Distance } from "@/components/rakhi/Distance";
import { ThingsILove } from "@/components/rakhi/ThingsILove";
import { Surprise } from "@/components/rakhi/Surprise";
import { Finale } from "@/components/rakhi/Finale";
import { IntroAnimation } from "@/components/rakhi/IntroAnimation";
import { Preloader } from "@/components/rakhi/Preloader";

const title = "For My Annayyya — A Rakhi From Miles Away";
const description =
  "A little Raksha Bandhan surprise for my elder brother: our memories, a handwritten letter, and a rakhi sent with love across the distance.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [showMainApp, setShowMainApp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleIntroComplete = () => {
    setShowMainApp(true);
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (!showMainApp) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <main className="bg-transparent">
      <Nav />
      <div className="animate-rise">
        <Hero />
        <Memories />
        <Distance />
        <ThingsILove />
        <Surprise />
        <Finale />
      </div>
    </main>
  );
}
