import * as THREE from "three"; // ← MUST BE FIRST IMPORT
import { useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";



export default function HandsRig() {
  const { scene } = useGLTF("/models/first_person_hands_rigged.glb");
  const { camera } = useThree();
  const group = useRef();

  // Ensure model scale/rotation for visibility
  scene.scale.set(1.2, 1.2, 1.2); // enlarge hands slightly
  scene.rotation.set(0, Math.PI, 0); // flip 180 degrees if facing backwards

  useFrame((state) => {
    if (!group.current) return;

    // Attach to camera
    const t = state.clock.elapsedTime;

    group.current.position.copy(camera.position);

    // Offset relative to camera direction
    group.current.position.add(
      camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(0.1)
    );

    // Local offset inside camera view
    group.current.position.add(new THREE.Vector3(0.25, -0.35, -0.6));

    // Slight idle sway
    group.current.rotation.set(
      Math.sin(t * 2) * 0.02,
      Math.sin(t * 1.5) * 0.03,
      0
    );

    // Match camera orientation
    group.current.quaternion.copy(camera.quaternion);
  });

  return <primitive ref={group} object={scene} />;
}
