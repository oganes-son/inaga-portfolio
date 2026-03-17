"use client";
import { useEffect, useState } from "react";

const T0 = "matrix(1,0,0,1,-1486,-7127)";
const T1 = "matrix(0.914262,0,0,0.767584,410.827567,1889.7737)";
const TN = "matrix(0.716814,0,0,0.85379,-6.995874,3593.932732)";
const TM = "matrix(-0.716814,0,0,-0.85379,4522.476434,12683.695975)";

// 各ストロークが前の60%完成時に開始（delay = prev_delay + prev_dur * 0.6）
// durは最初が速く、だんだん遅くなる
const STROKES = [
  { id: "i1",  inner: TN, delay: 0.00, dur: 0.20, wipe: "down"  as const, d: "M1889.764,3779.528L1653.543,4015.748L1653.543,6614.173L1889.764,6850.394L3425.197,6866.84L3425.197,5787.402L2598.425,5787.402L2598.425,3779.528L1889.764,3779.528Z" },
  { id: "i2",  inner: TM, delay: 0.12, dur: 0.24, wipe: "up"    as const, d: "M1889.764,3779.528L1653.543,4015.748L1653.543,6614.173L1889.764,6850.394L3425.197,6866.84L3425.197,5787.402L2598.425,5787.402L2598.425,3779.528L1889.764,3779.528Z" },
  { id: "na1", inner: TN, delay: 0.26, dur: 0.28, wipe: "right" as const, d: "M7039.37,4771.654L7039.37,3779.528L5433.071,3779.528L5196.85,4015.748L5196.85,6614.173L5433.071,6866.84L6260,6866.84L6236.22,4771.654L7039.37,4771.654Z" },
  { id: "na2", inner: TN, delay: 0.43, dur: 0.32, wipe: "down"  as const, d: "M6496.063,6850.394L8031.496,6850.394L8314.961,6566.929L8314.961,6094.488L7535.433,6094.488L7535.433,5574.803L7039.37,5574.803L7039.37,5055.118L6472.441,5055.118L6496.063,6850.394Z" },
  { id: "na3", inner: TN, delay: 0.62, dur: 0.36, wipe: "right" as const, d: "M7275.591,3779.528L8031.496,3779.528L8314.961,4062.992L8314.961,5811.024L7795.276,5815L7795.276,5323.184L7275.591,5323.184L7275.591,3779.528Z" },
  { id: "ka1", inner: TN, delay: 0.84, dur: 0.40, wipe: "right" as const, d: "M8976.378,3779.528L8740.157,4015.748L8740.157,6614.173L8976.378,6850.394L9803.15,6850.394L9803.15,5551.181L10039.37,5551.181L10039.37,6850.394L10866.142,6850.394L10866.142,4797.264L9803.15,4797.264L9803.15,3779.528L8976.378,3779.528Z" },
  { id: "ka4", inner: TN, delay: 1.08, dur: 0.44, wipe: "right" as const, d: "M10039.37,3779.528L10039.37,4535L10818.898,4535.433L10818.898,3779.528L10039.37,3779.528Z" },
  { id: "ka3", inner: TN, delay: 1.08, dur: 0.44, wipe: "right" as const, d: "M11102.362,3779.528L11102.362,4535.433L11858.268,4535.433L11858.268,4015.748L11622.047,3779.528L11102.362,3779.528Z" },
  { id: "ka2", inner: TN, delay: 1.34, dur: 0.50, wipe: "down"  as const, d: "M11102.362,4797.264L11102.362,6850.394L11598.425,6850.394L11858.268,6590.551L11858.268,4795.276L11102.362,4797.264Z" },
];

const CSS = [
  `@keyframes logo-down {from{clip-path:inset(0% 0% 100% 0%)}to{clip-path:inset(0% 0% 0% 0%)}}`,
  `@keyframes logo-up   {from{clip-path:inset(100% 0% 0% 0%)}to{clip-path:inset(0% 0% 0% 0%)}}`,
  `@keyframes logo-right{from{clip-path:inset(0% 100% 0% 0%)}to{clip-path:inset(0% 0% 0% 0%)}}`,
].join("");

export function LogoStroke({
  className,
  fill = "#333333",
  style,
}: {
  className?: string;
  fill?: string;
  style?: React.CSSProperties;
}) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setActive(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <svg
      viewBox="0 0 6686 2008"
      className={className}
      style={{ fillRule: "evenodd", ...style }}
    >
      <defs>
        <style>{CSS}</style>

        {/* 案4: 対角グラデーション */}
        <linearGradient id="lg-logo" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#0C3347" />
          <stop offset="50%"  stopColor="#031D2A" />
          <stop offset="100%" stopColor="#010D14" />
        </linearGradient>

        <filter id="fx-logo" x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
          {/* もやもや: 複雑なフラクタルノイズ、ごく薄く */}
          <feTurbulence type="fractalNoise" baseFrequency="0.003 0.001" numOctaves="6" seed="5" result="mist" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.1
                    0 0 0 0 0.3
                    0 0 0 0 0.45
                    0 0 0 1.2 -0.9"
            in="mist" result="colorMist"
          />
          <feComposite in="colorMist" in2="SourceGraphic" operator="in" result="clippedMist" />
          <feBlend in="SourceGraphic" in2="clippedMist" mode="screen" result="withMist" />

          {/* キラキラ細粒 */}
          <feTurbulence type="turbulence" baseFrequency="0.02 0.015" numOctaves="1" seed="17" result="fineNoise" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.55
                    0 0 0 0 0.85
                    0 0 0 0 1
                    0 0 0 18 -13"
            in="fineNoise" result="fineSparkles"
          />
          <feComposite in="fineSparkles" in2="SourceGraphic" operator="in" result="clippedFine" />

          {/* キラキラ粗粒 */}
          <feTurbulence type="turbulence" baseFrequency="0.008 0.006" numOctaves="1" seed="42" result="coarseNoise" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.5
                    0 0 0 0 0.8
                    0 0 0 0 1
                    0 0 0 14 -9"
            in="coarseNoise" result="coarseSparkles"
          />
          <feComposite in="coarseSparkles" in2="SourceGraphic" operator="in" result="clippedCoarse" />

          {/* 細粒 + 粗粒 合成 → もやもやと最終合成 */}
          <feBlend in="clippedFine" in2="clippedCoarse" mode="screen" result="allSparkles" />
          <feBlend in="withMist" in2="allSparkles" mode="screen" />
        </filter>
      </defs>

      {STROKES.map(({ id, inner, d, delay, dur, wipe }) => (
        <g
          key={id}
          style={
            active
              ? { animation: `logo-${wipe} ${dur}s ease-out ${delay}s both` }
              : { clipPath: wipe === "down" ? "inset(0% 0% 100% 0%)" : wipe === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)" }
          }
        >
          <g filter="url(#fx-logo)">
            <g transform={T0}>
              <g transform={T1}>
                <g transform={inner}>
                  <path d={d} fill="url(#lg-logo)" />
                </g>
              </g>
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
