import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

// ------------------------------------------------------
// 3D BACKGROUND SCENE — subtle movement, solemn atmosphere
// ------------------------------------------------------
function FloatingOrbs() {
  const orbs = Array.from({ length: 12 }, (_, i) => i);
  return (
    <group>
      {orbs.map((i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.2} floatIntensity={0.4}>
          <mesh position={[Math.random() * 6 - 3, Math.random() * 3 - 1.5, -3 - Math.random() * 1.5]}>
            <sphereGeometry args={[0.12 + Math.random() * 0.05, 32, 32]} />
            <meshStandardMaterial
              color={"#6b7280"}
              emissive={"#4b5563"}
              emissiveIntensity={0.3}
              transparent
              opacity={0.32}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function SoftLights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 2, 1]} intensity={1} color="#aaa" />
      <pointLight position={[-3, -2, 1]} intensity={0.6} color="#666" />
    </>
  );
}

// ------------------------------------------------------
// STORY SECTIONS — minimal words, conversational, solemn
// ------------------------------------------------------
const STEPS = [
  {
    speaker: "Narrator",
    text: "You’ve walked through numbers, stories, and walls. Before we end, let me show you what they all meant.",
  },
  {
    speaker: "Narrator",
    text: "The early reformers believed silence would purify the mind. They imagined isolation as medicine.",
  },
  {
    speaker: "Narrator",
    text: "But the records you explored—sentence lengths, race patterns, literacy—tell a different story.",
  },
  {
    speaker: "Narrator",
    text: "History shows the system broke more than it healed. Psychology tells us why: isolation reshapes the mind.",
  },
  {
    speaker: "Narrator",
    text: "And today, people still describe the same loneliness, the same thinning of hope.",
  },
  {
    speaker: "Narrator",
    text: "You’ve seen the data. You’ve seen the echoes. The question now is what we do with them.",
  },
];

const bubbleVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// ------------------------------------------------------
// MAIN STORY PAGE
// ------------------------------------------------------
export default function Story() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const next = () => {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prev = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* 3D Background */}
      <Canvas className="absolute inset-0" camera={{ position: [0, 0, 4], fov: 45 }}>
        <SoftLights />
        <Suspense fallback={null}>
          <FloatingOrbs />
        </Suspense>
      </Canvas>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Conversation Box */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={bubbleVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl bg-zinc-900/70 border border-zinc-700 rounded-2xl p-6 shadow-xl backdrop-blur-md"
          >
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">{current.speaker}</p>
            <p className="text-lg text-zinc-200 leading-relaxed">{current.text}</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={prev}
            disabled={step === 0}
            className="px-4 py-2 rounded-xl border border-zinc-600 bg-zinc-800/60 disabled:opacity-30"
          >
            Back
          </button>

          <button
            onClick={next}
            disabled={step === STEPS.length - 1}
            className="px-4 py-2 rounded-xl border border-zinc-600 bg-zinc-800/60 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}