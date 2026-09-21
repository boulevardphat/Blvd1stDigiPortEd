/* eslint-disable react/no-unknown-property */
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { Plus, Minus } from 'lucide-react';

// @ts-ignore
import cardGLB from '../assets/lanyard/card.glb';
// @ts-ignore
import lanyard from '../assets/lanyard/lanyard.png';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  aspectRatio?: number;
  lanyardImage?: string | null;
  lanyardWidth?: number;
  lanyardRepeat?: [number, number];
  className?: string;
  enableZoom?: boolean;
  minZoomZ?: number;
  maxZoomZ?: number;
}

// Camera Rig to smoothly animate camera position on zoom
function CameraRig({ targetZ }: { targetZ: number }) {
  useFrame((state) => {
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.12);
  });
  return null;
}

export default function Lanyard({
  position = [0, 0, 18],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  aspectRatio,
  lanyardImage = null,
  lanyardWidth = 1,
  lanyardRepeat,
  className = '',
  enableZoom = true,
  minZoomZ = 9,
  maxZoomZ = 20,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const defaultZ = useMemo(() => {
    return isMobile ? 16.5 : 13.5;
  }, [isMobile]);

  const [targetZ, setTargetZ] = useState(() => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return mobile ? 16.5 : 13.5;
  });
  const hasUserZoomedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!hasUserZoomedRef.current) {
        setTargetZ(mobile ? 16.5 : 13.5);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Native wheel listener for smooth zooming on canvas on desktop
  useEffect(() => {
    if (!enableZoom) return;
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      hasUserZoomedRef.current = true;
      const zoomSpeed = 0.005;
      setTargetZ((prev) => {
        const next = prev + e.deltaY * zoomSpeed;
        return Math.min(Math.max(next, minZoomZ), maxZoomZ);
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [enableZoom, minZoomZ, maxZoomZ]);

  return (
    <div
      ref={containerRef}
      className={`lanyard-wrapper ${className}`.trim()}
      onDoubleClick={() => setTargetZ(defaultZ)}
    >
      <Canvas
        camera={{ position: [position[0], position[1], targetZ], fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <CameraRig targetZ={targetZ} />
        <React.Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={1 / 60}>
            <Band
              cardGroupRef={cardGroupRef}
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              aspectRatio={aspectRatio}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              lanyardRepeat={lanyardRepeat}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </React.Suspense>
      </Canvas>

      {/* 2 nút cộng trừ zoom thủ công ở góc dưới bên phải (không đóng khung, tuân thủ Boulevard1st rounded-none) */}
      {enableZoom && (
        <div
          id="lanyard-zoom-manual-controls"
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 flex items-center gap-1 select-none pointer-events-auto"
        >
          <button
            type="button"
            id="lanyard-zoom-in-button"
            onClick={(e) => {
              e.stopPropagation();
              hasUserZoomedRef.current = true;
              setTargetZ((prev) => Math.max(minZoomZ, Number((prev - 1.2).toFixed(2))));
            }}
            disabled={targetZ <= minZoomZ}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white/80 hover:text-white transition-colors duration-150 rounded-none border-none p-0 cursor-pointer"
            aria-label="Zoom in"
            title="Phóng to (+)"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
          </button>
          <button
            type="button"
            id="lanyard-zoom-out-button"
            onClick={(e) => {
              e.stopPropagation();
              hasUserZoomedRef.current = true;
              setTargetZ((prev) => Math.min(maxZoomZ, Number((prev + 1.2).toFixed(2))));
            }}
            disabled={targetZ >= maxZoomZ}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white/80 hover:text-white transition-colors duration-150 rounded-none border-none p-0 cursor-pointer"
            aria-label="Zoom out"
            title="Thu nhỏ (−)"
          >
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
          </button>
        </div>
      )}
    </div>
  );
}

interface BandProps {
  cardGroupRef?: React.RefObject<THREE.Group | null>;
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  aspectRatio?: number;
  lanyardImage?: string | null;
  lanyardWidth?: number;
  lanyardRepeat?: [number, number];
}

function Band({
  cardGroupRef,
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  aspectRatio,
  lanyardImage = null,
  lanyardWidth = 1,
  lanyardRepeat,
}: BandProps) {
  const band = useRef<any>(null),
    fixed = useRef<any>(null),
    j1 = useRef<any>(null),
    j2 = useRef<any>(null),
    j3 = useRef<any>(null),
    card = useRef<any>(null);
  const vec = useRef(new THREE.Vector3()).current,
    ang = useRef(new THREE.Vector3()).current,
    rot = useRef(new THREE.Vector3()).current,
    dir = useRef(new THREE.Vector3()).current;
  const segmentProps: any = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardImage || lanyard);
  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL) as any;
  const backTex = useTexture(backImage || BLANK_PIXEL) as any;

  // Aspect ratio of the original front face of card.glb mesh (measured deltaX / deltaY in 3D)
  const BASE_MESH_ASPECT = 0.716366 / 0.9707; // ~0.737989

  const targetAspect = useMemo(() => {
    if (aspectRatio && aspectRatio > 0) return aspectRatio;
    const imgW = frontTex?.image?.naturalWidth || frontTex?.image?.width;
    const imgH = frontTex?.image?.naturalHeight || frontTex?.image?.height;
    if (imgW && imgH) return imgW / imgH;
    return null;
  }, [aspectRatio, frontTex?.image]);

  const cardScaleX = useMemo(() => {
    if (targetAspect) {
      return targetAspect / BASE_MESH_ASPECT;
    }
    return 1;
  }, [targetAspect]);

  // Composite the front/back images into the card's texture atlas (front = left
  // half, back = right half). Each image is drawn aspect-preserving (no stretch).
  const cardMap = useMemo(() => {
    const baseMap = materials.base?.map;
    if (!baseMap) return null;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image;
    if (!baseImg) return baseMap;
    const W = baseImg.width || 1024;
    const H = baseImg.height || 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    // Keep the original baked atlas for the card edges and any untouched face.
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: HTMLImageElement, rect: { x: number; y: number; w: number; h: number }) => {
      if (!img || !img.width || !img.height) return;
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;

      if (targetAspect) {
        // When the 3D card mesh is scaled in X by (targetAspect / BASE_MESH_ASPECT),
        // mapping the entire image to the UV rect produces a 100% distortion-free, isotropic 1:1 render in 3D world space.
        ctx.save();
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);
        ctx.clip();
        ctx.drawImage(img, rx, ry, rw, rh);
        ctx.restore();
        return;
      }

      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex?.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex?.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, targetAspect, frontTex, backTex, materials?.base?.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  // Velocity tracking & Tap impulse detection ("chạm để hất thẻ" & momentum fling)
  const lastKinematicPos = useRef(new THREE.Vector3());
  const dragVelocity = useRef(new THREE.Vector3());
  const pointerDownTime = useRef(0);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  // Global pointer release & cancel listener: guarantees drag always ends cleanly and transfers fling velocity
  useEffect(() => {
    if (!dragged) return;
    const handleRelease = () => {
      drag(false);
      if (card.current) {
        card.current.wakeUp();
        const speed = dragVelocity.current.length();
        if (speed > 1.2) {
          const maxSpeed = 35;
          const vx = Math.max(-maxSpeed, Math.min(maxSpeed, dragVelocity.current.x));
          const vy = Math.max(-maxSpeed, Math.min(maxSpeed, dragVelocity.current.y));
          const vz = Math.max(-maxSpeed, Math.min(maxSpeed, dragVelocity.current.z));
          card.current.setLinvel({ x: vx, y: vy, z: vz }, true);
          card.current.applyTorqueImpulse({
            x: (Math.random() - 0.5) * 3,
            y: -vx * 0.2,
            z: -vx * 0.1,
          }, true);
        }
        [j1, j2, j3].forEach((r) => r.current?.wakeUp());
      }
    };
    window.addEventListener('pointerup', handleRelease);
    window.addEventListener('pointercancel', handleRelease);
    return () => {
      window.removeEventListener('pointerup', handleRelease);
      window.removeEventListener('pointercancel', handleRelease);
    };
  }, [dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      
      const targetX = vec.x - dragged.x;
      const targetY = vec.y - dragged.y;
      const targetZ = vec.z - dragged.z;

      if (delta > 0) {
        const vx = (targetX - lastKinematicPos.current.x) / delta;
        const vy = (targetY - lastKinematicPos.current.y) / delta;
        const vz = (targetZ - lastKinematicPos.current.z) / delta;
        dragVelocity.current.lerp(new THREE.Vector3(vx, vy, vz), 0.7);
      }
      lastKinematicPos.current.set(targetX, targetY, targetZ);

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: targetX,
        y: targetY,
        z: targetZ,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current?.geometry?.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  const strapRepeat = useMemo(() => {
    if (lanyardRepeat) return lanyardRepeat;
    if (lanyardImage) return [-1, 1];
    return [-4, 1];
  }, [lanyardRepeat, lanyardImage]);

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8 * cardScaleX, 1.125, 0.01]} />
          <group
            ref={cardGroupRef}
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              try {
                (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
              } catch (err) {}
              const wasDragged = Boolean(dragged);
              drag(false);

              const dt = performance.now() - pointerDownTime.current;
              const dist = Math.hypot(e.clientX - pointerDownPos.current.x, e.clientY - pointerDownPos.current.y);

              if (card.current) {
                card.current.wakeUp();

                // 1. NHẸ NHÀNG CHẠM / CLICK VÀO THẺ: KÍCH HOẠT "HẤT THẺ" ĐUNG ĐƯA TỰ NHIÊN
                if (dt < 300 && dist < 15) {
                  const clickOffsetX = e.point.x - card.current.translation().x;
                  const swingDir = clickOffsetX > 0 ? -1 : 1;
                  const impulseX = swingDir * (14 + Math.random() * 6);
                  const impulseY = 4 + Math.random() * 3;
                  const impulseZ = (Math.random() - 0.5) * 8;

                  card.current.applyImpulse({ x: impulseX, y: impulseY, z: impulseZ }, true);
                  card.current.applyTorqueImpulse({
                    x: (Math.random() - 0.5) * 4,
                    y: -swingDir * (7 + Math.random() * 4),
                    z: swingDir * 2,
                  }, true);
                  [j1, j2, j3].forEach((r) => r.current?.wakeUp());
                  return;
                }

                // 2. KÉO & HẤT / FLICK THẺ KHI VUỐT NHANH
                if (wasDragged) {
                  const speed = dragVelocity.current.length();
                  if (speed > 1.2) {
                    const maxSpeed = 35;
                    const vx = Math.max(-maxSpeed, Math.min(maxSpeed, dragVelocity.current.x));
                    const vy = Math.max(-maxSpeed, Math.min(maxSpeed, dragVelocity.current.y));
                    const vz = Math.max(-maxSpeed, Math.min(maxSpeed, dragVelocity.current.z));

                    card.current.setLinvel({ x: vx, y: vy, z: vz }, true);
                    card.current.applyTorqueImpulse({
                      x: (Math.random() - 0.5) * 3,
                      y: -vx * 0.2,
                      z: -vx * 0.1,
                    }, true);
                  }
                  [j1, j2, j3].forEach((r) => r.current?.wakeUp());
                }
              }
            }}
            onPointerCancel={() => {
              drag(false);
              card.current?.wakeUp();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              try {
                (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
              } catch (err) {}
              pointerDownTime.current = performance.now();
              pointerDownPos.current = { x: e.clientX, y: e.clientY };
              dragVelocity.current.set(0, 0, 0);

              const cardTrans = card.current.translation();
              lastKinematicPos.current.copy(cardTrans);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(cardTrans)));
            }}
          >
            {/* Invisible expanded hit area for easy touch targeting on mobile */}
            <mesh visible={false}>
              <planeGeometry args={[1.6 * cardScaleX, 2.4]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
            <mesh geometry={nodes.card.geometry} scale={[cardScaleX, 1, 1]}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={strapRepeat}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);
