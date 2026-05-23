import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "./Sparkles";

export function CountdownScene({ onComplete }: { onComplete: () => void }) {
  const [n, setN] = useState(3);

  useEffect(() => {
    if (n === 0) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [n, onComplete]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: "radial-gradient(ellipse at center, oklch(0.32 0.04 30) 0%, oklch(0.18 0.03 30) 70%, oklch(0.12 0.02 30) 100%)" }}>
      <Sparkles count={70} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 70%)",
      }} />
      <AnimatePresence mode="wait">
        {n > 0 ? (
          <motion.div
            key={n}
            initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-display text-glow-rose"
            style={{ fontSize: "16rem", color: "var(--rose-pink)" }}
          >
            {n}
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-7xl text-glow-rose"
            style={{ color: "var(--heart)" }}
          >
            Surprise! 🎂
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
