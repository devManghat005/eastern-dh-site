import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import Papa from "papaparse";

/* ----------------------------------------------
   TOP LEVEL
---------------------------------------------- */
export default function StoryCorridor() {
  const [narratorActive, setNarratorActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* --- INSTRUCTION POPUP --- */}
      {showInstructions && (
        <div
          onClick={() => setShowInstructions(false)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "22px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <p>Use <strong>W</strong> to walk forward</p>
          <p>Click screen to look around</p>
          <p>Press <strong>Esc</strong> to exit camera view</p>
          <p style={{ marginTop: "20px", opacity: 0.7 }}>
            Click anywhere to begin
          </p>
        </div>
      )}

      <Canvas
        camera={{
          fov: 50,
          position: [0, 1.6, 0],
          rotation: [0, -Math.PI / 2, 0],
        }}
      >
        <PointerLockControls />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.4} />

        <Corridor />
        <InmateNamePanels narratorActive={narratorActive} />
        <FloatingNarrator setNarratorActive={setNarratorActive} />
        <Player />
      </Canvas>
    </div>
  );
}

/* ----------------------------------------------
   CORRIDOR MODEL
---------------------------------------------- */
function Corridor() {
  const { scene } = useGLTF("/models/infinite_corridor.glb");
  return <primitive object={scene} />;
}

/* ----------------------------------------------
   LOAD INMATE NAMES
---------------------------------------------- */
function InmateNamePanels({ narratorActive }) {
  const [names, setNames] = useState([]);

  useEffect(() => {
    Papa.parse("/cleaned_data.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const rows = results.data;

        const extracted = rows
          .map((r) => {
            const f = (r.FirstName || "").trim();
            const l = (r.LastName || "").trim();
            if (!f && !l) return null;
            return `${f} ${l}`.trim();
          })
          .filter(Boolean);

        setNames(extracted);
      },
    });
  }, []);

  if (!names.length) return null;

  /* ----------------------------------------------------------
     🔥 ONLY CHANGE YOU REQUESTED:
     Make wall blocks = number of narrator lines (14 blocks)
  ----------------------------------------------------------- */

  const NARRATOR_COUNT = 14; // match FloatingNarrator lines
  const BLOCK_COUNT = NARRATOR_COUNT;

  // auto-generate alternating wall positions
  const positions = Array.from({ length: BLOCK_COUNT }, (_, i) => {
    const x = 5 + i * 10;                  // forward spacing
    const z = i % 2 === 0 ? 2.3 : -2.3;    // alternate left/right
    return [x, 3.7, z];
  });

  const NAMES_PER_WALL = 5;

  return (
    <>
      {positions.map((pos, i) => {
        const s = i * NAMES_PER_WALL;
        const e = s + NAMES_PER_WALL;
        return (
          <NameCluster key={i} position={pos} names={names.slice(s, e)} />
        );
      })}
    </>
  );
}

/* ----------------------------------------------
   NAME CLUSTER — PROXIMITY FADE
---------------------------------------------- */
function NameCluster({ position, names }) {
  const groupRef = useRef();
  const opacityRef = useRef(0);
  const { camera } = useThree();

  const block = names.join("\n");
  const panelPos = new THREE.Vector3(...position);

  useFrame(() => {
    if (!groupRef.current) return;

    const dist = camera.position.distanceTo(panelPos);
    const target = dist < 10 ? 1 : 0;

    opacityRef.current = THREE.MathUtils.lerp(
      opacityRef.current,
      target,
      0.02
    );

    const mat = groupRef.current.children[0]?.material;
    if (mat) {
      mat.transparent = true;
      mat.opacity = opacityRef.current;
    }
  });

  const rotationY = position[2] > 0 ? Math.PI : 0;
  const wallOffset = position[2] > 0 ? -0.003 : 0.003;

  return (
    <group ref={groupRef}>
      <Text
        position={[position[0], position[1], position[2] + wallOffset]}
        rotation={[0, rotationY, 0]}
        fontSize={0.38}
        maxWidth={4.5}
        lineHeight={1.25}
        anchorX="center"
        anchorY="top"
        color="#e8e8e8"
        material-toneMapped={false}
        depthOffset={-20}
      >
        {block}
      </Text>
    </group>
  );
}

/* ----------------------------------------------
   FLOATING NARRATOR LINES (unchanged)
---------------------------------------------- */
function FloatingNarrator({ setNarratorActive }) {
  const lines = [
    { x: 10, text: "Hey... come take a walk with me.\nThis corridor speaks long before you do." },
    { x: 20, text: "You might be wondering what all this is.\nAnd why any of it matters." },
    { x: 30, text: "When Eastern State opened,\nit was believed that solitude could reshape a person.\nSilence was thought to guide someone back to themselves.\nThibaut writes about this hope." },
    { x: 40, text: "But inside these walls,\nreflection slipped into strain.\nWhat sounded gentle became something harsher.\nSmith and Haney describe this shift." },
    { x: 50, text: "Modern research confirms what people here already felt.\nLong isolation unsettles the mind.\nIt blurs identity.\nShalev shows how deep this damage runs." },
    { x: 60, text: "And it raises a question.\nWhy did it take so long\nfor the world to recognize the harm?" },
    { x: 70, text: "This place rested on faith in discipline.\nIt was believed that strict order\ncould produce moral change.\nRubin and Meranze study this belief." },
    { x: 80, text: "Yet walking here,\nyou feel the contradiction.\nThe hope of renewal never matched\nthe reality of separation." },
    { x: 90, text: "The records echo this.\nSome details are sparse.\nOthers overly exact.\nMuch of a person is missing on the page." },
    { x: 100, text: "Now look at the walls.\nThese names belonged to people\nwho lived through this experiment." },
    { x: 110, text: "Their stories remind us\nthat the system did not uplift them.\nIt shaped harm instead of repair." },
    { x: 120, text: "So what do we take from all this?\nMaybe the realization\nthat a system can be built with hope\nand still cause harm." },
    { x: 130, text: "Eastern State did not fail through poor execution.\nIt failed because the idea itself was flawed." },
    { x: 140, text: "I have taken enough of your time.\nLet me leave you with this:\na quiet reflection from a past\nthat still shapes the world we move through." },
  ];

  return (
    <>
      {lines.map((line, i) => (
        <FloatingLine
          key={i}
          x={line.x}
          text={line.text}
          setNarratorActive={setNarratorActive}
        />
      ))}
    </>
  );
}

/* ----------------------------------------------
   FLOATING LINE WITH PROXIMITY FADE
---------------------------------------------- */
function FloatingLine({ x, text, setNarratorActive }) {
  const textRef = useRef();
  const opacityRef = useRef(0);
  const { camera } = useThree();

  const pos = new THREE.Vector3(x, 1.9, 0);

  useFrame(() => {
    const dist = camera.position.distanceTo(pos);
    let target = 0;

    if (dist < 8) target = 1;
    if (camera.position.x > x + 1.5) target = 0;

    const prev = opacityRef.current;
    opacityRef.current = THREE.MathUtils.lerp(prev, target, 0.015);

    if (textRef.current?.material) {
      textRef.current.material.transparent = true;
      textRef.current.material.opacity = opacityRef.current;
    }

    if (opacityRef.current > 0.1 && prev <= 0.1) setNarratorActive(true);
    if (opacityRef.current < 0.05 && prev >= 0.05) setNarratorActive(false);
  });

  return (
    <Text
      ref={textRef}
      position={[x, 1.9, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      fontSize={0.42}
      color="#f2f2f2"
      anchorX="center"
      anchorY="middle"
      maxWidth={6}
      lineHeight={1.3}
      material-toneMapped={false}
      depthOffset={-25}
    >
      {text}
    </Text>
  );
}

/* ----------------------------------------------
   PLAYER MOVEMENT
---------------------------------------------- */
function Player() {
  const { camera } = useThree();
  const keys = useRef({});

  useEffect(() => {
    const down = (e) => (keys.current[e.code] = true);
    const up = (e) => (keys.current[e.code] = false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const leftWallZ = -2.71;
  const rightWallZ = 2.71;
  const padding = 0.25;

  useFrame((_, delta) => {
    const speed = 2 * delta;
    if (keys.current["KeyW"] || keys.current["ArrowUp"]) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      dir.y = 0;
      dir.normalize().multiplyScalar(speed);

      const nx = camera.position.x + dir.x;
      const nz = camera.position.z + dir.z;

      if (nz > leftWallZ + padding && nz < rightWallZ - padding) {
        camera.position.x = nx;
        camera.position.z = nz;
      }
    }
  });

  return null;
}
