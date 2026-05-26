import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, FloatingHearts } from "./Sparkles";
import { Send } from "lucide-react";
import { saveFeedback } from "@/api/feedbackApi";

export function EndingScene({ onRestart }: { onRestart: () => void }) {
  const [step, setStep] = useState(0);
  const [experienceText, setExperienceText] = useState("");
  const [aboutMeText, setAboutMeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    if (step === 0) {
      if (!aboutMeText.trim()) {
        setError("you should fill to go to next page");
        return;
      }
      setError("");
      setIsSubmitting(true);

      try {
        await saveFeedback({
          data: {
            experience: "",
            aboutMe: aboutMeText
          }
        } as any);
      } catch (e) {
        console.error("Failed to save feedback", e);
      }

      setIsSubmitting(false);
      setStep(1);
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-4 md:px-6 text-center"
      style={{ background: "radial-gradient(ellipse at center, oklch(0.3 0.05 350) 0%, oklch(0.14 0.02 30) 80%)" }}>
      <Sparkles count={80} />
      <FloatingHearts count={20} />

      <AnimatePresence mode="wait">


        {step === 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            className="relative z-10 max-w-lg w-full bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center"
          >
            <h2 className="font-script text-3xl md:text-4xl text-rose-300 mb-6 text-center drop-shadow-lg leading-relaxed">
              Ippudu mooskoni naa gurunchi kuda raayi
            </h2>
            <h6 className="font-script text-2xl md:text-2xl text-rose-300 mb-2 text-center drop-shadow-lg leading-relaxed">
              lekapothe  next page lo unna pedha suprise miss avthav
            </h6>
            <textarea
              className="w-full bg-black/20 border border-rose-300/30 rounded-2xl p-4 text-white placeholder:text-rose-200/40 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none h-32 mb-2 transition-all"
              placeholder="Write about me..."
              value={aboutMeText}
              onChange={(e) => setAboutMeText(e.target.value)}
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-sm mb-4 font-semibold text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: (!isSubmitting && aboutMeText.trim()) ? 1.05 : 1 }}
              whileTap={{ scale: (!isSubmitting && aboutMeText.trim()) ? 0.95 : 1 }}
              onClick={handleNext}
              disabled={isSubmitting || !aboutMeText.trim()}
              className="w-full mt-4 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? "Sending..." : "Send"}</span>
              {!isSubmitting && <Send className="w-5 h-5 flex-shrink-0" />}
            </motion.button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="relative z-10 w-full px-4"
          >
            <div className="text-6xl mb-6">🌸</div>
            <h2 className="font-display text-4xl md:text-7xl text-glow-rose mb-6" style={{ color: "var(--rose-pink)" }}>
              Thank you for existing
            </h2>
            <p className="font-sans font-semibold text-lg md:text-2xl max-w-2xl mx-auto opacity-90 text-rose-100 tracking-wide">
              Surprise ledhu le bokka ledhu peehhh!!
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
        )}
      </AnimatePresence>
    </section>
  );
}
