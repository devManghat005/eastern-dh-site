import React from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export default function DebugHUD() {
  const { camera } = useThree();
  const [pos, setPos] = React.useState({ x: 0, y: 0, z: 0 });

  useFrame(() => {
    setPos({
      x: camera.position.x.toFixed(2),
      y: camera.position.y.toFixed(2),
      z: camera.position.z.toFixed(2),
    });
  });

  return (
    <Html position={[0, 0, 0]}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.6)",
          padding: "8px 12px",
          borderRadius: "8px",
          color: "white",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
      >
        X: {pos.x} <br />
        Y: {pos.y} <br />
        Z: {pos.z}
      </div>
    </Html>
  );
}
