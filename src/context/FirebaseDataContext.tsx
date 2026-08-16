import React, { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebase";
import { DEFAULT_DATA } from "../lib/dbDefaults";

interface FirebaseDataContextType {
  data: typeof DEFAULT_DATA & { replies?: Record<string, any>; media?: Record<string, any> };
  loading: boolean;
}

const FirebaseDataContext = createContext<FirebaseDataContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SSR Check
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const rootRef = ref(database);
    
    // Live subscription to the database root node
    const unsubscribe = onValue(
      rootRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          console.log("Empty database detected. Seeding with default data...");
          // Seed the database with defaults
          set(rootRef, DEFAULT_DATA)
            .then(() => console.log("Database seeded successfully!"))
            .catch((err) => console.error("Database seeding failed:", err));
          setData(DEFAULT_DATA);
        } else {
          const raw = snapshot.val();
          
          // Deep-merge the Firebase data with local defaults in case keys are missing or deleted
          const merged = {
            home: { ...DEFAULT_DATA.home, ...raw.home },
            memories: Array.isArray(raw.memories) 
              ? raw.memories 
              : raw.memories 
                ? Object.values(raw.memories) 
                : DEFAULT_DATA.memories,
            ourBond: {
              ...DEFAULT_DATA.ourBond,
              ...raw.ourBond,
              things: Array.isArray(raw.ourBond?.things)
                ? raw.ourBond.things
                : raw.ourBond?.things
                  ? Object.values(raw.ourBond.things)
                  : DEFAULT_DATA.ourBond.things
            },
            surprise: { ...DEFAULT_DATA.surprise, ...raw.surprise },
            rakhi: { ...DEFAULT_DATA.rakhi, ...raw.rakhi },
            timeline: Array.isArray(raw.timeline)
              ? raw.timeline
              : raw.timeline
                ? Object.values(raw.timeline)
                : DEFAULT_DATA.timeline,
            letter: {
              ...DEFAULT_DATA.letter,
              ...raw.letter,
              paragraphs: Array.isArray(raw.letter?.paragraphs)
                ? raw.letter.paragraphs
                : raw.letter?.paragraphs
                  ? Object.values(raw.letter.paragraphs)
                  : DEFAULT_DATA.letter.paragraphs
            },
            gallery: Array.isArray(raw.gallery)
              ? raw.gallery
              : raw.gallery
                ? Object.values(raw.gallery)
                : DEFAULT_DATA.gallery,
            wishes: Array.isArray(raw.wishes)
              ? raw.wishes
              : raw.wishes
                ? Object.values(raw.wishes)
                : DEFAULT_DATA.wishes,
            songs: Array.isArray(raw.songs)
              ? raw.songs
              : raw.songs
                ? Object.values(raw.songs)
                : DEFAULT_DATA.songs,
            replies: raw.replies || {},
            media: raw.media || {}
          };
          
          setData(merged);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase subscription error:", error);
        // Fallback to local default data on network/permission error
        setData(DEFAULT_DATA);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseDataContext.Provider value={{ data, loading }}>
      {children}
    </FirebaseDataContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseDataContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
