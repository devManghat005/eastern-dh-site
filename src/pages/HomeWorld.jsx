import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

/* Load the model */
function PrisonModel() {
  const { scene } = useGLTF("/models/the_prison.glb");
  return (
    <primitive
      object={scene}
      scale={1.3}
      rotation={[0, 0, 0]}  // <-- use this instead
    />
  );
}



/* ---------------- FIXED CAMERA + LIMITED LOOK AROUND ---------------- */
function LimitedLookCamera() {
  const { camera, gl } = useThree();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const rotationRef = useRef(0); // current yaw rotation
  const lastX = useRef(0);

  // FIX CAMERA POSITION
  useEffect(() => {
    camera.position.set(50, 2, 5); // Change if needed
    camera.lookAt(0, 5, 0);
  }, [camera]);

  // Mouse Down
  useEffect(() => {
    const handleMouseDown = (e) => {
      isMouseDown || setIsMouseDown(true);
      lastX.current = e.clientX;
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    const handleMouseMove = (e) => {
      if (!isMouseDown) return;

      const delta = (e.clientX - lastX.current) * 0.003; // sensitivity
      lastX.current = e.clientX;

      // Apply limited yaw rotation
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

  // Update the camera every frame
  useFrame(() => {
    const yaw = rotationRef.current;
    const distance = 1;

    // Camera orientation relative to fixed position
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw; // limit left/right
  });

  return null;
}

/* ---------------- WORLD ---------------- */

export default function HomeWorld() {
  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 2000 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 5]} intensity={1} />

      {/* 3D Model */}
      <PrisonModel />

      {/* Limited Look Camera Controller */}
      <LimitedLookCamera />
    </Canvas>
  );
}
