"use client"

import type React from "react"

import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera, Html, Float, Text, RoundedBox } from "@react-three/drei"
import { useState, useRef, useEffect } from "react"
import * as THREE from "three"
import portfolioData from "@/data/portfolio.json"
import { SpookyIsland } from "./spooky-island"
import { SkyCabinIsland } from "./sky-cabin-island"
import { SingularityCrystal } from "./singularity-crystal"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Code,
  Briefcase,
  FolderOpen,
  MessageSquare,
  Server,
  Smartphone,
  Layout,
  Database,
  Terminal,
  X,
  FileText,
  Award,
  Folder,
  Gamepad2,
  Rocket,
  Zap,
  Trophy,
  Music, 
  Brain,
} from "lucide-react"
import { getGamesByCategory, getColorByTags } from "@/data/games";

const themeColors = {
  dark: {
    floor: "#0a0a0f",
    wall: "#0d0d15",
    desk: "#1a1a24",
    panel: "#0a0a0f",
    text: "#ffffff",
    textMuted: "#94a3b8",
    roomBg: "#0f172a",
  },
  light: {
    floor: "#f1f5f9",
    wall: "#e2e8f0",
    desk: "#cbd5e1",
    panel: "#f8fafc",
    text: "#0f172a",
    textMuted: "#475569",
    roomBg: "#f1f5f9",
  },
}

const rooms = [
  { id: "entrance", name: "Entrance", icon: Home, position: [0, 0, 0] as [number, number, number], cameraPosition: [0, 2, 8] as [number, number, number] },
  { id: "about", name: "About", icon: User, position: [15, 0, 0] as [number, number, number], cameraPosition: [15, 2, 8] as [number, number, number] },
  { id: "skills", name: "Skills", icon: Code, position: [30, 0, 0] as [number, number, number], cameraPosition: [30, 2, 8] as [number, number, number] },
  { id: "experience", name: "Experience", icon: Briefcase, position: [45, 0, 0] as [number, number, number], cameraPosition: [45, 2, 8] as [number, number, number] },
  { id: "contact", name: "Contact", icon: MessageSquare, position: [75, 0, 0] as [number, number, number], cameraPosition: [75, 2, 8] as [number, number, number] },
]

function Room({
  position,
  children,
  color,
  isDark = true,
}: { position: [number, number, number]; children: React.ReactNode; color?: string; isDark?: boolean }) {
  const colors = isDark ? themeColors.dark : themeColors.light
  const roomColor = color || colors.roomBg

  return (
    <group position={position}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={roomColor} roughness={0.8} />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, 2, -7]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={roomColor} roughness={0.9} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-7, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={roomColor} roughness={0.9} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[7, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={roomColor} roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={roomColor} roughness={0.9} />
      </mesh>
      {children}
    </group>
  )
}

function FloatingFrame({
  position,
  rotation = [0, 0, 0],
  children,
  size = [4, 3],
  isDark = true,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  children: React.ReactNode
  size?: [number, number]
  isDark?: boolean
}) {
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position} rotation={rotation as any}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[size[0] + 0.3, size[1] + 0.3, 0.1]} />
          <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Inner Frame */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[size[0], size[1], 0.05]} />
          <meshStandardMaterial color={colors.panel} />
        </mesh>
        {/* Content */}
        <Html transform position={[0, 0, 0.15]} scale={0.4} center>
          <div className="w-[400px] text-center">{children}</div>
        </Html>
      </group>
    </Float>
  )
}

function ColorfulRoom({
  position,
  children,
  isDark = true,
}: { position: [number, number, number]; children: React.ReactNode; isDark?: boolean }) {
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <group position={position}>
      {/* Floor with gradient effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={colors.floor} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 2, -7]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-7, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[7, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={colors.floor} roughness={0.9} />
      </mesh>

      {/* Colorful accent lights on walls */}
      <mesh position={[-6.5, 5, -6.9]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2} />
      </mesh>
      <mesh position={[6.5, 5, -6.9]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 6.8, -6.9]}>
        <boxGeometry args={[13, 0.1, 0.1]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={1.5} />
      </mesh>

      {/* Side wall neon accents */}
      <mesh position={[-6.9, 0, -5]}>
        <boxGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={2} />
      </mesh>
      <mesh position={[6.9, 0, -5]}>
        <boxGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} />
      </mesh>

      {/* Floor LED strips */}
      <mesh position={[0, -2.95, -6.9]}>
        <boxGeometry args={[14, 0.08, 0.08]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-6.9, -2.95, 0]}>
        <boxGeometry args={[0.08, 0.08, 14]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2} />
      </mesh>
      <mesh position={[6.9, -2.95, 0]}>
        <boxGeometry args={[0.08, 0.08, 14]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
      </mesh>

      {children}
    </group>
  )
}

// Particle Pyramid Hologram - rotating particle pyramid with glow
function ParticlePyramid({ position }: { position: [number, number, number] }) {
  const outerGroupRef = useRef<THREE.Group>(null)
  const innerGroupRef = useRef<THREE.Group>(null)
  const outerPointsRef = useRef<THREE.Points>(null)
  const innerPointsRef = useRef<THREE.Points>(null)
  const outerMatRef = useRef<THREE.PointsMaterial>(null)
  const innerMatRef = useRef<THREE.PointsMaterial>(null)
  const light1Ref = useRef<THREE.PointLight>(null)
  const light2Ref = useRef<THREE.PointLight>(null)
  const [hovered, setHovered] = useState(false)
  const hoverIntensity = useRef(0)
  
  const createPyramidParticles = (height: number, baseSize: number, count: number) => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      const t = Math.random()
      const u = Math.random()
      
      const apex = { x: 0, y: height, z: 0 }
      const base = [
        { x: -baseSize, y: 0, z: -baseSize },
        { x: baseSize, y: 0, z: -baseSize },
        { x: baseSize, y: 0, z: baseSize },
        { x: -baseSize, y: 0, z: baseSize }
      ]
      
      const face = Math.floor(Math.random() * 4)
      const basePoint1 = base[face]
      const basePoint2 = base[(face + 1) % 4]
      
      const x = (1 - t) * ((1 - u) * basePoint1.x + u * basePoint2.x) + t * apex.x
      const y = (1 - t) * 0 + t * height
      const z = (1 - t) * ((1 - u) * basePoint1.z + u * basePoint2.z) + t * apex.z
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      const colorPos = y / height
      const cyan = { r: 0, g: 1, b: 1 }
      const blue = { r: 0.25, g: 0.41, b: 0.88 }
      const purple = { r: 0.58, g: 0, b: 0.83 }
      
      let color
      if (colorPos < 0.5) {
        const mix = colorPos * 2
        color = {
          r: cyan.r + (blue.r - cyan.r) * mix,
          g: cyan.g + (blue.g - cyan.g) * mix,
          b: cyan.b + (blue.b - cyan.b) * mix
        }
      } else {
        const mix = (colorPos - 0.5) * 2
        color = {
          r: blue.r + (purple.r - blue.r) * mix,
          g: blue.g + (purple.g - blue.g) * mix,
          b: blue.b + (purple.b - blue.b) * mix
        }
      }
      
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      
      sizes[i] = Math.random() < 0.1 ? 0.015 : 0.008
    }
    
    return { positions, colors, sizes }
  }
  
  const outerParticles = createPyramidParticles(0.2, 0.12, 800)
  const innerParticles = createPyramidParticles(0.12, 0.07, 500)
  
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    const target = hovered ? 1 : 0
    hoverIntensity.current += (target - hoverIntensity.current) * Math.min(delta * 6, 1)
    const h = hoverIntensity.current

    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y = time * (0.3 + h * 0.4)
    }
    if (innerGroupRef.current) {
      innerGroupRef.current.rotation.y = -time * (0.5 + h * 0.5)
    }
    
    const outerBaseSize = 0.008 + h * 0.012
    const outerPulseAmp = 0.02 + h * 0.03
    if (outerPointsRef.current) {
      const sizes = outerPointsRef.current.geometry.attributes.size.array as Float32Array
      for (let i = 0; i < sizes.length; i++) {
        if (Math.random() < (0.02 + h * 0.08)) {
          const pulse = Math.sin(time * 10 + i) * 0.5 + 0.5
          sizes[i] = outerBaseSize + pulse * outerPulseAmp
        }
      }
      outerPointsRef.current.geometry.attributes.size.needsUpdate = true
    }
    
    const innerBaseSize = 0.006 + h * 0.01
    const innerPulseAmp = 0.015 + h * 0.025
    if (innerPointsRef.current) {
      const sizes = innerPointsRef.current.geometry.attributes.size.array as Float32Array
      for (let i = 0; i < sizes.length; i++) {
        if (Math.random() < (0.02 + h * 0.08)) {
          const pulse = Math.sin(time * 12 + i) * 0.5 + 0.5
          sizes[i] = innerBaseSize + pulse * innerPulseAmp
        }
      }
      innerPointsRef.current.geometry.attributes.size.needsUpdate = true
    }

    if (outerMatRef.current) {
      outerMatRef.current.opacity = 0.9 + h * 0.1
      outerMatRef.current.size = outerBaseSize
    }
    if (innerMatRef.current) {
      innerMatRef.current.opacity = 0.95 + h * 0.05
      innerMatRef.current.size = innerBaseSize
    }
    if (light1Ref.current) {
      light1Ref.current.intensity = 1.2 + h * 3
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = 0.8 + h * 2.5
    }
  })

  return (
    <group position={position}>
      {/* Invisible hit area for hover detection */}
      <mesh
        position={[0, 0.06, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.01, 0.14, 0.25, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Base platform */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Outer particle pyramid */}
      <group ref={outerGroupRef} position={[0, 0, 0]}>
        <points ref={outerPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={outerParticles.positions.length / 3}
              array={outerParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={outerParticles.colors.length / 3}
              array={outerParticles.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={outerParticles.sizes.length}
              array={outerParticles.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={outerMatRef}
            size={0.008}
            vertexColors
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      </group>

      {/* Inner particle pyramid */}
      <group ref={innerGroupRef} position={[0, 0.06, 0]}>
        <points ref={innerPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={innerParticles.positions.length / 3}
              array={innerParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={innerParticles.colors.length / 3}
              array={innerParticles.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={innerParticles.sizes.length}
              array={innerParticles.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={innerMatRef}
            size={0.006}
            vertexColors
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      </group>

      {/* Point light for glow effect */}
      <pointLight ref={light1Ref} position={[0, 0.12, 0]} intensity={1.2} color="#06b6d4" distance={0.4} />
      <pointLight ref={light2Ref} position={[0, 0.06, 0]} intensity={0.8} color="#9400d3" distance={0.3} />
    </group>
  )
}

// Mini Rocket - SpaceX Starship style
function MiniRocket({ position, isDark }: { position: [number, number, number]; isDark?: boolean }) {
  const engineRef1 = useRef<THREE.Mesh>(null)
  const engineRef2 = useRef<THREE.Mesh>(null)
  const engineRef3 = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    const pulsate = (Math.sin(state.clock.elapsedTime * 8) + 1) / 2
    const intensity = 0.5 + pulsate * 1.5
    
    if (engineRef1.current) {
      ;(engineRef1.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity
    }
    if (engineRef2.current) {
      ;(engineRef2.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity
    }
    if (engineRef3.current) {
      ;(engineRef3.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity
    }
  })

  return (
    <group position={position}>
      {/* Base platform */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rocket body - main cylinder */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.28, 16]} />
        <meshStandardMaterial 
          color={isDark ? "#cbd5e1" : "#94a3b8"} 
          metalness={0.9} 
          roughness={0.2} 
        />
      </mesh>

      {/* Rocket nose cone */}
      <mesh position={[0, 0.34, 0]}>
        <coneGeometry args={[0.025, 0.06, 16]} />
        <meshStandardMaterial 
          color={isDark ? "#e2e8f0" : "#cbd5e1"} 
          metalness={0.95} 
          roughness={0.1} 
        />
      </mesh>

      {/* Fins (4 pieces) - larger and more visible */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`fin-${i}`}
          position={[
            Math.cos((i * Math.PI) / 2) * 0.04,
            0.06,
            Math.sin((i * Math.PI) / 2) * 0.04,
          ]}
          rotation={[0, (i * Math.PI) / 2, 0]}
        >
          <boxGeometry args={[0.008, 0.06, 0.055]} />
          <meshStandardMaterial 
            color="#334155" 
            metalness={0.9} 
            roughness={0.2}
            emissive="#475569"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Engine nozzles (3 pieces) */}
      <mesh ref={engineRef1} position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.012, 0.01, 0.02, 8]} />
        <meshStandardMaterial 
          color="#fb923c" 
          emissive="#fb923c" 
          emissiveIntensity={1}
          metalness={0.5}
        />
      </mesh>
      
      <mesh ref={engineRef2} position={[0.015, 0.03, 0.01]}>
        <cylinderGeometry args={[0.008, 0.006, 0.015, 8]} />
        <meshStandardMaterial 
          color="#fb923c" 
          emissive="#fb923c" 
          emissiveIntensity={1}
          metalness={0.5}
        />
      </mesh>

      <mesh ref={engineRef3} position={[-0.015, 0.03, -0.01]}>
        <cylinderGeometry args={[0.008, 0.006, 0.015, 8]} />
        <meshStandardMaterial 
          color="#fb923c" 
          emissive="#fb923c" 
          emissiveIntensity={1}
          metalness={0.5}
        />
      </mesh>

      {/* Engine glow lights */}
      <pointLight position={[0, 0.03, 0]} intensity={0.8} color="#fb923c" distance={0.3} />
    </group>
  )
}

function RealisticFlowerPot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Terracotta pot - outer */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.08, 0.24, 16]} />
        <meshStandardMaterial color="#c2410c" roughness={0.85} />
      </mesh>

      {/* Pot rim - top ring */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <torusGeometry args={[0.12, 0.015, 16, 32]} />
        <meshStandardMaterial color="#9a3412" roughness={0.8} />
      </mesh>

      {/* Soil surface */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
        <meshStandardMaterial color="#4a3728" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Main thick stem */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.025, 0.32, 12]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>

      {/* Branch stems */}
      <mesh position={[-0.04, 0.35, 0.02]} rotation={[0.4, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.008, 0.012, 0.15, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>
      <mesh position={[0.04, 0.38, -0.02]} rotation={[-0.35, 0, 0.35]} castShadow>
        <cylinderGeometry args={[0.008, 0.012, 0.14, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>
      <mesh position={[0.02, 0.4, 0.04]} rotation={[0.3, 0.2, 0.2]} castShadow>
        <cylinderGeometry args={[0.006, 0.01, 0.12, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>

      {/* Large leaves - bottom layer */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh
          key={`leaf-b-${i}`}
          position={[
            Math.cos((i * Math.PI * 2) / 8) * 0.1,
            0.35 + Math.random() * 0.05,
            Math.sin((i * Math.PI * 2) / 8) * 0.1,
          ]}
          rotation={[0.6 + Math.random() * 0.2, (i * Math.PI * 2) / 8, 0.4]}
          castShadow
        >
          <sphereGeometry args={[0.055, 16, 12]} />
          <meshStandardMaterial color="#16a34a" roughness={0.5} />
        </mesh>
      ))}

      {/* Medium leaves - middle layer */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={`leaf-m-${i}`}
          position={[Math.cos((i * Math.PI * 2) / 6 + 0.3) * 0.07, 0.45, Math.sin((i * Math.PI * 2) / 6 + 0.3) * 0.07]}
          rotation={[0.5, (i * Math.PI * 2) / 6 + 0.3, 0.3]}
          castShadow
        >
          <sphereGeometry args={[0.04, 16, 12]} />
          <meshStandardMaterial color="#4ade80" roughness={0.45} />
        </mesh>
      ))}

      {/* Small leaves - top layer */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`leaf-t-${i}`}
          position={[Math.cos((i * Math.PI * 2) / 5 + 0.5) * 0.04, 0.52, Math.sin((i * Math.PI * 2) / 5 + 0.5) * 0.04]}
          rotation={[0.35, (i * Math.PI * 2) / 5 + 0.5, 0.2]}
          castShadow
        >
          <sphereGeometry args={[0.03, 16, 12]} />
          <meshStandardMaterial color="#86efac" roughness={0.4} />
        </mesh>
      ))}

      {/* Flowers */}
      <mesh position={[0, 0.58, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.05, 0.52, 0.03]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#fb7185" emissive="#fb7185" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.04, 0.55, -0.03]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.02, 0.5, 0.05]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function RGBSpeaker({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const speaker1Ref = useRef<THREE.Mesh>(null)
  const speaker2Ref = useRef<THREE.Mesh>(null)
  const speaker3Ref = useRef<THREE.Mesh>(null)

  // Анимация переливания для динамиков
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Верхний динамик
    if (speaker1Ref.current?.material) {
      const material = speaker1Ref.current.material as any
      const hue1 = (Math.sin(time * 0.8) * 0.5 + 0.5) * 60 + 280 // Розовый-фиолетовый
      material.emissive.setHSL(hue1 / 360, 0.9, 0.5)
      material.emissiveIntensity = 2 + Math.sin(time * 2) * 1
    }
    
    // Средний динамик
    if (speaker2Ref.current?.material) {
      const material = speaker2Ref.current.material as any
      const hue2 = (Math.sin(time * 0.9 + 2) * 0.5 + 0.5) * 80 + 180 // Синий-бирюзовый
      material.emissive.setHSL(hue2 / 360, 0.9, 0.5)
      material.emissiveIntensity = 2 + Math.sin(time * 2.2 + 1) * 1
    }
    
    // Нижний динамик
    if (speaker3Ref.current?.material) {
      const material = speaker3Ref.current.material as any
      const hue3 = (Math.sin(time * 1.0 + 4) * 0.5 + 0.5) * 60 + 0 // Красный-оранжевый
      material.emissive.setHSL(hue3 / 360, 0.9, 0.5)
      material.emissiveIntensity = 2 + Math.sin(time * 2.4 + 2) * 1
    }
  })

  return (
    <group position={position}>
      {/* Черный корпус колонки */}
      <RoundedBox args={[0.6, 2.2, 0.35]} radius={0.05}>
        <meshStandardMaterial color="#0a0a0f" roughness={0.2} metalness={0.4} />
      </RoundedBox>

      {/* Верхний динамик - розовый */}
      <mesh ref={speaker1Ref} position={[0, 0.7, 0.18]}>
        <circleGeometry args={[0.22, 32]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2} />
        </mesh>
      <mesh position={[0, 0.7, 0.175]}>
        <torusGeometry args={[0.22, 0.02, 16, 32]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.3} />
      </mesh>

      {/* Средний динамик - синий */}
      <mesh ref={speaker2Ref} position={[0, 0, 0.18]}>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
            </mesh>
      <mesh position={[0, 0, 0.175]}>
        <torusGeometry args={[0.25, 0.02, 16, 32]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.3} />
      </mesh>

      {/* Нижний динамик - оранжевый */}
      <mesh ref={speaker3Ref} position={[0, -0.7, 0.18]}>
        <circleGeometry args={[0.22, 32]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, -0.7, 0.175]}>
        <torusGeometry args={[0.22, 0.02, 16, 32]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.3} />
      </mesh>

      {/* RGB полоса сбоку */}
      <mesh position={[-0.31, 0, 0]}>
        <boxGeometry args={[0.02, 2.1, 0.3]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

function WallClock({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      {/* Clock face */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#f8fafc"} roughness={0.3} />
      </mesh>

      {/* Clock rim - removed, было неправильно повернуто */}
      {/* <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.4, 0.03, 16, 48]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
      </mesh> */}

      {/* Hour markers */}
      {[...Array(12)].map((_, i) => (
        <mesh
          key={i}
          position={[Math.sin((i * Math.PI * 2) / 12) * 0.32, 0.03, Math.cos((i * Math.PI * 2) / 12) * 0.32]}
        >
          <boxGeometry args={[0.02, 0.01, 0.06]} />
          <meshStandardMaterial color={isDark ? "#fff" : "#1e293b"} />
        </mesh>
      ))}

      {/* Hour hand */}
      <group position={[0, 0.04, 0]} rotation={[-0.8, 0, 0]}>
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[0.02, 0.01, 0.18]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
      </group>

      {/* Minute hand */}
      <group position={[0, 0.045, 0]} rotation={[0.2, 0, 0]}>
        <mesh position={[0, 0, 0.13]}>
          <boxGeometry args={[0.015, 0.01, 0.26]} />
          <meshStandardMaterial color="#818cf8" />
        </mesh>
      </group>

      {/* Center dot */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

function FloorLamp({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <group position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.28, 0.04, 12]} />
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#6b7280"} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Pole */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 2.4, 8]} />
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#9ca3af"} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lamp shade */}
      <mesh position={[0, 2.3, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.4, 12]} />
        <meshStandardMaterial color={isDark ? "#0f172a" : "#f1f5f9"} roughness={0.9} side={2} />
      </mesh>

      {/* Light bulb glow */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial 
          color="#fef3c7" 
          emissive="#fef3c7" 
          emissiveIntensity={hovered ? (isDark ? 4 : 5) : (isDark ? 2 : 3)} 
        />
      </mesh>

      {/* Actual light - уменьшенная интенсивность для более тусклого отражения */}
      <pointLight 
        position={[0, 2.1, 0]} 
        intensity={hovered ? (isDark ? 15 : 10) : (isDark ? 6 : 4)} 
        color="#fef3c7" 
        distance={hovered ? 8 : 5} 
      />
    </group>
  )
}

function AreaRug({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  return (
    <group position={position}>
      {/* Main rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color={isDark ? "#1e3a5f" : "#bfdbfe"} roughness={0.95} />
      </mesh>

      {/* Rug border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.001]}>
        <ringGeometry args={[1.8, 2, 4]} />
        <meshStandardMaterial color="#14b8a6" roughness={0.9} transparent opacity={0.6} />
      </mesh>

      {/* Decorative pattern - center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.002]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#f472b6" roughness={0.9} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function WallArt({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  isDark = true,
}: { position: [number, number, number]; rotation?: [number, number, number]; isDark?: boolean }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <RoundedBox args={[1.2, 0.9, 0.08]} radius={0.02}>
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#d1d5db"} metalness={0.3} roughness={0.5} />
      </RoundedBox>

      {/* Canvas */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1, 0.7]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>

      {/* Abstract art shapes */}
      <mesh position={[-0.2, 0.1, 0.05]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.2, -0.1, 0.05]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.1, 0.15, 0.05]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.15, 0.15]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function ModernDesk({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <group position={position}>
      {/* Desktop surface - sleek */}
      <RoundedBox args={[4, 0.08, 1.8]} radius={0.02} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={colors.desk} roughness={0.2} metalness={0.3} />
      </RoundedBox>

      {/* Left leg - angular modern */}
      <mesh position={[-1.7, -0.75, 0]} castShadow>
        <boxGeometry args={[0.08, 1.4, 1.6]} />
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#94a3b8"} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Right leg */}
      <mesh position={[1.7, -0.75, 0]} castShadow>
        <boxGeometry args={[0.08, 1.4, 1.6]} />
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#94a3b8"} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* RGB underglow strip - front */}
      <mesh position={[0, -0.1, 0.85]}>
        <boxGeometry args={[3.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={3} />
      </mesh>

      {/* RGB underglow strip - back */}
      <mesh position={[0, -0.1, -0.85]}>
        <boxGeometry args={[3.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={3} />
      </mesh>

      {/* RGB side strips */}
      <mesh position={[-1.85, -0.1, 0]}>
        <boxGeometry args={[0.06, 0.06, 1.6]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={3} />
      </mesh>
      <mesh position={[1.85, -0.1, 0]}>
        <boxGeometry args={[0.06, 0.06, 1.6]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={3} />
      </mesh>
    </group>
  )
}

function ModernGamingChair({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  return (
    <group position={position}>
      {/* Seat */}
      <RoundedBox args={[1.1, 0.15, 1.1]} radius={0.05} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#374151"} roughness={0.5} />
      </RoundedBox>

      {/* Back rest */}
      <RoundedBox args={[1.1, 1.5, 0.15]} radius={0.05} position={[0, 0.85, -0.5]} rotation={[0.15, 0, 0]} castShadow>
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#374151"} roughness={0.5} />
      </RoundedBox>

      {/* Colorful side wings - left */}
      <mesh position={[-0.6, 0.7, -0.35]} rotation={[0.1, 0, -0.15]} castShadow>
        <boxGeometry args={[0.12, 1.2, 0.5]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.3} roughness={0.4} />
      </mesh>

      {/* Colorful side wings - right */}
      <mesh position={[0.6, 0.7, -0.35]} rotation={[0.1, 0, 0.15]} castShadow>
        <boxGeometry args={[0.12, 1.2, 0.5]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.3} roughness={0.4} />
      </mesh>

      {/* Headrest */}
      <RoundedBox args={[0.5, 0.3, 0.12]} radius={0.03} position={[0, 1.55, -0.55]} rotation={[0.2, 0, 0]} castShadow>
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.2} roughness={0.4} />
      </RoundedBox>

      {/* Armrests */}
      <RoundedBox args={[0.12, 0.08, 0.5]} radius={0.02} position={[-0.55, 0.25, 0.15]} castShadow>
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#6b7280"} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.08, 0.5]} radius={0.02} position={[0.55, 0.25, 0.15]} castShadow>
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#6b7280"} roughness={0.3} />
      </RoundedBox>

      {/* Chair base */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Star base */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.06]} />
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#4b5563"} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Wheels with RGB */}
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} position={[Math.cos((i * Math.PI * 2) / 5) * 0.5, -0.85, Math.sin((i * Math.PI * 2) / 5) * 0.5]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#111" roughness={0.7} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.06, 0.015, 8, 16]} />
            <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Monitor({
  position,
  rotation = [0, 0, 0],
}: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation as any}>
      {/* Monitor bezel */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 1.1, 0.08]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.3} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.65, 0.95]} />
        <meshStandardMaterial color="#0a192f" emissive="#14b8a6" emissiveIntensity={0.1} />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[0, -0.7, 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Monitor base */}
      <mesh position={[0, -0.9, 0.2]} castShadow>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

function UltrawideMonitor({
  position,
  rotation = [0, 0, 0],
  showSkills = false,
  isDark = true,
  onClick,
  activeGame,
  setActiveGame,
  activeCategory,
  setActiveCategory,
  showWelcome,
  setShowWelcome,
  hoveredSkillIndex,
  setHoveredSkillIndex,
  hideHtmlOverlays = false,
  gamesData,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  showSkills?: boolean
  isDark?: boolean
  onClick?: () => void
  activeGame?: string | null
  setActiveGame?: (game: string | null) => void
  activeCategory?: string | null
  setActiveCategory?: (category: string | null) => void
  showWelcome?: boolean
  setShowWelcome?: (show: boolean) => void
  hoveredSkillIndex?: number | null
  setHoveredSkillIndex?: (index: number | null) => void
  hideHtmlOverlays?: boolean
  gamesData?: any
}) {
  const { skills } = portfolioData
  const [hovered, setHovered] = useState(false)
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

  const handleIconClick = (iconName: string) => {
    if (iconName === "Game" || iconName === "Fun" || iconName === "Resume" || iconName === "Awards"|| iconName === "Music" || iconName === "AI") {
      setActiveCategory?.(iconName)
    } else {
      console.log(`Icon clicked: ${iconName}`)
    }
  }

  const skillIcons: Record<string, React.ReactNode> = {
    "Backend & ERP": <Server className="w-6 h-6" />,
    "Mobile Development": <Smartphone className="w-6 h-6" />,
    Frontend: <Layout className="w-6 h-6" />,
    "Databases & Tools": <Database className="w-6 h-6" />,
  }

  const skillColors = ["#f472b6", "#818cf8", "#2dd4bf", "#fb923c"]
  
  const performSearch = (query: string) => {
    const resultsContainer = document.getElementById("searchResultsContainer")
    if (!resultsContainer) return

    if (query === "help") {
      resultsContainer.innerHTML = `
        <div class="p-3 rounded-lg border border-teal-500/30 mt-2">
          <p class="text-teal-400 font-mono text-sm mb-2">Available commands:</p>
          <ul class="space-y-1 text-gray-400 font-mono text-xs">
            <li>• <span class="text-pink-400">game</span> - Show game projects</li>
            <li>• <span class="text-pink-400">fun</span> - Show fun projects</li>
            <li>• <span class="text-pink-400">resume</span> - Show resume</li>
            <li>• <span class="text-pink-400">awards</span> - Show awards</li>
            <li>• <span class="text-pink-400">music</span> - Show music projects</li>
            <li>• <span class="text-pink-400">ai</span> - Show AI projects</li>
            <li>• <span class="text-pink-400">clear</span> - Clear results</li>
          </ul>
        </div>
      `
      return
    }

    if (query === "clear") {
      resultsContainer.innerHTML = ""
      return
    }

    if (query === "skills") {
      let skillsHtml = '<div class="p-3 rounded-lg border border-teal-500/30 mt-2"><p class="text-teal-400 font-mono text-sm mb-2">📚 MY SKILLS:</p>'
      skills.categories.forEach(cat => {
        skillsHtml += `<div class="mb-2"><span class="text-teal-400 font-bold text-xs">${cat.title}:</span> <span class="text-gray-400 text-xs">${cat.skills.slice(0, 6).join(", ")}</span></div>`
      })
      skillsHtml += '</div>'
      resultsContainer.innerHTML = skillsHtml
      return
    }

    const categoryMap: Record<string, string> = {
      "game": "Game", "fun": "Fun", "resume": "Resume",
      "awards": "Awards", "music": "Music", "ai": "AI"
    }

    const category = categoryMap[query]
    if (category && gamesData[category as keyof typeof gamesData]) {
      const items = gamesData[category as keyof typeof gamesData]
      let itemsHtml = `<div class="p-3 rounded-lg border border-teal-500/30 mt-2"><p class="text-teal-400 font-mono text-sm mb-3">🎮 Results for "${category}":</p><div class="grid gap-2">`

      items.forEach((item: any) => {
        itemsHtml += `
          <button
            onclick="(function(){ const event = new CustomEvent('selectGame', { detail: { url: '${item.url}' } }); document.dispatchEvent(event); })()"
            class="text-left p-2 rounded-lg bg-muted/50 hover:bg-primary/20 transition-all cursor-pointer w-full"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: ${item.color}20; border: 1px solid ${item.color}">
                <span style="color: ${item.color}">▶</span>
              </div>
              <div>
                <p class="font-bold text-sm" style="color: ${item.color}">${item.name}</p>
                <p class="text-xs text-gray-400">${item.description}</p>
              </div>
            </div>
          </button>
        `
      })
      itemsHtml += '</div></div>'
      resultsContainer.innerHTML = itemsHtml

      const handleSelectGame = (e: any) => {
        setActiveGame?.(e.detail.url)
        setShowWelcome?.(false)
        document.removeEventListener('selectGame', handleSelectGame)
      }
      document.addEventListener('selectGame', handleSelectGame)
      return
    }

    if (query) {
      resultsContainer.innerHTML = `
        <div class="p-3 rounded-lg border border-yellow-500/30 mt-2">
          <p class="text-yellow-400 font-mono text-sm">❌ Unknown command: "${query}"</p>
          <p class="text-gray-500 text-xs mt-1">Type 'help' for available commands</p>
        </div>
      `
    }
  }

  return (
    <group position={position} rotation={rotation as any}>
      {/* Monitor curved bezel */}
      <mesh castShadow>
        <boxGeometry args={[3, 1.3, 0.1]} />
        <meshStandardMaterial color={isDark ? "#0a0a0f" : "#d1d5db"} roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Screen - clickable */}
      <mesh 
        position={[0, 0, 0.08]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <planeGeometry args={[2.85, 1.15]} />
        <meshStandardMaterial
          color={isDark ? "#0f172a" : "#f8fafc"}
          emissive={isDark ? (hovered ? "#14b8a6" : "#14b8a6") : "#0ea5e9"}
          emissiveIntensity={isDark ? (hovered ? 0.15 : 0.08) : 0.02}
          transparent={false}
          opacity={1}
          side={0}
        />
      </mesh>

      {/* RGB strip on bottom */}
      <mesh position={[0, -0.6, 0.08]}>
        <boxGeometry args={[2.9, 0.04, 0.02]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2} />
      </mesh>

      {/* Content on screen - improved visibility */}
      {!hideHtmlOverlays && <Html transform position={[0, 0, 0.075]} scale={0.18} center>
        {showSkills ? (
          <div
            className="w-[700px] p-5 rounded-xl shadow-2xl"
            onClick={onClick}
            style={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              border: `2px solid ${isDark ? "#14b8a6" : "#0d9488"}`,
              cursor: onClick ? 'pointer' : 'default',
            }}
          >
            <h3
              className="text-xl font-bold mb-4 tracking-wide"
              style={{ color: "#14b8a6", textShadow: isDark ? "0 0 10px #14b8a6" : "none" }}
            >
              MY SKILLS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.categories.map((category, i) => {
                const isHighlighted = hoveredSkillIndex === i
                return (
                <div
                  key={i}
                  className="p-4 rounded-xl border-2 transition-all duration-200"
                  style={{
                    backgroundColor: isHighlighted ? `${skillColors[i]}30` : `${skillColors[i]}10`,
                    borderColor: skillColors[i],
                    boxShadow: isHighlighted ? `0 0 20px ${skillColors[i]}60, inset 0 0 15px ${skillColors[i]}15` : 'none',
                    transform: isHighlighted ? 'scale(1.03)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredSkillIndex?.(i)}
                  onMouseLeave={() => setHoveredSkillIndex?.(null)}
                >
                  <div className="flex items-center gap-3 mb-3" style={{ color: skillColors[i] }}>
                    {skillIcons[category.title] || <Code className="w-6 h-6" />}
                    <span className="font-bold text-base">{category.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.slice(0, 4).map((skill, j) => (
                      <span
                        key={j}
                        className="text-sm px-3 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: `${skillColors[i]}25`,
                          color: isDark ? "#fff" : skillColors[i],
                          border: `1px solid ${skillColors[i]}`,
                        }}
                      >
                        {skill.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              )})}
            </div>
          </div>
        ) : (showWelcome ?? true) ? (
          <div
            className="w-[700px] p-5 rounded-xl shadow-2xl relative"
            style={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              border: `2px solid ${isDark ? "#14b8a6" : "#0d9488"}`,
            }}
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowWelcome?.(false)
              }}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)",
                border: "1px solid #ef4444",
                color: "#ef4444",
              }}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-4 mb-3">
              <Terminal className="w-8 h-8" style={{ color: "#14b8a6" }} />
              <span
                className="font-mono text-2xl font-bold"
                style={{ color: "#14b8a6", textShadow: isDark ? "0 0 10px #14b8a6" : "none" }}
              >
                WELCOME
              </span>
            </div>
            {/* COMMAND LINE - клик для активации */}
            <div className="relative">
              <p 
                id="readyText"
                className="font-mono text-base cursor-text"
                style={{ color: isDark ? "#94a3b8" : "#475569" }}
                onClick={() => {
                  const textEl = document.getElementById("readyText")
                  const inputContainer = document.getElementById("searchContainer")
                  const inputEl = document.getElementById("searchInput")
                  if (textEl && inputContainer && inputEl) {
                    textEl.style.display = "none"
                    inputContainer.style.display = "flex"
                    inputEl.focus()
                  }
                }}
              >
                {">"} Ready to build amazing things...
              </p>

              <div 
                id="searchContainer"
                className="flex items-center gap-2"
                style={{ display: "none" }}
              >
                <span className="font-mono text-teal-400 font-bold">$</span>
                <input
                  id="searchInput"
                  type="text"
                  placeholder="type 'help' for commands..."
                  className="font-mono text-base bg-transparent outline-none flex-1"
                  style={{ color: isDark ? "#e2e8f0" : "#1f2937" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const query = e.currentTarget.value.toLowerCase().trim()
                      const resultsContainer = document.getElementById("searchResultsContainer")
    
                      if (!resultsContainer) return
    
                      if (query === "help") {
                        resultsContainer.innerHTML = `
                          <div class="p-3 rounded-lg border border-teal-500/30 mt-2">
                            <p class="text-teal-400 font-mono text-sm mb-2">Available commands:</p>
                            <ul class="space-y-1 text-gray-400 font-mono text-xs">
                              <li>• <span class="text-pink-400">game</span> - Show game projects</li>
                              <li>• <span class="text-pink-400">fun</span> - Show fun projects</li>
                              <li>• <span class="text-pink-400">resume</span> - Show resume</li>
                              <li>• <span class="text-pink-400">awards</span> - Show awards</li>
                              <li>• <span class="text-pink-400">music</span> - Show music projects</li>
                              <li>• <span class="text-pink-400">ai</span> - Show AI projects</li>
                              <li>• <span class="text-pink-400">clear</span> - Clear results</li>
                            </ul>
                          </div>
                        `
                        return
                      }
    
                      if (query === "clear") {
                        resultsContainer.innerHTML = ""
                        e.currentTarget.value = ""
                        return
                      }
    
                      if (query === "skills") {
                        let skillsHtml = '<div class="p-3 rounded-lg border border-teal-500/30 mt-2"><p class="text-teal-400 font-mono text-sm mb-2">📚 MY SKILLS:</p>'
                        skills.categories.forEach(cat => {
                          skillsHtml += `<div class="mb-2"><span class="text-teal-400 font-bold text-xs">${cat.title}:</span> <span class="text-gray-400 text-xs">${cat.skills.slice(0, 6).join(", ")}</span></div>`
                        })
                        skillsHtml += '</div>'
                        resultsContainer.innerHTML = skillsHtml
                        return
                      }
    
                      const categoryMap: Record<string, string> = {
                        "game": "Game", "fun": "Fun", "resume": "Resume",
                        "awards": "Awards", "music": "Music", "ai": "AI"
                      }
    
                      const category = categoryMap[query]
                      if (category && gamesData[category as keyof typeof gamesData]) {
                        const items = gamesData[category as keyof typeof gamesData]
                        let itemsHtml = `<div class="p-3 rounded-lg border border-teal-500/30 mt-2"><p class="text-teal-400 font-mono text-sm mb-3">🎮 Results for "${category}":</p><div class="grid gap-2">`
      
                        items.forEach((item: any) => {
                          itemsHtml += `
                            <button 
                              onclick="(function(){ const event = new CustomEvent('selectGame', { detail: { url: '${item.url}' } }); document.dispatchEvent(event); })()"
                              class="text-left p-2 rounded-lg bg-muted/50 hover:bg-primary/20 transition-all cursor-pointer w-full"
                            >
                              <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: ${item.color}20; border: 1px solid ${item.color}">
                                  <span style="color: ${item.color}">▶</span>
                                </div>
                              <div>
                                <p class="font-bold text-sm" style="color: ${item.color}">${item.name}</p>
                                <p class="text-xs text-gray-400">${item.description}</p>
                              </div>
                            </div>
                          </button>
                        `
                      })
                      itemsHtml += '</div></div>'
                      resultsContainer.innerHTML = itemsHtml
      
                      const handleSelectGame = (e: any) => {
                        setActiveGame?.(e.detail.url)
                        setShowWelcome?.(false)
                        document.removeEventListener('selectGame', handleSelectGame)
                      }
                      document.addEventListener('selectGame', handleSelectGame)
                      return
                    }
    
                    if (query) {
                      resultsContainer.innerHTML = `
                        <div class="p-3 rounded-lg border border-yellow-500/30 mt-2">
                          <p class="text-yellow-400 font-mono text-sm">❌ Unknown command: "${query}"</p>
                          <p class="text-gray-500 text-xs mt-1">Type 'help' for available commands</p>
                        </div>
                      `
                    }
                  }
                }}
                  onBlur={() => {
                    const textEl = document.getElementById("readyText")
                    const inputContainer = document.getElementById("searchContainer")
                    const inputEl = document.getElementById("searchInput") as HTMLInputElement
                    const resultsContainer = document.getElementById("searchResultsContainer")
                    if (textEl && inputContainer && inputEl && !inputEl.value && (!resultsContainer || resultsContainer.innerHTML === "")) {
                      textEl.style.display = "block"
                      inputContainer.style.display = "none"
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById("searchInput") as HTMLInputElement
                      if (input) {
                      performSearch(input.value.toLowerCase().trim())
                    }
                  }}
                  className="p-1 rounded-lg transition-all hover:scale-110"
                  style={{ color: "#14b8a6" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Search Results Container */}
            <div id="searchResultsContainer" className="mt-2"></div>

            {/* Desktop Icons */}
            <div className="flex justify-center gap-6 mt-4">
              {[
                { name: "Game", icon: FolderOpen, color: "#f472b6" },
                { name: "Fun", icon: Zap, color: "#fb923c" },
                { name: "Resume", icon: FileText, color: "#818cf8" },
                { name: "Awards", icon: Award, color: "#2dd4bf" },
                { name: "Music", icon: Music, color: "#ec4899" },
                { name: "AI", icon: Brain, color: "#06b6d4" },
              ].map((item) => {
                const Icon = item.icon
                const isHovered = hoveredIcon === item.name
                
                return (
                  <button
                    key={item.name}
                    onClick={() => handleIconClick(item.name)}
                    onMouseEnter={() => setHoveredIcon(item.name)}
                    onMouseLeave={() => setHoveredIcon(null)}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: isHovered ? `${item.color}15` : 'transparent',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    <Icon 
                      className="w-7 h-7" 
                      style={{ 
                        color: item.color,
                        filter: isHovered ? `drop-shadow(0 0 4px ${item.color})` : 'none'
                      }} 
                    />
                    <span 
                      className="text-xs font-medium"
                      style={{ 
                        color: isDark ? '#e2e8f0' : '#1f2937',
                      }}
                    >
                      {item.name}
                    </span>
                  </button>
                )
              })}
          </div>
          </div>
        ) : null}
      </Html>}
    </group>
  )
}

function Keyboard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1, 0.05, 0.4]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.4} />
      </mesh>
      {/* RGB strip */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.95, 0.01, 0.35]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function RGBKeyboard({ position, hoveredSkillIndex, setHoveredSkillIndex }: { position: [number, number, number]; hoveredSkillIndex: number | null; setHoveredSkillIndex?: (index: number | null) => void }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.2, 0.04, 0.45]} radius={0.01} castShadow>
        <meshStandardMaterial color="#0a0a0f" roughness={0.3} />
      </RoundedBox>

      {/* RGB backlight rows */}
      {[-0.15, -0.05, 0.05, 0.15].map((z, i) => (
        <mesh
          key={i}
          position={[0, 0.025, z]}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredSkillIndex?.(i) }}
          onPointerOut={() => setHoveredSkillIndex?.(null)}
        >
          <boxGeometry args={[1.1, 0.008, 0.06]} />
          <meshStandardMaterial
            color={["#f472b6", "#818cf8", "#2dd4bf", "#fb923c"][i]}
            emissive={["#f472b6", "#818cf8", "#2dd4bf", "#fb923c"][i]}
            emissiveIntensity={hoveredSkillIndex === i ? 4 : 0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

function Mouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.15, 0.05, 0.25]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.4} />
      </mesh>
      {/* RGB accent */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.05, 0.01, 0.15]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

function RGBMouse({ 
  position, 
  showWelcome, 
  onClick 
}: { 
  position: [number, number, number]
  showWelcome: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const scrollWheelRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  // Animation for blinking when Welcome is closed
  useFrame((state) => {
    if (!showWelcome) {
      const pulsate = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5
      
      // Розовое колесико - очень яркое свечение с белым
      if (scrollWheelRef.current?.material) {
        const material = scrollWheelRef.current.material as any
        material.emissiveIntensity = 3 + pulsate * 5 // Очень яркое
        // Добавляем белого для эффекта лампочки
        material.emissive.setRGB(
          1.0, // R - максимум
          0.6 + pulsate * 0.3, // G - добавляем белого
          0.8 + pulsate * 0.2  // B - добавляем белого
        )
      }
      
      // Бирюзовое кольцо - умеренное свечение
      if (ringRef.current?.material) {
        const material = ringRef.current.material as any
        material.emissiveIntensity = 2 + pulsate * 1.5
      }
    } else {
      // Возвращаем нормальные значения когда Welcome открыт
      if (scrollWheelRef.current?.material) {
        const material = scrollWheelRef.current.material as any
        material.emissiveIntensity = 1
        material.emissive.setRGB(0.96, 0.45, 0.71) // #f472b6
      }
      if (ringRef.current?.material) {
        const material = ringRef.current.material as any
        material.emissiveIntensity = 2
      }
    }
  })

  return (
    <group 
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      style={{ cursor: hovered ? 'pointer' : 'default' } as any}
    >
      <RoundedBox args={[0.15, 0.04, 0.28]} radius={0.02} castShadow>
        <meshStandardMaterial 
          color="#0a0a0f" 
          roughness={0.3}
        />
      </RoundedBox>

      <mesh ref={ringRef} position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.01, 8, 24]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2} />
      </mesh>

      {/* Scroll wheel - bright pink lamp effect when blinking */}
      <mesh ref={scrollWheelRef} position={[0, 0.05, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.04, 12]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1} />
      </mesh>
      
      {/* Добавляем точечный свет от колесика когда мерцает */}
      {!showWelcome && (
        <pointLight 
          position={[0, 0.05, 0.02]} 
          color="#ff88cc" 
          intensity={1.5} 
          distance={0.5} 
        />
      )}
    </group>
  )
}

function PCTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main case */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 1.2, 0.6]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Glass panel */}
      <mesh position={[0.26, 0, 0]}>
        <boxGeometry args={[0.02, 1, 0.5]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.2} />
      </mesh>
      {/* RGB fans visible through glass */}
      <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.2, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1} />
      </mesh>
      {/* Power LED */}
      <mesh position={[0, 0.5, 0.31]}>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={3} />
      </mesh>
    </group>
  )
}

function ModernPCTower({ position }: { position: [number, number, number] }) {
  const fan1Ref = useRef<THREE.Mesh>(null)
  const fan2Ref = useRef<THREE.Mesh>(null)
  const fan3Ref = useRef<THREE.Mesh>(null)
  const powerButtonRef = useRef<THREE.Mesh>(null)
  const rgbStripRef = useRef<THREE.Mesh>(null)

  // Анимация переливания цветов
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Вентилятор 1 - розовый -> фиолетовый -> синий
    if (fan1Ref.current?.material) {
      const material = fan1Ref.current.material as any
      const hue1 = (Math.sin(time * 0.5) * 0.5 + 0.5) * 60 + 300 // 300-360 (розовый-красный)
      material.emissive.setHSL(hue1 / 360, 0.8, 0.6)
      material.emissiveIntensity = 3 + Math.sin(time * 2) * 1
    }
    
    // Вентилятор 2 - синий -> фиолетовый -> бирюзовый
    if (fan2Ref.current?.material) {
      const material = fan2Ref.current.material as any
      const hue2 = (Math.sin(time * 0.6 + 2) * 0.5 + 0.5) * 80 + 200 // 200-280 (синий-фиолетовый)
      material.emissive.setHSL(hue2 / 360, 0.8, 0.6)
      material.emissiveIntensity = 3 + Math.sin(time * 2.2 + 1) * 1
    }
    
    // Вентилятор 3 - бирюзовый -> зеленый -> голубой
    if (fan3Ref.current?.material) {
      const material = fan3Ref.current.material as any
      const hue3 = (Math.sin(time * 0.7 + 4) * 0.5 + 0.5) * 60 + 160 // 160-220 (бирюзовый-голубой)
      material.emissive.setHSL(hue3 / 360, 0.8, 0.6)
      material.emissiveIntensity = 3 + Math.sin(time * 2.4 + 2) * 1
    }
    
    // Кнопка питания - пульсация бирюзовым
    if (powerButtonRef.current?.material) {
      const material = powerButtonRef.current.material as any
      material.emissiveIntensity = 4 + Math.sin(time * 3) * 2
    }
    
    // RGB полоса - радужное переливание
    if (rgbStripRef.current?.material) {
      const material = rgbStripRef.current.material as any
      const hueStrip = ((time * 50) % 360)
      material.emissive.setHSL(hueStrip / 360, 0.9, 0.6)
      material.emissiveIntensity = 3 + Math.sin(time * 2.5) * 1.5
    }
  })

  return (
    <group position={position}>
      {/* Main case */}
      <RoundedBox args={[0.5, 1.3, 0.55]} radius={0.03} castShadow>
        <meshStandardMaterial color="#0a0a0f" roughness={0.2} metalness={0.3} />
      </RoundedBox>

      {/* Glass panel with tint - removed for cleaner look */}
      {/* <mesh position={[0.26, 0, 0]}>
        <planeGeometry args={[1.1, 0.45]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.15} />
      </mesh> */}

      {/* RGB fans visible through glass - с анимацией переливания */}
      <Float speed={3} rotationIntensity={0} floatIntensity={0}>
        <mesh ref={fan1Ref} position={[0.2, 0.35, 0.05]}>
          <torusGeometry args={[0.12, 0.02, 8, 24]} />
          <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2} />
        </mesh>
      </Float>
      <Float speed={3.5} rotationIntensity={0} floatIntensity={0}>
        <mesh ref={fan2Ref} position={[0.2, -0.1, 0.05]}>
          <torusGeometry args={[0.12, 0.02, 8, 24]} />
          <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
        </mesh>
      </Float>
      <Float speed={4} rotationIntensity={0} floatIntensity={0}>
        <mesh ref={fan3Ref} position={[0.2, -0.55, 0.05]}>
          <torusGeometry args={[0.1, 0.02, 8, 24]} />
          <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2} />
        </mesh>
      </Float>

      {/* Front IO - Power button - яркая пульсация */}
      <mesh ref={powerButtonRef} position={[0, 0.55, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={3} />
      </mesh>

      {/* Front RGB strip - радужное переливание */}
      <mesh ref={rgbStripRef} position={[-0.22, 0, 0.28]}>
        <boxGeometry args={[0.03, 1, 0.02]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
      </mesh>
      
      {/* Убираем точечные источники света - они слишком яркие снизу */}
      {/* <pointLight position={[0.2, 0.35, 0.15]} color="#f472b6" intensity={0.5} distance={0.6} />
      <pointLight position={[0.2, -0.1, 0.15]} color="#818cf8" intensity={0.5} distance={0.6} />
      <pointLight position={[0.2, -0.55, 0.15]} color="#2dd4bf" intensity={0.5} distance={0.6} /> */}
    </group>
  )
}

function ModernWallDisplay({ position, isDark = true, hideHtmlOverlays = false }: { position: [number, number, number]; isDark?: boolean; hideHtmlOverlays?: boolean }) {
  const { personal } = portfolioData
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <group position={position}>
      {/* Main display panel - larger */}
      <RoundedBox args={[11, 5.5, 0.15]} radius={0.1}>
        <meshStandardMaterial color={colors.panel} roughness={0.8} />
      </RoundedBox>

      {/* Glowing borders - multi-color */}
      <mesh position={[-5.4, 0, 0.08]}>
        <boxGeometry args={[0.1, 5.3, 0.02]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[5.4, 0, 0.08]}>
        <boxGeometry args={[0.1, 5.3, 0.02]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, 2.65, 0.08]}>
        <boxGeometry args={[10.9, 0.1, 0.02]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, -2.65, 0.08]}>
        <boxGeometry args={[10.9, 0.1, 0.02]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={2.5} />
      </mesh>

      {/* Name text - much larger */}
      <Text
        position={[0, 1.5, 0.1]}
        fontSize={1.1}
        color={colors.text}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={isDark ? "#000" : "#fff"}
        depthOffset={-1}
      >
        {personal.name}
      </Text>

      {/* Decorative line under name */}
      <mesh position={[0, 0.8, 0.1]}>
        <boxGeometry args={[5, 0.08, 0.02]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2.5} />
      </mesh>

      {/* Title - larger */}
      <Text
        position={[0, 0.0, 0.1]}
        fontSize={0.45}
        color="#14b8a6"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={isDark ? "#000" : "#fff"}
        maxWidth={9}
        textAlign="center"
      >
        {personal.title}
      </Text>

      {/* Tagline - larger */}
      {personal.tagline && (
      <Text
          position={[0, -0.2, 0.1]}
          fontSize={0.26}
        color={colors.textMuted}
        anchorX="center"
        anchorY="middle"
          maxWidth={9.5}
        textAlign="center"
      >
        {personal.tagline}
      </Text>
      )}

      {/* Specializations with colors - professional design without emojis */}
      {!hideHtmlOverlays && <Html transform position={[0, -1.4, 0.2]} scale={0.38} center>
        <div className="flex flex-wrap gap-3 justify-center w-[900px]">
          {personal.specializations.map((spec, i) => {
            const specColors = ["#f472b6", "#818cf8", "#2dd4bf", "#fb923c"]
            return (
              <span
                key={i}
                className="px-5 py-2.5 rounded-full text-base font-semibold border-2 shadow-xl transition-all hover:scale-105"
                style={{
                  backgroundColor: isDark ? `${specColors[i]}35` : `${specColors[i]}20`,
                  borderColor: specColors[i],
                  color: isDark ? "#fff" : "#1e293b",
                  textShadow: isDark
                    ? `0 0 10px ${specColors[i]}80, 0 1px 3px rgba(0,0,0,0.4)`
                    : "0 1px 2px rgba(0,0,0,0.15)",
                  boxShadow: isDark
                    ? `0 0 16px ${specColors[i]}40, 0 4px 12px rgba(0,0,0,0.3)`
                    : `0 2px 8px ${specColors[i]}30, 0 1px 3px rgba(0,0,0,0.1)`,
                }}
              >
                {spec}
              </span>
            )
          })}
        </div>
      </Html>}

      {/* Corner decorations - larger */}
      {[
        [-5.1, 2.35, "#f472b6"],
        [5.1, 2.35, "#818cf8"],
        [-5.1, -2.35, "#fb923c"],
        [5.1, -2.35, "#2dd4bf"],
      ].map(([x, y, color], i) => (
        <mesh key={i} position={[x as number, y as number, 0.1]}>
          <boxGeometry args={[0.35, 0.35, 0.06]} />
          <meshStandardMaterial color={color as string} emissive={color as string} emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  )
}

function Shelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Shelf board */}
      <mesh castShadow>
        <boxGeometry args={[2, 0.08, 0.4]} />
        <meshStandardMaterial color="#2d2d3a" roughness={0.5} />
      </mesh>
      {/* Brackets */}
      <mesh position={[-0.8, -0.15, 0.15]}>
        <boxGeometry args={[0.05, 0.25, 0.05]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, -0.15, 0.15]}>
        <boxGeometry args={[0.05, 0.25, 0.05]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function FloatingDecor({ position, color, onClick }: { position: [number, number, number]; color: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  // Анимация мерцания при наведении
  useFrame((state) => {
    if (meshRef.current?.material && hovered) {
      const pulsate = Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5
      const material = meshRef.current.material as any
      material.emissiveIntensity = 2 + pulsate * 4
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh 
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onClick?.() }}
        style={{ cursor: hovered && onClick ? 'pointer' : 'default' } as any}
      >
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 3 : 1}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      
      {/* Добавляем точечный свет при наведении */}
      {hovered && (
        <pointLight 
          position={position} 
          color={color} 
          intensity={3} 
          distance={2} 
        />
      )}
    </Float>
  )
}

function CeilingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Light fixture */}
      <mesh>
        <boxGeometry args={[2.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Light panel */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[2.3, 0.02, 0.4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0, -0.5, 0]} intensity={30} color="#ffffff" distance={10} />
    </group>
  )
}

function EntranceRoom({ position, isDark = true, onZoomToDesk, onZoomToIsland, onZoomToBlueIsland, onSingularityCrystalClick, onSingularityCrystalDoubleClick, isSingularityCrystalTransformed = false, onOrangeCrystalClick, activeGame, setActiveGame, activeCategory, setActiveCategory, showWelcome, setShowWelcome, hoveredSkillIndex, setHoveredSkillIndex, hideHtmlOverlays = false, gamesData, }: { 
  position: [number, number, number]; 
  isDark?: boolean; 
  onZoomToDesk?: () => void;
  onZoomToIsland?: () => void;
  onZoomToBlueIsland?: () => void;
  onSingularityCrystalClick?: (isDouble?: boolean) => void;
  onSingularityCrystalDoubleClick?: () => void;
  isSingularityCrystalTransformed?: boolean;
  onOrangeCrystalClick?: () => void;
  activeGame: string | null;
  setActiveGame: (game: string | null) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  hoveredSkillIndex: number | null;
  setHoveredSkillIndex: (index: number | null) => void;
  hideHtmlOverlays?: boolean;
  gamesData?: any;
}) {
  const { personal } = portfolioData
  const [showLinkedInModal, setShowLinkedInModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showGithubModal, setShowGithubModal] = useState(false)

  return (
    <ColorfulRoom position={position} isDark={isDark}>
      {/* Wall Display - Main showcase */}
      <ModernWallDisplay position={[0, 2.5, -6.8]} isDark={isDark} hideHtmlOverlays={hideHtmlOverlays} />

      {/* Modern desk setup */}
      <ModernDesk position={[0, -1.5, -3]} isDark={isDark} />

      {/* Dual ultrawide monitors - one showing skills */}
      <UltrawideMonitor 
        position={[-0.8, -0.2, -3.8]} 
        rotation={[0, 0.15, 0]} 
        showSkills={true} 
        isDark={isDark} 
        onClick={onZoomToDesk}
        hoveredSkillIndex={hoveredSkillIndex}
        setHoveredSkillIndex={setHoveredSkillIndex}
        hideHtmlOverlays={hideHtmlOverlays}
        gamesData={gamesData}
      />
      <UltrawideMonitor position={[0.8, -0.2, -3.8]} rotation={[0, -0.15, 0]} showSkills={false} isDark={isDark} activeGame={activeGame} setActiveGame={setActiveGame} activeCategory={activeCategory} setActiveCategory={setActiveCategory} showWelcome={showWelcome} setShowWelcome={setShowWelcome} hideHtmlOverlays={hideHtmlOverlays} gamesData={gamesData} />

      {/* Flower pot - saved for possible relocation */}
      {/* <RealisticFlowerPot position={[-1.7, -1.46, -2.5]} /> */}
      
      {/* Tech-themed decorations on desk */}
      <ParticlePyramid position={[-1.6, -1.42, -2.5]} />
      <MiniRocket position={[-1.5, -1.46, -3.4]} isDark={isDark} />

      {/* RGB Keyboard and mouse */}
      <RGBKeyboard position={[0, -1.44, -2.5]} hoveredSkillIndex={hoveredSkillIndex} setHoveredSkillIndex={setHoveredSkillIndex} />
      <RGBMouse position={[0.85, -1.44, -2.5]} showWelcome={showWelcome} onClick={() => setShowWelcome(true)} />

      {/* Modern PC Tower */}
      <ModernPCTower position={[2.2, -2.35, -3.2]} />

      {/* Modern gaming chair - REMOVED */}
      {/* <ModernGamingChair position={[0, -2.3, -0.8]} isDark={isDark} /> */}

      <RGBSpeaker position={[-6.5, -1.8, -3]} isDark={isDark} />

      <FloorLamp position={[-5.5, -3, 1]} isDark={isDark} />

      {/* <AreaRug position={[0, -2.98, -1.5]} isDark={isDark} /> */}

      <group position={[-6.9, 3, -1]} rotation={[0, Math.PI / 2, 0]}>
        <WallClock position={[0, 0, 0]} isDark={isDark} />
      </group>

      <WallArt position={[6.9, 3.5, -4]} rotation={[0, -Math.PI / 2, 0]} isDark={isDark} />
      <WallArt position={[6.9, 1.5, -5]} rotation={[0, -Math.PI / 2, 0]} isDark={isDark} />

      {/* Floating decorative elements */}
      <SpookyIsland position={[-5, 3, -4]} scale={0.003} onClick={onZoomToIsland} />
      <SkyCabinIsland position={[5, 4, -3]} scale={0.028} onClick={onZoomToBlueIsland} />
      {isSingularityCrystalTransformed ? (
        <SingularityCrystal
          position={[-4, 5, -5]}
          onClick={onSingularityCrystalClick}
          onDoubleClick={onSingularityCrystalDoubleClick}
        />
      ) : (
        <FloatingDecor position={[-4, 5, -5]} color="#2dd4bf" onClick={onSingularityCrystalClick} />
      )}
      <FloatingDecor position={[4, 2, -5]} color="#fb923c" onClick={onOrangeCrystalClick} />

      {/* Social links panel on right wall - improved visibility */}
      {!hideHtmlOverlays && <group position={[6.7, -0.5, -1]} rotation={[0, -Math.PI / 2, 0]}>
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
          <RoundedBox args={[2.8, 2, 0.1]} radius={0.1}>
            <meshStandardMaterial color={isDark ? "#0a0a0f" : "#f1f5f9"} roughness={0.8} />
          </RoundedBox>
          {/* Border glow */}
          <mesh position={[0, 0.95, 0.06]}>
            <boxGeometry args={[2.6, 0.06, 0.02]} />
            <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2.5} />
          </mesh>
          <mesh position={[0, -0.95, 0.06]}>
            <boxGeometry args={[2.6, 0.06, 0.02]} />
            <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2.5} />
          </mesh>
          <Html transform position={[0, 0, 0.15]} scale={0.35} center>
            <div
              className="p-6 text-center w-[300px] rounded-xl"
              style={{
                backgroundColor: isDark ? "rgba(10, 10, 15, 0.98)" : "rgba(255, 255, 255, 0.98)",
                border: `2px solid ${isDark ? "#14b8a6" : "#0d9488"}`,
              }}
            >
              <p
                className="text-lg mb-6 font-bold tracking-wider"
                style={{ color: "#14b8a6", textShadow: isDark ? "0 0 10px #14b8a6" : "none" }}
              >
                CONNECT WITH ME
              </p>
              <div className="flex gap-6 justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setShowGithubModal(true)
                  }}
                  className="transition-all p-4 rounded-xl hover:scale-110 cursor-pointer"
                  style={{
                    color: isDark ? "#fff" : "#374151",
                    backgroundColor: isDark ? "rgba(244, 114, 182, 0.25)" : "rgba(244, 114, 182, 0.15)",
                    border: "2px solid #f472b6",
                  }}
                >
                  <Github size={36} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setShowLinkedInModal(true)
                  }}
                  className="transition-all p-4 rounded-xl hover:scale-110 cursor-pointer"
                  style={{
                    color: isDark ? "#fff" : "#374151",
                    backgroundColor: isDark ? "rgba(129, 140, 248, 0.25)" : "rgba(129, 140, 248, 0.15)",
                    border: "2px solid #818cf8",
                  }}
                >
                  <Linkedin size={36} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setShowEmailModal(true)
                  }}
                  className="transition-all p-4 rounded-xl hover:scale-110 cursor-pointer"
                  style={{
                    color: isDark ? "#fff" : "#374151",
                    backgroundColor: isDark ? "rgba(20, 184, 166, 0.25)" : "rgba(20, 184, 166, 0.15)",
                    border: "2px solid #14b8a6",
                  }}
                >
                  <Mail size={36} />
                </button>
              </div>
            </div>
          </Html>
        </Float>
      </group>}

      {/* LinkedIn Modal - positioned in front of social panel */}
      {!hideHtmlOverlays && showLinkedInModal && (
        <group position={[6.2, -0.5, -1]} rotation={[0, -Math.PI / 2, 0]}>
          <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.1}>
            <RoundedBox args={[3.5, 2.8, 0.15]} radius={0.12}>
              <meshStandardMaterial color={isDark ? "#0a0a0f" : "#f1f5f9"} roughness={0.7} />
            </RoundedBox>
            {/* Border glow */}
            <mesh position={[0, 1.35, 0.08]}>
              <boxGeometry args={[3.3, 0.08, 0.02]} />
              <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={3} />
            </mesh>
            <mesh position={[0, -1.35, 0.08]}>
              <boxGeometry args={[3.3, 0.08, 0.02]} />
              <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={3} />
            </mesh>
            <mesh position={[-1.65, 0, 0.08]}>
              <boxGeometry args={[0.08, 2.6, 0.02]} />
              <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={3} />
            </mesh>
            <mesh position={[1.65, 0, 0.08]}>
              <boxGeometry args={[0.08, 2.6, 0.02]} />
              <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={3} />
            </mesh>
            
            <Html transform position={[0, 0, 0.18]} scale={0.32} center>
              <div
                className="p-8 text-center w-[400px] rounded-2xl"
                style={{
                  backgroundColor: isDark ? "rgba(10, 10, 15, 0.98)" : "rgba(255, 255, 255, 0.98)",
                  border: `3px solid #818cf8`,
                }}
              >
                <div className="mb-6">
                  <Linkedin size={56} style={{ color: "#818cf8", margin: "0 auto" }} />
                </div>
                
                <p
                  className="text-2xl mb-6 font-bold tracking-wide"
                  style={{ color: "#818cf8", textShadow: isDark ? "0 0 15px #818cf8" : "none" }}
                >
                  LinkedIn Connection
                </p>
                
                <p
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: isDark ? "#e2e8f0" : "#334155" }}
                >
                  Do you want to connect with me on LinkedIn?
                </p>
                
                <div className="flex gap-6 justify-center">
                  <a
                    href="https://www.linkedin.com/in/petr-savelo-2a23b4257/?isSelfProfile=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-12 py-3 rounded-xl font-bold text-xl transition-all hover:scale-105"
                    style={{
                      backgroundColor: "#818cf8",
                      color: "#fff",
                      border: "2px solid #818cf8",
                      boxShadow: isDark ? "0 0 20px rgba(129, 140, 248, 0.5)" : "0 4px 12px rgba(129, 140, 248, 0.3)",
                    }}
                  >
                    Yes
                  </a>
                  <button
                    onClick={() => setShowLinkedInModal(false)}
                    className="px-12 py-3 rounded-xl font-bold text-xl transition-all hover:scale-105"
                    style={{
                      backgroundColor: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.15)",
                      color: isDark ? "#94a3b8" : "#64748b",
                      border: `2px solid ${isDark ? "#475569" : "#94a3b8"}`,
                    }}
                  >
                    No
                  </button>
              </div>
            </div>
          </Html>
        </Float>
      </group>
      )}

      {/* Email Modal - positioned in front of social panel */}
      {!hideHtmlOverlays && showEmailModal && (
        <group position={[6.2, -0.5, -1]} rotation={[0, -Math.PI / 2, 0]}>
          <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.1}>
            <RoundedBox args={[3.5, 2.8, 0.15]} radius={0.12}>
              <meshStandardMaterial color={isDark ? "#0a0a0f" : "#f1f5f9"} roughness={0.7} />
            </RoundedBox>
            {/* Border glow - teal color for email */}
            <mesh position={[0, 1.35, 0.08]}>
              <boxGeometry args={[3.3, 0.08, 0.02]} />
              <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={3} />
            </mesh>
            <mesh position={[0, -1.35, 0.08]}>
              <boxGeometry args={[3.3, 0.08, 0.02]} />
              <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={3} />
            </mesh>
            <mesh position={[-1.65, 0, 0.08]}>
              <boxGeometry args={[0.08, 2.6, 0.02]} />
              <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={3} />
            </mesh>
            <mesh position={[1.65, 0, 0.08]}>
              <boxGeometry args={[0.08, 2.6, 0.02]} />
              <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={3} />
            </mesh>
            
            <Html transform position={[0, 0, 0.18]} scale={0.32} center>
              <div
                className="p-8 text-center w-[400px] rounded-2xl"
                style={{
                  backgroundColor: isDark ? "rgba(10, 10, 15, 0.98)" : "rgba(255, 255, 255, 0.98)",
                  border: `3px solid #14b8a6`,
                }}
              >
                <div className="mb-6">
                  <Mail size={56} style={{ color: "#14b8a6", margin: "0 auto" }} />
                </div>
                
                <p
                  className="text-2xl mb-6 font-bold tracking-wide"
                  style={{ color: "#14b8a6", textShadow: isDark ? "0 0 15px #14b8a6" : "none" }}
                >
                  Email Contact
                </p>
                
                <div
                  className="mb-6 p-4 rounded-lg"
                  style={{
                    backgroundColor: isDark ? "rgba(20, 184, 166, 0.1)" : "rgba(20, 184, 166, 0.05)",
                    border: `2px solid ${isDark ? "rgba(20, 184, 166, 0.3)" : "rgba(20, 184, 166, 0.2)"}`,
                  }}
                >
                  <p
                    className="text-lg font-mono font-semibold"
                    style={{ color: isDark ? "#2dd4bf" : "#0d9488" }}
                  >
                    {personal.email}
                  </p>
                </div>
                
                <p
                  className="text-base mb-6"
                  style={{ color: isDark ? "#cbd5e1" : "#475569" }}
                >
                  Would you like to send me an email?
                </p>
                
                <div className="flex gap-6 justify-center">
                  <a
                    href={`mailto:${personal.email}`}
                    className="px-12 py-3 rounded-xl font-bold text-xl transition-all hover:scale-105"
                    style={{
                      backgroundColor: "#14b8a6",
                      color: "#fff",
                      border: "2px solid #14b8a6",
                      boxShadow: isDark ? "0 0 20px rgba(20, 184, 166, 0.5)" : "0 4px 12px rgba(20, 184, 166, 0.3)",
                    }}
                  >
                    Yes
                  </a>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-12 py-3 rounded-xl font-bold text-xl transition-all hover:scale-105"
                    style={{
                      backgroundColor: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.15)",
                      color: isDark ? "#94a3b8" : "#64748b",
                      border: `2px solid ${isDark ? "#475569" : "#94a3b8"}`,
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </Html>
          </Float>
        </group>
      )}

      {/* GitHub Modal */}
      {!hideHtmlOverlays && showGithubModal && (
        <group position={[6.2, -0.5, -1]} rotation={[0, -Math.PI / 2, 0]}>
          <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.1}>
            <RoundedBox args={[3.5, 2.8, 0.15]} radius={0.12}>
              <meshStandardMaterial color={isDark ? "#0a0a0f" : "#f1f5f9"} roughness={0.7} />
            </RoundedBox>
            <mesh position={[0, 1.35, 0.08]}>
              <boxGeometry args={[3.3, 0.08, 0.02]} />
              <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={3} />
            </mesh>
            <mesh position={[0, -1.35, 0.08]}>
              <boxGeometry args={[3.3, 0.08, 0.02]} />
              <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={3} />
            </mesh>
            
            <Html transform position={[0, 0, 0.18]} scale={0.32} center>
              <div
                className="p-8 text-center w-[400px] rounded-2xl"
                style={{
                  backgroundColor: isDark ? "rgba(10, 10, 15, 0.98)" : "rgba(255, 255, 255, 0.98)",
                  border: `3px solid #f472b6`,
                }}
              >
                <div className="mb-6">
                  <Github size={56} style={{ color: "#f472b6", margin: "0 auto" }} />
                </div>
                
                <p
                  className="text-2xl mb-6 font-bold tracking-wide"
                  style={{ color: "#f472b6", textShadow: isDark ? "0 0 15px #f472b6" : "none" }}
                >
                  GitHub Repositories
                </p>
                
                <p
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: isDark ? "#e2e8f0" : "#334155" }}
                >
                  Choose which GitHub profile to visit:
                </p>
                
                <div className="flex gap-6 justify-center">
                  <a
                    href="https://github.com/LilCannaVert"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105"
                    style={{
                      backgroundColor: "#f472b6",
                      color: "#fff",
                      border: "2px solid #f472b6",
                      boxShadow: isDark ? "0 0 20px rgba(244, 114, 182, 0.5)" : "0 4px 12px rgba(244, 114, 182, 0.3)",
                    }}
                  >
                    Old Git
                  </a>
                  <a
                    href="https://github.com/BitOpenCode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105"
                    style={{
                      backgroundColor: "#f472b6",
                      color: "#fff",
                      border: "2px solid #f472b6",
                      boxShadow: isDark ? "0 0 20px rgba(244, 114, 182, 0.5)" : "0 4px 12px rgba(244, 114, 182, 0.3)",
                    }}
                  >
                    New Git
                  </a>
                </div>
                
                <button
                  onClick={() => setShowGithubModal(false)}
                  className="mt-6 px-6 py-2 rounded-lg text-sm transition-all hover:scale-105"
                  style={{
                    backgroundColor: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.15)",
                    color: isDark ? "#94a3b8" : "#64748b",
                    border: `2px solid ${isDark ? "#475569" : "#94a3b8"}`,
                  }}
                >
                  Cancel
                </button>
              </div>
            </Html>
          </Float>
        </group>
      )}

      {/* Floating tooltip near mouse */}
      {!hideHtmlOverlays && !showWelcome && (
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
          <Html transform position={[0.85, -1.2, -2.5]} scale={0.25} center>
            <div className="bg-primary/90 text-primary-foreground px-2 py-1 rounded-lg shadow-md whitespace-nowrap text-xs font-medium animate-pulse">
              🖱️ Click here to return welcome screen
            </div>
          </Html>
        </Float>
      )}

      {/* Ambient colored lighting - сплошная полоска света под столом */}
      <pointLight position={[-2, -1.8, -3]} intensity={isDark ? 5 : 4} color="#14b8a6" distance={10} decay={1.2} />
      <pointLight position={[-1.5, -1.8, -3]} intensity={isDark ? 5 : 4} color="#14b8a6" distance={10} decay={1.2} />
      <pointLight position={[-1, -1.8, -3]} intensity={isDark ? 6 : 5} color="#14b8a6" distance={10} decay={1.2} />
      <pointLight position={[-0.5, -1.8, -3]} intensity={isDark ? 6 : 5} color="#14b8a6" distance={10} decay={1.2} />
      <pointLight position={[0, -1.8, -3]} intensity={isDark ? 7 : 6} color="#14b8a6" distance={10} decay={1.2} />
      <pointLight position={[0.5, -1.8, -3]} intensity={isDark ? 6 : 5} color="#14b8a6" distance={10} decay={1.2} />
      <pointLight position={[1, -1.8, -3]} intensity={isDark ? 6 : 5} color="#14b8a6" distance={10} decay={1.2} />
      <pointLight position={[1.5, -1.8, -3]} intensity={isDark ? 5 : 4} color="#14b8a6" distance={10} decay={1.2} />
      <pointLight position={[2, -1.8, -3]} intensity={isDark ? 5 : 4} color="#14b8a6" distance={10} decay={1.2} />
      <pointLight position={[0, 6, -3]} intensity={isDark ? 35 : 40} color="#ffffff" distance={10} />
    </ColorfulRoom>
  )
}

function AboutRoom({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { about } = portfolioData
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <Room position={position} color={isDark ? "#0f172a" : "#f1f5f9"} isDark={isDark}>
      {/* Main About Frame */}
      <FloatingFrame position={[0, 3, -5]} size={[10, 4]} isDark={isDark}>
        <div className="p-4 text-left">
          <h2 className="text-teal-400 text-2xl font-bold mb-3">{about.heading}</h2>
          {about.paragraphs.map((p, i) => (
            <p key={i} className={`${isDark ? "text-gray-300" : "text-gray-700"} text-sm mb-2`}>
              {p}
            </p>
          ))}
        </div>
      </FloatingFrame>

      {/* Stats */}
      <group position={[0, -0.5, -3]}>
        {about.stats.map((stat, i) => (
          <FloatingFrame key={i} position={[(i - 1.5) * 3, 0, 0]} size={[2.2, 1.8]} isDark={isDark}>
            <div className="p-2">
              <p className="text-teal-400 text-3xl font-bold">{stat.value}</p>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs`}>{stat.label}</p>
            </div>
          </FloatingFrame>
        ))}
      </group>

      {/* Floating decorative crystals */}
      <FloatingDecor position={[-5, 3.5, -2]} color="#14b8a6" size={0.3} isDark={isDark} />
      <FloatingDecor position={[5, 3.5, -2]} color="#06b6d4" size={0.3} isDark={isDark} />
      <FloatingDecor position={[-4, 1, -1]} color="#3b82f6" size={0.25} isDark={isDark} />
      <FloatingDecor position={[4, 1, -1]} color="#8b5cf6" size={0.25} isDark={isDark} />
      <FloatingDecor position={[0, 5, -3]} color="#14b8a6" size={0.35} isDark={isDark} />

      {/* Enhanced lighting */}
      <pointLight position={[0, 5, 0]} intensity={isDark ? 40 : 60} color="#14b8a6" />
      <pointLight position={[-5, 3, -2]} intensity={isDark ? 15 : 20} color="#14b8a6" distance={6} />
      <pointLight position={[5, 3, -2]} intensity={isDark ? 15 : 20} color="#06b6d4" distance={6} />
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
    </Room>
  )
}

function SkillsRoom({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { skills } = portfolioData

  return (
    <Room position={position} color={isDark ? "#1e1b4b" : "#e0e7ff"} isDark={isDark}>
      <FloatingFrame position={[0, 4.5, -5]} size={[6, 1.5]} isDark={isDark}>
        <h2 className="text-teal-400 text-2xl font-bold">{skills.heading}</h2>
      </FloatingFrame>

      {skills.categories.map((category, i) => {
        const xPos = i % 2 === 0 ? -3.5 : 3.5
        const yPos = i < 2 ? 2 : -0.5
        return (
          <FloatingFrame key={i} position={[xPos, yPos, -4]} size={[5, 2.5]} isDark={isDark}>
            <div className="p-3 text-left">
              <h3 className="text-teal-400 text-base font-semibold mb-2">{category.title}</h3>
              <div className="flex flex-wrap gap-1">
                {category.skills.map((skill, j) => (
                  <span key={j} className="bg-teal-500/20 text-white px-2 py-0.5 rounded text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </FloatingFrame>
        )
      })}

      {/* Floating decorative crystals */}
      <FloatingDecor position={[-6, 4, -2]} color="#8b5cf6" size={0.3} isDark={isDark} />
      <FloatingDecor position={[6, 4, -2]} color="#a855f7" size={0.3} isDark={isDark} />
      <FloatingDecor position={[-4.5, 1.5, -1.5]} color="#c084fc" size={0.25} isDark={isDark} />
      <FloatingDecor position={[4.5, 1.5, -1.5]} color="#d946ef" size={0.25} isDark={isDark} />
      <FloatingDecor position={[0, 5.5, -3]} color="#a78bfa" size={0.35} isDark={isDark} />

      {/* Enhanced lighting */}
      <pointLight position={[0, 5, 0]} intensity={isDark ? 40 : 60} color="#8b5cf6" />
      <pointLight position={[-6, 4, -2]} intensity={isDark ? 15 : 20} color="#8b5cf6" distance={6} />
      <pointLight position={[6, 4, -2]} intensity={isDark ? 15 : 20} color="#a855f7" distance={6} />
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
    </Room>
  )
}

function ExperienceRoom({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { experience } = portfolioData

  return (
    <Room position={position} color={isDark ? "#172554" : "#dbeafe"} isDark={isDark}>
      <FloatingFrame position={[0, 4.5, -5]} size={[6, 1.5]} isDark={isDark}>
        <h2 className="text-teal-400 text-2xl font-bold">{experience.heading}</h2>
      </FloatingFrame>

      {experience.items.map((item, i) => (
        <FloatingFrame key={i} position={[i === 0 ? -3 : 3, 1.5, -4]} size={[5, 4]} isDark={isDark}>
          <div className="p-3 text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${item.type === "work" ? "bg-teal-400" : "bg-purple-400"}`} />
              <span className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs`}>{item.period}</span>
            </div>
            <h3 className={`${isDark ? "text-white" : "text-slate-800"} text-base font-semibold`}>{item.title}</h3>
            <p className="text-teal-400 text-sm mb-2">{item.company}</p>
            <ul className="space-y-1">
              {item.description.slice(0, 3).map((desc, j) => (
                <li key={j} className={`${isDark ? "text-gray-300" : "text-gray-700"} text-xs`}>
                  • {desc}
                </li>
              ))}
            </ul>
          </div>
        </FloatingFrame>
      ))}

      {/* Floating decorative crystals */}
      <FloatingDecor position={[-5.5, 4, -2]} color="#3b82f6" size={0.3} isDark={isDark} />
      <FloatingDecor position={[5.5, 4, -2]} color="#60a5fa" size={0.3} isDark={isDark} />
      <FloatingDecor position={[-4, 0.5, -1.5]} color="#2563eb" size={0.25} isDark={isDark} />
      <FloatingDecor position={[4, 0.5, -1.5]} color="#1d4ed8" size={0.25} isDark={isDark} />
      <FloatingDecor position={[0, 5.5, -3]} color="#3b82f6" size={0.35} isDark={isDark} />

      {/* Enhanced lighting */}
      <pointLight position={[0, 5, 0]} intensity={isDark ? 40 : 60} color="#3b82f6" />
      <pointLight position={[-5, 4, -2]} intensity={isDark ? 15 : 20} color="#3b82f6" distance={6} />
      <pointLight position={[5, 4, -2]} intensity={isDark ? 15 : 20} color="#60a5fa" distance={6} />
      <ambientLight intensity={isDark ? 0.3 : 0.6} />

            {/* Floating button to open Resume */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3} position={[0, -1.5, -3]}>
        <Html transform center>
          <button
            onClick={() => {
              const event = new CustomEvent("openResume", {});
              document.dispatchEvent(event);
            }}
            className="px-2 py-1 bg-primary text-primary-foreground rounded-full font-medium text-xs shadow-sm hover:scale-105 transition-all cursor-pointer"
          >
            📄 Check experience →
          </button>
        </Html>
      </Float>
    </Room>
  )
}


function ContactRoom({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { contact, personal } = portfolioData

  return (
    <Room position={position} color={isDark ? "#0f172a" : "#f1f5f9"} isDark={isDark}>
      <FloatingFrame position={[0, 3, -5]} size={[8, 5]} isDark={isDark}>
        <div className="p-6">
          <h2 className="text-teal-400 text-3xl font-bold mb-3">{contact.heading}</h2>
          <p className={`${isDark ? "text-gray-300" : "text-gray-700"} text-base mb-6`}>{contact.description}</p>

          <div className="space-y-4">
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center justify-center gap-3 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 py-3 px-4 rounded-lg transition-colors"
            >
              <Mail size={20} />
              <span>{personal.email}</span>
            </a>

            <div className="flex justify-center gap-6">
              <a
                href={personal.github}
                className={`${isDark ? "text-white hover:text-teal-400" : "text-slate-700 hover:text-teal-500"} transition-colors`}
              >
                <Github size={28} />
              </a>
              <a
                href={personal.linkedin}
                className={`${isDark ? "text-white hover:text-teal-400" : "text-slate-700 hover:text-teal-500"} transition-colors`}
              >
                <Linkedin size={28} />
              </a>
            </div>
          </div>

          <p className={`${isDark ? "text-gray-500" : "text-gray-600"} text-xs mt-6`}>{personal.copyright}</p>
        </div>
      </FloatingFrame>

      {/* Floating decorative crystals */}
      <FloatingDecor position={[-5, 4, -2]} color="#14b8a6" size={0.3} isDark={isDark} />
      <FloatingDecor position={[5, 4, -2]} color="#06b6d4" size={0.3} isDark={isDark} />
      <FloatingDecor position={[-3.5, 1.5, -1.5]} color="#22d3ee" size={0.25} isDark={isDark} />
      <FloatingDecor position={[3.5, 1.5, -1.5]} color="#0891b2" size={0.25} isDark={isDark} />
      <FloatingDecor position={[0, 5.5, -3]} color="#14b8a6" size={0.35} isDark={isDark} />

      {/* Enhanced lighting */}
      <pointLight position={[0, 5, 0]} intensity={isDark ? 30 : 40} color="#14b8a6" />
      <pointLight position={[-5, 4, -2]} intensity={isDark ? 15 : 20} color="#14b8a6" distance={6} />
      <pointLight position={[5, 4, -2]} intensity={isDark ? 15 : 20} color="#06b6d4" distance={6} />
    </Room>
  )
}

function Scene({ currentRoom, isDark, isZoomedToDesk, isZoomedToIsland, isZoomedToBlueIsland, isZoomedToSingularityCrystal, isSingularityCrystalTransformed, isZoomedToOrangeCrystal, onZoomToDesk, onZoomToIsland, onZoomToBlueIsland, onSingularityCrystalClick, onSingularityCrystalDoubleClick, onOrangeCrystalClick, activeGame, setActiveGame, activeCategory, setActiveCategory, showWelcome, setShowWelcome, hoveredSkillIndex, setHoveredSkillIndex, gamesData }: { 
  currentRoom: number; 
  isDark: boolean; 
  isZoomedToDesk: boolean; 
  isZoomedToIsland: boolean;
  isZoomedToBlueIsland: boolean;
  isZoomedToSingularityCrystal: boolean;
  isSingularityCrystalTransformed: boolean;
  isZoomedToOrangeCrystal: boolean;
  onZoomToDesk: () => void;
  onZoomToIsland: () => void;
  onZoomToBlueIsland: () => void;
  onSingularityCrystalClick: (isDouble?: boolean) => void;
  onSingularityCrystalDoubleClick: () => void;
  onOrangeCrystalClick: () => void;
  activeGame: string | null;
  setActiveGame: (game: string | null) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  hoveredSkillIndex: number | null;
  setHoveredSkillIndex: (index: number | null) => void;
  gamesData?: any;
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const controlsRef = useRef<any>(null)
  
  // Позиция камеры для zoom к столу
  const deskCameraPosition: [number, number, number] = [0, 0.3, 0.5]
  const deskCameraTarget: [number, number, number] = [0, -0.3, -3.8]

  // Позиция камеры для zoom к острову — подлетаем близко к маленькому острову
  const islandCameraPosition: [number, number, number] = [-4.5, 3.2, -3.2]
  const islandCameraTarget: [number, number, number] = [-5, 3, -4]
  const blueIslandCameraPosition: [number, number, number] = [4.6, 4.0, -2.2]
  const blueIslandCameraTarget: [number, number, number] = [5, 4, -3]
  const singularityCrystalCameraPosition: [number, number, number] = [-3.25, 5.55, -3.55]
  const singularityCrystalCameraTarget: [number, number, number] = [-4, 5, -5]
  const orangeCrystalCameraPosition: [number, number, number] = [4.95, 2.65, -3.0]
  const orangeCrystalCameraTarget: [number, number, number] = [4, 2, -5]
  
  // Обычная позиция камеры
  const normalCameraPosition = rooms[currentRoom].cameraPosition
  const normalCameraTarget = [rooms[currentRoom].position[0], 1, 0] as [number, number, number]

  const isZoomed = isZoomedToDesk || isZoomedToIsland || isZoomedToBlueIsland || isZoomedToSingularityCrystal || isZoomedToOrangeCrystal

  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    const zoomTargetPos = isZoomedToDesk ? deskCameraPosition : isZoomedToIsland ? islandCameraPosition : isZoomedToBlueIsland ? blueIslandCameraPosition : isZoomedToSingularityCrystal ? singularityCrystalCameraPosition : isZoomedToOrangeCrystal ? orangeCrystalCameraPosition : null;

    if (zoomTargetPos) {
      const animate = () => {
        if (!cameraRef.current) return;
        const currentPos = cameraRef.current.position;
        const diffX = zoomTargetPos[0] - currentPos.x;
        const diffY = zoomTargetPos[1] - currentPos.y;
        const diffZ = zoomTargetPos[2] - currentPos.z;

        if (Math.abs(diffX) > 0.05 || Math.abs(diffY) > 0.05 || Math.abs(diffZ) > 0.05) {
          cameraRef.current.position.x += diffX * 0.1;
          cameraRef.current.position.y += diffY * 0.1;
          cameraRef.current.position.z += diffZ * 0.1;
          requestAnimationFrame(animate);
        } else {
          cameraRef.current.position.set(...zoomTargetPos);
        }
      };
      animate();
    } else {
      const targetPos = rooms[currentRoom].cameraPosition;
      const targetLookAt = [rooms[currentRoom].position[0], 1, 0];
      cameraRef.current.position.set(targetPos[0], targetPos[1], targetPos[2]);
      controlsRef.current.target.set(targetLookAt[0], targetLookAt[1], targetLookAt[2]);
      controlsRef.current.update();
    }
  }, [currentRoom, isZoomedToDesk, isZoomedToIsland, isZoomedToBlueIsland, isZoomedToSingularityCrystal, isZoomedToOrangeCrystal]);
  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={isZoomedToDesk ? deskCameraPosition : isZoomedToIsland ? islandCameraPosition : isZoomedToBlueIsland ? blueIslandCameraPosition : isZoomedToSingularityCrystal ? singularityCrystalCameraPosition : isZoomedToOrangeCrystal ? orangeCrystalCameraPosition : [0, 2, 8]} fov={60} />
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        enabled={true}
        minDistance={isZoomedToDesk ? 3.8 : isZoomedToIsland ? 0.8 : isZoomedToBlueIsland ? 0.9 : isZoomedToSingularityCrystal ? 0.9 : isZoomedToOrangeCrystal ? 1.0 : 5}
        maxDistance={isZoomedToDesk ? 4.5 : isZoomedToIsland ? 2.5 : isZoomedToBlueIsland ? 2.8 : isZoomedToSingularityCrystal ? 2.3 : isZoomedToOrangeCrystal ? 2.6 : 12}
        minPolarAngle={isZoomedToDesk ? Math.PI / 2.5 : isZoomedToIsland ? Math.PI / 4 : isZoomedToBlueIsland ? Math.PI / 4 : isZoomedToSingularityCrystal ? Math.PI / 4 : isZoomedToOrangeCrystal ? Math.PI / 4 : Math.PI / 4}
        maxPolarAngle={isZoomedToDesk ? Math.PI / 1.6 : isZoomedToIsland ? Math.PI / 1.5 : isZoomedToBlueIsland ? Math.PI / 1.45 : isZoomedToSingularityCrystal ? Math.PI / 1.4 : isZoomedToOrangeCrystal ? Math.PI / 1.45 : Math.PI / 2}
        target={isZoomedToDesk ? deskCameraTarget : isZoomedToIsland ? islandCameraTarget : isZoomedToBlueIsland ? blueIslandCameraTarget : isZoomedToSingularityCrystal ? singularityCrystalCameraTarget : isZoomedToOrangeCrystal ? orangeCrystalCameraTarget : normalCameraTarget}
      />

      <ambientLight intensity={isDark ? 0.4 : 0.6} />
      <directionalLight position={[10, 10, 5]} intensity={isDark ? 0.3 : 0.5} castShadow={false} />

      {/* Lazy load only nearby rooms for performance */}
      {currentRoom === 0 && <EntranceRoom position={rooms[0].position} isDark={isDark} onZoomToDesk={onZoomToDesk} onZoomToIsland={onZoomToIsland} onZoomToBlueIsland={onZoomToBlueIsland} onSingularityCrystalClick={onSingularityCrystalClick} onSingularityCrystalDoubleClick={onSingularityCrystalDoubleClick} isSingularityCrystalTransformed={isSingularityCrystalTransformed} onOrangeCrystalClick={onOrangeCrystalClick} activeGame={activeGame} setActiveGame={setActiveGame} activeCategory={activeCategory} setActiveCategory={setActiveCategory} showWelcome={showWelcome} setShowWelcome={setShowWelcome} hoveredSkillIndex={hoveredSkillIndex} setHoveredSkillIndex={setHoveredSkillIndex} hideHtmlOverlays={isZoomedToIsland || isZoomedToBlueIsland || isZoomedToSingularityCrystal || isZoomedToOrangeCrystal} gamesData={gamesData} />}
      {(currentRoom === 0 || currentRoom === 1) && <AboutRoom position={rooms[1].position} isDark={isDark} />}
      {(currentRoom === 1 || currentRoom === 2) && <SkillsRoom position={rooms[2].position} isDark={isDark} />}
      {(currentRoom === 2 || currentRoom === 3) && <ExperienceRoom position={rooms[3].position} isDark={isDark} />}
      {(currentRoom === 3 || currentRoom === 4) && <ContactRoom position={rooms[4].position} isDark={isDark} />}

      <Environment files={isDark ? "/hdri/dikhololo_night_1k.hdr" : "/hdri/potsdamer_platz_1k.hdr"} background={false} environmentIntensity={0.5} />
    </>
  )
}

export function House3D() {
  const [currentRoom, setCurrentRoom] = useState(0)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isZoomedToDesk, setIsZoomedToDesk] = useState(false)
  const [isZoomedToIsland, setIsZoomedToIsland] = useState(false)
  const [isZoomedToBlueIsland, setIsZoomedToBlueIsland] = useState(false)
  const [isZoomedToSingularityCrystal, setIsZoomedToSingularityCrystal] = useState(false)
  const [isSingularityCrystalTransformed, setIsSingularityCrystalTransformed] = useState(false)
  const [isZoomedToOrangeCrystal, setIsZoomedToOrangeCrystal] = useState(false)
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [hoveredSkillIndex, setHoveredSkillIndex] = useState<number | null>(null)
  const lastSingularityClickRef = useRef(0)
    useEffect(() => {
    const handleOpenResume = () => {
      setActiveCategory("Resume");
    };
    document.addEventListener("openResume", handleOpenResume);
    return () => document.removeEventListener("openResume", handleOpenResume);
  }, []);
  const gamesData = {
    "Game": getGamesByCategory("Game").map(game => ({
      name: game.en,
      url: game.url,
      description: game.descEn || (game.tags.includes("game") ? "Interactive game" : (game.tags.includes("visual") ? "Visual experience" : "Creative project")),
      color: getColorByTags(game.tags),
      isLocal: !game.url.startsWith("http"),
      github: game.github,
      isStatic: game.isStatic,
      staticEmoji: game.staticEmoji,
      staticLabel: game.staticLabel,
      tech: game.tech,
      isMobile: game.isMobile || game.tags.includes("mobile") || game.url.includes("mobile"),
    })),
    "Fun": getGamesByCategory("Fun").map(game => ({
      name: game.en,
      url: game.url,
      description: game.descEn || (game.tags.includes("music") ? "Music experience" : "Fun interactive project"),
      color: getColorByTags(game.tags),
      isLocal: !game.url.startsWith("http"),
      github: game.github,
    })),
    "Awards": getGamesByCategory("Awards").map(game => ({
      name: game.en,
      url: game.url,
      description: game.descEn || "Award-winning project",
      color: getColorByTags(game.tags),
      isLocal: !game.url.startsWith("http"),
      github: game.github,
    })),
    "Music": [
    ...getGamesByCategory("Music").map(game => ({
      name: game.en,
      url: game.url,
      description: game.descEn || "Music creation tool",
      color: getColorByTags(game.tags),
      isLocal: !game.url.startsWith("http"),
      github: game.github,
      isStatic: game.isStatic,
      staticEmoji: game.staticEmoji,
      staticLabel: game.staticLabel,
      isMobile: game.isMobile,
      redditLinks: game.redditLinks,
    })),
    ],
    "Resume": getGamesByCategory("Resume").map(game => ({
      name: game.en,
      url: game.url,
      description: game.descEn || "Professional experience & skills",
      color: getColorByTags(game.tags),
      isLocal: !game.url.startsWith("http"),
      github: game.github,
      isStatic: game.isStatic,
      isMobile: game.isMobile,
    })),
    "AI": getGamesByCategory("AI").map(game => ({
      name: game.en,
      url: game.url,
      description: game.descEn || "AI-powered project",
      color: getColorByTags(game.tags),
      isLocal: !game.url.startsWith("http"),
      github: game.github,
      isMobile: game.isMobile,
      redditLinks: game.redditLinks,
    })),
  };

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? resolvedTheme === "dark" : true

  const goToPrev = () => setCurrentRoom((prev) => Math.max(0, prev - 1))
  const goToNext = () => setCurrentRoom((prev) => Math.min(rooms.length - 1, prev + 1))
  
  const handleZoomToDesk = () => {
    setCurrentRoom(0)
    setIsZoomedToDesk(true)
  }

  const handleZoomToIsland = () => {
    setCurrentRoom(0)
    setIsZoomedToBlueIsland(false)
    setIsZoomedToSingularityCrystal(false)
    setIsZoomedToOrangeCrystal(false)
    setIsZoomedToIsland(true)
  }

  const handleZoomToBlueIsland = () => {
    setCurrentRoom(0)
    setIsZoomedToIsland(false)
    setIsZoomedToSingularityCrystal(false)
    setIsZoomedToOrangeCrystal(false)
    setIsZoomedToBlueIsland(true)
  }

  const handleSingularityCrystalClick = (isDouble = false) => {
    setCurrentRoom(0)
    if (!isZoomedToSingularityCrystal) {
      setIsZoomedToDesk(false)
      setIsZoomedToIsland(false)
      setIsZoomedToBlueIsland(false)
      setIsZoomedToOrangeCrystal(false)
      setIsZoomedToSingularityCrystal(true)
      return
    }

    if (!isSingularityCrystalTransformed) {
      setIsSingularityCrystalTransformed(true)
      lastSingularityClickRef.current = 0
      return
    }

    const now = performance.now()
    const rapidSecondClick = now - lastSingularityClickRef.current < 320
    if (isDouble || rapidSecondClick) {
      setIsSingularityCrystalTransformed(false)
      lastSingularityClickRef.current = 0
    } else {
      lastSingularityClickRef.current = now
    }
  }

  const handleSingularityCrystalDoubleClick = () => {
    if (isSingularityCrystalTransformed) {
      setIsSingularityCrystalTransformed(false)
      lastSingularityClickRef.current = 0
    }
  }


  const handleOrangeCrystalClick = () => {
    setCurrentRoom(0)
    setIsZoomedToDesk(false)
    setIsZoomedToIsland(false)
    setIsZoomedToBlueIsland(false)
    setIsZoomedToSingularityCrystal(false)
    setIsZoomedToOrangeCrystal(true)
  }
  
  const zoomOut = () => {
    setIsZoomedToDesk(false)
    setIsZoomedToIsland(false)
    setIsZoomedToBlueIsland(false)
    setIsZoomedToSingularityCrystal(false)
    setIsZoomedToOrangeCrystal(false)
  }
  
  const isModalOpen = !!(activeCategory || activeGame)

  return (
    <div className="relative h-screen w-full">
      {!isModalOpen && (
      <Canvas 
        shadows={false}
        className="bg-background"
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true
        }}
      >
        <Scene currentRoom={currentRoom} isDark={isDark} isZoomedToDesk={isZoomedToDesk} isZoomedToIsland={isZoomedToIsland} isZoomedToBlueIsland={isZoomedToBlueIsland} isZoomedToSingularityCrystal={isZoomedToSingularityCrystal} isSingularityCrystalTransformed={isSingularityCrystalTransformed} isZoomedToOrangeCrystal={isZoomedToOrangeCrystal} onZoomToDesk={handleZoomToDesk} onZoomToIsland={handleZoomToIsland} onZoomToBlueIsland={handleZoomToBlueIsland} onSingularityCrystalClick={handleSingularityCrystalClick} onSingularityCrystalDoubleClick={handleSingularityCrystalDoubleClick} onOrangeCrystalClick={handleOrangeCrystalClick} activeGame={activeGame} setActiveGame={setActiveGame} activeCategory={activeCategory} setActiveCategory={setActiveCategory} showWelcome={showWelcome} setShowWelcome={setShowWelcome} hoveredSkillIndex={hoveredSkillIndex} setHoveredSkillIndex={setHoveredSkillIndex} gamesData={gamesData} />
      </Canvas>
      )}

      {/* UI Overlay */}
      {!isModalOpen && (
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
            <span className="text-primary font-semibold">{portfolioData.personal.name}</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
      )}

      {/* Zoom Out Button */}
      {!isModalOpen && (isZoomedToDesk || isZoomedToIsland || isZoomedToBlueIsland || isZoomedToSingularityCrystal || isZoomedToOrangeCrystal) && (
        <div className="absolute top-20 left-4 z-10">
          <button
            onClick={zoomOut}
            className="bg-primary hover:bg-primary/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/50 transition-all hover:scale-105"
          >
            <span className="text-primary-foreground font-semibold">Back</span>
          </button>
        </div>
      )}

      {/* Room Navigation */}
      {!isModalOpen && !isZoomedToDesk && !isZoomedToIsland && !isZoomedToBlueIsland && !isZoomedToSingularityCrystal && !isZoomedToOrangeCrystal && (
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-2 border border-border flex items-center gap-2">
          <button
            onClick={goToPrev}
            disabled={currentRoom === 0}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex gap-1">
            {rooms.map((room, i) => {
              const Icon = room.icon
              return (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    currentRoom === i ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className={`text-sm font-medium ${currentRoom === i ? "block" : "hidden md:block"}`}>
                    {room.name}
                  </span>
                </button>
              )
            })}
          </div>

          <button
            onClick={goToNext}
            disabled={currentRoom === rooms.length - 1}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
      )}

      {/* Instructions */}
      {!isModalOpen && !isZoomedToDesk && !isZoomedToIsland && !isZoomedToBlueIsland && !isZoomedToSingularityCrystal && !isZoomedToOrangeCrystal && (
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col gap-2">
        <p className="hidden md:block text-muted-foreground text-sm bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full whitespace-nowrap">
          Drag to look around • Scroll to zoom • Click rooms to navigate
        </p>
        <p className="md:hidden text-muted-foreground text-xs bg-background/60 backdrop-blur-sm px-2 py-1 rounded-full whitespace-nowrap">
        Drag • Scroll • Click rooms
        </p>
        <p className="hidden md:block text-muted-foreground text-sm bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full whitespace-nowrap">
          Click on the monitor with MY SKILLS — camera will zoom in
        </p>
        <p className="md:hidden text-muted-foreground text-xs bg-background/60 backdrop-blur-sm px-2 py-1 rounded-full whitespace-nowrap">
        Click MY SKILLS to zoom
        </p>
      </div>
      )}

      {/* Fullscreen Game/Category Modal */}
      {(activeCategory || activeGame) && (
        <div 
          className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
                    {activeCategory && !activeGame ? (
            <div className="relative w-full h-full flex flex-col">
              {/* Category Header with Navigation */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <h2 className="hidden md:flex text-2xl font-bold text-primary items-center gap-3">
                    <FolderOpen className="w-8 h-8" />
                    {activeCategory}
                  </h2>
                  {/* Category Navigation Buttons - адаптивные */}
                  <div className="flex items-center gap-2 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-border overflow-x-auto max-w-[calc(100vw-100px)] md:max-w-none pb-1">
                    <div className="flex gap-2">
                      {["Game", "Fun", "Resume", "Awards", "Music", "AI"].map((category) => (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`px-3 md:w-[85px] md:px-4 py-2 rounded-lg text-sm font-semibold transition-all text-center whitespace-nowrap ${
                            activeCategory === category
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="p-2 rounded-lg hover:bg-destructive/20 transition-colors group"
                >
                  <X className="w-6 h-6 text-muted-foreground group-hover:text-destructive" />
                </button>
              </div>

              {/* Подсказка только для мобильных - ПОСЛЕ всего заголовка */}
              <p className="md:hidden text-xs text-muted-foreground text-center mt-1 mb-2">
              Scroll buttons above to the right
              </p>
              {/* Games Grid */}
              <div className="flex-1 p-8 overflow-auto bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {gamesData[activeCategory as keyof typeof gamesData]?.map((game) => (
                    <button
                      key={game.name}
                      onClick={() => setActiveGame(game.url)}
                      className="group relative p-6 rounded-xl border-2 border-border bg-card hover:border-primary transition-all hover:scale-105 hover:shadow-xl text-left min-h-[260px] flex flex-col"
                    >
                      <div className="flex flex-col gap-4 flex-1">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                          style={{ backgroundColor: `${game.color}20`, border: `2px solid ${game.color}` }}
                        >
                          {activeCategory === "Game" && <Gamepad2 className="w-8 h-8" style={{ color: game.color }} />}
                          {activeCategory === "Fun" && <Zap className="w-8 h-8" style={{ color: game.color }} />}
                          {activeCategory === "Resume" && <FileText className="w-8 h-8" style={{ color: game.color }} />}
                          {activeCategory === "Awards" && <Trophy className="w-8 h-8" style={{ color: game.color }} />}
                          {activeCategory === "Music" && <Music className="w-8 h-8" style={{ color: game.color }} />}
                          {activeCategory === "AI" && <Brain className="w-8 h-8" style={{ color: game.color }} />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {game.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {game.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                            <span>
                              {activeCategory === "Resume" ? "Check" : 
                              activeCategory === "Awards" ? "View" : "Look up"}
                            </span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
                    ) : activeGame ? (
            <div className="relative w-full h-full flex flex-col bg-black">
              {/* Game Header */}
              <div className="flex items-center justify-between p-3 bg-background/95 backdrop-blur-sm border-b border-border">
                <button
                  onClick={() => {
                    setActiveGame(null)
                    if (!activeCategory) setActiveCategory(null)
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-semibold">Back</span>
                </button>
                <button
                  onClick={() => {
                    setActiveGame(null)
                    setActiveCategory(null)
                  }}
                  className="p-2 rounded-lg hover:bg-destructive/20 transition-colors group"
                >
                  <X className="w-6 h-6 text-muted-foreground group-hover:text-destructive" />
                </button>
              </div>

              {/* Content: either static info modal or iframe */}
              <div className="flex-1 relative flex items-center justify-center bg-gray-900">
                {(() => {
                  // Находим текущую игру в gamesData
                  let currentGame = null;
                  for (const category in gamesData) {
                    const found = gamesData[category as keyof typeof gamesData]?.find(g => g.url === activeGame);
                    if (found) {
                      currentGame = found;
                      break;
                    }
                  }
                  const isStatic = currentGame?.isStatic === true || currentGame?.url === "https://t.me/PocketSoundbot";
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                  // Special window for Voice Cloner
                  if (currentGame?.name === "Voice Cloner") {
                    return (
                      <div className="max-w-2xl mx-auto p-8 bg-card rounded-2xl border border-primary/30 shadow-2xl">
                        <div className="text-center">
                          <span className="text-7xl mb-4 block">🎙️</span>
                          <h2 className="text-3xl font-bold mb-4 text-foreground">Voice Cloner</h2>
                          <p className="text-lg mb-6 text-muted-foreground">
                            Contact me on Telegram: <a href="https://t.me/sapelon" target="_blank" className="text-primary hover:underline">@sapelon</a> or <a href="https://t.me/cortexai" target="_blank" className="text-primary hover:underline">@cortexai</a><br/>
                            I will create a tunnel for you.
                          </p>
                          <div className="flex gap-4 justify-center">
                            <a
                              href={currentGame?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all"
                            >
                              Go
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  if (isStatic) {
                  console.log("PocketSound DEBUG:", { name: currentGame?.name, redditLinks: currentGame?.redditLinks });
                    return (
                      <div className="max-w-2xl mx-auto p-8 bg-card rounded-2xl border border-primary/30 shadow-2xl">
                        <div className="text-center">
                          <span className="text-7xl mb-4 block">{currentGame?.staticEmoji || "🔗"}</span>
                          <h2 className="text-3xl font-bold mb-4 text-foreground">{currentGame?.name}</h2>
                          <p className="text-lg mb-6 text-muted-foreground">{currentGame?.description}</p>
                          <div className="flex gap-4 justify-center flex-wrap">
                            <a 
                              href={currentGame?.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all"
                            >
                              {currentGame?.staticLabel || "Open"}
                            </a>
                            {currentGame?.github && (
                              <a 
                                href={currentGame.github} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all"
                              >
                                GitHub
                              </a>
                            )}
                          </div>
                          {currentGame?.name === "PocketSound" && (
                          <div className="mt-6 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-2">Discussion on Reddit:</p>
                            <div className="flex gap-3 justify-center flex-wrap">
                              <a href="https://www.reddit.com/r/n8n/comments/1ta2mt7/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                              Version 1
                              </a>
                              <a href="https://www.reddit.com/r/n8n/comments/1tgl4m9/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                              Version 2
                              </a>
                            </div>
                          </div>
                          )}
                          
                          {currentGame?.tech && currentGame.tech.length > 0 && (
                            <div className="mt-4 flex gap-2 justify-center flex-wrap">
                              {currentGame.tech.map((tech: string, idx: number) => (
                                <span key={idx} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  // Обычный iframe для динамических проектов
                  if (isMobile) {
                    return (
                      <div className="w-full h-full overflow-y-auto">
                        <iframe
                          src={activeGame}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex items-center justify-center w-full h-full overflow-auto p-4">
                        <div className="w-[400px] h-[780px] bg-black rounded-[40px] shadow-2xl overflow-hidden border-4 border-gray-700 relative">
                          <div className="absolute top-0 left-0 right-0 h-12 bg-black rounded-t-[44px] flex justify-center items-center">
                            <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
                          </div>
                          <iframe
                            src={activeGame}
                            className="absolute top-12 left-0 w-full h-[calc(100%-96px)] border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                          />
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                            <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}