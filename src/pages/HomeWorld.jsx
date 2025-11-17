import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

/* --------------------------------------------
   PRISON INTERIOR
--------------------------------------------- */
function PrisonInterior() {
  const { scene } = useGLTF("/models/inside_prison.glb");
  useEffect(() => scene.rotation.set(0, 0, 0), [scene]);
  return <primitive object={scene} scale={1.3} />;
}

/* --------------------------------------------
   MANNEQUIN WITH OPTIONAL POSE
--------------------------------------------- */
function Mannequin({ position=[0,0,0], rotation=[0,0,0], pose=null }) {
  const { scene } = useGLTF("/models/mannequin.glb");
  const clone = SkeletonUtils.clone(scene);

  useEffect(() => {
    if (!pose) return;

    clone.traverse((bone) => {
      if (!bone.isBone) return;

      /* Existing poses */
      if (pose === "lean" && bone.name.includes("spine_03"))
        bone.rotation.x = -0.3;

      if (pose === "open") {
        if (bone.name.includes("upperarm_l")) bone.rotation.z = 0.4;
        if (bone.name.includes("upperarm_r")) bone.rotation.z = -0.4;
      }

      if (pose === "cross") {
        if (bone.name.includes("upperarm_l")) bone.rotation.z = -0.6;
        if (bone.name.includes("upperarm_r")) bone.rotation.z = 0.6;
        if (bone.name.includes("lowerarm_l")) bone.rotation.x = -1;
        if (bone.name.includes("lowerarm_r")) bone.rotation.x = -1;
      }

      if (pose === "behind") {
        if (bone.name.includes("upperarm_l")) bone.rotation.x = -0.6;
        if (bone.name.includes("upperarm_r")) bone.rotation.x = -0.6;
        if (bone.name.includes("lowerarm_l")) bone.rotation.x = -1.2;
        if (bone.name.includes("lowerarm_r")) bone.rotation.x = -1.2;
      }

      if (pose === "down" && bone.name.includes("spine_05")) {
        bone.rotation.x = 0.4;
      }

      /* --------------------------------------------
         NEW POSE: ARMS FOLDED + WALL LEAN (m8)
      --------------------------------------------- */
      if (pose === "foldlean") {
        // Lean torso backward slightly
        if (bone.name.includes("spine_03")) bone.rotation.x = 0.18;
        if (bone.name.includes("spine_04")) bone.rotation.x = 0.28;
        if (bone.name.includes("spine_05")) bone.rotation.x = 0.32;

        // ARMS FOLDED (NOT crossed)
        // L arm comes inward
        if (bone.name.includes("upperarm_l")) bone.rotation.z = -0.35;
        if (bone.name.includes("lowerarm_l")) bone.rotation.x = -0.7;

        // R arm comes inward slightly above
        if (bone.name.includes("upperarm_r")) bone.rotation.z = 0.35;
        if (bone.name.includes("lowerarm_r")) bone.rotation.x = -0.4;

        // Relax head down a bit
        if (bone.name.includes("head")) bone.rotation.x = 0.1;

        // Slight sideways lean — reversed direction from before
        if (bone.name.includes("spine_02")) bone.rotation.z = -0.1;
      }
    });
  }, [clone, pose]);

  return (
    <group position={position} rotation={rotation} scale={1}>
      <primitive object={clone} />
    </group>
  );
}

/* --------------------------------------------
   CAMERA CONTROLLER (unchanged)
--------------------------------------------- */
function LimitedLookCamera({ inside }) {
  const { camera, gl } = useThree();

  const [down, setDown] = useState(false);
  const rotationRef = useRef(0);
  const lastX = useRef(0);
  const baseYaw = useRef(0);

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
    camera.position.set(10, 9, 0.5);

    requestAnimationFrame(() => {
      baseYaw.current = Math.PI / 2;
      rotationRef.current = baseYaw.current;
      camera.rotation.set(-0.5, baseYaw.current, 0);
    });
  }, [inside, camera]);

  useEffect(() => {
    const downFn = (e) => { setDown(true); lastX.current = e.clientX; };
    const upFn = () => setDown(false);

    const moveFn = (e) => {
      if (!down) return;
      const dx = (e.clientX - lastX.current) * 0.003;
      lastX.current = e.clientX;

      rotationRef.current = Math.min(
        Math.max(rotationRef.current + dx, baseYaw.current - Math.PI/4),
        baseYaw.current + Math.PI/4
      );
    };

    gl.domElement.addEventListener("mousedown", downFn);
    window.addEventListener("mouseup", upFn);
    window.addEventListener("mousemove", moveFn);

    return () => {
      gl.domElement.removeEventListener("mousedown", downFn);
      window.removeEventListener("mouseup", upFn);
      window.removeEventListener("mousemove", moveFn);
    };
  }, [down, gl.domElement]);

  useFrame(() => {
    camera.rotation.order = "YXZ";
    camera.rotation.y = rotationRef.current;
    camera.rotation.z = 0;
  });

  return null;
}

/* --------------------------------------------
   MAIN WORLD
--------------------------------------------- */
export default function HomeWorld() {
  const [inside] = useState(true);

  /* GROUP 1 — talking pair */
  const m1 = { pos: [1, 4.5, -5], rot: 0 };
  const m2 = { pos: [0.5, 4.5, -5], rot: Math.PI/2 };

  /* GROUP 2 — lean + open */
  const m3 = { pos: [5.5, 4.5, 5], rot: Math.PI/1.8, pose: "lean" };
  const m4 = { pos: [6, 4.5, 5], rot: -Math.PI/2, pose: "open" };

  /* GROUP 3 — arms crossed + looking down */
  const m5 = { pos: [1.5, 1.2, 2], rot: Math.PI/1.5, pose: "cross" };
  const m6 = { pos: [2.5, 1.2, 2], rot: -Math.PI/1.5, pose: "down" };
  const m7 = { pos: [2, 1.2, 2.5], rot: Math.PI/1, pose: "behind" };

  /* GROUP 4 — m8 leaning with arms folded */
  const m8 = { 
    pos: [0, 4.5, 5.8], 
    rot: -Math.PI/1, 
    pose: "foldlean",
    tilt: 0.22   // reversed lean direction
  };

  return (
    <Canvas camera={{ fov:60, near:0.1, far:2000 }} style={{width:"100vw", height:"100vh"}}>
      <ambientLight intensity={0.6}/>
      <directionalLight position={[10,20,5]} intensity={1}/>

      <PrisonInterior />

      <Mannequin position={m1.pos} rotation={[0,m1.rot,0]} />
      <Mannequin position={m2.pos} rotation={[0,m2.rot,0]} />

      <Mannequin position={m3.pos} rotation={[0,m3.rot,0]} pose={m3.pose}/>
      <Mannequin position={m4.pos} rotation={[0,m4.rot,0]} pose={m4.pose}/>

      <Mannequin position={m5.pos} rotation={[0,m5.rot,0]} pose={m5.pose}/>
      <Mannequin position={m6.pos} rotation={[0,m6.rot,0]} pose={m6.pose}/>

      <Mannequin position={m7.pos} rotation={[0,m7.rot,0]} pose={m7.pose}/>

      {/* m8 with folded arms + reversed tilt */}
      <Mannequin 
        position={m8.pos}
        rotation={[m8.tilt, m8.rot, 0]}
        pose={m8.pose}
      />

      <LimitedLookCamera inside={inside} />
    </Canvas>
  );
}
