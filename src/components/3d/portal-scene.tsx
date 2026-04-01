import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

interface PortalSceneProps {
  color?: string; // hex color
  isJumping?: boolean;
}

export function PortalScene({ color = '#06b6d4', isJumping = false }: PortalSceneProps) {
  const ringsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const targetCameraZ = useRef(5);
  
  // Create 8 nested rings for the tunnel
  const rings = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      radius: 1 + i * 0.4,
      tube: 0.02 + i * 0.005,
      speed: (i % 2 === 0 ? 1 : -1) * (0.2 + (12 - i) * 0.05),
      zOffset: -i * 1.5
    }));
  }, []);

  const targetColor = useMemo(() => new THREE.Color(color), [color]);
  const currentColor = useRef(new THREE.Color(color));

  useFrame((state, delta) => {
    // Lerp colors for smooth transitions
    currentColor.current.lerp(targetColor, delta * 2);

    if (ringsRef.current) {
      ringsRef.current.children.forEach((child, i) => {
        child.rotation.z += rings[i].speed * delta;
        // Pulse scale slightly
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
        child.scale.set(pulse, pulse, pulse);
        
        // Update material color
        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        material.emissive.copy(currentColor.current);
        material.color.copy(currentColor.current);
        
        // If jumping, stretch the rings towards the camera (warp effect)
        if (isJumping) {
          child.position.z += delta * 20 * (i * 0.1 + 1);
        } else {
          // Reset positioning if not jumping
          child.position.z = THREE.MathUtils.lerp(child.position.z, rings[i].zOffset, delta * 2);
        }
      });
    }

    if (coreRef.current) {
       const mat = coreRef.current.material as THREE.MeshStandardMaterial;
       mat.emissive.copy(currentColor.current);
       mat.color.copy(currentColor.current);
       coreRef.current.rotation.z -= delta * 0.5;
       
       if (isJumping) {
         coreRef.current.scale.lerp(new THREE.Vector3(50, 50, 50), delta * 5);
       } else {
         coreRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 2);
       }
    }

    // Camera animation for jump
    if (isJumping) {
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, -10, delta * 3);
    } else {
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5, delta * 2);
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 2]} intensity={isJumping ? 5 : 2} color={color} distance={20} />
      
      <Stars radius={50} depth={20} count={3000} factor={4} saturation={1} fade speed={isJumping ? 5 : 1} />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <group ref={ringsRef}>
          {rings.map((ring, i) => (
            <mesh key={i} position={[0, 0, ring.zOffset]}>
              <torusGeometry args={[ring.radius, ring.tube, 16, 100]} />
              <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={1.5} 
                transparent 
                opacity={Math.max(0.1, 1 - (i * 0.08))} 
                wireframe={i % 3 === 0}
              />
            </mesh>
          ))}
        </group>
        
        {/* The Singularity Core */}
        <mesh ref={coreRef} position={[0, 0, -20]}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            transparent
            opacity={0.8}
            wireframe
          />
        </mesh>
      </Float>
      
      {/* Fog to obscure the back of the tunnel */}
      <fog attach="fog" args={['#020617', 2, 25]} />
    </>
  );
}
