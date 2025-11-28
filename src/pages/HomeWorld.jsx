import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useProgress, Text } from "@react-three/drei";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { SkeletonUtils } from "three-stdlib";

import RaceSidebar from "./RaceSidebar";
import SentenceSidebar from "./DummySidebar3";
import DummySidebar4 from "./DummySidebar4";
import AgeSidebar from "./AgeSidebar";

/* --------------------------------------------
   GLOBAL CACHES / PRELOAD
--------------------------------------------- */

const hdrCache = { texture: null };

useGLTF.preload("/models/inside_prison.glb");
useGLTF.preload("/models/mannequin.glb");

/* ==========================================================
   EXPLORE SIGN
========================================================== */
function ExploreText({ onClick }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y =
        ref.current.userData.baseY + Math.sin(t * 1.2) * 0.25;
    }
  });

  return (
    <Text
      ref={ref}
      userData={{ baseY: 6 }}
      position={[-10, 7, 0]}
      rotation={[0, 1.56, 0]}
      fontSize={1.5}
      anchorX="center"
      anchorY="middle"
      color="yellow"
      outlineWidth={0.03}
      outlineColor="black"
      onClick={onClick}
    >
      EXPLORE
    </Text>
  );
}

/* ==========================================================
   EXPLORE CAMERA CONTROLLER
========================================================== */
function ExploreZoomController({
  exploreZooming,
  setExploreZooming,
  onExplore,
  target,
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (!exploreZooming) return;

    camera.position.lerp(target, 0.04);

    if (camera.position.distanceTo(target) < 0.8) {
      setExploreZooming(false);
      onExplore?.();
    }
  });

  return null;
}

/* --------------------------------------------
   HDR SKY
--------------------------------------------- */
function SceneHDRI({ onReady }) {
  const { scene } = useThree();

  useEffect(() => {
    let cancelled = false;

    const applyTexture = (tex) => {
      if (cancelled) return;
      tex.mapping = THREE.EquirectangularReflectionMapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      hdrCache.texture = tex;
      scene.background = tex;
      onReady?.();
    };

    if (hdrCache.texture) {
      applyTexture(hdrCache.texture);
      return () => (cancelled = true);
    }

    const loader = new RGBELoader().setDataType(THREE.FloatType);
    loader.load("/hdr/citrus_orchard_puresky_4k.hdr", (tex) => applyTexture(tex));

    return () => (cancelled = true);
  }, [scene, onReady]);

  return null;
}

/* --------------------------------------------
   HOVER OUTLINE GLOW
--------------------------------------------- */
function HoverGlow({ children }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.traverse((obj) => {
      if (obj.isMesh && obj.material && "emissiveIntensity" in obj.material) {
        obj.material.emissiveIntensity = hovered
          ? THREE.MathUtils.lerp(obj.material.emissiveIntensity, 1.3, 0.15)
          : THREE.MathUtils.lerp(obj.material.emissiveIntensity, 0.0, 0.15);
      }
    });
  });

  return (
    <group
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  );
}

/* --------------------------------------------
   PRISON INTERIOR
--------------------------------------------- */
function PrisonInterior() {
  const { scene } = useGLTF("/models/inside_prison.glb");
  useEffect(() => {
    scene.rotation.set(0, 0, 0);
  }, [scene]);
  return <primitive object={scene} scale={1.3} />;
}

/* --------------------------------------------
   MANNEQUIN
--------------------------------------------- */
function Mannequin({ position, rotation, pose }) {
  const { scene } = useGLTF("/models/mannequin.glb");
  const clone = SkeletonUtils.clone(scene);

  useEffect(() => {
    clone.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        obj.material = obj.material.clone();
        obj.material.emissive = new THREE.Color(0xffffff);
        obj.material.emissiveIntensity = 0;
      }
    });

    if (!pose) return;

    clone.traverse((bone) => {
      if (!bone.isBone) return;

      if (pose === "lean" && bone.name.includes("spine_03"))
        bone.rotation.x = -0.3;

      if (pose === "open") {
        if (bone.name.includes("upperarm_l")) bone.rotation.z = 0.4;
        if (bone.name.includes("upperarm_r")) bone.rotation.z = -0.4;
      }

      if (pose === "cross") {
        if (bone.name.includes("upperarm_l")) bone.rotation.z = -0.5;
        if (bone.name.includes("upperarm_r")) bone.rotation.z = 0.5;
        if (bone.name.includes("lowerarm_l")) bone.rotation.x = -0.8;
        if (bone.name.includes("lowerarm_r")) bone.rotation.x = -0.8;
      }

      if (pose === "behind") {
        if (bone.name.includes("upperarm_l")) bone.rotation.x = -0.6;
        if (bone.name.includes("upperarm_r")) bone.rotation.x = -0.6;
      }

      if (pose === "down" && bone.name.includes("spine_05"))
        bone.rotation.x = 0.4;

      if (pose === "walllean") {
        if (bone.name.includes("spine_03")) bone.rotation.x = 0.25;
        if (bone.name.includes("spine_04")) bone.rotation.x = 0.35;
        if (bone.name.includes("spine_05")) bone.rotation.x = 0.4;
      }
    });
  }, [clone, pose]);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <primitive object={clone} />
    </group>
  );
}

/* --------------------------------------------
   CAMERA CONTROLLER
--------------------------------------------- */
function LimitedLookCamera({ inside, zoomState, zoomTarget, rotateTarget }) {
  const { camera, gl } = useThree();

  const [down, setDown] = useState(false);
  const rotationRef = useRef(0);
  const lastX = useRef(0);
  const baseYaw = useRef(0);

  const insideStartPos = useRef(new THREE.Vector3(10, 9, 0.5));
  const insideStartRot = useRef(-0.5);

  // STARTING CAMERA OUTSIDE
  useEffect(() => {
    camera.up.set(0, 1, 0);
    camera.position.set(50, 2, 5);

    requestAnimationFrame(() => {
      camera.lookAt(0, 5, 0);
      camera.rotation.z = 0;
    });
  }, [camera]);

  // SWITCH TO INSIDE VIEW
  useEffect(() => {
    if (!inside) return;

    camera.position.copy(insideStartPos.current);
    requestAnimationFrame(() => {
      baseYaw.current = Math.PI / 2;
      rotationRef.current = baseYaw.current;
      camera.rotation.set(insideStartRot.current, baseYaw.current, 0);
    });
  }, [inside, camera]);

  // MOUSE DRAG LOOK
  useEffect(() => {
    const dom = gl.domElement;

    const downFn = (e) => {
      setDown(true);
      lastX.current = e.clientX;
    };
    const upFn = () => setDown(false);

    const moveFn = (e) => {
      if (!down) return;
      const dx = (e.clientX - lastX.current) * 0.003;
      lastX.current = e.clientX;
      rotationRef.current += dx;
    };

    dom.addEventListener("mousedown", downFn);
    window.addEventListener("mouseup", upFn);
    window.addEventListener("mousemove", moveFn);

    return () => {
      dom.removeEventListener("mousedown", downFn);
      window.removeEventListener("mouseup", upFn);
      window.removeEventListener("mousemove", moveFn);
    };
  }, [down, gl.domElement]);

  // FRAME UPDATE
  useFrame(() => {
    camera.rotation.order = "YXZ";

    if (zoomState === "rotate" && rotateTarget) {
      const dir = new THREE.Vector3().subVectors(rotateTarget, camera.position);
      const desiredYaw = Math.atan2(-dir.x, -dir.z);

      camera.rotation.y = THREE.MathUtils.lerp(
        camera.rotation.y,
        desiredYaw,
        0.08
      );
      camera.rotation.x = insideStartRot.current;
      camera.rotation.z = 0;

      rotationRef.current = camera.rotation.y;
      return;
    }

    if (zoomState === "in" && zoomTarget) {
      camera.position.lerp(zoomTarget, 0.05);
      camera.rotation.x = insideStartRot.current;
      camera.rotation.y = rotationRef.current;
      camera.rotation.z = 0;
      return;
    }

    if (zoomState === "out") {
      camera.position.lerp(insideStartPos.current, 0.05);

      camera.rotation.y = THREE.MathUtils.lerp(
        camera.rotation.y,
        baseYaw.current,
        0.05
      );

      camera.rotation.x = THREE.MathUtils.lerp(
        camera.rotation.x,
        insideStartRot.current,
        0.05
      );

      camera.rotation.z = 0;

      rotationRef.current = camera.rotation.y;
      return;
    }

    // Idle look mode
    camera.rotation.y = rotationRef.current;
    camera.rotation.x = insideStartRot.current;
    camera.rotation.z = 0;
  });

  return null;
}

/* --------------------------------------------
   ⭐ INSTRUCTIONS POPUP (BLOCKS CLICKS)
--------------------------------------------- */
function InstructionsPopup({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.65)",
        color: "white",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px",
        textAlign: "center",
        cursor: "pointer",
        padding: "20px",
        pointerEvents: "auto", // BLOCKS CLICKS UNDERNEATH
      }}
    >
      {/* text does not capture clicks */}
      <div style={{ pointerEvents: "none" }}>
        <p><strong>Hold Left Click</strong> and drag to look around</p>
        <p><strong>Click on the inmates</strong> to interact with them</p>
        <p><strong>Click the text bubble</strong> to continue the story</p>
        <p style={{ marginTop: "25px", opacity: 0.7 }}>
          Click anywhere to continue
        </p>
      </div>
    </div>
  );
}

/* --------------------------------------------
   ⭐ TWO-STEP STORY OVERLAY (LOWERED)
--------------------------------------------- */
function StoryOverlay({ onFinish }) {
  const [step, setStep] = useState(0); // 0 = msg1, 1 = msg2, 2 = done

  useEffect(() => {
    const advance = () => {
      setStep((prev) => {
        if (prev === 0) return 1;
        if (prev === 1) {
          onFinish?.();
          return 2;
        }
        return prev;
      });
    };

    window.addEventListener("pointerdown", advance);
    return () => window.removeEventListener("pointerdown", advance);
  }, [onFinish]);

  if (step === 2) return null;

  const messages = [
    "Let us take a look at what they are talking about inside the prison...",
    "Let us take a look at what they are talking about inside the prison...",
  ];

  return (
    <div
      className="absolute left-1/2 transform -translate-x-1/2 
                 text-center text-2xl text-white font-semibold 
                 bg-black/70 px-6 py-4 rounded-xl shadow-lg"
      style={{
        top: "15%",
        zIndex: 999,
        pointerEvents: "none", // bubble itself does NOT capture clicks
      }}
    >
      <p>{messages[step]}</p>
    </div>
  );
}

/* --------------------------------------------
   MAIN WORLD
--------------------------------------------- */

export default function HomeWorld({ onBack, onExplore }) {
  const [inside] = useState(true);

  const [zoomState, setZoomState] = useState("idle");
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exploreZooming, setExploreZooming] = useState(false);
  const [storyFinished, setStoryFinished] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const { progress } = useProgress();
  const glbReady = progress === 100;

  const [hdrReady, setHdrReady] = useState(false);
  const sceneReady = hdrReady && glbReady;

  /* GROUP POSITIONS */
  const m1 = { pos: [1, 4.5, -5], rot: 0 };
  const m2 = { pos: [0.5, 4.5, -5], rot: Math.PI / 2 };
  const m3 = { pos: [5.5, 4.5, 5], rot: Math.PI / 1.8, pose: "lean" };
  const m4 = { pos: [6, 4.5, 5], rot: -Math.PI / 2, pose: "open" };
  const m5 = { pos: [1.5, 1.2, 2], rot: Math.PI / 1.5, pose: "cross" };
  const m6 = { pos: [2.5, 1.2, 2], rot: -Math.PI / 1.5, pose: "down" };
  const m7 = { pos: [2, 1.2, 2.5], rot: Math.PI, pose: "behind" };
  const m8 = { pos: [0, 4.5, 6], rot: Math.PI, pose: "walllean" };

  const EXPLORE_TARGET = new THREE.Vector3(-10, 6, 0);

  /* CLICK HANDLERS */
  const animateSelect = (groupId) => {
    setSelected(groupId);
    setZoomState("rotate");

    setTimeout(() => setZoomState("in"), 900);
    setTimeout(() => {
      setSidebarOpen(true);
      setZoomState("idle");
    }, 1700);
  };

  const handleBack = () => {
    setSidebarOpen(false);
    setZoomState("out");

    setTimeout(() => {
      setZoomState("idle");
      setSelected(null);
    }, 1200);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        position: "relative",
      }}
    >
      {/* INSTRUCTIONS FIRST */}
      {showInstructions && (
        <InstructionsPopup onClose={() => setShowInstructions(false)} />
      )}

      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 bg-black text-white 
                  px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
      >
        ← Back
      </button>

      {/* TWO-STEP STORY BUBBLE */}
      <StoryOverlay onFinish={() => setStoryFinished(true)} />

      {/* SIDE PANEL */}
      {sidebarOpen && (
        <div className="absolute top-0 right-0 w-[420px] h-full bg-white shadow-xl z-50">
          <button
            onClick={handleBack}
            className="text-sm bg-black text-white px-3 py-1 m-4 rounded"
          >
            Back
          </button>

          {selected === "group1" && <RaceSidebar />}
          {selected === "group2" && <AgeSidebar />}
          {selected === "group3" && <SentenceSidebar />}
          {selected === "group4" && <DummySidebar4 />}
        </div>
      )}

      {/* MAIN CANVAS */}
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 2000 }}
        dpr={[1, 1.25]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
        style={{
          width: "100%",
          height: "100%",
          opacity: sceneReady ? 1 : 0,
          transition: "opacity 0.7s ease-in-out",
        }}
      >
        <SceneHDRI onReady={() => setHdrReady(true)} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 5]} intensity={1} />

        {/* EXPLORE SIGN SHOWS ONLY AFTER STORY IS COMPLETELY FINISHED */}
        {sceneReady && storyFinished && (
          <>
            <ExploreText onClick={() => setExploreZooming(true)} />
            <ExploreZoomController
              exploreZooming={exploreZooming}
              setExploreZooming={setExploreZooming}
              onExplore={onExplore}
              target={EXPLORE_TARGET}
            />
          </>
        )}

        <Suspense fallback={null}>
          <PrisonInterior />

          {/* GROUPS */}
          <HoverGlow>
            <group onClick={() => animateSelect("group1")}>
              <Mannequin position={m1.pos} rotation={m1.rot} />
              <Mannequin position={m2.pos} rotation={m2.rot} />
            </group>
          </HoverGlow>

          <HoverGlow>
            <group onClick={() => animateSelect("group2")}>
              <Mannequin position={m3.pos} rotation={m3.rot} pose={m3.pose} />
              <Mannequin position={m4.pos} rotation={m4.rot} pose={m4.pose} />
            </group>
          </HoverGlow>

          <HoverGlow>
            <group onClick={() => animateSelect("group3")}>
              <Mannequin position={m5.pos} rotation={m5.rot} pose={m5.pose} />
              <Mannequin position={m6.pos} rotation={m6.rot} pose={m6.pose} />
              <Mannequin position={m7.pos} rotation={m7.rot} pose={m7.pose} />
            </group>
          </HoverGlow>

          <HoverGlow>
            <group onClick={() => animateSelect("group4")}>
              <Mannequin position={m8.pos} rotation={m8.rot} pose={m8.pose} />
            </group>
          </HoverGlow>

          <LimitedLookCamera
            inside={inside}
            zoomState={zoomState}
            zoomTarget={null}
            rotateTarget={null}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
