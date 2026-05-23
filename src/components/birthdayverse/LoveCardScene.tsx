import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { FloatingHearts } from "./Sparkles";

interface LoveCardSceneProps {
  name?: string;
  message?: string;
  onContinue: () => void;
}

export function LoveCardScene({
  name = "Your Name",
  message = "My love. You are a very special person. I always silently thank you for coming into my life. Today, I wish you all the best, lots of health, and lots of joy. I always hope we will celebrate many more birthdays like this together. Happy birthday to you. 💕",
  onContinue,
}: LoveCardSceneProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const set = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6 py-20"
      style={{ background: "linear-gradient(180deg, oklch(0.22 0.03 30), oklch(0.16 0.02 30))" }}>
      <ReactConfetti
        width={size.w}
        height={size.h}
        numberOfPieces={120}
        recycle={false}
        colors={["#FF9EB5", "#F8D7E8", "#FF5FA2", "#FFF7FB", "#FFAFCC"]}
      />
      <FloatingHearts count={12} />

      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative max-w-3xl w-full rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.24 0.04 30), oklch(0.18 0.03 30))",
          border: "1px solid color-mix(in oklab, var(--rose-pink) 30%, transparent)",
          boxShadow: "0 30px 80px -20px rgba(255,95,162,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
        }}
      >
        <div className="p-8 md:p-12">
          <h3 className="font-script text-4xl text-center mb-2" style={{ color: "var(--cream)" }}>
            To {name} <span style={{ color: "var(--heart)" }}>❤</span>
          </h3>
          <div className="mx-auto w-24 h-px my-6" style={{ background: "var(--rose-pink)" }} />

          <div className="grid md:grid-cols-[1fr_2px_1.4fr] gap-8 items-center">
            {/* Bunny */}
            <div className="flex justify-center">
              <Bunny />
            </div>
            <div className="hidden md:block w-px h-48" style={{ background: "color-mix(in oklab, var(--rose-pink) 40%, transparent)" }} />
            <p className="font-script text-xl md:text-2xl leading-relaxed text-cream/90">
              {message}
            </p>
          </div>

          {/* Small hearts */}
          <div className="absolute top-6 right-8 text-2xl animate-float-y" style={{ color: "var(--heart)" }}>♥</div>
          <div className="absolute bottom-6 left-8 text-xl animate-float-y" style={{ color: "var(--soft-pink)", animationDelay: "1.2s" }}>♥</div>

          <div className="mt-10 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onContinue}
              className="btn-glow rounded-full px-7 py-3 font-script text-xl"
            >
              Our memories →
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Bunny() {
  return (
    <div className="relative w-40 h-44">
      {/* Ears */}
      <div className="absolute left-6 top-0 w-5 h-16 rounded-full" style={{ background: "white" }}>
        <div className="absolute inset-x-1 top-2 bottom-2 rounded-full" style={{ background: "#FFD0DE" }} />
      </div>
      <div className="absolute right-6 top-0 w-5 h-16 rounded-full" style={{ background: "white" }}>
        <div className="absolute inset-x-1 top-2 bottom-2 rounded-full" style={{ background: "#FFD0DE" }} />
      </div>
      {/* Head */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 w-28 h-28 rounded-full" style={{ background: "white", boxShadow: "0 8px 20px -4px rgba(0,0,0,0.4)" }}>
        {/* eyes */}
        <div className="absolute left-6 top-12 w-2 h-2 rounded-full bg-black" />
        <div className="absolute right-6 top-12 w-2 h-2 rounded-full bg-black" />
        {/* cheeks */}
        <div className="absolute left-3 top-16 w-4 h-3 rounded-full" style={{ background: "#FFB5C8", filter: "blur(1px)" }} />
        <div className="absolute right-3 top-16 w-4 h-3 rounded-full" style={{ background: "#FFB5C8", filter: "blur(1px)" }} />
      </div>
      {/* Heart */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 text-4xl"
        style={{ color: "var(--rose-pink)" }}
      >
        ♥
      </motion.div>
    </div>
  );
}
