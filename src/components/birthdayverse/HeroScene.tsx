import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Balloons } from "./Balloons";
import { Sparkles } from "./Sparkles";
import FloatingBalloons from "./FloatingBalloons";
import profilePlaceholder from "@/assets/profile-custom.jpg";
import bgR from "@/assets/r.jpg";
import hatImage from "@/assets/hat.png";

interface HeroSceneProps {
  name?: string;
  date?: string;
  profileImage?: string;
  onStart: () => void;
}

export function HeroScene({
  name = "Ammulu",
  date = "DD Month YYYY",
  profileImage = profilePlaceholder,
  onStart,
}: HeroSceneProps) {
  const [fireworks, setFireworks] = useState<{ id: string; x: number; y: number; color: string; particles: { dx: number; dy: number; color: string; size: number }[] }[]>([]);

  const spawnFirework = (x: number, y: number) => {
    const parentColors = ['#f43f5e', '#ec4899', '#a78bfa', '#3b82f6', '#10b981', '#f59e0b', '#f97316', '#00ffff', '#ffff00'];
    const mainColor = parentColors[Math.floor(Math.random() * parentColors.length)];

    const sparks = Array.from({ length: 45 }).map((_, i) => {
      const angle = (i * 360 / 45) * (Math.PI / 180) + Math.random() * 0.2;
      const speed = Math.random() * 130 + 40;
      return {
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.3 ? mainColor : parentColors[Math.floor(Math.random() * parentColors.length)],
      };
    });

    const newFirework = {
      id: Math.random().toString(),
      x, y, color: mainColor, particles: sparks
    };

    setFireworks(prev => [...prev, newFirework]);
    setTimeout(() => setFireworks(prev => prev.filter(f => f.id !== newFirework.id)), 2000);
  };

  useEffect(() => {
    setTimeout(() => spawnFirework(20, 30), 200);
    setTimeout(() => spawnFirework(80, 25), 600);
    setTimeout(() => spawnFirework(50, 20), 1000);
    setTimeout(() => spawnFirework(30, 40), 1400);
    setTimeout(() => spawnFirework(70, 35), 1800);

    const interval = setInterval(() => {
      const randomX = Math.random() * 80 + 10;
      const randomY = Math.random() * 45 + 10;
      spawnFirework(randomX, randomY);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, #ffe1e1, #ff217de0), url(${bgR})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent",
      }}
    >

      <FloatingBalloons count={12} />

      {/* BACKGROUND FIREWORK / CRACKER BLASTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[1]">
        <AnimatePresence>
          {fireworks.map((fw) => (
            <div
              key={fw.id}
              className="absolute w-8 h-8"
              style={{ left: `${fw.x}%`, top: `${fw.y}%` }}
            >
              {/* Rockets upward tail trail */}
              <motion.div
                initial={{ scaleY: 0, opacity: 1, y: 150 }}
                animate={{ scaleY: [1, 0], opacity: [1, 0], y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-0.5 h-16 bg-gradient-to-t from-transparent via-amber-200 to-white origin-bottom -translate-x-1/2 absolute bottom-0"
              />
              {/* Central Flash */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2.5, 0], opacity: [1, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute left-0 top-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full blur-md"
              />
              {/* Beautiful expanding circular sparks */}
              {fw.particles.map((spark, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: spark.dx,
                    y: spark.dy + 45, // gravity drift downward
                    scale: [0.8, 1.5, 0],
                    opacity: [1, 1, 0.3, 0]
                  }}
                  transition={{ duration: Math.random() * 0.6 + 1.0, ease: "easeOut" }}
                  className="absolute rounded-full shadow-[0_0_12px_currentColor]"
                  style={{
                    width: spark.size,
                    height: spark.size,
                    color: spark.color,
                    backgroundColor: spark.color,
                    x: '-50%',
                    y: '-50%'
                  }}
                />
              ))}
            </div>
          ))}
        </AnimatePresence>
      </div>
      {/* Buntings */}
      <Bunting className="left-0 top-6" />
      <Bunting className="right-0 top-6 scale-x-[-1]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 md:px-14 py-20 flex-col md:flex-row gap-16 md:gap-24">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative max-w-xl text-center md:text-left"
        >
          <div className="relative inline-block">
            <TypewriterText
              text="Wish you many more"
              className="font-display text-4xl md:text-6xl leading-[1.1] text-white text-glow-soft"
            />
            <motion.img
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: -18 }}
              transition={{ delay: 0.8, type: "spring" }}
              src={hatImage}
              alt="party hat"
              className="absolute -top-8 -right-6 md:-top-10 md:-right-12 w-20 md:w-28"
              style={{ zIndex: -1 }}
            />
          </div>
          <TypewriterText
            text="Happy returns of the day"
            delay={1.2}
            className="font-display text-4xl md:text-6xl leading-[1.1] mt-2"
            style={{ color: "var(--pink)" }}
          />
          <TypewriterText
            text={name}
            delay={2.6}
            className="font-display text-5xl md:text-7xl leading-[1.1] mt-2"
            style={{ color: "var(--heart)" }}
          />



          <div className="mt-6">
            <motion.button
              onClick={onStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="btn-glow inline-flex items-center gap-2 rounded-full px-7 py-3 font-script text-xl"
            >
              Click here  <FiArrowRight />
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
            <div className="absolute -inset-6 rounded-full animate-spin-slow"
              style={{ background: "conic-gradient(from 0deg, transparent, var(--rose-pink), transparent)", opacity: 0.12 }} />
            <div className="relative h-64 w-64 md:h-96 md:w-96 rounded-full overflow-hidden ring-4 ring-rose-300/60 shadow-2xl">
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
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-2 md:px-7 md:py-2.5 font-script text-xl md:text-2xl flex items-center gap-2 whitespace-nowrap"
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
    <svg className={`absolute w-[90vw] md:w-[45vw] opacity-90 ${className}`} viewBox="0 0 600 120" fill="none">
      <path d="M0 10 Q 300 100 600 10" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = i * 65 + 25;
        const t = (x / 600);
        const y = 10 + Math.sin(t * Math.PI) * 55;
        const color = i % 2 === 0 ? "#FF9EB5" : "#F8D7E8";
        return (
          <polygon
            key={i}
            points={`${x},${y} ${x + 36},${y} ${x + 18},${y + 42}`}
            fill={color}
          />
        );
      })}
    </svg>
  );
}

function FloatBalloon({ className = "", color, delay = 0 }: { className?: string; color: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
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

function TypewriterText({ text, delay = 0, className, style }: { text: string; delay?: number; className?: string; style?: React.CSSProperties }) {
  const characters = Array.from(text);

  return (
    <motion.h1
      className={className}
      style={style}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.1, delayChildren: delay }
        },
        hidden: {}
      }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
