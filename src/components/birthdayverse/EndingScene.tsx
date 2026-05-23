import { motion } from "framer-motion";
import { Sparkles, FloatingHearts } from "./Sparkles";

export function EndingScene({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "radial-gradient(ellipse at center, oklch(0.3 0.05 350) 0%, oklch(0.14 0.02 30) 80%)" }}>
      <Sparkles count={80} />
      <FloatingHearts count={20} />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="text-6xl mb-6">🌸</div>
        <h2 className="font-display text-5xl md:text-7xl text-glow-rose mb-6" style={{ color: "var(--rose-pink)" }}>
          Thank you for existing
        </h2>
        <p className="font-script text-2xl md:text-3xl max-w-2xl mx-auto opacity-90">
          I built an entire experience just to make you smile.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onRestart}
          className="mt-12 inline-flex items-center gap-2 rounded-full px-7 py-3 font-script text-xl border"
          style={{
            borderColor: "color-mix(in oklab, var(--rose-pink) 60%, transparent)",
            color: "var(--cream)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          Replay the magic ↺
        </motion.button>
      </motion.div>
    </section>
  );
}
