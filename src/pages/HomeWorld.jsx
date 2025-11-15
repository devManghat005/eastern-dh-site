import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import RaceSidebar from "./RaceSidebar";

/* preload models */
useGLTF.preload("/models/Identity_Mask.glb");
useGLTF.preload("/models/hammer.glb");

/* ------------------ 3D OBJECTS ------------------ */

function Mask({ open }) {
  const { scene } = useGLTF("/models/Identity_Mask.glb");
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.004;
    ref.current.position.y = 1 + Math.sin(Date.now() * 0.001) * 0.1;
  });

  return (
    <group ref={ref} position={[-3, 1, 0]} scale={1.7} onClick={open}>
      <primitive object={scene} />
      <Html center position={[0, 2.4, 0]}>
        <div className="px-3 py-1 rounded-full bg-black/10 text-black text-xs border border-gray-300">
          Race Explorer
        </div>
      </Html>
    </group>
  );
}

function Hammer({ open }) {
  const { scene } = useGLTF("/models/hammer.glb");
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y -= 0.004;
    ref.current.position.y = 1 + Math.sin(Date.now() * 0.001 + 1) * 0.1;
  });

  return (
    <group ref={ref} position={[3, 1, 0]} scale={2.2} onClick={open}>
      <primitive object={scene} />
      <Html center position={[0, 2.2, 0]}>
        <div className="px-3 py-1 rounded-full bg-black/10 text-black text-xs border border-gray-300">
          Occupation Explorer
        </div>
      </Html>
    </group>
  );
}

/* ------------------ MAIN PAGE ------------------ */

export default function HomeWorld() {
  const [panel, setPanel] = useState(null);

  return (
    <div className="w-full h-screen bg-white relative overflow-hidden">
      <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
        <color attach="background" args={["white"]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 5, 6]} intensity={1.5} />
        <Mask open={() => setPanel("race")} />
        <Hammer open={() => setPanel("occupation")} />
        <OrbitControls enableDamping dampingFactor={0.06} />
      </Canvas>

      <AnimatePresence>
        {panel && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute top-0 right-0 h-full w-[420px] bg-gray-50 shadow-2xl border-l border-gray-300 p-6 overflow-y-auto"
          >
            <button
              onClick={() => setPanel(null)}
              className="text-sm bg-black text-white px-3 py-1 rounded mb-4"
            >
              Close
            </button>

            {panel === "race" && <RaceSidebar />}

            {panel === "occupation" && (
              <div>
                <h2 className="text-2xl font-semibold mb-2">Occupation Explorer</h2>
                <p className="text-gray-700 text-sm">
                  Occupation analytics will go here.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
