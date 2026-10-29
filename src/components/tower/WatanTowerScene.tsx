import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Html, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { residentialFloorNumbers, towerMeta } from "../../data/tower";

type Props = {
  selectedFloor: number | null;
  onSelectFloor: (floor: number) => void;
  lang: "ar" | "en";
};

/**
 * Al Watan Tower exterior inspired by the official dusk render:
 * pill-shaped shaft, continuous gold arched exoskeleton, mid gold band,
 * glass curtain with floor plates, illuminated slatted podium + terrace.
 */
function TowerMesh({ selectedFloor, onSelectFloor, lang }: Props) {
  const floors = residentialFloorNumbers;
  const floorH = 0.34;
  const shaftH = floors.length * floorH;
  const shaftY0 = 3.2;

  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#8eb8cf",
        metalness: 0.2,
        roughness: 0.12,
        transmission: 0.45,
        thickness: 0.8,
        transparent: true,
        opacity: 0.88,
        envMapIntensity: 1.4,
      }),
    [],
  );
  const glassLit = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#cfba82",
        metalness: 0.35,
        roughness: 0.18,
        emissive: "#cfba82",
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.95,
      }),
    [],
  );
  const gold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c4a35a",
        metalness: 0.92,
        roughness: 0.22,
      }),
    [],
  );
  const podiumMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d9e2e8",
        metalness: 0.25,
        roughness: 0.45,
        emissive: "#b8c9d4",
        emissiveIntensity: 0.15,
      }),
    [],
  );
  const water = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1c4b63",
        metalness: 0.7,
        roughness: 0.15,
      }),
    [],
  );

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = 2.15;
    const d = 1.45;
    const r = 0.95;
    s.moveTo(-w + r, -d);
    s.lineTo(w - r, -d);
    s.absarc(w - r, -d + r, r, -Math.PI / 2, 0, false);
    s.lineTo(w, d - r);
    s.absarc(w - r, d - r, r, 0, Math.PI / 2, false);
    s.lineTo(-w + r, d);
    s.absarc(-w + r, d - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(-w, -d + r);
    s.absarc(-w + r, -d + r, r, Math.PI, (Math.PI * 3) / 2, false);
    return s;
  }, []);

  const extrude = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        depth: shaftH,
        bevelEnabled: false,
        curveSegments: 24,
      }),
    [shape, shaftH],
  );

  return (
    <group position={[0, -7.2, 0]}>
      {/* waterfront */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 6]} material={water} receiveShadow>
        <planeGeometry args={[40, 18]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <circleGeometry args={[22, 64]} />
        <meshStandardMaterial color="#c5d3dc" roughness={1} />
      </mesh>

      {/* podium with vertical light fins */}
      <mesh position={[0, 1.15, 0]} material={podiumMat} castShadow receiveShadow>
        <boxGeometry args={[8.4, 2.3, 6.2]} />
      </mesh>
      {Array.from({ length: 18 }).map((_, i) => {
        const x = -3.8 + i * 0.45;
        return (
          <mesh key={`fin-${i}`} position={[x, 1.15, 3.12]}>
            <boxGeometry args={[0.08, 2.1, 0.06]} />
            <meshStandardMaterial color="#f2f6f8" emissive="#e8d6a5" emissiveIntensity={0.55} />
          </mesh>
        );
      })}
      {/* podium terrace greenery strip */}
      <mesh position={[0, 2.35, 1.6]}>
        <boxGeometry args={[7.6, 0.18, 2.2]} />
        <meshStandardMaterial color="#4f6b57" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.42, 0]} material={gold}>
        <boxGeometry args={[8.6, 0.1, 6.4]} />
      </mesh>

      {/* main glass shaft (extruded pill footprint) */}
      <group position={[0, shaftY0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={extrude} material={glass} castShadow />
      </group>

      {/* clickable floor bands on front face */}
      <group position={[0, shaftY0, 0]}>
        {floors.map((floor, index) => {
          const y = index * floorH + floorH / 2;
          const active = selectedFloor === floor;
          return (
            <group key={floor} position={[0, y, 0]}>
              <mesh
                position={[0, 0, 1.52]}
                material={active ? glassLit : gold}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFloor(floor);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                  document.body.style.cursor = "auto";
                }}
              >
                <boxGeometry args={[3.9, floorH * 0.72, 0.04]} />
              </mesh>
              {/* thin floor plate line */}
              <mesh position={[0, -floorH / 2, 0]} material={gold}>
                <boxGeometry args={[4.2, 0.025, 2.95]} />
              </mesh>
              {active ? (
                <Html distanceFactor={16} position={[3.4, 0, 0]} style={{ pointerEvents: "none" }}>
                  <div className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-gold shadow-gold">
                    {lang === "ar" ? `ادخل الطابق ${floor}` : `Enter floor ${floor}`}
                  </div>
                </Html>
              ) : null}
            </group>
          );
        })}
      </group>

      {/* gold arched exoskeleton — left & right continuous frames */}
      <mesh position={[-2.35, shaftY0 + shaftH / 2, 0]} material={gold} castShadow>
        <boxGeometry args={[0.22, shaftH + 0.8, 0.22]} />
      </mesh>
      <mesh position={[2.35, shaftY0 + shaftH / 2, 0]} material={gold} castShadow>
        <boxGeometry args={[0.22, shaftH + 0.8, 0.22]} />
      </mesh>
      {/* curved crown connectors approximated with stepped gold slabs */}
      <mesh position={[0, shaftY0 + shaftH + 0.55, 0]} material={gold}>
        <boxGeometry args={[5.1, 0.28, 3.3]} />
      </mesh>
      <mesh position={[0, shaftY0 + shaftH + 1.05, 0]} material={gold}>
        <boxGeometry args={[4.2, 0.35, 2.6]} />
      </mesh>
      <mesh position={[0, shaftY0 + shaftH + 1.5, 0]} material={glass}>
        <boxGeometry args={[2.8, 0.45, 1.9]} />
      </mesh>
      {/* mid gold band ~1/3 height */}
      <mesh position={[0, shaftY0 + shaftH * 0.33, 0]} material={gold}>
        <boxGeometry args={[4.55, 0.18, 3.15]} />
      </mesh>

      {/* soft night glow */}
      <pointLight position={[4, shaftY0 + shaftH * 0.85, 3]} intensity={18} color="#cfba82" distance={18} />
      <pointLight position={[-3, 1.2, 4]} intensity={10} color="#e8d6a5" distance={12} />
    </group>
  );
}

export default function WatanTowerScene(props: Props) {
  return (
    <div className="relative h-[min(78vh,720px)] w-full overflow-hidden bg-gradient-to-b from-[#0f2d3d] via-[#1c4b63] to-[#c5d3dc]">
      <Canvas camera={{ position: [11, 7, 16], fov: 40 }} shadows>
        <color attach="background" args={["#152936"]} />
        <fog attach="fog" args={["#152936", 22, 55]} />
        <ambientLight intensity={0.45} />
        <directionalLight castShadow position={[12, 20, 8]} intensity={1.15} color="#ffe6c2" />
        <Suspense fallback={null}>
          <TowerMesh {...props} />
          <Environment preset="night" />
          <ContactShadows opacity={0.4} scale={30} blur={2.8} far={22} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={9}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.08}
          target={[0, 5, 0]}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-ink/70 to-transparent p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {props.lang === "ar" ? towerMeta.nameAr : towerMeta.nameEn}
        </p>
        <p className="mt-1 text-sm text-cream/85">
          {props.lang === "ar"
            ? "حرّك البرج واضغط أي طابق للدخول إلى الممر الداخلي"
            : "Orbit the tower and click a floor to enter the corridor"}
        </p>
      </div>
    </div>
  );
}
