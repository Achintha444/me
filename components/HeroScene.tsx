"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, invalidate } from "@react-three/fiber";
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
/** Radius of vertex dot spheres placed at the 12 original icosahedron corners */
const VERTEX_DOT_RADIUS = 0.055;
/** Lerp factor per frame for the hover tint transition (~150 ms at 60 fps) */
const HOVER_LERP_FACTOR = 0.12;
/** Squared color-distance threshold below which lerping stops */
const LERP_EPSILON_SQ = 0.00001;

// ─── Geometry helpers ──────────────────────────────────────────────────────

/**
 * Extracts the 12 unique vertex positions from a detail-0 icosahedron.
 * The detail-0 geometry has exactly 12 vertices — the original icosahedron corners.
 * Using detail-0 here (not the shared detail-1 geometry) avoids pulling 42 positions.
 *
 * @param radius - The icosahedron radius, must match GEO_RADIUS.
 * @returns Array of 12 THREE.Vector3 positions in local space.
 */
function getOriginalIcosahedronVertices(radius: number): THREE.Vector3[] {
  const geo = new THREE.IcosahedronGeometry(radius, 0);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const seen = new Map<string, THREE.Vector3>();

  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    // Round to 4 decimal places to deduplicate nearly-identical positions
    const key = `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;
    if (!seen.has(key)) seen.set(key, v);
  }

  geo.dispose();
  return Array.from(seen.values());
}

/**
 * Resets a 4-component RGBA color buffer to fully transparent (alpha = 0).
 * RGB values are left untouched since they don't render at alpha 0.
 *
 * @param buffer - The target Float32Array (length = vertexCount * 4).
 */
function clearAlphaBuffer(buffer: Float32Array): void {
  for (let i = 3; i < buffer.length; i += 4) {
    buffer[i] = 0;
  }
}

// ─── Full-icosahedron wireframe ───────────────────────────────────────────

/**
 * Renders every edge of the icosahedron as a wireframe line mesh in a single
 * color. Replaces the previous half-wireframe + seam-glow pair so all visible
 * borders share one color.
 *
 * @param geometry - Shared base BufferGeometry.
 * @param wireframeColor - CSS/hex color string from the active theme.
 */
function FullWireframe({
  geometry,
  wireframeColor,
}: {
  geometry: THREE.BufferGeometry;
  wireframeColor: string;
}) {
  const wireGeo = useMemo(
    () => new THREE.WireframeGeometry(geometry),
    [geometry]
  );
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.color.set(wireframeColor);
    invalidate();
  }, [wireframeColor]);

  return (
    <lineSegments geometry={wireGeo} raycast={() => null}>
      <lineBasicMaterial
        ref={materialRef}
        color={wireframeColor}
        transparent
        opacity={1}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ─── Sub-mesh: development half (solid, warm lit surface) ─────────────────

/**
 * Renders the positive-x half of the icosahedron as a transparent hit-mesh.
 * At rest the mesh is fully invisible; on hover, the front-facing triangle
 * under the cursor fades up to the theme's hover tint.
 *
 * Visibility is driven by per-vertex RGBA colors (alpha 0 = invisible).
 * `meshStandardMaterial` with `vertexColors` honours per-vertex alpha when
 * the color attribute has itemSize 4 and the material is `transparent`.
 *
 * Hover tinting is smoothed via a lerp in `useFrame`; once settled (squared
 * distance below LERP_EPSILON_SQ), invalidation stops to save GPU power.
 *
 * @param geometry - Shared base BufferGeometry (detail-1, 240 positions).
 * @param solidIndices - Index list for the positive-x (dev) triangles.
 * @param hoverTint - CSS/hex accent color from the active theme.
 * @param onHoverChange - Callback so the parent group can pause rotation.
 */
function DevelopmentHalf({
  geometry,
  solidIndices,
  hoverTint,
  onHoverChange,
}: {
  geometry: THREE.BufferGeometry;
  solidIndices: number[];
  hoverTint: string;
  onHoverChange: (isHovered: boolean) => void;
}) {
  const vertexCount = useMemo(
    () => (geometry.getAttribute("position") as THREE.BufferAttribute).count,
    [geometry]
  );

  const subGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // Clone position/normal so this geometry owns its buffers (sharing can
    // cause raycast edge-cases when the index doesn't reference every vertex).
    const srcPos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const srcNorm = geometry.getAttribute("normal") as THREE.BufferAttribute;
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(srcPos.array), 3)
    );
    g.setAttribute(
      "normal",
      new THREE.BufferAttribute(new Float32Array(srcNorm.array), 3)
    );
    g.setIndex(solidIndices);

    // Per-vertex RGBA color buffer; alpha 0 = invisible.
    const colors = new Float32Array(vertexCount * 4);
    g.setAttribute("color", new THREE.BufferAttribute(colors, 4));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    return g;
  }, [geometry, solidIndices, vertexCount]);

  /** Live RGBA buffer (currently on GPU) and target buffer (lerp destination). */
  const liveColors = useRef<Float32Array | null>(null);
  const targetColors = useRef<Float32Array | null>(null);
  /** Index of the currently hovered face (-1 = none). */
  const hoveredFace = useRef<number>(-1);
  /** Whether any lerp is still in progress. */
  const lerpActive = useRef<boolean>(false);

  useEffect(() => {
    const attr = subGeo.getAttribute("color") as THREE.BufferAttribute;
    liveColors.current = attr.array as Float32Array;
    targetColors.current = new Float32Array(liveColors.current);
  }, [subGeo]);

  /**
   * When hoverTint changes (theme switch while hovering), repaint the
   * currently-hovered face's target RGB to the new tint. Alpha stays at 1.
   */
  useEffect(() => {
    const target = targetColors.current;
    if (!target || hoveredFace.current === -1) return;
    const idx = subGeo.getIndex();
    if (!idx) return;
    const tint = new THREE.Color(hoverTint);
    const fi = hoveredFace.current;
    for (let k = 0; k < 3; k++) {
      const vi = idx.array[fi * 3 + k] * 4;
      target[vi] = tint.r;
      target[vi + 1] = tint.g;
      target[vi + 2] = tint.b;
      target[vi + 3] = 1;
    }
    lerpActive.current = true;
    invalidate();
  }, [hoverTint, subGeo]);

  /** Lerps live colors toward target each frame; stops when settled. */
  useFrame(() => {
    const live = liveColors.current;
    const target = targetColors.current;
    if (!live || !target || !lerpActive.current) return;

    let maxDeltaSq = 0;
    for (let i = 0; i < live.length; i++) {
      const diff = target[i] - live[i];
      live[i] += diff * HOVER_LERP_FACTOR;
      maxDeltaSq = Math.max(maxDeltaSq, diff * diff);
    }

    const colorAttr = subGeo.getAttribute("color") as THREE.BufferAttribute;
    colorAttr.needsUpdate = true;

    if (maxDeltaSq < LERP_EPSILON_SQ) {
      for (let i = 0; i < live.length; i++) live[i] = target[i];
      colorAttr.needsUpdate = true;
      lerpActive.current = false;
    } else {
      invalidate();
    }
  });

  /**
   * Applies a tint to the target buffer for the given face, restoring the
   * previous face's alpha to 0 so only one triangle is visible at a time.
   *
   * @param nextFace - Triangle index into the subGeo index buffer.
   * @param tint - The hover THREE.Color to apply.
   */
  function applyFaceHover(nextFace: number, tint: THREE.Color): void {
    const target = targetColors.current;
    const idx = subGeo.getIndex();
    if (!target || !idx) return;

    const prevFace = hoveredFace.current;

    if (prevFace !== -1 && prevFace !== nextFace) {
      for (let k = 0; k < 3; k++) {
        const vi = idx.array[prevFace * 3 + k] * 4;
        target[vi + 3] = 0; // fade alpha to 0; RGB doesn't matter while invisible
      }
    }

    for (let k = 0; k < 3; k++) {
      const vi = idx.array[nextFace * 3 + k] * 4;
      target[vi] = tint.r;
      target[vi + 1] = tint.g;
      target[vi + 2] = tint.b;
      target[vi + 3] = 1;
    }

    hoveredFace.current = nextFace;
    lerpActive.current = true;
    invalidate();
  }

  /** Fades all vertex alphas back to 0 — full invisibility. */
  function clearFaceHover(): void {
    const target = targetColors.current;
    if (!target) return;
    clearAlphaBuffer(target);
    hoveredFace.current = -1;
    lerpActive.current = true;
    invalidate();
  }

  return (
    <mesh
      geometry={subGeo}
      onPointerMove={(e) => {
        if (e.faceIndex === undefined || e.faceIndex === null) return;
        if (e.faceIndex === hoveredFace.current) return;
        applyFaceHover(e.faceIndex, new THREE.Color(hoverTint));
      }}
      onPointerOut={() => {
        onHoverChange(false);
        clearFaceHover();
      }}
      onPointerOver={() => {
        onHoverChange(true);
      }}
    >
      <meshStandardMaterial
        vertexColors
        transparent
        roughness={0.35}
        metalness={0.12}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

// ─── Vertex dots at the 12 original icosahedron corners ───────────────────

/**
 * Renders 12 small emissive spheres at the original icosahedron vertex positions
 * (before subdivision). These dots are parented to the rotating group so they
 * move with the shape.
 *
 * The 12 positions are computed from a temporary detail-0 IcosahedronGeometry
 * and deduplicated via string-keyed position rounding, since Three.js may
 * duplicate vertices at seams even for detail-0.
 *
 * @param vertexDotColor - CSS/hex color string from the active theme.
 */
function VertexDots({ vertexDotColor }: { vertexDotColor: string }) {
  const vertices = useMemo(() => getOriginalIcosahedronVertices(GEO_RADIUS), []);

  const dotGeo = useMemo(
    () => new THREE.SphereGeometry(VERTEX_DOT_RADIUS, 16, 16),
    []
  );

  /**
   * One shared MeshStandardMaterial instance reused by all 12 dot meshes via
   * <primitive>. This ensures theme-change effects update every dot in a single
   * material.color.set() call rather than needing one ref per sphere.
   */
  const sharedMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: vertexDotColor,
        emissive: new THREE.Color(vertexDotColor),
        emissiveIntensity: 0.6,
        metalness: 0.2,
        roughness: 0.3,
      }),
    [] // created once; color kept in sync via the effect below
  );

  useEffect(() => {
    sharedMaterial.color.set(vertexDotColor);
    sharedMaterial.emissive.set(vertexDotColor);
    invalidate();
  }, [vertexDotColor, sharedMaterial]);

  return (
    <>
      {vertices.map((v, i) => (
        <mesh key={i} geometry={dotGeo} position={[v.x, v.y, v.z]} raycast={() => null}>
          <primitive object={sharedMaterial} attach="material" />
        </mesh>
      ))}
    </>
  );
}

// ─── Spinning group containing both halves ────────────────────────────────

interface SplitIcosahedronProps {
  staticPose: boolean;
  colors: ThemeColors;
}

/**
 * SplitIcosahedron — the rotating group that contains all three mesh layers
 * (design wireframe half, solid development half, seam glow) plus the 12
 * vertex dot spheres.
 *
 * Rotation pauses when the cursor is over the solid half or when staticPose
 * is true (prefers-reduced-motion). staticPose always wins.
 *
 * @param staticPose - Disables all animation when true.
 * @param colors - Full theme color set from the active ThemeColors entry.
 */
function SplitIcosahedron({ staticPose, colors }: SplitIcosahedronProps) {
  const groupRef = useRef<THREE.Group>(null);
  /** True while the pointer is over the solid half. */
  const isHovered = useRef<boolean>(false);

  const baseGeo = useMemo(
    () => new THREE.IcosahedronGeometry(GEO_RADIUS, GEO_DETAIL),
    []
  );

  /**
   * Indices for every face of the icosahedron. The hover hit-mesh covers the
   * whole shape so any face under the cursor can be tinted.
   */
  const allFaceIndices = useMemo(() => {
    const pos = baseGeo.getAttribute("position") as THREE.BufferAttribute;
    const idx = baseGeo.getIndex();
    const out: number[] = [];
    if (idx) {
      for (let i = 0; i < idx.count; i++) out.push(idx.getX(i));
    } else {
      for (let i = 0; i < pos.count; i++) out.push(i);
    }
    return out;
  }, [baseGeo]);

  useFrame((_state, delta) => {
    if (staticPose || isHovered.current || !groupRef.current) return;
    groupRef.current.rotation.y += delta * ROT_SPEED_BASE * ROT_SPEED_Y_RATIO;
    groupRef.current.rotation.x += delta * ROT_SPEED_BASE * 0.35;
  });

  /** Callback passed to DevelopmentHalf to synchronise hover state. */
  const handleHoverChange = (hovered: boolean) => {
    isHovered.current = hovered;
  };

  const INITIAL_ROTATION_X = 0.3;
  const INITIAL_ROTATION_Y = 0.6;

  return (
    <group
      ref={groupRef}
      rotation={[INITIAL_ROTATION_X, INITIAL_ROTATION_Y, 0]}
    >
      <FullWireframe geometry={baseGeo} wireframeColor={colors.wireframe} />
      <DevelopmentHalf
        geometry={baseGeo}
        solidIndices={allFaceIndices}
        hoverTint={colors.hoverTint}
        onHoverChange={handleHoverChange}
      />
      <VertexDots vertexDotColor={colors.vertexDot} />
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
 * - The outer wrapper div is `pointer-events: auto` so that R3F's raycaster can
 *   receive events; the canvas lives in its own grid column with no overlapping
 *   text content, so this does not block text selection elsewhere in the hero.
 *   The Canvas element's `pointer-events: auto` is kept explicit for clarity.
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
        pointerEvents: "auto",
      }}
    >
      <Canvas
        frameloop={staticPose ? "demand" : "always"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.2], fov: 50, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", pointerEvents: "auto" }}
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
