"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, AdaptiveDpr } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import PerfumeBottle from "./PerfumeBottle";

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <spotLight
        position={[0, 5, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={2}
        color="#d4af37"
        distance={20}
      />
      <pointLight position={[0, -2, 2]} intensity={0.5} color="#f0d68a" />
      <PerfumeBottle />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={0.5} />
      </mesh>
      <Environment preset="night" />
      <AdaptiveDpr pixelated />
    </>
  );
}

export default function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      {visible && (
        <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} frameloop="demand">
          <PerspectiveCamera makeDefault position={[0, 0, 3.5]} fov={45} />
          <Suspense fallback={null}>
            <SceneContent />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
