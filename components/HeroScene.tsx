"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import type { ThemeColors } from "@/lib/theme";

/** Radius of the icosahedron geometry */
const GEO_RADIUS = 1.8;
/** Level of subdivision (higher = smoother halves) */
const GEO_DETAIL = 1;
/** Slow base rotation speed in radians per second */
const ROT_SPEED_BASE = 0.18;
/** Fraction of base speed applied to Y-axis */
const ROT_SPEED_Y_RATIO = 0.7;

// ─── Geometry helpers ──────────────────────────────────────────────────────

/**
 * Partitions an IcosahedronGeometry's faces into two groups based on whether
 * each triangle's centroid falls in the positive-x half or the negative-x half.
 * Returns index arrays for both groups so we can render them as two meshes
 * sharing a single geometry but using different materials.
 */
function partitionIcosahedronIndices(geometry: THREE.BufferGeometry): {
  solidIndices: number[];
  wireIndices: number[];
} {
  const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
  const idx = geometry.getIndex();

  const solidIndices: number[] = [];
  const wireIndices: number[] = [];

  if (idx) {
    for (let i = 0; i < idx.count; i += 3) {
      const a = idx.getX(i);
      const b = idx.getX(i + 1);
      const c = idx.getX(i + 2);

      const cx = (pos.getX(a) + pos.getX(b) + pos.getX(c)) / 3;

      if (cx >= 0) {
        solidIndices.push(a, b, c);
      } else {
        wireIndices.push(a, b, c);
      }
    }
  }

  return { solidIndices, wireIndices };
}

// ─── Sub-mesh: design half (wireframe, terracotta) ────────────────────────

function DesignHalf({
  geometry,
  wireIndices,
  wireframeColor,
}: {
  geometry: THREE.BufferGeometry;
  wireIndices: number[];
  wireframeColor: string;
}) {
  const subGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", geometry.getAttribute("position"));
    g.setAttribute("normal", geometry.getAttribute("normal"));
    g.setIndex(wireIndices);
    g.computeBoundingSphere();
    return g;
  }, [geometry, wireIndices]);

  const wireGeo = useMemo(() => new THREE.WireframeGeometry(subGeo), [subGeo]);

  return (
    <lineSegments geometry={wireGeo}>
      <lineBasicMaterial
        color={wireframeColor}
        transparent
        opacity={1}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ─── Sub-mesh: development half (solid, warm lit surface) ─────────────────

function DevelopmentHalf({
  geometry,
  solidIndices,
  solidColor,
}: {
  geometry: THREE.BufferGeometry;
  solidIndices: number[];
  solidColor: string;
}) {
  const subGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", geometry.getAttribute("position"));
    g.setAttribute("normal", geometry.getAttribute("normal"));
    g.setIndex(solidIndices);
    g.computeBoundingSphere();
    return g;
  }, [geometry, solidIndices]);

  return (
    <mesh geometry={subGeo}>
      <meshStandardMaterial
        color={solidColor}
        roughness={0.35}
        metalness={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Seam edge glow (single shared wireframe at low opacity) ──────────────

function SeamGlow({
  geometry,
  seamColor,
}: {
  geometry: THREE.BufferGeometry;
  seamColor: string;
}) {
  const wireGeo = useMemo(
    () => new THREE.WireframeGeometry(geometry),
    [geometry]
  );

  return (
    <lineSegments geometry={wireGeo}>
      <lineBasicMaterial
        color={seamColor}
        transparent
        opacity={0.14}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ─── Spinning group containing both halves ────────────────────────────────

interface SplitIcosahedronProps {
  staticPose: boolean;
  colors: ThemeColors;
}

function SplitIcosahedron({ staticPose, colors }: SplitIcosahedronProps) {
  const groupRef = useRef<THREE.Group>(null);

  const baseGeo = useMemo(
    () => new THREE.IcosahedronGeometry(GEO_RADIUS, GEO_DETAIL),
    []
  );

  const { solidIndices, wireIndices } = useMemo(
    () => partitionIcosahedronIndices(baseGeo),
    [baseGeo]
  );

  useFrame((_state, delta) => {
    if (staticPose || !groupRef.current) return;
    groupRef.current.rotation.y += delta * ROT_SPEED_BASE * ROT_SPEED_Y_RATIO;
    groupRef.current.rotation.x += delta * ROT_SPEED_BASE * 0.35;
  });

  const INITIAL_ROTATION_X = 0.3;
  const INITIAL_ROTATION_Y = 0.6;

  return (
    <group
      ref={groupRef}
      rotation={[INITIAL_ROTATION_X, INITIAL_ROTATION_Y, 0]}
    >
      <SeamGlow geometry={baseGeo} seamColor={colors.seam} />
      <DesignHalf geometry={baseGeo} wireIndices={wireIndices} wireframeColor={colors.wireframe} />
      <DevelopmentHalf geometry={baseGeo} solidIndices={solidIndices} solidColor={colors.solid} />
    </group>
  );
}

// ─── Exported canvas component ────────────────────────────────────────────

interface HeroSceneProps {
  staticPose?: boolean;
  colors: ThemeColors;
}

/**
 * HeroScene — a Three.js canvas visual for the portfolio hero section.
 *
 * Accepts theme-aware colors as props so materials update reactively
 * when the theme changes. No MutationObserver needed — React re-renders
 * this component when HeroSceneWrapper passes new colors.
 *
 * Technical notes:
 * - Client-only; loaded via `next/dynamic` with `ssr: false` from the page.
 * - `aria-hidden="true"` — decorative; primary content is the surrounding heading.
 * - Pixel ratio capped at 2 for performance.
 * - Respects `prefers-reduced-motion` via the `staticPose` prop.
 */
export function HeroScene({ staticPose = false, colors }: HeroSceneProps) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        frameloop={staticPose ? "demand" : "always"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.2], fov: 50, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Ambient fill — intensity and color vary by theme */}
        <ambientLight intensity={0.45} color={colors.ambient} />

        {/* Key light from upper-right */}
        <directionalLight
          position={[4, 6, 3]}
          intensity={2.2}
          color={colors.keyLight}
        />

        {/* Rim light from upper-left — separates shape from background */}
        <directionalLight
          position={[-5, 3, 1]}
          intensity={0.6}
          color={colors.rimLight}
        />

        {/* Terracotta bounce from lower-left — warms the design wireframe half */}
        <pointLight
          position={[-4, -3, 2]}
          intensity={1.2}
          color={colors.bounce}
          distance={14}
          decay={2}
        />

        {/* Environment for subtle IBL reflections on the solid half */}
        <Environment preset="dawn" />

        <SplitIcosahedron staticPose={staticPose} colors={colors} />
      </Canvas>
    </div>
  );
}
