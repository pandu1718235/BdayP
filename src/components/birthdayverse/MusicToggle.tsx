import { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

// Drop your audio file at /public/audio/birthday.mp3 and it will auto-load.
const MUSIC_SRC = "/audio/birthday.mp3";

export function MusicToggle({ active }: { active: boolean }) {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      const a = new Audio(MUSIC_SRC);
      a.loop = true;
      a.volume = 0.35;
      ref.current = a;
    }
  }, []);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (on && active) a.play().catch(() => setOn(false));
    else a.pause();
  }, [on, active]);

  if (!active) return null;

  return (
    <button
      onClick={() => setOn((v) => !v)}
      aria-label={on ? "Mute music" : "Play music"}
      className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all"
      style={{
        background: "rgba(255,158,181,0.15)",
        borderColor: "color-mix(in oklab, var(--rose-pink) 50%, transparent)",
        color: "var(--cream)",
      }}
    >
      {on ? <FiVolume2 /> : <FiVolumeX />}
    </button>
  );
}
