import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import bgMemory from "@/assets/bg-memory.png";
import m1 from "@/assets/image.png";
import m2 from "@/assets/image copy.png";
import m3 from "@/assets/image copy 2.jpeg";
import m4 from "@/assets/image copy 3.png";
import m5 from "@/assets/image copy 4.png";
import m6 from "@/assets/image copy 5.png";
import m7 from "@/assets/memory-1.png";
import m8 from "@/assets/WhatsApp Image 2026-05-25 at 7.17.15 PM.jpeg";
import m9 from "@/assets/WhatsApp Image 2026-05-25 at 7.18.04 PM.jpeg";
import m10 from "@/assets/profile-custom.jpg";

const MEMORIES = [
  { src: m5 },
  { src: m2 },
  { src: m3 },
  { src: m4 },
  { src: m9 },
  { src: m6 },
  { src: m8 },
  { src: m7 },
  { src: m1 },
  { src: m10 },
];

export function MemoryScene({ onContinue }: { onContinue: () => void }) {
  const [viewedSlides, setViewedSlides] = useState<Set<number>>(new Set([0]));
  const allViewed = viewedSlides.size >= MEMORIES.length;

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
          modules={[Autoplay, EffectCoverflow, Navigation]}
          effect="coverflow"
          navigation
          centeredSlides
          slidesPerView="auto"
          loop
          autoplay={{ delay: 2400, disableOnInteraction: false }}
          coverflowEffect={{ rotate: 30, stretch: 0, depth: 140, modifier: 1, slideShadows: false }}
          onSlideChange={(swiper) => {
            setViewedSlides(prev => {
              if (prev.has(swiper.realIndex)) return prev;
              const next = new Set(prev);
              next.add(swiper.realIndex);
              return next;
            });
          }}
        >
          {MEMORIES.map((m, i) => (
            <SwiperSlide key={i} style={{ width: 260 }}>
              <Polaroid src={m.src} tilt={i % 2 === 0 ? -4 : 4} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: var(--rose-pink, #f43f5e) !important;
          background: rgba(255, 255, 255, 0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .swiper-button-next::after, .swiper-button-prev::after {
          font-size: 18px !important;
          font-weight: bold;
        }
      `}</style>

      <div className="mt-8 flex flex-col items-center gap-3">

        <motion.button
          whileHover={{ scale: allViewed ? 1.05 : 1 }}
          onClick={onContinue}
          disabled={!allViewed}
          className={`btn-glow rounded-full px-7 py-3 font-script text-xl transition-all duration-300 ${!allViewed ? "opacity-40 grayscale cursor-not-allowed" : ""
            }`}
        >
          Next Page →
        </motion.button>
      </div>
    </section>
  );
}

function Polaroid({ src, tilt }: { src: string; caption: string; tilt: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0 30px 60px -20px rgba(255,95,162,0.6)" }}
      style={{ rotate: tilt }}
      className="bg-cream/95 p-3 pb-10 rounded-sm shadow-xl"
    >
      <div className="w-full aspect-square overflow-hidden bg-black/10">
        <img src={src} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <p className="mt-3 text-center font-script text-lg text-cocoa" style={{ color: "var(--cocoa)" }}>

      </p>
    </motion.div>
  );
}
