import { useMemo } from "react";

export function Sparkles({ count = 40 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 3,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute animate-sparkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: "white",
            borderRadius: "50%",
            boxShadow: "0 0 6px rgba(255,255,255,0.9), 0 0 12px rgba(255,159,181,0.7)",
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function FloatingHearts({ count = 16 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 8,
        size: 14 + Math.random() * 18,
        opacity: 0.5 + Math.random() * 0.5,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.left}%`,
            bottom: "-40px",
            animation: `floatHeart ${h.duration}s ${h.delay}s linear infinite`,
            opacity: h.opacity,
            fontSize: h.size,
          }}
        >
          💗
        </div>
      ))}
      <style>{`
        @keyframes floatHeart {
          0% { transform: translateY(0) translateX(0) rotate(0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-110vh) translateX(40px) rotate(20deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
