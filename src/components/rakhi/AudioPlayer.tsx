import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Film } from "lucide-react";
import { useFirebase } from "../../context/FirebaseDataContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function AudioPlayer() {
  const { data } = useFirebase();
  const songs = data.songs || [];
  const featuredSong = songs.find((s: any) => s.featured) || songs[0] || {
    title: "Nenu Thodu Undana",
    artist: "Jigra (Telugu)",
    audioUrl: "/nenu-thodu-undana.mp4",
    lyrics: "Wherever you are, whatever life brings, I'll always be your little sister. This song is my little piece of love reaching you from miles away."
  };
  const isDefaultSong = featuredSong.audioUrl.includes("nenu-thodu-undana");

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Refs for Web Audio API volume booster
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isAudioInitializedRef = useRef(false);

  // Initialize Web Audio API for volume boosting (must be triggered by user gesture)
  const initWebAudio = () => {
    if (isAudioInitializedRef.current || !audioRef.current) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const source = ctx.createMediaElementSource(audioRef.current);
      const gainNode = ctx.createGain();
      
      // 6.0x volume booster
      gainNode.gain.value = isMuted ? 0 : 6.0;
      
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      audioContextRef.current = ctx;
      gainNodeRef.current = gainNode;
      isAudioInitializedRef.current = true;
      console.log("Web Audio API Volume Booster Initialized (6.0x gain).");

      if (ctx.state === "suspended") {
        ctx.resume();
      }
    } catch (err) {
      console.warn("Web Audio API initialization skipped or blocked by browser:", err);
    }
  };

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 1.0;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : 6.0;
    }
  }, [isMuted]);

  // Notification timer
  useEffect(() => {
    const notificationTimeout = setTimeout(() => {
      setShowNotification(false);
    }, 10000);
    return () => clearTimeout(notificationTimeout);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      initWebAudio();

      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (isDefaultSong && (audioRef.current.currentTime < 12 || audioRef.current.currentTime > 55)) {
          audioRef.current.currentTime = 12;
        }
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setShowNotification(false);
          })
          .catch((err) => console.error("Playback failed:", err));
      }
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Trims audio to play ONLY the main lyrics/chorus (12s to 55s) and loops it (only for default song)
  const handleTimeUpdate = () => {
    if (audioRef.current && isDefaultSong) {
      const current = audioRef.current.currentTime;
      if (current < 12) {
        audioRef.current.currentTime = 12;
      }
      if (current > 55) {
        audioRef.current.currentTime = 12;
      }
    }
  };

  const openVideoModal = () => {
    // Pause background music if playing
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setIsVideoModalOpen(true);
  };

  const handleVideoModalChange = (open: boolean) => {
    setIsVideoModalOpen(open);
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2 font-sans sm:right-6 sm:bottom-6">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={featuredSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        loop
        preload="auto"
      />

      {/* Play Notification Bubble */}
      {showNotification && !isPlaying && (
        <div className="animate-bounce hover:animate-none flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 rounded-2xl border border-white/20 bg-background/80 px-3 py-2 shadow-lift backdrop-blur-md max-w-[calc(100vw-2rem)]">
          <span className="text-[11px] font-semibold text-foreground">Play song for Annayyya ❤️</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={togglePlay} 
              className="text-[10px] font-bold text-rose uppercase hover:underline cursor-pointer"
            >
              Play
            </button>
            <span className="text-muted-foreground/30 text-[10px]">|</span>
            <button 
              onClick={openVideoModal} 
              className="text-[10px] font-bold text-gold uppercase hover:underline cursor-pointer"
            >
              Watch Video
            </button>
          </div>
        </div>
      )}

      {/* Main Music Player Card (Sleek Compact Pill) */}
      <div className="flex items-center gap-3.5 rounded-full border border-white/20 bg-background/75 px-3 py-2 shadow-lift backdrop-blur-md max-w-[calc(100vw-2rem)] overflow-hidden">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-soft transition-all duration-300 cursor-pointer ${
            isPlaying ? "bg-rose hover:bg-rose/90 animate-pulse" : "bg-gold hover:bg-gold/90"
          }`}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause className="h-4.5 w-4.5 fill-white" /> : <Play className="h-4.5 w-4.5 fill-white translate-x-[1px]" />}
        </button>

        {/* Title / Click to open video */}
        <button
          onClick={openVideoModal}
          className="flex flex-col pr-1 text-left cursor-pointer group hover:opacity-85 transition-opacity"
          title="Click to watch dedication video"
        >
          <span className="text-[9px] font-bold tracking-wider text-rose uppercase flex items-center gap-1">
            {featuredSong.artist} <Maximize2 className="h-2 w-2 opacity-60 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="text-xs font-semibold text-foreground max-w-[80px] xs:max-w-[110px] truncate">
            {featuredSong.title}
          </span>
        </button>

        {/* Music Waves (Active Playing Indicator) */}
        {isPlaying ? (
          <div className="flex items-end gap-[2px] h-3.5 w-4 px-0.5">
            <span className="w-[2px] rounded-full bg-rose animate-music-wave-1" />
            <span className="w-[2px] rounded-full bg-gold animate-music-wave-2" />
            <span className="w-[2px] rounded-full bg-rose animate-music-wave-3" />
          </div>
        ) : null}

        {/* Watch Video Dedicated Button */}
        <button
          onClick={openVideoModal}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-rose transition-colors cursor-pointer"
          title="Watch Dedicated Video"
          aria-label="Watch Dedicated Video"
        >
          <Film className="h-4.5 w-4.5" />
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-4.5 w-4.5 text-rose" /> : <Volume2 className="h-4.5 w-4.5" />}
        </button>
      </div>

      {/* Beautiful Video Modal dialog popup */}
      <Dialog open={isVideoModalOpen} onOpenChange={handleVideoModalChange}>
        <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-md border border-amber-600/20 text-foreground p-6 shadow-2xl rounded-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-display text-2xl text-rose flex items-center gap-2">
              <span>{featuredSong.title} ❤️</span>
            </DialogTitle>
            <DialogDescription className="font-sans text-xs tracking-wider uppercase text-gold font-semibold">
              {featuredSong.artist} • Special Dedication
            </DialogDescription>
          </DialogHeader>

          {/* Video Container */}
          <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-inner">
            {isVideoModalOpen && (
              <video
                src={featuredSong.audioUrl}
                className="h-full w-full object-contain"
                controls
                autoPlay
                playsInline
              />
            )}
          </div>

          <div className="mt-4 space-y-3 text-center sm:text-left">
            <p className="font-hand text-xl text-ink/90 leading-relaxed">
              “{featuredSong.lyrics}”
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground font-mono uppercase tracking-wider">
              <span>Dedicated with love</span>
              <span className="text-rose font-semibold">— Jaanu 🌸</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
