import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { saveWish } from "@/api/wishApi";
import { Sparkles, Send } from "lucide-react";

interface WishSceneProps {
  onComplete: () => void;
}

export function WishScene({ onComplete }: WishSceneProps) {
  const [wish, setWish] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(true);

  const handleSubmit = async () => {
    if (!wish.trim()) {
      setError("you should fill to go to next page");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      await saveWish({ data: wish } as any);
    } catch (e) {
      console.error("Failed to save wish", e);
    }

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden text-pink-900 font-sans z-20"
      style={{
        backgroundColor: '#ffb6c1',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.8) translate(10, 10)' fill='%23f472b6' opacity='0.5'/%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.5) translate(100, 80)' fill='%23f472b6' opacity='0.4'/%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.6) translate(40, 120)' fill='%23f43f5e' opacity='0.3'/%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.7) translate(120, 20)' fill='%23fbcfe8' opacity='0.6'/%3E%3C/svg%3E")`
      }}
    >

      <AnimatePresence mode="wait">
        {showPrivacyPopup ? (
          <motion.div
            key="privacy-popup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            className="relative mx-4 max-w-sm w-full bg-white/90 backdrop-blur-md border border-pink-200 p-8 rounded-3xl shadow-2xl z-30 flex flex-col items-center text-center"
          >

            <h2 className="font-sans font-bold text-2xl text-pink-600 mb-2">Secret Space</h2>
            <p className="font-sans text-pink-500 mb-6 font-medium leading-relaxed">
              Your wish is completely anonymous.<br />No one can read it
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPrivacyPopup(false)}
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-all"
            >
              Okay, I understand
            </motion.button>
          </motion.div>
        ) : !submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            className="relative mx-4 max-w-lg w-full bg-white/40 backdrop-blur-md border border-white/40 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] z-10 flex flex-col items-center"
          >
            <Sparkles className="w-12 h-12 text-white mb-4 animate-pulse" />
            <h2 className="font-script text-3xl md:text-5xl text-white mb-2 text-center drop-shadow-sm leading-tight">
              Make a Wish...
            </h2>
            {/* <p className="font-script text-2xl text-white mb-6 text-center">
              hope it reaches GOD
            </p> */}

            <p className="text-pink-800 text-center mb-6 font-medium">
              Close your eyes, think of something special, and type it below. It's completely anonymous!
            </p>

            <textarea
              className="w-full bg-white/60 border border-pink-300 rounded-2xl p-4 text-pink-900 placeholder:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none h-32 mb-2 transition-all shadow-inner"
              placeholder="I wish for..."
              value={wish}
              onChange={(e) => setWish(e.target.value)}
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-sm mb-4 font-bold text-center bg-white/60 py-1 px-3 rounded-full"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: (!isSubmitting && wish.trim()) ? 1.05 : 1 }}
              whileTap={{ scale: (!isSubmitting && wish.trim()) ? 0.95 : 1 }}
              onClick={handleSubmit}
              disabled={isSubmitting || !wish.trim()}
              className="w-full mt-4 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-4 px-2 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm md:text-base leading-tight text-center">{isSubmitting ? "Sending..." : "Nee gurinchi rayamani adigav ga adhi choodali ante neeku istamaindhi jaraagali ani koruko"}</span>
              {!isSubmitting && <Send className="w-5 h-5 flex-shrink-0" />}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center max-w-md z-10"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-20 h-20 text-pink-500 mb-6 drop-shadow-md" />
            </motion.div>
            <h2 className="font-script text-4xl md:text-5xl text-pink-600 mb-4 drop-shadow-sm leading-relaxed">
              It reaches God.<br />Your wishes may come true ✨
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
