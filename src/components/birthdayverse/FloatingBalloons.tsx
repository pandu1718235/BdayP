import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Balloon {
  id: string;
  x: number;
  delay: number;
  scale: number;
  color: string;
}

const BALLOON_COLORS = [
  { bg: 'bg-gradient-to-b from-rose-300 via-rose-400 to-rose-500', hex: '#f43f5e' },
  { bg: 'bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500', hex: '#f472b6' },
  { bg: 'bg-gradient-to-b from-fuchsia-300 via-fuchsia-400 to-fuchsia-500', hex: '#f0abfc' },
  { bg: 'bg-gradient-to-b from-violet-300 via-violet-400 to-violet-500', hex: '#c4b5fd' },
  { bg: 'bg-gradient-to-b from-cyan-300 via-cyan-400 to-cyan-500', hex: '#06b6d4' },
  { bg: 'bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400', hex: '#e9bc2a' },
];

interface FloatingBalloonsProps {
  count?: number;
}

export default function FloatingBalloons({ count = 15 }: FloatingBalloonsProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    // Generate initial set of balloons
    const initialBalloons = Array.from({ length: count }).map((_, i) => ({
      id: Math.random().toString(),
      x: Math.random() * 90 + 5,
      delay: Math.random() * 8,
      scale: Math.random() * 0.4 + 0.8,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)].hex
    }));
    setBalloons(initialBalloons);
  }, []);

  const popBalloon = (id: string) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    setTimeout(() => {
      setBalloons(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          x: Math.random() * 90 + 5,
          delay: 0,
          scale: Math.random() * 0.4 + 0.8,
          color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)].hex
        }
      ]);
    }, 1200);
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <AnimatePresence>
        {balloons.map((balloon) => (
          <motion.div
            key={balloon.id}
            initial={{ y: '110vh', x: `${balloon.x}vw`, rotate: 0 }}
            animate={{
              y: '-20vh',
              x: [
                `${balloon.x}vw`,
                `${balloon.x + (Math.random() * 6 - 3)}vw`,
                `${balloon.x + (Math.random() * 8 - 4)}vw`,
                `${balloon.x}vw`
              ],
              rotate: [0, -10, 10, 0]
            }}
            exit={{ 
              scale: [balloon.scale, balloon.scale * 1.5, 0], 
              opacity: [1, 0.8, 0],
              transition: { duration: 0.25 }
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              delay: balloon.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ scale: balloon.scale }}
            className="absolute cursor-pointer pointer-events-auto select-none group"
            onClick={() => popBalloon(balloon.id)}
          >
            {/* Balloon Body */}
            <div className="relative" style={{ width: 60, height: 75 }}>
              <div 
                className="w-14 h-18 md:w-16 md:h-20 rounded-full relative shadow-md group-hover:brightness-105 transition-all"
                style={{
                  width: 60,
                  height: 72,
                  background: `radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.8), ${balloon.color} 50%, ${balloon.color}dd 85%)`,
                  boxShadow: `
                    0 18px 35px -10px ${balloon.color}cc,
                    inset -8px -12px 20px rgba(0, 0, 0, 0.25),
                    inset 6px 8px 15px rgba(255, 255, 255, 0.3)
                  `,
                }}
              >
                {/* Highlight flare */}
                <div className="absolute top-2 left-3 w-4 h-6 bg-white/30 rounded-full rotate-12 blur-[0.5px]" />
              </div>
              
              {/* String */}
              <svg className="absolute bottom-[-42px] left-1/2 -translateX-1/2 w-4 h-11" viewBox="0 0 10 40" fill="none">
                <path d="M5 0 C2 10, 8 20, 5 30 C3 35, 7 38, 5 40" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>

              {/* Tie knot */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 rounded-full" 
                style={{ 
                  top: "84px", 
                  width: 8, 
                  height: 8, 
                  background: balloon.color,
                  boxShadow: `0 2px 4px rgba(0,0,0,0.2)`
                }} 
              />

              {/* Pop prompt overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] bg-black/60 text-white font-mono px-1 rounded-sm">pop</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
