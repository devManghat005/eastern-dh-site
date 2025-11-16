import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";

/* ---------------------------------------------------------
   FREE-ROAM CAMERA CONTROLS (WASD + Mouse Look)
--------------------------------------------------------- */

function FreeCameraControls() {
  const { camera, gl } = useThree();

  const vel = 0.4;              // movement speed
  const lookSpeed = 0.002;      // mouse sensitivity
  const keys = useRef({});      // held keys tracker
  const rot = useRef({ x: 0, y: 0 }); // stored rotation angles

  /* Track pressed keys */
  useEffect(() => {
    const down = (e) => (keys.current[e.key.toLowerCase()] = true);
    const up = (e) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  /* Mouse Look */
  useEffect(() => {
    const onMouseMove = (e) => {
      rot.current.y -= e.movementX * lookSpeed; // left/right
      rot.current.x -= e.movementY * lookSpeed; // up/down
      rot.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rot.current.x));
    };

    const onClick = () => {
      gl.domElement.requestPointerLock();
    };

    document.addEventListener("mousemove", onMouseMove);
    gl.domElement.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      gl.domElement.removeEventListener("click", onClick);
    };
  }, [gl]);

  /* Movement + Apply Rotation */
  useFrame(() => {
    // Apply rotation directly to camera
    camera.rotation.x = rot.current.x;
    camera.rotation.y = rot.current.y;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    if (keys.current["w"]) camera.position.addScaledVector(dir, vel);
    if (keys.current["s"]) camera.position.addScaledVector(dir, -vel);

    const right = new THREE.Vector3();
    right.crossVectors(dir, camera.up).normalize();

    if (keys.current["a"]) camera.position.addScaledVector(right, -vel);
    if (keys.current["d"]) camera.position.addScaledVector(right, vel);
  });

  return (
    <Html position={[0, 0, 0]}>
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 30,
          padding: "10px 14px",
          background: "#000",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "12px",
          opacity: 0.8,
          lineHeight: "16px",
        }}
      >
        <strong>Camera Debug</strong>
        <br />
        Pos X: {camera.position.x.toFixed(2)}
        <br />
        Pos Y: {camera.position.y.toFixed(2)}
        <br />
        Pos Z: {camera.position.z.toFixed(2)}
        <br />
        <br />
        Rot X: {camera.rotation.x.toFixed(2)}
        <br />
        Rot Y: {camera.rotation.y.toFixed(2)}
        <br />
        Rot Z: {camera.rotation.z.toFixed(2)}
      </div>
    </Html>
  );
}

/* ---------------------------------------------------------
   PRISON MODEL LOADER
--------------------------------------------------------- */

function PrisonModel() {
  const { scene } = useGLTF("/models/the_prison.glb");
  return <primitive object={scene} scale={1} />;
}

useGLTF.preload("/models/the_prison.glb");

/* ---------------------------------------------------------
   MAIN PAGE
--------------------------------------------------------- */

export default function PrisonWorld() {
  return (
    <div className="w-full h-screen bg-white">
      <Canvas
        camera={{
          position: [15, 20, 30], // starting position
          fov: 60,
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight intensity={1.5} position={[10, 20, 10]} />

        <PrisonModel />
        <FreeCameraControls />
      </Canvas>
    </div>
  );
}
