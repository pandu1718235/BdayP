import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles, Plus, Trash2, Scissors } from 'lucide-react';
import bgCake from "@/assets/bg-cake.png";

interface Candle {
  id: string;
  x: number; // custom local percentage width on cake top
  y: number; // custom local percentage depth on cake top
  color: string;
  isLit: boolean;
}

interface CakeSceneProps {
  recipientName?: string;
  onComplete: () => void;
}

const CANDLE_COLORS = ['#fb7185', '#38bdf8', '#fbbf24', '#a78bfa', '#34d399'];

export function CakeScene({ recipientName = "Ammulu", onComplete }: CakeSceneProps) {
  const [candles, setCandles] = useState<Candle[]>([
    { id: '1', x: 50, y: 50, color: '#fb7185', isLit: false }, // center
    { id: '2', x: 30, y: 50, color: '#38bdf8', isLit: false }, // left
    { id: '3', x: 70, y: 50, color: '#fbbf24', isLit: false }, // right
    { id: '4', x: 50, y: 32, color: '#a78bfa', isLit: false }, // top
    { id: '5', x: 50, y: 68, color: '#34d399', isLit: false }, // bottom
  ]);
  const [flavor, setFlavor] = useState<'turquoise' | 'berry-pink' | 'vanilla-chocolate'>('berry-pink');
  const [cakeState, setCakeState] = useState<'place-candles' | 'lighting' | 'lit' | 'blown' | 'cutting' | 'sliced'>('place-candles');

  // Cut, slash and particle explosion states
  const [slashActive, setSlashActive] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  const [fireworks, setFireworks] = useState<{ id: string; x: number; y: number; color: string; particles: { dx: number; dy: number; color: string; size: number }[] }[]>([]);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  // Helper function to spawn a beautiful background firecracker blast
  const spawnFirework = (x: number, y: number) => {
    const parentColors = ['#f43f5e', '#ec4899', '#a78bfa', '#3b82f6', '#10b981', '#f59e0b', '#f97316', '#00ffff', '#ffff00'];
    const mainColor = parentColors[Math.floor(Math.random() * parentColors.length)];

    // Spawn 45 sparks for this firework
    const sparks = Array.from({ length: 45 }).map((_, i) => {
      const angle = (i * 360 / 45) * (Math.PI / 180) + Math.random() * 0.2;
      const speed = Math.random() * 130 + 40; // distance/radius of blast
      return {
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 1, // 1px to 3.5px
        color: Math.random() > 0.3 ? mainColor : parentColors[Math.floor(Math.random() * parentColors.length)],
      };
    });

    const newFirework = {
      id: Math.random().toString(),
      x,
      y,
      color: mainColor,
      particles: sparks
    };

    setFireworks(prev => [...prev, newFirework]);

    // Cleanup after 2 seconds
    setTimeout(() => {
      setFireworks(prev => prev.filter(f => f.id !== newFirework.id));
    }, 2000);
  };

  // Automatically trigger multiple recurring background crackers when sliced
  useEffect(() => {
    if (cakeState !== 'sliced') return;

    // Set up continuous light show in background
    const interval = setInterval(() => {
      const randomX = Math.random() * 80 + 10; // 10% to 90%
      const randomY = Math.random() * 45 + 10; // 10% to 55%
      spawnFirework(randomX, randomY);
    }, 500);

    return () => clearInterval(interval);
  }, [cakeState]);

  // Audio state
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Spawns a new candle on clicking the cake top surface
  const handleCakeTopClick = (e: MouseEvent<HTMLDivElement>) => {
    if (cakeState !== 'place-candles') return;

    // Get relative click coordinate on the cake top platter
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Filter valid oval space inside the platter ellipse (equation of ellipse)
    // Center is (50, 50). Semi-axes are a = 42, b = 25.
    const dx = x - 50;
    const dy = y - 50;
    if ((dx * dx) / (42 * 42) + (dy * dy) / (25 * 25) <= 1) {
      const newCandle: Candle = {
        id: Math.random().toString(),
        x,
        y,
        color: CANDLE_COLORS[Math.floor(Math.random() * CANDLE_COLORS.length)],
        isLit: false
      };
      setCandles(prev => [...prev, newCandle]);
    }
  };

  // Triggers the lighting ceremony instantly
  const startLightingCeremony = () => {
    setCandles(prev => prev.map(c => ({ ...c, isLit: true })));
    setCakeState('lit');
  };

  // Handle Blow Action (called either from mic or manual BLOW click)
  const handleBlowOut = () => {
    if (cakeState !== 'lit') return;
    setCandles(prev => prev.map(c => ({ ...c, isLit: false })));
    setCakeState('blown');
    disableMicrophone();
  };

  // Web Audio blow detection
  const enableMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsMicEnabled(true);
      detectBlow();
    } catch (err) {
      console.warn("Microphone access denied or error:", err);
      alert("Microphone denied. Don't worry, you can click the BLOW button manually!");
    }
  };

  const disableMicrophone = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsMicEnabled(false);
  };

  const detectBlow = () => {
    if (!analyserRef.current || cakeState !== 'lit') return;
    const array = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(array);

    // Average amplitude across spectrum
    const average = array.reduce((acc, val) => acc + val, 0) / array.length;

    if (average > 65) { // blow threshold (blowing creates broadband high amplitude)
      handleBlowOut();
      return;
    }
    animationFrameRef.current = requestAnimationFrame(detectBlow);
  };

  useEffect(() => {
    if (cakeState === 'lit' && isMicEnabled) {
      detectBlow();
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [cakeState, isMicEnabled]);

  // Clean-up mic on unmount
  useEffect(() => {
    return () => disableMicrophone();
  }, []);

  const clearCandles = () => {
    setCandles([]);
  };

  // Triggering the slice mechanics
  const handleKnifeSlice = () => {
    if (cakeState === 'sliced') return;
    setSlashActive(true);
    setCakeState('sliced');

    // Generating 48 festive particles exploding outwards
    const newParticles = Array.from({ length: 48 }).map((_, i) => {
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const intensity = Math.random() * 160 + 50;
      return {
        id: Math.random().toString(),
        x: Math.cos(angle) * intensity,
        y: Math.sin(angle) * intensity - 50, // elevate up
        color: ['#fb7185', '#38bdf8', '#fbbf24', '#a78bfa', '#34d399', '#f43f5e', '#ec4899'][Math.floor(Math.random() * 7)],
        scale: Math.random() * 0.7 + 0.4,
        rotation: Math.random() * 360,
      };
    });
    setParticles(newParticles);

    // Blast brilliant multi-color crackers in the background!
    setTimeout(() => spawnFirework(20, 25), 50);
    setTimeout(() => spawnFirework(50, 15), 250);
    setTimeout(() => spawnFirework(80, 20), 450);
    setTimeout(() => spawnFirework(35, 30), 650);
    setTimeout(() => spawnFirework(65, 35), 850);

    setTimeout(() => {
      setSlashActive(false);
    }, 900);
  };

  // Color mappings for cake toppings
  const cakeColors = {
    turquoise: {
      primary: '#06b6d4', // Cyan 500
      secondary: '#22d3ee', // Cyan 400
      drippings: '#ffffff', // icing white
      accent: '#ec4899', // strawberry pink accent
    },
    'berry-pink': {
      primary: '#db2777', // Rose/Pink
      secondary: '#f43f5e',
      drippings: '#fdf2f8',
      accent: '#eab308',
    },
    'vanilla-chocolate': {
      primary: '#78350f', // deep cocoa
      secondary: '#92400e',
      drippings: '#fffbeb',
      accent: '#ef4444',
    }
  };

  const currentTheme = cakeColors[flavor];

  // Helper function to build the visually complete layered cake
  const renderCakeContent = () => {
    return (
      <div className="relative w-full h-[220px] flex flex-col items-center justify-end select-none">

        {/* Top Layer & platter where candles exist */}
        <div className="relative w-64 md:w-72 h-32 flex items-center justify-center">

          {/* Ellipse top of the Cake */}
          <div
            onClick={handleCakeTopClick}
            className="absolute top-0 left-0 right-0 h-16 rounded-full cursor-crosshair z-20 group"
            style={{
              backgroundColor: currentTheme.secondary,
              border: '3px solid rgba(255,255,255,0.15)',
            }}
          >
            {/* Glow ring inside */}
            <div className="absolute inset-2 border border-white/10 rounded-full pointer-events-none" />

            {/* Sprinkles on selection screen */}
            {cakeState === 'place-candles' && (
              <div className="absolute inset-x-8 inset-y-2 text-[10px] text-white/40 select-none text-center pointer-events-none mt-1 animate-pulse">
                🍰 Click to plant candies / candles!
              </div>
            )}

            {/* PLANTED CANDLES */}
            {candles.map((candle) => (
              <motion.div
                key={candle.id}
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="absolute w-2 h-12 origin-bottom select-none -translate-x-1/2 -translate-y-full pointer-events-none"
                style={{
                  left: `${candle.x}%`,
                  top: `${candle.y}%`,
                }}
              >
                {/* Tiny metal holder */}
                <div className="w-1.5 h-1 bg-amber-600 rounded-sm absolute bottom-0 left-0" />

                {/* Candle Body Wax */}
                <div
                  className="w-1.5 h-8 rounded-t-sm relative shadow"
                  style={{ backgroundColor: candle.color }}
                >
                  {/* Spirals */}
                  <div className="absolute inset-x-0 top-2 h-0.5 bg-white/40 rotate-[15deg]" />
                  <div className="absolute inset-x-0 top-4 h-0.5 bg-white/40 rotate-[15deg]" />
                  <div className="absolute inset-x-0 top-6 h-0.5 bg-white/40 rotate-[15deg]" />
                </div>

                {/* FLAME WICK */}
                <div className="w-0.5 h-1.5 bg-neutral-600 mx-auto" />

                {/* THE CANDLE FLAME */}
                <AnimatePresence>
                  {candle.isLit && (
                    <motion.div
                      key="flame"
                      initial={{ opacity: 0, scale: 0.2 }}
                      animate={{
                        opacity: [0.85, 1, 0.85],
                        scale: [1, 1.05, 0.95, 1.05, 1],
                        y: [0, -1, 0, -1, 0],
                        skewX: [0, -2, 2, -1, 0],
                        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                      }}
                      exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                      className="absolute -top-5 left-1/2 -translateX-1/2 w-3.5 h-5 rounded-full z-30 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at bottom, #ff9800 0%, #ff5722 50%, #ffeb3b 95%)',
                        transformOrigin: 'bottom center',
                        boxShadow: '0 0 10px #ff9800, 0 0 20px #ff5722',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Layer 1 Vertical Frosting Sidewall */}
          <div
            className="absolute top-8 left-0 right-0 h-16 rounded-b-[40px] z-10 overflow-hidden shadow-lg"
            style={{ backgroundColor: currentTheme.primary }}
          >
            {/* Dripping Icing */}
            <svg className="absolute top-0 left-0 w-full h-12" viewBox="0 0 200 40" preserveAspectRatio="none" style={{ color: currentTheme.drippings }}>
              <path d="M0 0 L200 0 L200 15 Q180 25, 170 12 Q150 5, 140 18 Q120 30, 110 10 Q90 0, 80 16 Q60 35, 50 15 Q30 2, 20 20 Q10 28, 0 15 Z" fill="currentColor" />
            </svg>

            {/* Strawberry topping bits decoration */}
            <div className="absolute bottom-3 left-4 right-4 flex justify-around pointer-events-none">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-2 h-2 rounded-full shadow animate-pulse"
                  style={{ backgroundColor: currentTheme.accent }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Layer 2 (Larger tier) */}
        <div className="relative w-72 md:w-80 h-20 -mt-10 z-0">
          <div
            className="absolute top-0 left-0 right-0 h-16 rounded-full"
            style={{ backgroundColor: currentTheme.secondary }}
          />
          <div
            className="absolute top-8 left-0 right-0 h-16 rounded-b-[50px] overflow-hidden shadow-md"
            style={{ backgroundColor: currentTheme.primary }}
          >
            {/* Secondary drips */}
            <svg className="absolute top-0 left-0 w-full h-10" viewBox="0 0 200 40" preserveAspectRatio="none" style={{ color: currentTheme.drippings }}>
              <path d="M0 0 L200 0 L200 10 Q190 20, 180 10 Q160 5, 150 15 Q130 25, 120 8 Q100 0, 90 12 Q75 25, 65 10 Q45 2, 35 15 Q20 22, 0 10 Z" fill="currentColor" opacity="0.6" />
            </svg>

            {/* Little piped whipped cream stars */}
            <div className="absolute bottom-2 left-6 right-6 flex justify-between">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-3 h-2.5 rounded-full bg-white opacity-90 shadow-inner"
                  style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center select-none z-20"
      style={{
        backgroundColor: '#2a2426',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.8) translate(10, 10)' fill='%23fda4af' opacity='0.15'/%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.5) translate(100, 80)' fill='%23f472b6' opacity='0.1'/%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.6) translate(40, 120)' fill='%23f43f5e' opacity='0.15'/%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' transform='scale(0.7) translate(120, 20)' fill='%23fbcfe8' opacity='0.15'/%3E%3C/svg%3E")`
      }}
    >
      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4">

        {/* BACKGROUND FIREWORK / CRACKER BLASTS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
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

        {/* Dynamic Title Headers */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cakeState}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-center mb-6"
          >
            {cakeState === 'place-candles' && (
              <>
                <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-1">Make Your Birthday Cake! 🎂</h2>
                <p className="text-rose-200 text-xs md:text-sm font-mono leading-none">Click the top layer to plant candles, or change the frosting!</p>
              </>
            )}
            {cakeState === 'lighting' && (
              <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-amber-300">Matches Sparking... 🔥</h2>
            )}
            {cakeState === 'lit' && (
              <>
                <h2 className="text-3xl md:text-4xl font-sans font-black text-rose-300 animate-pulse">Happy Birthday to my girl Ammulu😘❤️!</h2>
                <p className="text-rose-200 text-xs md:text-sm font-mono mt-1 leading-none">Click the button below to blow them out!</p>
              </>
            )}
            {cakeState === 'blown' && (
              <>
                <h2 className="text-3xl md:text-4xl font-sans font-black text-amber-200">Cheers to you for your 18th bday🥳✨💫!</h2>
                <p className="text-rose-200 text-xs md:text-sm font-mono mt-1 leading-none">Perfect blowout! Now let's cut a delicious slice!</p>
              </>
            )}
            {cakeState === 'cutting' && (
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-rose-300">Slice Through the Cake 🔪</h2>
            )}
            {cakeState === 'sliced' && (
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-blue-500">Here's your sweet slice! 🍰🍰</h2>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Flavor Customizer Tabs (only in design phase) */}
        {cakeState === 'place-candles' && (
          <div className="flex flex-wrap justify-center gap-2 mb-8 bg-neutral-900/60 p-1.5 rounded-2xl border border-white/10 shadow-lg relative pointer-events-auto max-w-[90vw]">
            {(['turquoise', 'berry-pink', 'vanilla-chocolate'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFlavor(opt)}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold capitalize transition-all ${flavor === opt
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
                  }`}
              >
                {opt.replace('-', ' ')}
              </button>
            ))}
          </div>
        )}

        {/* STARRING THE MAIN CAKE STAGE DISPLAY */}
        <div className="relative w-full max-w-[440px] aspect-[4/3] flex items-center justify-center p-4">

          {/* Sparkles Floating Background */}
          {cakeState === 'lit' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-amber-300 py-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5],
                    y: [-20, -100]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.4
                  }}
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${40 + Math.random() * 40}%`,
                  }}
                >
                  ★
                </motion.div>
              ))}
            </div>
          )}

          {/* THREE LAYER DYNAMIC SVG CAKE WITH DRAG AREA AND ACTIVE PARTICLES */}
          <div ref={dragAreaRef} className="relative w-full h-full flex flex-col justify-end pointer-events-auto select-none overflow-visible">

            {/* THE ELLIPSE PLATES / STANDS */}
            <div className="absolute bottom-8 left-12 right-12 h-14 bg-neutral-800/40 rounded-full border border-neutral-700/30 shadow-2xl z-0 transform translate-y-2 pointer-events-none" />

            {/* Slices representation when sliced */}
            {cakeState === 'sliced' ? (
              <div className="absolute inset-0 z-10 w-full h-[220px] self-end relative">

                {/* Slice 1: Left */}
                <motion.div
                  initial={{ x: 0, y: 0, rotate: 0 }}
                  animate={{ x: -45, y: 18, rotate: -7 }}
                  transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                  style={{ clipPath: 'polygon(50% 41%, 0% 12%, 0% 100%, 50% 100%)' }}
                  className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end pointer-events-none"
                >
                  {renderCakeContent()}
                </motion.div>

                {/* Slice 2: Right */}
                <motion.div
                  initial={{ x: 0, y: 0, rotate: 0 }}
                  animate={{ x: 45, y: 18, rotate: 7 }}
                  transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                  style={{ clipPath: 'polygon(50% 41%, 100% 12%, 100% 100%, 50% 100%)' }}
                  className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end pointer-events-none"
                >
                  {renderCakeContent()}
                </motion.div>

                {/* Slice 3: Back */}
                <motion.div
                  initial={{ x: 0, y: 0, rotate: 0 }}
                  animate={{ x: 0, y: -26, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                  style={{ clipPath: 'polygon(50% 41%, 0% 12%, 0% 0%, 100% 0%, 100% 12%)' }}
                  className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end pointer-events-none"
                >
                  {renderCakeContent()}
                </motion.div>
              </div>
            ) : (
              <div className="relative w-full flex flex-col items-center justify-end z-10">
                {renderCakeContent()}
              </div>
            )}

            {/* EXPLODING FEAST PARTICLES */}
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: -70, scale: 0, rotate: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    scale: p.scale,
                    rotate: p.rotation,
                    opacity: [1, 1, 0.4, 0]
                  }}
                  transition={{ duration: 1.3, ease: "easeOut" }}
                  className="absolute left-1/2 bottom-24 w-3 h-3 rounded-sm z-40 pointer-events-none"
                  style={{ backgroundColor: p.color, x: '-50%' }}
                />
              ))}
            </AnimatePresence>

            {/* BRIGHT NEON SLASH VISUAL FLASH */}
            <AnimatePresence>
              {slashActive && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.1, rotate: -25 }}
                  animate={{ opacity: [0, 1, 1, 0], scaleY: [0.1, 1, 1, 0.1] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 m-auto w-1 ml-[50%] h-[300px] bg-white shadow-[0_0_15px_#fff,0_0_25px_#fb7185] z-50 pointer-events-none origin-center"
                />
              )}

              {slashActive && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.1, rotate: 35 }}
                  animate={{ opacity: [0, 1, 1, 0], scaleY: [0.1, 1, 1, 0.1] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                  className="absolute inset-0 m-auto w-1 ml-[50%] h-[300px] bg-white shadow-[0_0_15px_#fff,0_0_25px_#fbbf24] z-50 pointer-events-none origin-center"
                />
              )}
            </AnimatePresence>

            {/* INTERACTIVE DRAGGABLE KNIFE */}
            {cakeState === 'cutting' && (
              <motion.div
                drag
                dragConstraints={dragAreaRef}
                dragElastic={0.2}
                onDrag={(event, info) => {
                  // If they drag knife over a distance of 65px, trigger the slice!
                  const dist = Math.sqrt(info.offset.x * info.offset.x + info.offset.y * info.offset.y);
                  if (dist > 65) {
                    handleKnifeSlice();
                  }
                }}
                onDragEnd={(event, info) => {
                  // Trigger slice instantly if they drag knife noticeably on drag release
                  if (Math.abs(info.offset.y) > 40 || Math.abs(info.offset.x) > 40) {
                    handleKnifeSlice();
                  }
                }}
                whileDrag={{ scale: 1.15, rotate: -10 }}
                className="absolute left-[45%] top-[10%] z-50 cursor-grab active:cursor-grabbing flex flex-col items-center pointer-events-auto select-none"
              >
                {/* Little Floating Helper instruction tag */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                  className="absolute -top-12 text-[10px] bg-rose-500 text-white font-black px-2 py-1 rounded-lg shadow-md border border-rose-400/30 whitespace-nowrap tracking-wider font-mono select-none"
                >
                  🫵 DRAG ME DOWN TO CUT!
                </motion.div>

                {/* Stylized shiny knife vector */}
                <div className="w-14 h-36 origin-bottom rotate-[15deg] filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] pointer-events-none">
                  <svg viewBox="0 0 40 120" className="w-full h-full">
                    {/* Steel blade with bevel */}
                    <path d="M15 10 C15 10, 26 40, 26 80 L14 80 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    <path d="M14 10 L14 80" stroke="#ffffff" strokeWidth="1.5" />
                    {/* Knife Brass Guard */}
                    <rect x="10" y="80" width="20" height="6" rx="2" fill="#eab308" />
                    {/* Rose handle */}
                    <rect x="13" y="86" width="14" height="28" rx="4" fill="#fb7185" />
                    {/* Rivets */}
                    <circle cx="20" cy="94" r="1.5" fill="#f1f5f9" />
                    <circle cx="20" cy="104" r="1.5" fill="#f1f5f9" />
                  </svg>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* CORE CONTROL ACTIONS FOOTER SHELF */}
        <div className="w-full flex flex-col items-center justify-center gap-4 mt-6 z-30 pointer-events-auto">
          <div className="flex flex-wrap items-center justify-center gap-4">

            {cakeState === 'place-candles' && (
              <>
                {candles.length > 0 && (
                  <button
                    onClick={clearCandles}
                    className="flex items-center gap-2 px-6 py-2.5 bg-stone-800 hover:bg-stone-700 hover:text-white text-stone-300 font-sans font-semibold rounded-2xl border border-stone-700 transition-colors shadow-md text-sm"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>Clear Candles</span>
                  </button>
                )}
                <button
                  onClick={startLightingCeremony}
                  disabled={candles.length === 0}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-sans font-bold rounded-2xl shadow-lg hover:shadow-orange-500/20 shadow-inner transition-all text-sm animate-bounce"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Light the Candles! 🕯️</span>
                </button>
              </>
            )}

            {cakeState === 'lit' && (
              <>


                <button
                  onClick={handleBlowOut}
                  className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-sans font-black rounded-2xl shadow-xl hover:shadow-rose-500/30 transition-all text-base border-b-4 border-rose-700 uppercase tracking-widest"
                >
                  🌬️ Click to BLOW Out!
                </button>
              </>
            )}

            {cakeState === 'blown' && (
              <button
                onClick={() => setCakeState('cutting')}
                className="px-10 py-3.5 bg-blue-400 hover:bg-blue-500 text-white font-sans font-bold rounded-2xl shadow-lg border-b-4 border-blue-700 text-sm flex items-center gap-2"
              >
                <Scissors className="w-4 h-4 rotate-90" />
                <span>Click to Cut the Cake! 🍰</span>
              </button>
            )}

            {cakeState === 'cutting' && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-rose-200 font-mono tracking-wider mb-1 animate-pulse">
                  👇 Or click below if you want to skip drag!
                </span>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={handleKnifeSlice}
                  className="relative px-12 py-5 bg-amber-100 hover:brightness-105 border-4 border-dashed border-amber-400/60 rounded-3xl flex items-center justify-center cursor-pointer select-none group shadow"
                >
                  <span className="text-stone-800 text-base font-sans font-extrabold flex items-center gap-2">
                    🔪 Squeeze to Slice Here! 🍰
                  </span>
                </motion.div>
              </div>
            )}
          </div>

          {/* COMPLETED SUCCESS TRANSITION STAGE BUTTON */}
          {cakeState === 'sliced' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="mt-4 px-10 py-4.5 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-sans font-extrabold rounded-2xl shadow-2xl shadow-blue-500/30 text-base animate-pulse hover:brightness-105 flex items-center gap-2"
            >
              <span>Make a wish ✉️</span>
              <Sparkles className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
