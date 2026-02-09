import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Plant3D from "./Plant3D";

const PlantScene = () => {
  return (
    <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Plant */}
      <Plant3D />

      {/* Disable zoom for clean UI */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default PlantScene;
