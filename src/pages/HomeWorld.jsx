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
      ref.current.position.y = ref.current.userData.baseY + Math.sin(t * 1.2) * 0.25;
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
   EXPLORE CAMERA
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
      return () => {
        cancelled = true;
      };
    }

    const loader = new RGBELoader().setDataType(THREE.FloatType);
    loader.load("/hdr/citrus_orchard_puresky_4k.hdr", (tex) => applyTexture(tex));

    return () => {
      cancelled = true;
    };
  }, [scene, onReady]);

  return null;
}

/* --------------------------------------------
   HOVER GLOW
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

  useEffect(() => {
    camera.up.set(0, 1, 0);
    camera.position.set(50, 2, 5);
    requestAnimationFrame(() => {
      camera.lookAt(0, 5, 0);
      camera.rotation.z = 0;
    });
  }, [camera]);

  useEffect(() => {
    if (!inside) return;

    camera.up.set(0, 1, 0);
    camera.position.copy(insideStartPos.current);

    requestAnimationFrame(() => {
      baseYaw.current = Math.PI / 2;
      rotationRef.current = baseYaw.current;
      camera.rotation.set(insideStartRot.current, baseYaw.current, 0);
    });
  }, [inside, camera]);

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

  useFrame(() => {
    camera.rotation.order = "YXZ";

    if (zoomState === "rotate" && rotateTarget) {
      const dir = new THREE.Vector3().subVectors(rotateTarget, camera.position);
      const desiredYaw = Math.atan2(-dir.x, -dir.z);
      const newYaw = THREE.MathUtils.lerp(camera.rotation.y, desiredYaw, 0.08);

      camera.rotation.y = newYaw;
      camera.rotation.x = insideStartRot.current;
      camera.rotation.z = 0;

      rotationRef.current = newYaw;
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

      const newYaw = THREE.MathUtils.lerp(
        camera.rotation.y,
        baseYaw.current,
        0.05
      );
      const newPitch = THREE.MathUtils.lerp(
        camera.rotation.x,
        insideStartRot.current,
        0.05
      );

      camera.rotation.y = newYaw;
      camera.rotation.x = newPitch;
      camera.rotation.z = 0;

      rotationRef.current = newYaw;

      return;
    }

    if (zoomState === "idle") {
      camera.rotation.y = rotationRef.current;
      camera.rotation.x = insideStartRot.current;
      camera.rotation.z = 0;
    }
  });

  return null;
}

/* --------------------------------------------
   STORY OVERLAY
--------------------------------------------- */

/* --------------------------------------------
   STORY OVERLAY
--------------------------------------------- */

function StoryOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    window.addEventListener("pointerdown", hide);
    return () => window.removeEventListener("pointerdown", hide);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="absolute top-40 left-1/2 transform -translate-x-1/2 text-center 
                 text-2xl text-white font-semibold 
                 bg-black/70 px-6 py-4 rounded-xl shadow-lg"
      style={{ zIndex: 999 }}
    >
      <p>Let us take a look at what they are talking about inside the prison...</p>
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

  // ADDED — TRACK WHICH GROUPS HAVE BEEN READ
  const [textsRead, setTextsRead] = useState({
    group1: false,
    group2: false,
    group3: false,
    group4: false,
  });

  // ADDED — CHECK IF ALL GROUPS READ
  const allRead = Object.values(textsRead).every(Boolean);

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
  const m6 = { pos: [2.5, 1.2, 2], rot: Math.PI / 1.5, pose: "down" };
  const m7 = { pos: [2, 1.2, 2.5], rot: Math.PI, pose: "behind" };

  const m8 = { pos: [0, 4.5, 6], rot: Math.PI, pose: "walllean" };

  /* EXPLORE TARGET */
  const EXPLORE_TARGET = new THREE.Vector3(-10, 6, 0);

  /* ROTATION CENTERS */
  const group1Center = new THREE.Vector3(
    (m1.pos[0] + m2.pos[0]) / 2,
    (m1.pos[1] + m2.pos[1]) / 2,
    (m1.pos[2] + m2.pos[2]) / 2
  );

  const group2Center = new THREE.Vector3(
    (m3.pos[0] + m4.pos[0]) / 2,
    (m3.pos[1] + m4.pos[1]) / 2,
    (m3.pos[2] + m4.pos[2]) / 2
  );

  const group3Center = new THREE.Vector3(
    (m5.pos[0] + m6.pos[0] + m7.pos[0]) / 3,
    (m5.pos[1] + m6.pos[1] + m7.pos[1]) / 3,
    (m5.pos[2] + m6.pos[2] + m7.pos[2]) / 3
  );

  const group4Center = new THREE.Vector3(...m8.pos);

  /* CAMERA TARGETS */
  const rotateTarget =
    selected === "group1"
      ? group1Center
      : selected === "group2"
      ? group2Center
      : selected === "group3"
      ? group3Center
      : selected === "group4"
      ? group4Center
      : null;

  const zoomTarget =
    selected === "group1"
      ? new THREE.Vector3(1, 6.2, -5.5)
      : selected === "group2"
      ? new THREE.Vector3(5.8, 6, 4.3)
      : selected === "group3"
      ? new THREE.Vector3(2.5, 2.3, 2)
      : selected === "group4"
      ? new THREE.Vector3(0, 6, 5.3)
      : null;

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

    // ADDED — MARK GROUP AS READ ON CLOSE
    if (selected) {
      setTextsRead((prev) => ({ ...prev, [selected]: true }));
    }

    setZoomState("out");

    setTimeout(() => {
      setZoomState("idle");
      setSelected(null);
    }, 1200);
  };

  const handleExploreClick = () => {
    setExploreZooming(true);
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
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 bg-black text-white 
                  px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
      >
        ← Back
      </button>

      <StoryOverlay />

      {sidebarOpen && (
        <div className="absolute top-0 right-0 w-[420px] h-full overflow-y-auto bg-white shadow-xl z-50">
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

        {/* SHOW EXPLORE SIGN ONLY IF ALL GROUPS READ */}
        {sceneReady && allRead && (
          <>
            <ExploreText onClick={handleExploreClick} />
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
            zoomTarget={zoomTarget}
            rotateTarget={rotateTarget}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
