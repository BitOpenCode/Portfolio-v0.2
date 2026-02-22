"use client"

import { Html } from "@react-three/drei"
import { type ThreeEvent, useFrame } from "@react-three/fiber"
import { Github, Linkedin, Mail } from "lucide-react"
import { useRef } from "react"
import * as THREE from "three"

type ContactData = {
  heading: string
  description: string
}

type PersonalData = {
  email: string
  github: string
  linkedin: string
  copyright: string
}

const PALETTE = {
  floor: "#3e4473",
  wall: "#4b5387",
  wallDark: "#22274f",
  trim: "#c9ccee",
  black: "#10152f",
  blackSoft: "#1a2145",
  neonA: "#7da8ff",
  neonB: "#6d8fff",
}


export function ContactCyberRoom({
  position,
  isDark = true,
  contact,
  personal,
}: {
  position: [number, number, number]
  isDark?: boolean
  contact: ContactData
  personal: PersonalData
}) {
  const rig = useRef<THREE.Group>(null)
  const targetTilt = useRef({ x: 0, y: 0 })

  const tvGlow = useRef<THREE.PointLight>(null)
  const tabletGlow = useRef<THREE.PointLight>(null)
  const tvScreenMat = useRef<THREE.MeshStandardMaterial>(null)
  const tabletMat = useRef<THREE.MeshStandardMaterial>(null)


  useFrame((state) => {
    const t = state.clock.elapsedTime
    const flicker = 0.84 + Math.sin(t * 18) * 0.11 + (Math.sin(t * 43) > 0.96 ? 0.24 : 0)

    if (tvGlow.current) tvGlow.current.intensity = (isDark ? 9.5 : 7.5) * flicker
    if (tabletGlow.current) tabletGlow.current.intensity = (isDark ? 4.0 : 3.0) * flicker
    if (tvScreenMat.current) tvScreenMat.current.emissiveIntensity = 1.0 * flicker
    if (tabletMat.current) tabletMat.current.emissiveIntensity = 0.7 * flicker

    if (rig.current) {
      const targetX = targetTilt.current.y * 0.022
      const targetZ = targetTilt.current.x * 0.035
      rig.current.rotation.x = THREE.MathUtils.lerp(rig.current.rotation.x, targetX, 0.06)
      rig.current.rotation.z = THREE.MathUtils.lerp(rig.current.rotation.z, targetZ, 0.06)
      rig.current.rotation.y = THREE.MathUtils.lerp(rig.current.rotation.y, 0, 0.06)
    }
  })

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!e.uv) return
    targetTilt.current.x = e.uv.x - 0.5
    targetTilt.current.y = e.uv.y - 0.5
  }

  const resetTilt = () => {
    targetTilt.current.x = 0
    targetTilt.current.y = 0
  }

  return (
    <group position={position}>
      <mesh position={[0, 1.6, 2.8]} onPointerMove={handlePointerMove} onPointerOut={resetTilt}>
        <planeGeometry args={[13.5, 9.5]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={rig}>
        {/* base + trims */}
        <mesh position={[0, -2.45, 0]}>
          <boxGeometry args={[12, 0.2, 12]} />
          <meshStandardMaterial color={isDark ? PALETTE.floor : "#d9deef"} roughness={0.88} />
        </mesh>
        <mesh position={[0, -2.25, 0]}>
          <boxGeometry args={[12.4, 0.18, 12.4]} />
          <meshStandardMaterial color={isDark ? PALETTE.trim : "#b8bfd9"} />
        </mesh>

        {/* back wall (TV centered) */}
        <mesh position={[0, 1.25, -5.95]}>
          <boxGeometry args={[12, 7.5, 0.2]} />
          <meshStandardMaterial color={isDark ? PALETTE.wallDark : "#cfd6ee"} roughness={0.92} />
        </mesh>

        {/* right wall (paintings + shelf) */}
        <mesh position={[5.95, 1.25, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[12, 7.5, 0.2]} />
          <meshStandardMaterial color={isDark ? PALETTE.wall : "#d7ddf2"} roughness={0.92} />
        </mesh>

        {/* TV zone centered on back wall */}
        <mesh position={[0, 1.15, -5.7]}>
          <boxGeometry args={[6.2, 5.6, 0.26]} />
          <meshStandardMaterial color={isDark ? "#0f1636" : "#cad2ef"} />
        </mesh>
        <mesh position={[0, 1.1, -5.45]}>
          <boxGeometry args={[4.6, 2.6, 0.08]} />
          <meshStandardMaterial ref={tvScreenMat} color={PALETTE.neonA} emissive={PALETTE.neonA} emissiveIntensity={1} roughness={0.35} />
        </mesh>
        <pointLight ref={tvGlow} position={[0, 1.1, -4.9]} color={PALETTE.neonA} distance={7} intensity={8} />

        {/* TV speakers */}
        <mesh position={[-2.85, 1.1, -5.45]}>
          <boxGeometry args={[0.34, 2.2, 0.34]} />
          <meshStandardMaterial color={PALETTE.black} />
        </mesh>
        <mesh position={[2.85, 1.1, -5.45]}>
          <boxGeometry args={[0.34, 2.2, 0.34]} />
          <meshStandardMaterial color={PALETTE.black} />
        </mesh>

        {/* TV shelves */}
        <mesh position={[0, 3.1, -5.55]}>
          <boxGeometry args={[2.2, 0.1, 0.46]} />
          <meshStandardMaterial color={PALETTE.trim} />
        </mesh>
        <mesh position={[0, -0.05, -5.55]}>
          <boxGeometry args={[2.8, 0.1, 0.46]} />
          <meshStandardMaterial color={PALETTE.trim} />
        </mesh>
        <mesh position={[-0.7, 3.22, -5.55]}>
          <boxGeometry args={[0.5, 0.24, 0.28]} />
          <meshStandardMaterial color={PALETTE.trim} />
        </mesh>
        <mesh position={[0.0, 3.22, -5.55]}>
          <boxGeometry args={[0.48, 0.24, 0.28]} />
          <meshStandardMaterial color={PALETTE.trim} />
        </mesh>
        <mesh position={[0.7, 3.22, -5.55]}>
          <boxGeometry args={[0.56, 0.24, 0.28]} />
          <meshStandardMaterial color={PALETTE.trim} />
        </mesh>

        {/* compact contact panel on lower TV shelf */}
        <group position={[0, -0.05, -5.3]}>
          <Html transform occlude scale={0.12} center>
            <div
              style={{
                width: "360px",
                borderRadius: "12px",
                padding: "12px 14px",
                background: isDark ? "rgba(10, 12, 28, 0.88)" : "rgba(255,255,255,0.92)",
                border: `1px solid ${isDark ? "rgba(125,168,255,0.42)" : "rgba(47,127,223,0.25)"}`,
                boxShadow: "0 8px 26px rgba(0,0,0,0.33)",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              <h3 style={{ margin: 0, marginBottom: 6, fontSize: 18, color: "#67e8f9" }}>{contact.heading}</h3>
              <p style={{ margin: 0, marginBottom: 9, fontSize: 11, lineHeight: "16px", color: isDark ? "#cbd5e1" : "#334155" }}>{contact.description}</p>
              <a
                href={`mailto:${personal.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  borderRadius: 9,
                  padding: "8px 10px",
                  marginBottom: 8,
                  textDecoration: "none",
                  color: "white",
                  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                }}
              >
                <Mail size={14} />
                <span style={{ fontWeight: 700, fontSize: 12 }}>{personal.email}</span>
              </a>
              <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
                <a href={personal.github} target="_blank" rel="noreferrer" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}><Github size={18} /></a>
                <a href={personal.linkedin} target="_blank" rel="noreferrer" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}><Linkedin size={18} /></a>
              </div>
              <p style={{ margin: 0, marginTop: 7, textAlign: "center", fontSize: 9, color: isDark ? "#94a3b8" : "#64748b" }}>{personal.copyright}</p>
            </div>
          </Html>
        </group>

        {/* right wall: door */}
        <group position={[5.72, -2.35, -1.0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 2.3, 0]}>
            <boxGeometry args={[2.25, 4.7, 0.16]} />
            <meshStandardMaterial color={isDark ? "#0d1435" : "#d2d9ea"} roughness={0.58} />
          </mesh>
          <mesh position={[-1.15, 2.3, 0]}>
            <boxGeometry args={[0.22, 4.8, 0.24]} />
            <meshStandardMaterial color={isDark ? PALETTE.black1 : "#9ba8c8"} />
          </mesh>
          <mesh position={[1.15, 2.3, 0]}>
            <boxGeometry args={[0.22, 4.8, 0.24]} />
            <meshStandardMaterial color={isDark ? PALETTE.black1 : "#9ba8c8"} />
          </mesh>
          <mesh position={[0.78, 2.25, 0.1]}>
            <boxGeometry args={[0.24, 0.1, 0.08]} />
            <meshStandardMaterial color={PALETTE.trim} emissive={PALETTE.neonA} emissiveIntensity={0.4} />
          </mesh>
        </group>

        {/* right wall: two paintings */}
        <mesh position={[5.84, 2.25, 2.2]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[2.1, 2.8, 0.08]} />
          <meshStandardMaterial color="#d35b63" emissive={PALETTE.neonB} emissiveIntensity={0.14} />
        </mesh>
        <mesh position={[5.84, 2.25, 4.6]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[2.0, 2.8, 0.08]} />
          <meshStandardMaterial color="#1b2b3a" emissive={PALETTE.neonB} emissiveIntensity={0.12} />
        </mesh>


        {/* sofa in front of camera */}
        <group position={[2.8, -2.2, 3.15]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0.56, 0]}>
            <boxGeometry args={[3.4, 0.9, 2.0]} />
            <meshStandardMaterial color={PALETTE.blackSoft} />
          </mesh>
          <mesh position={[0, 1.46, -0.78]}>
            <boxGeometry args={[3.4, 1.05, 0.36]} />
            <meshStandardMaterial color={PALETTE.black1} />
          </mesh>
          <mesh position={[-1.58, 1.05, 0]}>
            <boxGeometry args={[0.22, 1.25, 2.0]} />
            <meshStandardMaterial color={PALETTE.black1} />
          </mesh>
          <mesh position={[1.58, 1.05, 0]}>
            <boxGeometry args={[0.22, 1.25, 2.0]} />
            <meshStandardMaterial color={PALETTE.black1} />
          </mesh>
        </group>

        {/* table + tablet before sofa */}
        <group position={[0.5, -2.2, 0.65]}>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[2.95, 0.12, 2.05]} />
            <meshStandardMaterial color={PALETTE.black} />
          </mesh>
          {[
            [-1.3, 0.4, -0.85],
            [1.3, 0.4, -0.85],
            [-1.3, 0.4, 0.85],
            [1.3, 0.4, 0.85],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]}>
              <boxGeometry args={[0.11, 0.84, 0.11]} />
              <meshStandardMaterial color={PALETTE.blackSoft} />
            </mesh>
          ))}
          <mesh position={[0.65, 1.03, -0.2]} rotation={[0.05, -0.22, 0.18]}>
            <boxGeometry args={[0.86, 0.06, 0.52]} />
            <meshStandardMaterial ref={tabletMat} color={PALETTE.neonA} emissive={PALETTE.neonA} emissiveIntensity={0.68} />
          </mesh>
          <pointLight ref={tabletGlow} position={[0.65, 1.1, -0.2]} color={PALETTE.neonA} distance={3.4} intensity={3.4} />
        </group>

        {/* floor accents */}
        <mesh position={[-2.8, -2.15, -5.55]}>
          <boxGeometry args={[3.6, 0.05, 0.08]} />
          <meshStandardMaterial color={PALETTE.neonA} emissive={PALETTE.neonA} emissiveIntensity={0.75} />
        </mesh>
        <mesh position={[5.72, -2.15, 2.3]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[3.1, 0.05, 0.08]} />
          <meshStandardMaterial color={PALETTE.neonB} emissive={PALETTE.neonB} emissiveIntensity={0.72} />
        </mesh>
      </group>

      {/* key lights */}
      <ambientLight intensity={isDark ? 0.24 : 0.3} />
      <pointLight position={[0, 4.9, 1.2]} intensity={isDark ? 3.6 : 2.8} color="#ffffff" distance={10} />
      <pointLight position={[0, -1.7, 1.9]} intensity={isDark ? 2.4 : 1.6} color="#7da8ff" distance={7} />
      <pointLight position={[5.2, 1.8, 2.4]} intensity={isDark ? 2.5 : 1.8} color="#7da8ff" distance={8} />
    </group>
  )
}
