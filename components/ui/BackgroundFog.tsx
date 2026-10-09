"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useMood } from "@/hooks/useMood";

function FogField() {
  const points = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const tiltTarget = useRef({ x: 0, y: 0 });
  const tiltCurrent = useRef({ x: 0, y: 0 });
  const motionImpulse = useRef({ x: 0, y: 0 });
  const { accent } = useMood();
  const count = 1400;

  useEffect(() => {
    // 1. Mouse/pointer move for PC
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // 2. Touch move for mobile
    const onTouch = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        mouse.current.x = (t.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(t.clientY / window.innerHeight) * 2 + 1;
      }
    };

    // 3. Real physical phone orientation / tilt (gyroscope)
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      // gamma is left/right tilt (-90 to +90 deg, natural hold ~ 0 deg)
      // beta is front/back tilt (-180 to +180 deg, natural hold ~ 45-55 deg)
      const gx = Math.max(-1.5, Math.min(1.5, e.gamma / 25));
      const gy = Math.max(-1.5, Math.min(1.5, (e.beta - 45) / 25));
      tiltTarget.current.x = gx;
      tiltTarget.current.y = -gy;
    };

    // 4. Physical phone movement / acceleration (accelerometer)
    const onMotion = (e: DeviceMotionEvent) => {
      const acc = e.acceleration || e.accelerationIncludingGravity;
      if (acc && acc.x != null && acc.y != null) {
        // subtle acceleration impulse
        motionImpulse.current.x += Math.max(-0.6, Math.min(0.6, acc.x * 0.04));
        motionImpulse.current.y += Math.max(-0.6, Math.min(0.6, -acc.y * 0.04));
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    window.addEventListener("devicemotion", onMotion, { passive: true });

    // iOS 13+ permission request on user tap
    const requestPermission = async () => {
      const DOE = typeof window !== "undefined"
        ? (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent
        : undefined;
      if (DOE && typeof DOE.requestPermission === "function") {
        try {
          const res = await DOE.requestPermission();
          if (res === "granted") {
            window.addEventListener("deviceorientation", onOrientation, { passive: true });
            window.addEventListener("devicemotion", onMotion, { passive: true });
          }
        } catch {
          // ignore error
        }
      }
    };

    window.addEventListener("touchstart", requestPermission, { once: true });
    window.addEventListener("click", requestPermission, { once: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("devicemotion", onMotion);
      window.removeEventListener("touchstart", requestPermission);
      window.removeEventListener("click", requestPermission);
    };
  }, []);

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      spd[i] = 0.12 + Math.random() * 0.35;
    }
    return { positions: pos, speeds: spd };
  }, []);

  const color = useMemo(() => new THREE.Color(accent), [accent]);

  useFrame((state, delta) => {
    const mesh = points.current;
    if (!mesh) return;
    const attr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;

    // Smooth interpolation (lerp) for phone physical tilt and motion impulse
    tiltCurrent.current.x += (tiltTarget.current.x - tiltCurrent.current.x) * 0.08;
    tiltCurrent.current.y += (tiltTarget.current.y - tiltCurrent.current.y) * 0.08;
    motionImpulse.current.x *= 0.92;
    motionImpulse.current.y *= 0.92;

    // Combined input: mouse on PC, physical phone tilt + acceleration on mobile
    const totalX = mouse.current.x * 0.5 + tiltCurrent.current.x * 0.85 + motionImpulse.current.x;
    const totalY = mouse.current.y * 0.5 + tiltCurrent.current.y * 0.85 + motionImpulse.current.y;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      arr[ix] += Math.sin(t * 0.15 + i) * 0.002 + totalX * 0.35 * delta;
      arr[ix + 1] += speeds[i] * delta * 0.18 + totalY * 0.25 * delta;
      arr[ix + 2] += Math.cos(t * 0.12 + i * 0.3) * 0.0015;
      if (arr[ix + 1] > 5.5) arr[ix + 1] = -5.3;
      if (arr[ix + 1] < -5.5) arr[ix + 1] = 5.3;
      if (arr[ix] > 9.8) arr[ix] = -9.8;
      if (arr[ix] < -9.8) arr[ix] = 9.8;
    }
    attr.needsUpdate = true;

    // 3D rotation and position react dynamically to phone movement and mouse
    mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, totalX * 0.3, 0.08);
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, totalY * 0.18, 0.08);
    mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, totalX * 0.5, 0.08);
    mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, totalY * 0.35, 0.08);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={color}
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function BackgroundFog() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-obsidian" />
      <div className="absolute inset-0 bg-radial-fade" />
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.75]} gl={{ antialias: false, alpha: true }}>
        <FogField />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian/20 to-obsidian" />
    </div>
  );
}
