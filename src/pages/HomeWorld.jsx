import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Text3D } from "@react-three/drei";
import * as THREE from "three";

/* --------------------------------------------
   3D MODELS WITH ROTATION OVERRIDE FIX
--------------------------------------------- */

function PrisonExterior() {
  const { scene } = useGLTF("/models/the_prison.glb");

  // OVERRIDE INTERNAL GLB ROTATION
  useEffect(() => {
    scene.rotation.set(0, 0, 0);
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={1.3}
    />
  );
}

function PrisonInterior() {
  const { scene } = useGLTF("/models/inside_prison.glb");

  // OVERRIDE INTERNAL GLB ROTATION
  useEffect(() => {
    scene.rotation.set(0, 0, 0);
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={1.3}
    />
  );
}

/* --------------------------------------------
   CLICKABLE FLOATING ENTER LABEL
--------------------------------------------- */

function EnterText({ onClick }) {
  return (
    <Text3D
      font="/node_modules/three/examples/fonts/helvetiker_regular.typeface.json"
      position={[45, 3, -48]}   // Adjust manually as needed
      rotation={[0, 0, 0]}
      size={2.5}
      height={0.3}
      bevelEnabled
      bevelSize={0.05}
      bevelThickness={0.1}
      onClick={onClick}
    >
      ENTER
      <meshStandardMaterial color="red" />
    </Text3D>
  );
}

/* --------------------------------------------
   FIXED CAMERA + LIMITED LOOK AROUND + ZOOM
--------------------------------------------- */

function LimitedLookCamera({ zooming, zoomTarget, onZoomDone }) {
  const { camera, gl } = useThree();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const rotationRef = useRef(0);
  const lastX = useRef(0);

  useEffect(() => {
    camera.up.set(0, 1, 0);
    camera.position.set(50, 2, 5);
    camera.lookAt(0, 5, 0);
    camera.rotation.z = 0;
  }, [camera]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      setIsMouseDown(true);
      lastX.current = e.clientX;
    };

    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseMove = (e) => {
      if (!isMouseDown) return;

      const delta = (e.clientX - lastX.current) * 0.003;
      lastX.current = e.clientX;

      rotationRef.current = Math.min(
        Math.max(rotationRef.current + delta, -Math.PI / 4),
        Math.PI / 4
      );
    };

    gl.domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMouseDown, gl.domElement]);

  useFrame(() => {
    camera.rotation.order = "YXZ";
    camera.rotation.y = rotationRef.current;
    camera.rotation.z = 0;

    if (zooming && zoomTarget) {
      camera.position.lerp(zoomTarget, 0.05);
      if (camera.position.distanceTo(zoomTarget) < 0.5) {
        onZoomDone && onZoomDone();
      }
    }
  });

  return null;
}

/* --------------------------------------------
   MAIN WORLD
--------------------------------------------- */

export default function HomeWorld() {
  const [inside, setInside] = useState(false);
  const [zooming, setZooming] = useState(false);

  // WHERE THE CAMERA ZOOMS BEFORE INTERIOR LOADS
  const zoomTarget = new THREE.Vector3(20, 5, 2);

  const handleEnterClick = () => {
    setZooming(true);
  };

  const handleZoomDone = () => {
    setZooming(false);
    setInside(true);
  };

  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 2000 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 5]} intensity={1} />

      {!inside && <PrisonExterior />}
      {!inside && <EnterText onClick={handleEnterClick} />}

      {inside && <PrisonInterior />}

      <LimitedLookCamera
        zooming={zooming}
        zoomTarget={zoomTarget}
        onZoomDone={handleZoomDone}
      />
    </Canvas>
  );
}
