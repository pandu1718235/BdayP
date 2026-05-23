import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HeroScene } from "@/components/birthdayverse/HeroScene";
import { CountdownScene } from "@/components/birthdayverse/CountdownScene";
import { CakeScene } from "@/components/birthdayverse/CakeScene";
import { LoveCardScene } from "@/components/birthdayverse/LoveCardScene";
import { MemoryScene } from "@/components/birthdayverse/MemoryScene";
import { EndingScene } from "@/components/birthdayverse/EndingScene";
import { MusicToggle } from "@/components/birthdayverse/MusicToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BirthdayVerse — A Cinematic Birthday Experience" },
      { name: "description", content: "An aesthetic, interactive birthday wishing experience: balloons, cake cutting, love card, memories, and more." },
      { property: "og:title", content: "BirthdayVerse" },
      { property: "og:description", content: "I built an entire experience just to make you smile." },
    ],
  }),
  component: Index,
});

// 🎀 EDIT THESE PLACEHOLDERS WHEN READY
const CONFIG = {
  name: "Your Name",
  date: "DD Month YYYY",
  message:
    "My love. You are a very special person. I always silently thank you for coming into my life. Today, I wish you all the best, lots of health, and lots of joy. I always hope we will celebrate many more birthdays like this together. Happy birthday to you. 💕",
};

type Scene = "hero" | "countdown" | "cake" | "love" | "memory" | "ending";

function Index() {
  const [scene, setScene] = useState<Scene>("hero");
  const started = scene !== "hero";

  return (
    <main className="relative">
      <MusicToggle active={started} />
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {scene === "hero" && (
            <HeroScene name={CONFIG.name} date={CONFIG.date} onStart={() => setScene("countdown")} />
          )}
          {scene === "countdown" && <CountdownScene onComplete={() => setScene("cake")} />}
          {scene === "cake" && <CakeScene onComplete={() => setScene("love")} />}
          {scene === "love" && (
            <LoveCardScene name={CONFIG.name} message={CONFIG.message} onContinue={() => setScene("memory")} />
          )}
          {scene === "memory" && <MemoryScene onContinue={() => setScene("ending")} />}
          {scene === "ending" && <EndingScene onRestart={() => setScene("hero")} />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
