import { motion } from "framer-motion";

const PALETTE = ["#FF9EB5", "#F8D7E8", "#FF5FA2", "#FFC8DD", "#FFAFCC"];

interface BalloonsProps {
  count?: number;
  drift?: boolean;
}

export function Balloons({ count = 14, drift = true }: BalloonsProps) {
  const balloons = Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 95,
    delay: Math.random() * 6,
    duration: 14 + Math.random() * 10,
    size: 38 + Math.random() * 38,
    color: PALETTE[i % PALETTE.length],
    sway: 18 + Math.random() * 22,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{ left: `${b.left}%`, bottom: drift ? `-${b.size * 2}px` : "auto", top: drift ? "auto" : `${b.left}%` }}
          initial={drift ? { y: 0 } : { y: 0 }}
          animate={drift ? { y: `-120vh`, x: [0, b.sway, -b.sway, 0] } : { y: [0, -14, 0], x: [0, 6, -6, 0] }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
            x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Balloon size={b.size} color={b.color} />
        </motion.div>
      ))}
    </div>
  );
}

function Balloon({ size, color }: { size: number; color: string }) {
  return (
    <div className="relative" style={{ width: size, height: size * 1.25 }}>
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size * 1.18,
          background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), ${color} 55%, color-mix(in oklab, ${color} 70%, black) 100%)`,
          boxShadow: `0 18px 35px -10px ${color}66, inset -6px -10px 18px rgba(0,0,0,0.18)`,
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: size * 1.16,
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: `8px solid ${color}`,
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: size * 1.22,
          width: 1.5,
          height: size * 0.9,
          background: "rgba(255,255,255,0.45)",
        }}
      />
    </div>
  );
}
