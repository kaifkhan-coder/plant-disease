import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import Plant3D from "./Plant3D";

function CameraRig() {
  const group = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  // Track mouse (normalized)
  const onMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.current = { x, y };
  };

  useFrame(() => {
    if (!group.current) return;

    // Smooth parallax camera rig
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.current.x * 0.25,
      0.05
    );

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouse.current.y * 0.15,
      0.05
    );
  });

  return (
    <group ref={group} onPointerMove={onMove}>
      <Plant3D />
    </group>
  );
}

const PlantScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 4], fov: 45 }}
      shadows
      dpr={[1, 2]}
    >
      {/* Environment gives realistic lighting reflections */}
      <Environment preset="forest" />

      {/* Lights (clean cinematic) */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Rim light */}
      <directionalLight position={[-6, 3, -4]} intensity={0.6} />

      {/* Plant inside camera rig */}
      <CameraRig />

      {/* Soft ground shadow (looks premium) */}
      <ContactShadows
        position={[0, -1.25, 0]}
        opacity={0.5}
        scale={8}
        blur={2.8}
        far={5}
      />

      {/* Controls: keep clean, add subtle auto rotate */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}   // keep it UI-clean
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
};

export default PlantScene;
