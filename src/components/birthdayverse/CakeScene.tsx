import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import bgCake from "@/assets/bg-cake.png";

export function CakeScene({ onComplete }: { onComplete: () => void }) {
  const [cut, setCut] = useState(false);
  const [candleOut, setCandleOut] = useState(false);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(74,44,42,0.85), rgba(74,44,42,0.92)), url(${bgCake})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-script text-4xl md:text-5xl mb-4"
        style={{ color: "var(--soft-pink)" }}
      >
        {candleOut ? (cut ? "Make a wish 🌸" : "Now cut the cake ✨") : "Blow out the candle"}
      </motion.h2>
      <p className="text-sm md:text-base opacity-70 mb-10 font-soft">
        {candleOut ? "Tap & drag the knife across the cake" : "Tap the flame"}
      </p>

      {/* Spotlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center 65%, rgba(255,200,221,0.25) 0%, transparent 50%)",
      }} />

      <div className="relative" style={{ width: 360, maxWidth: "90vw" }}>
        {/* Candle */}
        <AnimatePresence>
          {!candleOut && (
            <motion.button
              key="candle"
              onClick={() => setCandleOut(true)}
              exit={{ opacity: 0, y: -20 }}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute left-1/2 -translate-x-1/2 -top-24 flex flex-col items-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="h-6 w-4 rounded-full"
                style={{ background: "radial-gradient(circle, #FFE9A8, #FF8A3D 70%, transparent)", filter: "blur(1px)" }}
              />
              <div className="h-12 w-2 mt-1" style={{ background: "linear-gradient(180deg, #FFC8DD, #FF5FA2)" }} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cake */}
        <div className="relative h-56 flex items-end justify-center">
          {/* Top tier */}
          <motion.div
            animate={cut ? { x: -40, rotate: -8 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute bottom-20 h-16 w-48 rounded-t-2xl"
            style={{
              background: "linear-gradient(180deg, #FFF7FB 0%, #FFE3EF 100%)",
              boxShadow: "0 10px 30px -10px rgba(255,95,162,0.5), inset 0 -4px 0 #F8D7E8",
            }}
          />
          {/* Drip */}
          <div className="absolute bottom-[88px] h-3 w-48" style={{
            background: "radial-gradient(circle at 20% 0, transparent 6px, var(--rose-pink) 6px) repeat-x",
            backgroundSize: "20px 12px",
          }} />
          {/* Bottom tier */}
          <motion.div
            animate={cut ? { x: 30, rotate: 6 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="absolute bottom-2 h-20 w-72 rounded-2xl"
            style={{
              background: "linear-gradient(180deg, #FFF7FB 0%, #FFD6E7 100%)",
              boxShadow: "0 16px 40px -10px rgba(255,95,162,0.4), inset 0 -6px 0 #F8D7E8",
            }}
          />
          {/* Plate */}
          <div className="absolute bottom-0 h-3 w-80 rounded-full" style={{ background: "rgba(0,0,0,0.4)", filter: "blur(6px)" }} />

          {/* Hearts on cake */}
          {[20, 50, 80].map((x) => (
            <div key={x} className="absolute bottom-7 text-rose-400" style={{ left: `${x}%`, fontSize: 14 }}>♥</div>
          ))}
        </div>

        {/* Knife (drag) */}
        {candleOut && !cut && (
          <motion.div
            drag="x"
            dragConstraints={{ left: -120, right: 120 }}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 60) setCut(true);
            }}
            whileDrag={{ scale: 1.05 }}
            className="absolute left-1/2 -translate-x-1/2 -top-2 cursor-grab active:cursor-grabbing select-none"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex flex-col items-center">
              <div className="h-1 w-36 rounded-full" style={{ background: "linear-gradient(90deg, #E8E8E8, #FFFFFF, #E8E8E8)", boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }} />
              <div className="h-6 w-3 mt-0.5 rounded-b" style={{ background: "#4A2C2A" }} />
            </div>
          </motion.div>
        )}

        {/* Cut sparkles */}
        <AnimatePresence>
          {cut && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-5xl">✨</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {cut && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            className="mt-12 btn-glow rounded-full px-7 py-3 font-script text-xl"
          >
            Reveal your gift →
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
