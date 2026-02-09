import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap";

const Plant3D = () => {
  const plantRef = useRef();
  const { scene } = useGLTF("/models/plant.glb");

  useEffect(() => {
    if (!plantRef.current) return;

    // Floating animation
    gsap.to(plantRef.current.position, {
      y: 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Slow rotation
    gsap.to(plantRef.current.rotation, {
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <primitive
      ref={plantRef}
      object={scene}
      scale={1.2}
      position={[0, -1, 0]}
    />
  );
};

export default Plant3D;
