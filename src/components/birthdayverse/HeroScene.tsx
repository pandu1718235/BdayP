import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Balloons } from "./Balloons";
import { Sparkles } from "./Sparkles";
import profilePlaceholder from "@/assets/profile-placeholder.jpg";

interface HeroSceneProps {
  name?: string;
  date?: string;
  profileImage?: string;
  onStart: () => void;
}

export function HeroScene({
  name = "Your Name",
  date = "DD Month YYYY",
  profileImage = profilePlaceholder,
  onStart,
}: HeroSceneProps) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden grid-bg" style={{ backgroundColor: "var(--cocoa)" }}>
      <Sparkles count={50} />
      <Balloons count={10} drift={false} />

      {/* Buntings */}
      <Bunting className="left-0 top-6" />
      <Bunting className="right-0 top-6 scale-x-[-1]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-between px-6 md:px-14 py-20 flex-col md:flex-row gap-12">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative max-w-xl text-center md:text-left"
        >
          <div className="relative inline-block">
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95] text-cream text-glow-soft">
              Happy
            </h1>
            <PartyHat className="absolute -top-6 -right-8 md:-right-12" />
          </div>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.95] mt-1" style={{ color: "var(--rose-pink)" }}>
            Birthday
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-script text-xl"
            style={{ background: "var(--rose-pink)", color: "white" }}
          >
            <Star /> {date} <Star />
          </motion.div>

          <div className="mt-6">
            <motion.button
              onClick={onStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="btn-glow inline-flex items-center gap-2 rounded-full px-7 py-3 font-script text-xl"
            >
              Click here {name} <FiArrowRight />
            </motion.button>
          </div>
        </motion.div>

        {/* Right: profile + balloons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          <div className="relative">
            <div className="absolute -inset-6 rounded-full animate-spin-slow opacity-60"
              style={{ background: "conic-gradient(from 0deg, transparent, var(--rose-pink), transparent)" }} />
            <div className="relative h-72 w-72 md:h-96 md:w-96 rounded-full overflow-hidden ring-4 ring-rose-300/60 shadow-2xl">
              <img src={profileImage} alt={name} className="h-full w-full object-cover" />
            </div>

            {/* Floating balloon decorations */}
            <FloatBalloon className="-top-6 -left-10" color="#FF9EB5" />
            <FloatBalloon className="top-1/2 -right-12" color="#FFAFCC" delay={1.2} />

            {/* Name badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full px-7 py-2.5 font-script text-2xl flex items-center gap-2 whitespace-nowrap"
              style={{ background: "var(--rose-pink)", color: "white" }}
            >
              <span>♥</span> {name} <span>♥</span>
            </motion.div>

            {/* Stamp */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -right-16 -top-4 hidden md:flex h-24 w-24 rounded-full items-center justify-center text-center text-[10px] font-bold tracking-widest"
              style={{ background: "var(--soft-pink)", color: "var(--cocoa)" }}
            >
              HAPPY<br />BIRTHDAY
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Smiley */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-black text-white text-2xl"
      >
        ☺
      </motion.div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-script" style={{ color: "var(--rose-pink)" }}>
        BirthdayVerse · made with love
      </div>
    </section>
  );
}

function Star() {
  return <span className="text-xs">★</span>;
}

function Bunting({ className = "" }: { className?: string }) {
  return (
    <svg className={`absolute w-1/2 ${className}`} viewBox="0 0 600 80" fill="none">
      <path d="M0 10 Q 300 80 600 10" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
      {Array.from({ length: 10 }).map((_, i) => {
        const x = i * 60 + 20;
        const t = (x / 600);
        const y = 10 + Math.sin(t * Math.PI) * 60;
        const color = i % 2 === 0 ? "#FF9EB5" : "#F8D7E8";
        return (
          <polygon
            key={i}
            points={`${x},${y} ${x + 22},${y} ${x + 11},${y + 26}`}
            fill={color}
          />
        );
      })}
    </svg>
  );
}

function PartyHat({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "22px solid transparent",
          borderRight: "22px solid transparent",
          borderBottom: "48px solid var(--rose-pink)",
          transform: "rotate(18deg)",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
        }}
      />
      <div className="absolute top-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-white" />
    </div>
  );
}

function FloatBalloon({ className = "", color, delay = 0 }: { className?: string; color: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 5, repeat: Infinity, delay }}
    >
      <div className="relative" style={{ width: 60, height: 75 }}>
        <div
          className="rounded-full"
          style={{
            width: 60,
            height: 72,
            background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.6), ${color} 55%)`,
            boxShadow: `0 12px 24px -6px ${color}88`,
          }}
        />
        <div className="absolute left-1/2 top-[72px] w-px h-12" style={{ background: "rgba(255,255,255,0.4)" }} />
      </div>
    </motion.div>
  );
}
