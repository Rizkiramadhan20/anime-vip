'use client'

import React, { useRef, useMemo, useState } from 'react'

import { Canvas, useFrame, useThree } from '@react-three/fiber'

import { useSpring, animated } from '@react-spring/three'

import * as THREE from 'three'

function AnimatedBlob({ position, scale, color, speed = 1, mousePosition }: {
    position: [number, number, number]
    scale: number
    color: string
    speed?: number
    mousePosition: THREE.Vector3
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [springs, api] = useSpring(() => ({
        scale: scale,
        position: position,
        config: { mass: 1, tension: 170, friction: 26 }
    }))

    // Create modern blob geometry with more organic shape
    const geometry = useMemo(() => {
        const geo = new THREE.SphereGeometry(1, 64, 64)
        const positions = geo.attributes.position.array
        const vertex = new THREE.Vector3()

        for (let i = 0; i < positions.length; i += 3) {
            vertex.fromArray(positions, i)
            const noise = Math.sin(vertex.x * 3) * Math.sin(vertex.y * 2) * Math.sin(vertex.z * 4) * 0.15
            vertex.normalize().multiplyScalar(1 + noise)
            vertex.toArray(positions, i)
        }

        geo.computeVertexNormals()
        return geo
    }, [])

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.elapsedTime * speed
            meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2
            meshRef.current.rotation.y = Math.cos(time * 0.5) * 0.2
            meshRef.current.rotation.z = Math.sin(time * 0.7) * 0.1

            // Smooth breathing effect
            const breathingScale = 1 + Math.sin(time * 1.5) * 0.08

            // Mouse interaction - move blob away from cursor
            const blobPosition = new THREE.Vector3(...position)
            const distance = blobPosition.distanceTo(mousePosition)
            const repulsionRadius = 2.5
            const repulsionStrength = 0.8

            if (distance < repulsionRadius) {
                const direction = blobPosition.clone().sub(mousePosition).normalize()
                const repulsion = direction.multiplyScalar((repulsionRadius - distance) * repulsionStrength)
                const newPosition = blobPosition.clone().add(repulsion)

                api.start({
                    scale: scale * breathingScale * (1 + (repulsionRadius - distance) * 0.1),
                    position: [newPosition.x, newPosition.y, newPosition.z]
                })
            } else {
                api.start({
                    scale: scale * breathingScale,
                    position: position
                })
            }
        }
    })

    return (
        <animated.mesh
            ref={meshRef}
            position={springs.position}
            scale={springs.scale}
        >
            <primitive object={geometry} />
            <meshStandardMaterial
                color={color}
                transparent
                opacity={0.7}
                roughness={0.2}
                metalness={0.3}
                envMapIntensity={0.5}
            />
        </animated.mesh>
    )
}

function MouseTracker({ onMouseMove }: { onMouseMove: (position: THREE.Vector3) => void }) {
    const { camera } = useThree()

    useFrame((state) => {
        const mouse = state.mouse
        const vector = new THREE.Vector3(mouse.x * 5, mouse.y * 3, 0)
        onMouseMove(vector)
    })

    return null
}

function FloatingParticles() {
    const particlesRef = useRef<THREE.Points>(null)

    const particlesGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry()
        const particleCount = 100
        const positions = new Float32Array(particleCount * 3)

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10
            positions[i + 1] = (Math.random() - 0.5) * 10
            positions[i + 2] = (Math.random() - 0.5) * 10
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        return geometry
    }, [])

    useFrame((state) => {
        if (particlesRef.current) {
            const time = state.clock.elapsedTime
            particlesRef.current.rotation.y = time * 0.1
            particlesRef.current.rotation.x = time * 0.05
        }
    })

    return (
        <points ref={particlesRef} geometry={particlesGeometry}>
            <pointsMaterial
                size={0.02}
                color="#ffffff"
                transparent
                opacity={0.3}
                sizeAttenuation
            />
        </points>
    )
}

function BlobsScene() {
    const [mousePosition, setMousePosition] = useState<THREE.Vector3>(new THREE.Vector3())

    return (
        <>
            {/* Mouse tracker for interaction */}
            <MouseTracker onMouseMove={setMousePosition} />

            {/* Modern lighting setup */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={0.6} color="#ffffff" />
            <pointLight position={[-10, -10, -5]} intensity={0.4} color="#a5b4fc" />
            <pointLight position={[10, -10, -5]} intensity={0.3} color="#f0abfc" />

            {/* Environment for reflections */}
            <fog attach="fog" args={['#000000', 5, 15]} />

            {/* Main animated blobs */}
            <AnimatedBlob
                position={[2.5, 1.2, 0]}
                scale={1.4}
                color="#a5b4fc"
                speed={0.6}
                mousePosition={mousePosition}
            />
            <AnimatedBlob
                position={[-2, -0.8, 0]}
                scale={1.0}
                color="#f0abfc"
                speed={0.8}
                mousePosition={mousePosition}
            />
            <AnimatedBlob
                position={[0.8, -1.5, 0]}
                scale={0.8}
                color="#c084fc"
                speed={1.0}
                mousePosition={mousePosition}
            />
            <AnimatedBlob
                position={[-0.5, 1.8, 0]}
                scale={0.6}
                color="#a78bfa"
                speed={0.7}
                mousePosition={mousePosition}
            />

            {/* Floating particles for modern effect */}
            <FloatingParticles />
        </>
    )
}

export default function BlobsBackground() {
    return (
        <div className="block flex-1 bg-gradient-to-br from-primary/10 via-primary/20 to-accent/20 rounded-l-3xl relative overflow-hidden order-first lg:order-last">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                style={{ background: 'transparent' }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
            >
                <BlobsScene />
            </Canvas>
        </div>
    )
}
