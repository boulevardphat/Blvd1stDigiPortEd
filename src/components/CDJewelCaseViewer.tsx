import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/* =========================================================================
   1. TYPES & URLS
   ========================================================================= */
export const JEWEL_CASE_TEXTURE_URLS = {
  front: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BREIMAGINED%5D%20CONFESSIONS%20II%20IN%20JEWEL/front.webp',
  insideFront: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BREIMAGINED%5D%20CONFESSIONS%20II%20IN%20JEWEL/inside_front.webp',
  insideBack: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BREIMAGINED%5D%20CONFESSIONS%20II%20IN%20JEWEL/inside_back.webp',
  backSpine: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BREIMAGINED%5D%20CONFESSIONS%20II%20IN%20JEWEL/back_spine.webp',
};

export interface JewelCaseTextures {
  front?: THREE.Texture | null;
  insideFront?: THREE.Texture | null;
  insideBack?: THREE.Texture | null;
  backSpine?: THREE.Texture | null;
}

export interface JewelCaseProps {
  open?: boolean;
  textures?: JewelCaseTextures;
}

/* =========================================================================
   2. 3D JEWEL CASE MODEL (PURE GEOMETRY & SHADER MATERIALS)
   Mô hình 3D chuẩn Hộp đĩa CD Jewel Case (Đã bỏ đĩa CD theo yêu cầu)
   ========================================================================= */
export function JewelCaseModel({ 
  open = false, 
  textures = {} 
}: JewelCaseProps) {
  const frontLidPivotRef = useRef<THREE.Group>(null);

  // Animation mở nắp mượt mà (Lerp góc -180 độ quanh bản lề bên trái)
  useFrame((_, delta) => {
    if (frontLidPivotRef.current) {
      const targetRotation = open ? -Math.PI : 0;
      frontLidPivotRef.current.rotation.y = THREE.MathUtils.lerp(
        frontLidPivotRef.current.rotation.y,
        targetRotation,
        delta * 6
      );
    }
  });

  // Tỉ lệ kích thước chuẩn của hộp đĩa CD (Jewel Case)
  const caseW = 1.42;
  const caseH = 1.25;
  const caseD = 0.104;
  const T = 0.012; // Độ dày của nhựa

  // Vật liệu nhựa acrylic trong suốt cao cấp (Kính hộp)
  const glassMaterial = useMemo(() => (
    <meshPhysicalMaterial 
      color="#ffffff"
      transmission={1}
      transparent={true}
      roughness={0.08}
      ior={1.5}
      thickness={0.02}
      clearcoat={1}
      clearcoatRoughness={0.1}
      envMapIntensity={1.5}
    />
  ), []);

  // Vật liệu khay nhựa bên trong (Tray)
  const trayMaterial = useMemo(() => (
    <meshPhysicalMaterial 
      color="#ffffff"
      transmission={1}
      transparent={true}
      roughness={0.15}
      ior={1.5}
      thickness={0.05}
      envMapIntensity={1.5}
    />
  ), []);

  // Xử lý UV mapping phần gáy (Spine) nếu có texture
  const spineLeftTex = useMemo(() => {
    if (!textures.backSpine) return null;
    const t = textures.backSpine.clone();
    t.offset.set(144 / 150, 0);
    t.repeat.set(6 / 150, 1);
    t.needsUpdate = true;
    return t;
  }, [textures.backSpine]);

  const backTex = useMemo(() => {
    if (!textures.backSpine) return null;
    const t = textures.backSpine.clone();
    t.offset.set(6 / 150, 0);
    t.repeat.set(138 / 150, 1);
    t.needsUpdate = true;
    return t;
  }, [textures.backSpine]);

  const spineRightTex = useMemo(() => {
    if (!textures.backSpine) return null;
    const t = textures.backSpine.clone();
    t.offset.set(0, 0);
    t.repeat.set(6 / 150, 1);
    t.needsUpdate = true;
    return t;
  }, [textures.backSpine]);

  // Xử lý UV mapping mặt trong khay đĩa (Inside Back)
  const insideBackTex = useMemo(() => {
    if (!textures.insideBack) return null;
    const t = textures.insideBack.clone();
    t.offset.set(6 / 150, 0);
    t.repeat.set(138 / 150, 1);
    t.needsUpdate = true;
    return t;
  }, [textures.insideBack]);

  return (
    <group rotation={[0, -0.2, 0]}>
      {/* ================= THÂN SAU (BASE / BACK CASE) ================= */}
      <group>
        {/* Mặt đáy sau (Mặt nhựa trong) */}
        <mesh position={[T / 2, 0, -caseD / 2 + T / 2]} receiveShadow castShadow>
          <boxGeometry args={[caseW - T, caseH, T]} />
          {glassMaterial}
        </mesh>
        
        {/* Thành hông phải (Nhựa trong) */}
        <mesh position={[caseW / 2 - T / 2, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[T, caseH - 2 * T, caseD - 2 * T]} />
          {glassMaterial}
        </mesh>

        {/* Thành hông trái / Bản lề (Nhựa trong) */}
        <mesh position={[-caseW / 2 + T / 2, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[T, caseH - 2 * T, caseD]} />
          {glassMaterial}
        </mesh>

        {/* GIẤY LÓT ĐÁY (TRAY CARD & SPINES) */}
        <group>
          {/* Mặt lưng giấy (nhìn từ sau ra trước) */}
          <mesh position={[0, 0, -caseD / 2 + T + 0.001]} rotation={[0, Math.PI, 0]} receiveShadow>
            <planeGeometry args={[caseW - T * 2, caseH - T * 2]} />
            <meshStandardMaterial 
              map={backTex || null} 
              color={!backTex ? "#f0f0f0" : "#ffffff"}
              roughness={0.8}
            />
          </mesh>
          {/* Gáy trái (Spine Left) */}
          <mesh position={[-caseW / 2 + T + 0.001, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
            <planeGeometry args={[caseD - T * 2, caseH - T * 2]} />
            <meshStandardMaterial 
              map={spineLeftTex || null} 
              color={!spineLeftTex ? "#e2e2e2" : "#ffffff"} 
              roughness={0.8}
            />
          </mesh>
          {/* Gáy phải (Spine Right) */}
          <mesh position={[caseW / 2 - T - 0.001, 0, -caseD / 4]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <planeGeometry args={[caseD / 2, caseH - T * 2]} />
            <meshStandardMaterial 
              map={spineRightTex || null} 
              color={!spineRightTex ? "#e2e2e2" : "#ffffff"} 
              roughness={0.8}
            />
          </mesh>
        </group>

        {/* MẶT TRONG GIẤY LÓT (Nhìn xuyên qua khay CD khi đã bỏ đĩa) */}
        <mesh position={[0, 0, -caseD / 2 + T + 0.002]} receiveShadow>
          <planeGeometry args={[caseW - T * 2, caseH - T * 2]} />
          <meshStandardMaterial 
            map={insideBackTex || null} 
            color={!insideBackTex ? "#f0f0f0" : "#ffffff"}
            roughness={0.8}
          />
        </mesh>

        {/* ================= KHAY GIỮ ĐĨA (CD TRAY TRONG SUỐT) ================= */}
        <group position={[0, 0, 0]}>
          {/* Khay nhựa nền */}
          <mesh position={[0, 0, -0.01]} receiveShadow castShadow>
            <boxGeometry args={[caseW - T * 2.2, caseH - T * 2.2, 0.01]} />
            {trayMaterial}
          </mesh>

          {/* Gờ nổi bên trái khay (Pillar) */}
          <mesh position={[-caseW / 2 + T + 0.12 / 2, 0, 0.015]} receiveShadow castShadow>
            <boxGeometry args={[0.12, caseH - T * 2 - 0.01, 0.05]} />
            {trayMaterial}
          </mesh>
          
          {/* Rãnh tròn lõm ôm đĩa CD */}
          <mesh position={[0.06, 0, -0.005]} receiveShadow castShadow>
            <ringGeometry args={[0.17, 0.58, 64]} />
            {trayMaterial}
          </mesh>
          
          {/* Trục tâm khay CD (Tray Hub) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0.06, 0, -0.005]} receiveShadow castShadow>
            <cylinderGeometry args={[0.075, 0.075, 0.01, 32]} />
            {trayMaterial}
          </mesh>

          {/* 6 Răng kẹp đĩa ở tâm khay (Hub Teeth) */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} position={[0.06, 0, 0]} rotation={[0, 0, (i * Math.PI) / 3]} receiveShadow castShadow>
              <boxGeometry args={[0.16, 0.015, 0.008]} />
              {trayMaterial}
            </mesh>
          ))}
        </group>
      </group>

      {/* ================= NẮP TRƯỚC (FRONT LID & PIVOT HINGE) ================= */}
      <group position={[-caseW / 2 + T + 0.06, 0, 0]} ref={frontLidPivotRef}>
        <group position={[caseW / 2 - T - 0.06, 0, 0]}>
          
          {/* Mặt kính nắp trước */}
          <mesh position={[0.06, 0, caseD / 2 - T / 2]} receiveShadow castShadow>
            <boxGeometry args={[1.276, caseH - T * 2, T]} />
            {glassMaterial}
          </mesh>

          {/* Thành trên của nắp trước */}
          <mesh position={[0, caseH / 2 - T / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.396, T, caseD - 2 * T]} />
            {glassMaterial}
          </mesh>

          {/* Thành dưới của nắp trước */}
          <mesh position={[0, -caseH / 2 + T / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.396, T, caseD - 2 * T]} />
            {glassMaterial}
          </mesh>
          
          {/* Cuốn sổ Booklet - Mặt bìa trước (Cover, hướng về +Z) */}
          <mesh position={[0.06, 0, caseD / 2 - T - 0.001]} receiveShadow>
            <planeGeometry args={[1.25, caseH - T * 2 - 0.02]} />
            <meshStandardMaterial 
              map={textures.front || null} 
              color={!textures.front ? "#f4f4f4" : "#ffffff"} 
              roughness={0.7}
            />
          </mesh>
          
          {/* Cuốn sổ Booklet - Mặt trong (Inside Front, hướng về -Z) */}
          <mesh position={[0.06, 0, caseD / 2 - T - 0.002]} rotation={[0, Math.PI, 0]} receiveShadow>
            <planeGeometry args={[1.25, caseH - T * 2 - 0.02]} />
            <meshStandardMaterial 
              map={textures.insideFront || null} 
              color={!textures.insideFront ? "#e8e8e8" : "#ffffff"} 
              roughness={0.7}
            />
          </mesh>

          {/* Hai chốt nhựa kẹp giữ booklet ở nắp */}
          <mesh position={[0.65, 0, caseD / 2 - T - 0.004]} receiveShadow>
            <boxGeometry args={[0.01, 0.8, 0.005]} />
            {glassMaterial}
          </mesh>
          <mesh position={[-0.55, 0, caseD / 2 - T - 0.004]} receiveShadow>
            <boxGeometry args={[0.01, 0.8, 0.005]} />
            {glassMaterial}
          </mesh>

        </group>
      </group>
    </group>
  );
}

/* =========================================================================
   3. INTERNAL AUTO-TEXTURED WRAPPER
   Tự động tải 4 ảnh texture từ GitHub raw với useTexture
   ========================================================================= */
function AutoTexturedJewelCase({ open, customTextures }: { open: boolean; customTextures?: JewelCaseTextures }) {
  const loaded = useTexture(JEWEL_CASE_TEXTURE_URLS);

  const textures = useMemo(() => {
    if (customTextures) return customTextures;
    if (loaded.front) loaded.front.colorSpace = THREE.SRGBColorSpace;
    if (loaded.insideFront) loaded.insideFront.colorSpace = THREE.SRGBColorSpace;
    if (loaded.insideBack) loaded.insideBack.colorSpace = THREE.SRGBColorSpace;
    if (loaded.backSpine) loaded.backSpine.colorSpace = THREE.SRGBColorSpace;
    return loaded;
  }, [loaded, customTextures]);

  return <JewelCaseModel open={open} textures={textures} />;
}

/* =========================================================================
   4. 3D SCENE CANVAS (LIGHTING, SHADOWS, ORBITCONTROLS)
   ========================================================================= */
export interface CDSceneProps {
  open: boolean;
  textures?: JewelCaseTextures;
}

export function CDScene({ open, textures }: CDSceneProps) {
  return (
    <Canvas 
      shadows 
      dpr={[1, 1.5]} 
      camera={{ position: [0, 0, 3.8], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      className="rounded-none select-none cursor-grab active:cursor-grabbing"
    >
      {/* Hệ thống ánh sáng cho chất liệu kính trong suốt */}
      <ambientLight intensity={0.7} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.2} 
        penumbra={1} 
        intensity={1.2} 
        castShadow 
      />
      <directionalLight position={[-10, 10, 5]} intensity={0.6} />
      
      {/* Điều khiển chuột: Giữ chuột trái xoay, chuột phải di chuyển, cuộn để zoom */}
      <OrbitControls 
        makeDefault 
        minDistance={1.8} 
        maxDistance={8} 
        enableDamping
        dampingFactor={0.05}
      />

      <Suspense fallback={null}>
        <AutoTexturedJewelCase open={open} customTextures={textures} />
        {/* Environment map preset giúp kính trong suốt có viền phản xạ ánh sáng chuẩn studio */}
        <Environment preset="city" />
      </Suspense>

      {/* Đổ bóng tiếp xúc mềm dưới đáy hộp */}
      <ContactShadows 
        position={[0, -1.1, 0]} 
        opacity={0.35} 
        scale={8} 
        blur={1.5} 
        far={2} 
        resolution={256} 
      />
    </Canvas>
  );
}

/* =========================================================================
   5. CD JEWEL CASE VIEWER COMPONENT
   ========================================================================= */
export interface CDJewelCaseViewerProps {
  open: boolean;
  onToggleOpen?: () => void;
  textures?: JewelCaseTextures;
}

export const CDJewelCaseViewer: React.FC<CDJewelCaseViewerProps> = ({
  open,
  onToggleOpen,
  textures,
}) => {
  return (
    <div 
      id="cd-jewel-case-canvas-wrapper"
      className="w-full h-full relative overflow-hidden bg-black select-none rounded-none flex items-center justify-center"
      onDoubleClick={onToggleOpen}
    >
      <CDScene open={open} textures={textures} />
    </div>
  );
};
