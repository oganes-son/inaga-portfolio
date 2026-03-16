"use client";
import { motion } from "framer-motion";

// ─── Block definitions in footer_logo.png coordinate space (1000×300) ───────
// Python analysis results:
//   い:   x =   0 – 295  ( 0.0 – 29.5%)
//   な:   x = 347 – 653  (34.7 – 65.3%)
//   がの「か」部分: x = 694 – 903  (69.4 – 90.3%)
//   がの「゛」部分: x = 926 – 1000 (92.6 – 100%)
//   Characters occupy roughly y = 30 – 270 in the 300px height.
//
// initY: CSS translateY in px (negative = starts above container, invisible)
// initR: initial rotation in degrees (rotates around block center)

interface Block {
  id: string;
  x: number; y: number; w: number; h: number;
  delay: number;
  initY: number;
  initR: number;
}

const FILL = "rgba(22, 28, 46, 0.85)";

const BLOCKS: Block[] = [
  // ── い ──────────────────────────────────────────────────────────────────
  { id: "i-L",    x:  15, y:  35, w: 108, h: 200, delay: 0.00, initY: -400, initR: -15 },
  { id: "i-R",    x: 165, y:  35, w: 108, h: 200, delay: 0.15, initY: -380, initR:  20 },
  { id: "i-btm",  x:  15, y: 228, w: 260, h:  42, delay: 0.28, initY: -320, initR:  -5 },

  // ── な ──────────────────────────────────────────────────────────────────
  { id: "na-L",   x: 350, y:  35, w:  92, h: 235, delay: 0.50, initY: -420, initR: -22 },
  { id: "na-T",   x: 350, y:  35, w: 305, h:  68, delay: 0.65, initY: -350, initR:  12 },
  { id: "na-R",   x: 562, y:  35, w:  88, h: 165, delay: 0.78, initY: -440, initR:  28 },
  { id: "na-btm", x: 420, y: 195, w: 232, h:  80, delay: 0.90, initY: -290, initR: -10 },

  // ── が（主体） ────────────────────────────────────────────────────────────
  { id: "ga-L",   x: 696, y:  35, w: 110, h: 235, delay: 1.10, initY: -400, initR: -20 },
  { id: "ga-R",   x: 840, y:  35, w:  62, h: 235, delay: 1.25, initY: -380, initR:  15 },
  { id: "ga-bar", x: 696, y: 112, w: 210, h:  58, delay: 1.38, initY: -330, initR:  -5 },

  // ── が゛（濁点） ──────────────────────────────────────────────────────────
  { id: "ten-T",  x: 928, y:  35, w:  68, h:  72, delay: 1.55, initY: -360, initR:  30 },
  { id: "ten-B",  x: 928, y: 195, w:  68, h:  78, delay: 1.68, initY: -380, initR: -22 },
];

// ─── Props ───────────────────────────────────────────────────────────────────
interface Props {
  variant: "pc" | "smartphone";
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function LogoAnimation({ variant, className }: Props) {
  const isPC        = variant === "pc";
  const maskId      = `logo-mask-${variant}`;
  const aspectRatio = isPC ? "4441 / 2095" : "2063 / 2602";
  const svgWidth    = isPC ? "40%"         : "62%";

  return (
    <div
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={{ aspectRatio }}
    >
      {/* 水彩テクスチャ背景 */}
      <img
        src="/images/logo_bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        draggable={false}
      />

      {/* テトリスアニメーション層
          mix-blend-mode:multiply → 水彩背景が文字部分に透けて見える */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ mixBlendMode: "multiply" }}
      >
        <svg
          viewBox="0 0 1000 300"
          style={{ width: svgWidth, height: "auto", overflow: "visible" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* footer_logo.png: 白文字・透過PNG → 白=表示・透明=非表示 */}
            <mask id={maskId}>
              <image
                href="/images/footer_logo.png"
                x="0" y="0"
                width="1000" height="300"
              />
            </mask>
          </defs>

          <g mask={`url(#${maskId})`}>
            {BLOCKS.map((b) => (
              <motion.rect
                key={b.id}
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill={FILL}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                initial={{ translateY: b.initY, rotate: b.initR }}
                animate={{ translateY: 0, rotate: 0 }}
                transition={{
                  delay:     b.delay + 0.4,
                  type:      "spring",
                  damping:   16,
                  stiffness: 110,
                  mass:      1.2,
                }}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
