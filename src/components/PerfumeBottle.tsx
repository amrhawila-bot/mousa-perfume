"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const PARTICLE_COUNT = 60;

const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 8;
  particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
}

function Particles() {
  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#d4af37"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function PerfumeBottle() {
  const groupRef = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (capRef.current) {
      capRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <Particles />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={groupRef} position={[0, -0.5, 0]}>
          <mesh position={[0, 0.6, 0]} ref={capRef}>
            <cylinderGeometry args={[0.25, 0.3, 0.4, 16]} />
            <meshPhysicalMaterial
              color="#d4af37"
              metalness={0.95}
              roughness={0.05}
              envMapIntensity={3}
            />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.15, 0.25, 0.08, 16]} />
            <meshPhysicalMaterial
              color="#d4af37"
              metalness={0.9}
              roughness={0.1}
              envMapIntensity={2}
            />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
            <meshPhysicalMaterial
              color="#f0d68a"
              metalness={0.8}
              roughness={0.15}
              envMapIntensity={2}
            />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.9, 1.1, 0.55]} />
            <MeshTransmissionMaterial
              backside
              thickness={0.5}
              roughness={0.02}
              transmission={0.96}
              ior={1.5}
              chromaticAberration={0.06}
              color="#1a1a2e"
              envMapIntensity={1.5}
              clearcoat={0.4}
              clearcoatRoughness={0.15}
            />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.82, 0.7, 0.48]} />
            <MeshDistortMaterial
              color="#d4af37"
              emissive="#d4af37"
              emissiveIntensity={0.2}
              metalness={0.4}
              roughness={0.05}
              transparent
              opacity={0.5}
              distort={0.15}
              speed={1.5}
            />
          </mesh>
          <mesh position={[0, -0.85, 0]}>
            <boxGeometry args={[0.95, 0.08, 0.6]} />
            <meshPhysicalMaterial
              color="#d4af37"
              metalness={0.95}
              roughness={0.1}
              envMapIntensity={3}
            />
          </mesh>
          <mesh position={[0, -0.9, 0]}>
            <boxGeometry args={[0.95, 0.04, 0.6]} />
            <meshPhysicalMaterial
              color="#f0d68a"
              metalness={0.8}
              roughness={0.25}
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      </Float>
    </>
  );
}
