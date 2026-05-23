import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import bgMemory from "@/assets/bg-memory.png";
import m1 from "@/assets/memory-1.jpg";
import m2 from "@/assets/memory-2.jpg";
import m3 from "@/assets/memory-3.jpg";
import m4 from "@/assets/memory-4.jpg";
import m5 from "@/assets/memory-5.jpg";
import m6 from "@/assets/memory-6.jpg";

const MEMORIES = [
  { src: m1, caption: "Sunny afternoons together" },
  { src: m2, caption: "Sweet little celebrations" },
  { src: m3, caption: "Dreams that floated higher" },
  { src: m4, caption: "Walks beneath the blossoms" },
  { src: m5, caption: "Quiet nights, glowing hearts" },
  { src: m6, caption: "Words I couldn't say out loud" },
];

export function MemoryScene({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden py-16 px-4 flex flex-col items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(74,44,42,0.92), rgba(74,44,42,0.92)), url(${bgMemory})`,
        backgroundSize: "cover",
      }}>

      {/* Hanging letters */}
      <div className="flex justify-center gap-3 md:gap-5 mb-6">
        {"HAPPY".split("").map((c, i) => (
          <motion.div
            key={i}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <div className="w-px h-8 mx-auto" style={{ background: "rgba(255,255,255,0.4)" }} />
            <motion.div
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white font-serif text-xl bg-black rounded-sm shadow-lg"
            >
              {c}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-script text-4xl md:text-5xl mb-2"
        style={{ color: "var(--soft-pink)" }}
      >
        birthday
      </motion.h2>
      <div className="w-40 border-b border-dashed mb-12" style={{ borderColor: "var(--soft-pink)" }} />

      <div className="w-full max-w-5xl">
        <Swiper
          modules={[Autoplay, EffectCoverflow]}
          effect="coverflow"
          centeredSlides
          slidesPerView="auto"
          loop
          autoplay={{ delay: 2400, disableOnInteraction: false }}
          coverflowEffect={{ rotate: 30, stretch: 0, depth: 140, modifier: 1, slideShadows: false }}
        >
          {MEMORIES.map((m, i) => (
            <SwiperSlide key={i} style={{ width: 260 }}>
              <Polaroid src={m.src} caption={m.caption} tilt={i % 2 === 0 ? -4 : 4} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={onContinue}
        className="mt-12 btn-glow rounded-full px-7 py-3 font-script text-xl"
      >
        One last thing →
      </motion.button>
    </section>
  );
}

function Polaroid({ src, caption, tilt }: { src: string; caption: string; tilt: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0 30px 60px -20px rgba(255,95,162,0.6)" }}
      style={{ rotate: tilt }}
      className="bg-cream/95 p-3 pb-10 rounded-sm shadow-xl"
    >
      <div className="w-full aspect-square overflow-hidden bg-black/10">
        <img src={src} alt={caption} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <p className="mt-3 text-center font-script text-lg text-cocoa" style={{ color: "var(--cocoa)" }}>
        {caption}
      </p>
    </motion.div>
  );
}
