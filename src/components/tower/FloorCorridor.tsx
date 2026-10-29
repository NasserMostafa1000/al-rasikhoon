import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PointerLockControls } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Apartment } from "../../data/tower";
import { typeLabel } from "../../data/tower";
import { formatAed } from "../../lib/format";

type Props = {
  floor: number;
  apartments: Apartment[];
  lang: "ar" | "en";
  onExit: () => void;
  onEnterApartment: (apt: Apartment) => void;
};

function Door({
  apt,
  position,
  side,
  lang,
  onEnter,
}: {
  apt: Apartment;
  position: [number, number, number];
  side: "left" | "right";
  lang: "ar" | "en";
  onEnter: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <group position={position} rotation={[0, side === "left" ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onEnter();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[1.05, 2.2, 0.08]} />
        <meshStandardMaterial color={hover ? "#cfba82" : "#5c4630"} metalness={0.2} roughness={0.55} />
      </mesh>
      <mesh position={[0.35, 0, 0.06]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#cfba82" metalness={1} roughness={0.2} />
      </mesh>
      <Html distanceFactor={8} position={[0, 1.4, 0.1]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-full bg-ink/90 px-2 py-1 text-[10px] font-bold text-gold">
          {lang === "ar" ? `شقة ${apt.unit}` : `Apt ${apt.unit}`} · {typeLabel(apt.type, lang)}
        </div>
      </Html>
    </group>
  );
}

function Player({ doorsZ }: { doorsZ: number[] }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const vel = useRef(new THREE.Vector3());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, dt) => {
    const speed = 4.2;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    vel.current.set(0, 0, 0);
    if (keys.current.KeyW || keys.current.ArrowUp) vel.current.add(forward);
    if (keys.current.KeyS || keys.current.ArrowDown) vel.current.sub(forward);
    if (keys.current.KeyA || keys.current.ArrowLeft) vel.current.sub(right);
    if (keys.current.KeyD || keys.current.ArrowRight) vel.current.add(right);

    if (vel.current.lengthSq() > 0) {
      vel.current.normalize().multiplyScalar(speed * dt);
      camera.position.add(vel.current);
    }

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -0.55, 0.55);
    camera.position.y = 1.65;
    const minZ = Math.min(...doorsZ, -2) - 2;
    const maxZ = Math.max(...doorsZ, 2) + 2;
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, minZ, maxZ);
  });

  return <PointerLockControls />;
}

function Hallway({ apartments, lang, onEnterApartment }: Omit<Props, "floor" | "onExit">) {
  const half = Math.ceil(apartments.length / 2);
  const left = apartments.slice(0, half);
  const right = apartments.slice(half);
  const spacing = 3.2;
  const doorsZ = useMemo(() => {
    const zs: number[] = [];
    left.forEach((_, i) => zs.push(i * spacing));
    right.forEach((_, i) => zs.push(i * spacing));
    return zs.length ? zs : [0];
  }, [left, right, spacing]);

  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e8e2d6", roughness: 0.85 }),
    [],
  );
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2a2a2a", metalness: 0.35, roughness: 0.35 }),
    [],
  );
  const ceilMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f4f3ec", roughness: 0.9 }),
    [],
  );

  const length = Math.max(left.length, right.length) * spacing + 4;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 6, 4]} intensity={0.8} />
      <pointLight position={[0, 2.4, length / 2]} intensity={12} color="#cfba82" distance={28} />

      {/* floor / ceiling / walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, length / 2 - 2]} material={floorMat} receiveShadow>
        <planeGeometry args={[3.2, length]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.1, length / 2 - 2]} material={ceilMat}>
        <planeGeometry args={[3.2, length]} />
      </mesh>
      <mesh position={[-1.55, 1.55, length / 2 - 2]} material={wallMat}>
        <boxGeometry args={[0.12, 3.1, length]} />
      </mesh>
      <mesh position={[1.55, 1.55, length / 2 - 2]} material={wallMat}>
        <boxGeometry args={[0.12, 3.1, length]} />
      </mesh>

      {/* ceiling lights */}
      {Array.from({ length: Math.ceil(length / 3) }).map((_, i) => (
        <mesh key={i} position={[0, 3.0, i * 3]}>
          <boxGeometry args={[0.8, 0.05, 0.25]} />
          <meshStandardMaterial color="#fff8e8" emissive="#ffe6b0" emissiveIntensity={1.2} />
        </mesh>
      ))}

      {left.map((apt, i) => (
        <Door
          key={apt.id}
          apt={apt}
          side="left"
          lang={lang}
          position={[-1.48, 1.1, i * spacing]}
          onEnter={() => onEnterApartment(apt)}
        />
      ))}
      {right.map((apt, i) => (
        <Door
          key={apt.id}
          apt={apt}
          side="right"
          lang={lang}
          position={[1.48, 1.1, i * spacing]}
          onEnter={() => onEnterApartment(apt)}
        />
      ))}

      <Player doorsZ={doorsZ} />
    </>
  );
}

export default function FloorCorridor({ floor, apartments, lang, onExit, onEnterApartment }: Props) {
  const [lockedHint, setLockedHint] = useState(true);

  return (
    <div className="relative h-[min(82vh,760px)] w-full overflow-hidden bg-ink">
      <Canvas camera={{ position: [0, 1.65, -1.5], fov: 70 }}>
        <Suspense fallback={null}>
          <Hallway apartments={apartments} lang={lang} onEnterApartment={onEnterApartment} />
        </Suspense>
      </Canvas>

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-ink/80 to-transparent p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">
            {lang === "ar" ? `داخل الطابق ${floor}` : `Inside floor ${floor}`}
          </p>
          <p className="mt-1 text-sm text-cream/80">
            {lang === "ar"
              ? "اضغط للنظر · WASD للحركة · اضغط باب الشقة للدخول"
              : "Click to look · WASD to walk · Click a door to enter"}
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink"
        >
          {lang === "ar" ? "خروج للبرج" : "Exit to tower"}
        </button>
      </div>

      {lockedHint ? (
        <button
          type="button"
          className="absolute inset-0 z-10 flex items-center justify-center bg-ink/55 text-center"
          onClick={() => setLockedHint(false)}
        >
          <div className="max-w-sm rounded-2xl bg-cream px-6 py-5 text-ink shadow-soft">
            <p className="font-display text-xl font-bold text-sea">
              {lang === "ar" ? "ادخل الممر" : "Enter the corridor"}
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              {lang === "ar"
                ? "اضغط هنا ثم تحرّك كخرائط جوجل داخل الطابق واختر باب الشقة"
                : "Click here, then walk like Street View and choose an apartment door"}
            </p>
          </div>
        </button>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 overflow-x-auto bg-ink/70 p-3 backdrop-blur">
        <div className="flex min-w-max gap-2">
          {apartments.map((apt) => (
            <button
              key={apt.id}
              type="button"
              onClick={() => onEnterApartment(apt)}
              className="rounded-full border border-gold/30 bg-ink px-3 py-1.5 text-xs text-cream hover:border-gold"
            >
              {lang === "ar" ? `شقة ${apt.unit}` : `Apt ${apt.unit}`} · {formatAed(apt.priceAed, lang)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
