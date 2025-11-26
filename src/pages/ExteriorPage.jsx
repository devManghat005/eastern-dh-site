import React, {
  useRef,
  useEffect,
  useState,
  Suspense,
  memo,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/* -----------------------------------------------------
   GLOBAL CACHE
----------------------------------------------------- */
const hdrCache = { texture: null };

// Preload GLB
useGLTF.preload(
  "/models/the_prison.glb"
);

const ZOOM_TARGET = new THREE.Vector3(50, 4, -42);

const STORY_TEXTS = [
  "In the quiet outskirts of the old penitentiary...",
  "Stories linger in the air..... shadows of people and moments long gone.",
  "Before we step inside, take a moment to understand where you are.",
  "who you are.",
  "Every corridor holds a memory, every wall a voice.",
  "When you're ready... we go in together.",
];

/* -----------------------------------------------------
   HDR LOADER
----------------------------------------------------- */
function SceneHDRI({ onReady }) {
  const { scene } = useThree();

  useEffect(() => {
    if (hdrCache.texture) {
      scene.environment = hdrCache.texture;
      scene.background = hdrCache.texture;
      onReady?.();
      return;
    }

    new RGBELoader()
      .setDataType(THREE.FloatType)
      .load(
        "/hdr/dikhololo_night_4k.hdr",
        (tex) => {
          tex.mapping = THREE.EquirectangularReflectionMapping;
          tex.encoding = THREE.sRGBEncoding;

          hdrCache.texture = tex;
          scene.environment = tex;
          scene.background = tex;

          onReady?.();
        }
      );
  }, [scene, onReady]);

  return null;
}

/* -----------------------------------------------------
   PRISON MODEL
----------------------------------------------------- */
function PrisonExterior({ onLoaded }) {
  const { scene } = useGLTF(
    "/models/the_prison.glb"
  );

  useEffect(() => {
    scene.rotation.set(0, 0, 0);
    onLoaded?.();
  }, [scene, onLoaded]);

  return <primitive object={scene} scale={1.3} />;
}

/* -----------------------------------------------------
   ENTER SIGN
----------------------------------------------------- */
function EnterText({ onClick }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 3 + Math.sin(t * 1.2) * 0.25;
    }
  });

  return (
    <Text
      ref={ref}
      position={[49.5, 3, -48]}
      fontSize={2.5}
      anchorX="center"
      anchorY="middle"
      color="yellow"
      outlineWidth={0.03}
      outlineColor="black"
      onClick={onClick}
    >
      ENTER
    </Text>
  );
}

/* -----------------------------------------------------
   CAMERA
----------------------------------------------------- */
function ExteriorCameraController({ zooming, onZoomComplete }) {
  const { camera, gl } = useThree();

  const isDown = useRef(false);
  const lastX = useRef(0);
  const rot = useRef(0);
  const baseYaw = useRef(0);

  useEffect(() => {
    camera.up.set(0, 1, 0);
    camera.position.set(50, 2, 5);
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const dom = gl.domElement;

    const down = (e) => {
      if (zooming) return;
      isDown.current = true;
      lastX.current = e.clientX;
    };
    const up = () => (isDown.current = false);

    const move = (e) => {
      if (!isDown.current || zooming) return;

      const dx = (e.clientX - lastX.current) * 0.003;
      lastX.current = e.clientX;

      rot.current = THREE.MathUtils.clamp(
        rot.current + dx,
        baseYaw.current - Math.PI / 4,
        baseYaw.current + Math.PI / 4
      );
    };

    dom.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);

    return () => {
      dom.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", move);
    };
  }, [gl, zooming]);

  useFrame(() => {
    camera.rotation.order = "YXZ";
    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      rot.current,
      0.15
    );

    if (zooming) {
      camera.position.lerp(ZOOM_TARGET, 0.04);
      if (camera.position.distanceTo(ZOOM_TARGET) < 0.5) {
        onZoomComplete();
      }
    }
  });

  return null;
}

/* -----------------------------------------------------
   STORY OVERLAY
----------------------------------------------------- */
const StoryOverlay = memo(function StoryOverlay({ onFinish }) {
  const [index, setIndex] = useState(-1);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIndex(0), 2000);
    return () => clearTimeout(t);
  }, []);

  const next = () => {
    if (index < STORY_TEXTS.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setVisible(false);
      onFinish();
    }
  };

  if (!visible) return null;

  return (
    <div
      onClick={next}
      className="absolute top-20 left-1/2 transform -translate-x-1/2 
                 text-center text-2xl text-white font-semibold 
                 bg-black/70 px-6 py-4 rounded-xl shadow-lg cursor-pointer select-none"
      style={{ zIndex: 999 }}
    >
      {index >= 0 && <p>{STORY_TEXTS[index]}</p>}
    </div>
  );
});

/* -----------------------------------------------------
   MAIN PAGE
----------------------------------------------------- */
export default function ExteriorPage({ enterInterior }) {
  const [zooming, setZooming] = useState(false);
  const [hdrReady, setHdrReady] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  const sceneVisible = hdrReady && modelReady;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        position: "relative",
      }}
    >

      {/* ---------------------------------------------------
           PILL NAVBAR (added, changed NOTHING else)
      --------------------------------------------------- */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 
                   flex gap-6 px-8 py-3 bg-white/20 backdrop-blur-md 
                   rounded-full shadow-lg z-[1000] text-white font-semibold"
      >
        <button className="px-4 py-1 hover:text-yellow-300 transition">
          About
        </button>
        <button className="px-4 py-1 hover:text-yellow-300 transition">
          Entry 2
        </button>
        <button className="px-4 py-1 hover:text-yellow-300 transition">
          Entry 3
        </button>
        <button className="px-4 py-1 hover:text-yellow-300 transition">
          Entry 4
        </button>
      </div>

      {sceneVisible && (
        <StoryOverlay onFinish={() => setZooming(false)} />
      )}

      <Canvas
        dpr={[1, 1.25]}
        camera={{ fov: 60, position: [50, 2, 5] }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
        style={{
          width: "100%",
          height: "100%",
          opacity: sceneVisible ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
        }}
      >
        <color attach="background" args={["#000"]} />

        <SceneHDRI onReady={() => setHdrReady(true)} />

        <ambientLight intensity={0.5} />
        <directionalLight intensity={1} position={[10, 20, 5]} />

        <Suspense fallback={null}>
          <PrisonExterior onLoaded={() => setModelReady(true)} />
        </Suspense>

        {sceneVisible && (
          <EnterText onClick={() => setZooming(true)} />
        )}

        <ExteriorCameraController
          zooming={zooming}
          onZoomComplete={() => enterInterior()}
        />
      </Canvas>
    </div>
  );
}
