"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// ゆっくり回転する幾何学立体（正二十面体）の部品
function AnimatedShape() {
  // 立体を操作するための「参照（リファレンス）」を作ります
  const meshRef = useRef<THREE.Mesh>(null);

  // useFrameは毎フレーム（パラパラ漫画の1コマごと）実行される処理です
  useFrame((state, delta) => {
    if (meshRef.current) {
      // 毎フレーム少しずつ回転させる
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* ジオメトリ（形状）：正二十面体 */}
      <icosahedronGeometry args={[2.5, 0]} />
      {/* マテリアル（質感）：ワイヤーフレームにするとモダンでかっこいいです */}
      <meshBasicMaterial color="#10b981" wireframe={true} transparent opacity={0.3} />
    </mesh>
  );
}

// これが背景として読み込まれるメインの部品
export default function Background3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* Canvasが3Dを描画するキャンバスになります */}
      <Canvas camera={{ position: [0, 0, 5] }}>
        <AnimatedShape />
      </Canvas>
    </div>
  );
}