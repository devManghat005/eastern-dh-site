import { useEffect, useRef } from "react";

export default function FootstepAudio({ isWalking }) {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/footsteps.wav");
    audioRef.current.volume = 0.3;
    audioRef.current.loop = true;
  }, []);

  // Play / pause based on movement
  useEffect(() => {
    if (!audioRef.current) return;
    if (isWalking) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isWalking]);

  return null;
}
