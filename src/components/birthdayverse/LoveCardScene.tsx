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
  name = "Prani",
  message = "Nee gurunchi rayali ante chala undhi kani ippudu kastam but nuvvu chala manchi pillavai evarni emi anav,cuteeuu,sweetuu, brave ,loyal , super character , full energy ,andhariki help chesthav , kani konchem emotional ani naaku anipichindhi but eppudu happy ga undu ,neetho matladadam naaku oka varam eppudu anthe matladuthuu undu😁, malli kaludham ani waitinggg ,ikkada varake pattindhi sooo antheee inka unnai le but tarvatha cheptha le  . 💕",
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
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 md:px-6 py-20"
      style={{
        backgroundColor: '#1a1516',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.8) translate(10, 10)' fill='%2338272b' opacity='0.5'/%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.5) translate(100, 80)' fill='%2338272b' opacity='0.5'/%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.6) translate(40, 120)' fill='%2338272b' opacity='0.5'/%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.7) translate(120, 20)' fill='%2338272b' opacity='0.5'/%3E%3C/svg%3E")`
      }}>

      <ReactConfetti
        width={size.w}
        height={size.h}
        numberOfPieces={80}
        recycle={false}
        colors={["#fbcfe8", "#f9a8d4", "#f472b6", "#e879f9", "#38bdf8", "#fde047"]}
      />
      <FloatingHearts count={15} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative max-w-3xl w-full rounded-md overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "#ffffff", // Pure white notebook paper
          backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e0f2fe 31px, #e0f2fe 32px)", // Light blue ruled lines
          backgroundPosition: "0 32px",
          color: "#334155" // Dark slate pen color
        }}
      >
        {/* Notebook Margins */}
        <div className="absolute top-0 bottom-0 left-8 md:left-12 w-px bg-red-400 opacity-60" />
        <div className="absolute top-0 bottom-0 left-[36px] md:left-[52px] w-px bg-red-400 opacity-30" />

        <div className="pt-8 pb-8 pr-4 pl-12 md:pt-12 md:pb-12 md:pr-12 md:pl-20 relative z-10">

          {/* Title like reference */}
          <div className="mb-4 md:mb-6 rotate-[-2deg] flex justify-center">
            <h3 className="font-script text-3xl md:text-6xl text-center text-pink-500 font-bold uppercase tracking-wider leading-relaxed" style={{ textShadow: "2px 2px 0px #fbcfe8" }}>
              To Prani <span className="text-yellow-400 text-2xl md:text-5xl inline-block rotate-12" style={{ textShadow: "none" }}>★</span>
            </h3>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
            {/* Bunny GIF */}
            <div className="flex justify-center w-full md:w-1/3 shrink-0 relative z-20">
              <div className="absolute -inset-4 bg-yellow-100 rounded-full blur-xl opacity-50 -z-10"></div>
              <BunnyGif />
            </div>

            <div className="md:w-2/3">
              <p className="font-script text-2xl md:text-3xl leading-[32px] text-slate-700 whitespace-pre-line">
                {message}
              </p>
            </div>
          </div>

          {/* Doodles (absolute inside card) */}
          <svg className="absolute top-6 right-6 md:top-8 md:right-12 w-10 h-10 text-yellow-400 -rotate-12 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute bottom-24 right-10 md:bottom-16 md:right-12 w-8 h-8 text-blue-400 rotate-12 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>

          <div className="absolute top-16 md:top-24 left-1/2 md:left-2/3 text-xl md:text-2xl text-pink-300 font-script rotate-12 opacity-80 pointer-events-none">
            xoxo
          </div>
          <div className="absolute bottom-4 left-6 md:bottom-10 md:left-24 text-xl md:text-3xl text-zinc-400 font-script -rotate-12 opacity-80 pointer-events-none">
            Your's Best boy ♥
          </div>

          <div className="mt-8 md:mt-12 flex justify-end md:justify-center pr-4 md:pr-0">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="bg-pink-400 hover:bg-pink-500 text-white shadow-lg rounded-lg px-8 py-3 font-script text-xl md:text-2xl border-2 border-pink-500 border-dashed transition-colors max-w-sm text-center"
            >
              Next💝
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function BunnyGif() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tenor.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-[200px]">
      <div
        className="tenor-gif-embed"
        data-postid="8725168587126957863"
        data-share-method="host"
        data-aspect-ratio="1.32515"
        data-width="100%"
      >
        <a href="https://tenor.com/view/bunny-love-gif-8725168587126957863">Bunny Love Sticker</a>
        from <a href="https://tenor.com/search/bunny-stickers">Bunny Stickers</a>
      </div>
    </div>
  );
}
