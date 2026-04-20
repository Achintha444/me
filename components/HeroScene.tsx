"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

// ─── Design constants ──────────────────────────────────────────────────────
/** Terracotta accent — matches --color-accent in globals.css */
const COLOR_ACCENT = "#C84B31";
/** Warm dark ink — matches --color-ink in globals.css */
const COLOR_INK = "#0F0E0D";

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

      // Centroid x-coordinate of the triangle
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

/** The wireframe (design) half of the split icosahedron. */
function DesignHalf({
  geometry,
  wireIndices,
}: {
  geometry: THREE.BufferGeometry;
  wireIndices: number[];
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
        color="#A83A23"
        transparent
        opacity={1}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ─── Sub-mesh: development half (solid, warm lit surface) ─────────────────

/** The solid (development) half of the split icosahedron. */
function DevelopmentHalf({
  geometry,
  solidIndices,
}: {
  geometry: THREE.BufferGeometry;
  solidIndices: number[];
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
        color="#E8E0D6"
        roughness={0.35}
        metalness={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Seam edge glow (single shared wireframe at low opacity) ──────────────

/**
 * Full wireframe drawn at very low opacity to hint at the complete structure.
 * Gives the seam between halves a subtle lit appearance.
 */
function SeamGlow({ geometry }: { geometry: THREE.BufferGeometry }) {
  const wireGeo = useMemo(
    () => new THREE.WireframeGeometry(geometry),
    [geometry]
  );

  return (
    <lineSegments geometry={wireGeo}>
      <lineBasicMaterial
        color={COLOR_INK}
        transparent
        opacity={0.14}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ─── Spinning group containing both halves ────────────────────────────────

/** Props for the split icosahedron rig. */
interface SplitIcosahedronProps {
  /** If true, the mesh holds a fixed display pose without any animation loop. */
  staticPose: boolean;
}

/**
 * Icosahedron split along the x=0 plane:
 * - Negative-x half: wireframe lines in terracotta (#C84B31) — representing design
 * - Positive-x half: solid lit surface in off-white — representing development
 *
 * Rotates slowly so the seam always catches the warm light from the Environment.
 */
function SplitIcosahedron({ staticPose }: SplitIcosahedronProps) {
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

  // Static starting pose — tilted so both halves are visible on load
  const INITIAL_ROTATION_X = 0.3;
  const INITIAL_ROTATION_Y = 0.6;

  return (
    <group
      ref={groupRef}
      rotation={[INITIAL_ROTATION_X, INITIAL_ROTATION_Y, 0]}
    >
      <SeamGlow geometry={baseGeo} />
      <DesignHalf geometry={baseGeo} wireIndices={wireIndices} />
      <DevelopmentHalf geometry={baseGeo} solidIndices={solidIndices} />
    </group>
  );
}

// ─── Exported canvas component ────────────────────────────────────────────

/** Props for the HeroScene canvas wrapper. */
interface HeroSceneProps {
  /**
   * If true, suppress the animation loop. Used when `prefers-reduced-motion`
   * is active — the mesh renders in a fixed pose instead.
   */
  staticPose?: boolean;
}

/**
 * HeroScene — a Three.js canvas visual for the portfolio hero section.
 *
 * Metaphor: an icosahedron split along its vertical axis. The left (negative-x)
 * half is rendered as a terracotta wireframe, evoking design sketches and
 * Figma frames. The right (positive-x) half is a fully lit solid surface,
 * evoking shipped, engineered product. Both halves are one form — the same
 * geometry — communicating that design and development are unified in a single
 * discipline rather than separate trades.
 *
 * Technical notes:
 * - Client-only; loaded via `next/dynamic` with `ssr: false` from the page.
 * - `aria-hidden="true"` — decorative; primary content is the surrounding heading.
 * - Pixel ratio capped at 2 for performance.
 * - Respects `prefers-reduced-motion` via the `staticPose` prop.
 * - `frameloop="always"` kept simple; geometry is low-poly (≤80 faces).
 */
export function HeroScene({ staticPose = false }: HeroSceneProps) {
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
        {/* Warm ambient fill — slightly reduced so the directional key has more contrast */}
        <ambientLight intensity={0.45} color="#FFF5EE" />

        {/* Key light from upper-right — strong catch on the solid half */}
        <directionalLight
          position={[4, 6, 3]}
          intensity={2.2}
          color="#FFFFFF"
        />

        {/* Rim light from upper-left — separates the shape from the background */}
        <directionalLight
          position={[-5, 3, 1]}
          intensity={0.6}
          color="#E8D5C0"
        />

        {/* Terracotta bounce from lower-left — warms the design wireframe half */}
        <pointLight
          position={[-4, -3, 2]}
          intensity={1.2}
          color={COLOR_ACCENT}
          distance={14}
          decay={2}
        />

        {/* Environment for subtle IBL reflections on the solid half */}
        <Environment preset="dawn" />

        <SplitIcosahedron staticPose={staticPose} />
      </Canvas>
    </div>
  );
}
