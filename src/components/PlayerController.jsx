import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PlayerController({ onNarrationChange, narration }) {
  const { camera } = useThree();

  const keys = useRef({});
  const velocity = useRef(0);
  const bobRef = useRef(0);
  const stepTimer = useRef(0);
  const footstep = useRef(null);

  // ======== COLLISION BOUNDS (from your Box3, with small buffer) ========
  const MIN_X = -5.0;   // was about -5.2177
  const MAX_X = 275.0;  // was about 275.1508
  const MIN_Z = -4.3;   // was about -4.5084
  const MAX_Z = 4.0;    // was about 4.1445

  useEffect(() => {
    const audio = new Audio("/sounds/footsteps.wav");
    audio.volume = 0.3;
    footstep.current = audio;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => (keys.current[e.code] = true);
    const handleKeyUp = (e) => (keys.current[e.code] = false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const forward = keys.current["KeyW"] || keys.current["ArrowUp"];

    if (forward) {
      velocity.current = 2; // walking speed
    } else {
      velocity.current = 0;
    }

    if (velocity.current > 0) {
      // Get forward direction
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      dir.y = 0;
      dir.normalize();

      // Candidate new position
      const nextPos = camera.position.clone().addScaledVector(dir, velocity.current * delta);

      // ======== APPLY COLLISION ON BOTH X AND Z ========
      const correctedPos = camera.position.clone();

      // Clamp X inside corridor length
      if (nextPos.x > MIN_X && nextPos.x < MAX_X) {
        correctedPos.x = nextPos.x;
      } else {
        // If trying to go beyond the end, keep at the edge
        correctedPos.x = THREE.MathUtils.clamp(nextPos.x, MIN_X, MAX_X);
      }

      // Clamp Z inside corridor width (side walls)
      if (nextPos.z > MIN_Z && nextPos.z < MAX_Z) {
        correctedPos.z = nextPos.z;
      } else {
        correctedPos.z = THREE.MathUtils.clamp(nextPos.z, MIN_Z, MAX_Z);
      }

      camera.position.copy(correctedPos);

      // ======== HEAD BOB ========
      bobRef.current += delta * 6;
      camera.position.y = 1.6 + Math.sin(bobRef.current) * 0.03;

      // ======== FOOTSTEPS ========
      stepTimer.current += delta;
      if (stepTimer.current > 0.45) {
        stepTimer.current = 0;
        if (footstep.current) {
          footstep.current.currentTime = 0;
          footstep.current.play();
        }
      }

      // ======== NARRATION TRIGGERS (along X, since corridor is long in X) ========
      narration.forEach((line) => {
        if (!line.triggered && camera.position.x >= line.xTrigger) {
          onNarrationChange(line.text);
          line.triggered = true;
        }
      });
    } else {
      // Not moving → reset head position
      camera.position.y = 1.6;
    }
  });

  return null;
}
