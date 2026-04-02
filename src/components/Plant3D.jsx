import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import * as THREE from "three";

const Plant3D = () => {
  const plantRef = useRef();
  const { scene } = useGLTF("/models/plant.glb");

  useEffect(() => {
    if (!plantRef.current) return;

    // Floating animation
    gsap.to(plantRef.current.position, {
      y: -0.85, // float around this
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Slow rotation (base)
    gsap.to(plantRef.current.rotation, {
      y: Math.PI * 2,
      duration: 22,
      repeat: -1,
      ease: "none",
    });

    // Breathing scale (subtle life feel)
    gsap.to(plantRef.current.scale, {
      x: 1.23,
      y: 1.26,
      z: 1.23,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  // Pointer-based 3D tilt (smooth)
  useFrame(({ mouse }) => {
    if (!plantRef.current) return;

    const targetRotX = mouse.y * 0.18;
    const targetRotZ = -mouse.x * 0.18;

    plantRef.current.rotation.x = THREE.MathUtils.lerp(
      plantRef.current.rotation.x,
      targetRotX,
      0.05
    );

    plantRef.current.rotation.z = THREE.MathUtils.lerp(
      plantRef.current.rotation.z,
      targetRotZ,
      0.05
    );
  });

  return (
    <primitive
      ref={plantRef}
      object={scene}
      scale={1.2}
      position={[0, -1, 0]}
      castShadow
      receiveShadow
    />
  );
};

useGLTF.preload("/models/plant.glb");

export default Plant3D;
