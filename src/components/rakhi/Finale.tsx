import { PhotoFrame } from "./PhotoFrame";
import { Reveal } from "./Reveal";
import { useFirebase } from "../../context/FirebaseDataContext";

export function Finale() {
  const { data } = useFirebase();
  const home = data.home;
  const finalImage = home.finalImage || "final-photo.png";
  const finalMessage = home.finalMessage || "Until the next Rakhi we celebrate together…";
  const finalSignature = home.finalSignature || "Lots of Love,\nYour Sister ❤️";

  return (
    <footer className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 md:py-32">
      <Reveal>
        <div className="bg-paper p-3 shadow-lift sm:p-4">
          <PhotoFrame
            file={finalImage}
            label="The two of us"
            className="aspect-[3/2] w-full"
          />
        </div>
      </Reveal>

      <Reveal delay={160}>
        <p className="mt-12 font-display text-[clamp(1.4rem,4vw,2rem)] leading-relaxed text-muted-foreground italic">
          {finalMessage}
        </p>
        <p className="mt-8 font-hand text-3xl text-rose whitespace-pre-line">
          {finalSignature}
        </p>
      </Reveal>
    </footer>
  );
}
