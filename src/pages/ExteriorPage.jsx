import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Text3D } from "@react-three/drei";
import * as THREE from "three";

/* ---------------- PRISON EXTERIOR ---------------- */
function PrisonExterior() {
  const { scene } = useGLTF("/models/the_prison.glb");
  useEffect(() => scene.rotation.set(0, 0, 0), [scene]);
  return <primitive object={scene} scale={1.3} />;
}

/* ---------------- ENTER SIGN ---------------- */
function EnterText({ onClick }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 3 + Math.sin(t * 1.2) * 0.25;
    }
  });

  return (
    <Text3D
      ref={ref}
      font="/node_modules/three/examples/fonts/helvetiker_regular.typeface.json"
      position={[45, 3, -48]}
      rotation={[0, 0, 0]}
      size={2.5}
      height={0.3}
      bevelEnabled
      bevelSize={0.05}
      bevelThickness={0.1}
      onClick={onClick}
    >
      ENTER
      <meshStandardMaterial emissive="yellow" emissiveIntensity={1.5} />
    </Text3D>
  );
}

/* ---------------- CAMERA CONTROLLER + ZOOM ---------------- */
function ExteriorCameraController({ zooming, onZoomComplete }) {
  const { camera, gl } = useThree();

  const isDown = useRef(false);
  const lastX = useRef(0);
  const rotationRef = useRef(0);
  const baseYaw = useRef(0);

  const zoomTarget = new THREE.Vector3(50, 4, -42);

  /* Start position */
  useEffect(() => {
    camera.up.set(0, 1, 0);
    camera.position.set(50, 2, 5);

    requestAnimationFrame(() => {
      baseYaw.current = 0;
      rotationRef.current = 0;
      camera.rotation.set(0, 0, 0);
    });
  }, [camera]);

  /* Mouse look */
  useEffect(() => {
    const down = (e) => {
      isDown.current = true;
      lastX.current = e.clientX;
    };
    const up = () => (isDown.current = false);
    const move = (e) => {
      if (!isDown.current) return;
      const dx = (e.clientX - lastX.current) * 0.003;
      lastX.current = e.clientX;

      rotationRef.current = Math.min(
        Math.max(rotationRef.current + dx, baseYaw.current - Math.PI / 4),
        baseYaw.current + Math.PI / 4
      );
    };

    gl.domElement.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);

    return () => {
      gl.domElement.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", move);
    };
  }, [gl.domElement]);

  /* Apply rotation + perform zoom */
  useFrame(() => {
    camera.rotation.order = "YXZ";
    camera.rotation.y = rotationRef.current;

    if (zooming) {
      camera.position.lerp(zoomTarget, 0.04);

      if (camera.position.distanceTo(zoomTarget) < 0.5) {
        onZoomComplete();
      }
    }
  });

  return null;
}

/* ---------------- MAIN EXTERIOR PAGE ---------------- */
export default function ExteriorPage({ enterInterior }) {
  const [zooming, setZooming] = useState(false);

  const startZoom = () => setZooming(true);

  const finishZoom = () => {
    // Now we switch pages AFTER zoom
    enterInterior();
  };

  return (
    <Canvas
      camera={{ fov: 60, position: [50, 2, 5], near: 0.1, far: 2000 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 5]} intensity={1} />

      <PrisonExterior />

      <EnterText onClick={startZoom} />

      <ExteriorCameraController
        zooming={zooming}
        onZoomComplete={finishZoom}
      />
    </Canvas>
  );
}
