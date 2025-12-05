import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import Papa from "papaparse";

/* -------------------------------------------------------------
   TOP LEVEL — INCLUDING HEAVEN TRANSITION OVERLAY
------------------------------------------------------------- */
export default function StoryCorridor({ onNavigate }) {
  const [narratorActive, setNarratorActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // heaven transition overlay
  const [whiteOut, setWhiteOut] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      
      {/* 🌟 HEAVEN TRANSITION OVERLAY */}
      {whiteOut && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "white",
            opacity: whiteOut ? 1 : 0,
            filter: "blur(10px)",
            transition: "opacity 2.2s ease, filter 2s ease",
            zIndex: 9999,
          }}
        />
      )}

      {/* Instructions popup */}
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
          <p><strong>W</strong> to walk forward</p>
          <p>Click screen to look around</p>
          <p><strong>Esc</strong> to exit</p>
          <p style={{ marginTop: "20px", opacity: 0.7 }}>Click anywhere to begin</p>
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
        <directionalLight position={[10,10,5]} intensity={0.4} />

        <Corridor />
        <InmateNamePanels narratorActive={narratorActive} />
        <FloatingNarrator setNarratorActive={setNarratorActive} />

        {/* 🌟 Heavenly light */}
        <EndOfTunnelLight whiteOut={whiteOut} />

        {/* Player with heaven transition trigger */}
        <Player setWhiteOut={setWhiteOut} onNavigate={onNavigate} />
      </Canvas>
    </div>
  );
}

/* -------------------------------------------------------------
   END OF TUNNEL LIGHT — HEAVEN FLARE UPGRADE
------------------------------------------------------------- */
function EndOfTunnelLight({ whiteOut }) {
  const coreRef = useRef();
  const haloRef = useRef();

  const X = 180;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    let baseEmissive = 10 + Math.sin(t * 2) * 3;

    // If entering heaven → blast brightness
    if (whiteOut) {
      baseEmissive = 200;
    }

    if (coreRef.current?.material) {
      coreRef.current.material.emissiveIntensity = baseEmissive;
    }

    const haloScale = 1.3 + Math.sin(t * 1.5) * 0.05;
    if (haloRef.current) {
      haloRef.current.scale.set(haloScale, haloScale, haloScale);
    }
  });

  return (
    <>
      {/* bright emissive core */}
      <mesh position={[X, 2, 0]} ref={coreRef}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshStandardMaterial
          emissive="#ffffff"
          emissiveIntensity={10}
          color="#ffffff"
        />
      </mesh>

      {/* halo */}
      <mesh position={[X, 2, 0]} ref={haloRef}>
        <sphereGeometry args={[9, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight position={[X, 2, 0]} intensity={10} distance={60} color="white" />

      {/* light cone */}
      <mesh position={[X, 2, 0]} rotation={[0, 0, -Math.PI/2]}>
        <coneGeometry args={[18, 60, 40, 1, true]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={0.16}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

/* -------------------------------------------------------------
   CORRIDOR MODEL
------------------------------------------------------------- */
function Corridor() {
  const { scene } = useGLTF("/models/infinite_corridor.glb");
  return <primitive object={scene} />;
}

/* -------------------------------------------------------------
   INMATE NAMES
------------------------------------------------------------- */
function InmateNamePanels() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    Papa.parse("/cleaned_data.csv", {
      download: true,
      header: true,
      complete: ({ data }) => {
        setNames(
          data
            .map(r => `${(r.FirstName||"").trim()} ${(r.LastName||"").trim()}`.trim())
            .filter(Boolean)
        );
      }
    });
  }, []);

  if (!names.length) return null;

  const N = 14;
  const positions = Array.from({ length: N }, (_, i) => {
    const x = 5 + i * 10;
    const z = i % 2 === 0 ? 2.3 : -2.3;
    return [x, 3.7, z];
  });

  return (
    <>
      {positions.map((pos, i) => (
        <NameCluster
          key={i}
          position={pos}
          names={names.slice(i*5, i*5 + 5)}
        />
      ))}
    </>
  );
}

/* -------------------------------------------------------------
   NAME CLUSTER
------------------------------------------------------------- */
function NameCluster({ position, names }) {
  const groupRef = useRef();
  const opacityRef = useRef(0);
  const { camera } = useThree();

  const vec = new THREE.Vector3(...position);

  useFrame(() => {
    if (!groupRef.current) return;

    const dist = camera.position.distanceTo(vec);
    const target = dist < 10 ? 1 : 0;

    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, 0.02);
    const mat = groupRef.current.children[0]?.material;
    if (mat) {
      mat.transparent = true;
      mat.opacity = opacityRef.current;
    }
  });

  const flip = position[2] > 0 ? Math.PI : 0;

  return (
    <group ref={groupRef}>
      <Text
        position={[position[0], position[1], position[2] + (position[2] > 0 ? -0.003 : 0.003)]}
        rotation={[0, flip, 0]}
        fontSize={0.38}
        maxWidth={4.5}
        lineHeight={1.25}
        anchorX="center"
        anchorY="top"
        color="#e8e8e8"
        material-toneMapped={false}
      >
        {names.join("\n")}
      </Text>
    </group>
  );
}

/* -------------------------------------------------------------
   FLOATING NARRATOR
------------------------------------------------------------- */
function FloatingNarrator({ setNarratorActive }) {
  const lines = [
    { x:10, text:"Hey... come take a walk with me.\nThis corridor speaks long before you do." },
    { x:20, text:"You might be wondering what all this is.\nAnd why any of it matters." },
    { x:30, text:"When Eastern State opened,\nit was believed that solitude could reshape a person.\nSilence was thought to guide someone back to themselves.\n(Thibaut, 1982)" },
    { x:40, text:"But inside these walls,\nreflection slipped into strain.\nWhat sounded gentle became something harsher.\n(Smith, 2009; Haney, 2018)" },
    { x:50, text:"Modern research confirms what people here already felt.\nLong isolation unsettles the mind.\nIt blurs identity.\n(Shalev, 2009)" },
    { x:60, text:"And it raises a question.\nWhy did it take so long\nfor the world to recognize the harm?" },
    { x:70, text:"This place rested on faith in discipline.\nIt was believed that strict order\ncould produce moral change.\n(Rubin, 2018)" },
    { x:80, text:"Yet walking here,\nyou feel the contradiction.\nThe hope of renewal never matched\nthe reality of separation." },
    { x:90, text:"The records echo this.\nSome details are sparse.\nOthers overly exact.\nMuch of a person is missing on the page." },
    { x:100, text:"Now look at the walls.\nThese names belonged to people\nwho lived through this experiment." },
    { x:110, text:"Their stories remind us\nthat the system did not uplift them.\nIt shaped harm instead of repair." },
    { x:120, text:"So what do we take from all this?\nMaybe the realization\nthat a system can be built with hope\nand still cause harm." },
    { x:130, text:"Eastern State did not fail through poor execution.\nIt failed because the idea itself was flawed." },
    { x:140, text:"I have taken enough of your time.\nLet me leave you with this:\na quiet reflection from a past\nthat still shapes the world we move through." }
  ];
  

  return (
    <>
      {lines.map((line,i)=>(
        <FloatingLine key={i} x={line.x} text={line.text} setNarratorActive={setNarratorActive}/>
      ))}
    </>
  );
}

/* -------------------------------------------------------------
   FLOATING LINE
------------------------------------------------------------- */
function FloatingLine({ x, text, setNarratorActive }) {
  const textRef = useRef();
  const opacityRef = useRef(0);
  const { camera } = useThree();
  const loc = new THREE.Vector3(x, 1.9, 0);

  useFrame(() => {
    const dist = camera.position.distanceTo(loc);
    let target = dist < 8 ? 1 : 0;
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
      rotation={[0, -Math.PI/2, 0]}
      fontSize={0.42}
      color="#f2f2f2"
      anchorX="center"
      anchorY="middle"
      maxWidth={6}
      lineHeight={1.3}
      material-toneMapped={false}
    >
      {text}
    </Text>
  );
}

/* -------------------------------------------------------------
   PLAYER MOVEMENT + HEAVEN TRIGGER
------------------------------------------------------------- */
function Player({ setWhiteOut, onNavigate }) {
  const { camera } = useThree();
  const keys = useRef({});

  useEffect(() => {
    const down = (e) => keys.current[e.code] = true;
    const up = (e) => keys.current[e.code] = false;
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const leftZ = -2.71, rightZ = 2.71, pad = 0.25;
  const LIGHT_X = 180;

  useFrame((_, delta) => {
    const speed = 2 * delta;

    if (keys.current["KeyW"] || keys.current["ArrowUp"]) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      dir.y = 0;
      dir.normalize().multiplyScalar(speed);

      const nx = camera.position.x + dir.x;
      const nz = camera.position.z + dir.z;
      if (nz > leftZ + pad && nz < rightZ - pad) {
        camera.position.x = nx;
        camera.position.z = nz;
      }
    }

    // 🌟 HEAVEN TRANSITION TRIGGER
    if (camera.position.x > LIGHT_X - 7) {
      setWhiteOut(true);

      setTimeout(() => {
        onNavigate("letter");
      }, 2000);
    }
  });

  return null;
}
