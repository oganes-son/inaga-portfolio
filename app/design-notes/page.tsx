"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { FaXTwitter, FaSoundcloud, FaYoutube, FaInstagram } from "react-icons/fa6";
import { FiChevronDown, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// ─────────────────────────────────────────────
// Color Palette
// ─────────────────────────────────────────────
const PALETTE = [
  {
    label: "#333333",
    usage: "本文・UI・テキスト全般",
    style: { background: "#333333" },
  },
  {
    label: "#ffffff",
    usage: "背景",
    style: { background: "#ffffff", border: "1px solid #e5e5e5" },
  },
  {
    label: "rgba(51,51,51,0.09)",
    usage: "波形ビジュアライザー",
    style: { background: "rgba(51,51,51,0.09)", border: "1px solid #e5e5e5" },
  },
  {
    label: "#eeeeee",
    usage: "シークバー未再生部分",
    style: { background: "#eeeeee" },
  },
];

// ─────────────────────────────────────────────
// Typography specimens
// ─────────────────────────────────────────────
const TYPOGRAPHY = [
  {
    name: "Mobo-semibold",
    note: "class: font-['Mobo-bold']",
    role: "タイトル系",
    spec: "tracking-wider",
    sample: "作品タイトル",
    className: "font-['Mobo-bold'] text-[28pt] tracking-wider text-[#333333] leading-tight",
  },
  {
    name: "Mobo",
    note: "class: font-['Mobo']",
    role: "本文日本語",
    spec: "leading-[2.1]",
    sample: "自己紹介や作品詳細ページの本文に使用。",
    className: "font-['Mobo'] text-[11pt] leading-[2.1] text-[#333333]",
  },
  {
    name: "Bahnschrift",
    note: "class: font-['Bahnschrift']",
    role: "英字・数字・ラベル系",
    spec: "tracking-[0.3em]",
    sample: "PORTFOLIO / MUSIC / DESIGN",
    className: "font-['Bahnschrift'] text-[11pt] tracking-[0.3em] text-[#333333] uppercase",
  },
];

// ─────────────────────────────────────────────
// Section heading with bottom-half highlight
// ─────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-5 mb-10">
      <h2 className="font-['Bahnschrift'] text-[14pt] tracking-[0.35em] text-[#333333] uppercase whitespace-nowrap">
        <span
          style={{
            background: "linear-gradient(to top, rgba(51,51,51,0.12) 44%, transparent 44%)",
            padding: "0 2px",
          }}
        >
          {children}
        </span>
      </h2>
      <div className="flex-1 h-px bg-[#333333] opacity-10" />
    </div>
  );
}

// ─────────────────────────────────────────────
// Admin demos
// ─────────────────────────────────────────────

// タブナビゲーション
function TabDemo() {
  const tabs = ["MUSIC", "DESIGN", "NEWS", "PLAYER", "SEO"] as const;
  const [active, setActive] = useState<string>("MUSIC");
  return (
    <div className="flex gap-1 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-3 py-1.5 text-xs font-['Bahnschrift'] tracking-widest rounded transition-colors ${
            active === tab ? "bg-[#333333] text-white" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// アコーディオンアイテム（⠿ ドラッグハンドル + シェブロン + 削除確認）
function AccordionDemo() {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`bg-white border rounded overflow-hidden ${expanded ? "border-gray-400" : "border-gray-200"}`}>
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none hover:bg-gray-50 transition-colors"
        onClick={() => { setExpanded((v) => !v); setConfirmDelete(false); }}
      >
        <span className="text-gray-400 text-sm shrink-0">⠿</span>
        <span className="text-xs font-['Bahnschrift'] text-gray-400 w-5 text-right shrink-0">1</span>
        <span className="flex-1 truncate font-['Bahnschrift'] tracking-wide text-xs">Purify</span>
        {confirmDelete ? (
          <>
            <span className="text-xs text-red-500 font-['Bahnschrift'] shrink-0">削除しますか？</span>
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
              onPointerDown={(e) => e.stopPropagation()}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded shrink-0"
            >はい</button>
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
              onPointerDown={(e) => e.stopPropagation()}
              className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-100 transition-colors shrink-0"
            >いいえ</button>
          </>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 text-gray-300 hover:text-red-400 transition-colors shrink-0"
          >
            <FiTrash2 className="text-sm" />
          </button>
        )}
        <FiChevronDown className={`text-gray-400 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </div>
      {expanded && (
        <div className="px-3 pb-4 pt-3 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">タイトル</label>
            <input
              type="text"
              defaultValue="Purify"
              className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">説明</label>
            <textarea
              rows={2}
              defaultValue="サンプルの説明文です。"
              className="border border-gray-200 rounded px-2 py-1.5 text-xs resize-none focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button className="p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors opacity-30" disabled>
              <FiChevronLeft className="text-sm" />
            </button>
            <button className="p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors opacity-30" disabled>
              <FiChevronRight className="text-sm" />
            </button>
            <button className="flex-1 py-2 text-xs font-['Bahnschrift'] tracking-widest bg-[#333333] text-white rounded hover:bg-[#555555] transition-colors">
              一時保存
            </button>
            <button
              onClick={() => setExpanded(false)}
              className="px-4 py-2 text-xs font-['Bahnschrift'] tracking-widest border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// スマホフレーム（静的モックアップ）
function PhoneFrameDemo() {
  return (
    <div
      className="mx-auto border-4 border-gray-800 rounded-[28px] overflow-hidden shadow-xl bg-white"
      style={{ width: 140, height: 290, display: "flex", flexDirection: "column" }}
    >
      {/* ノッチ */}
      <div className="bg-gray-800 shrink-0 flex items-center justify-center" style={{ height: 11 }}>
        <div className="bg-gray-600 rounded-full" style={{ width: 32, height: 3 }} />
      </div>
      {/* コンテンツ */}
      <div className="flex-1 bg-white flex flex-col gap-2 p-2 overflow-hidden">
        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
          <span className="font-['Bahnschrift'] text-[5pt] opacity-30">IMAGE</span>
        </div>
        <div className="font-['Mobo-bold'] text-[5pt] tracking-wider">Purify</div>
        <div className="font-['Bahnschrift'] text-[4pt] opacity-40 tracking-widest uppercase">MUSIC / ALBUM DESIGN</div>
        <div className="w-full h-[1px] bg-gray-200" />
        <div className="font-['Mobo'] text-[4pt] opacity-60 leading-relaxed">作品の説明文が入ります。</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Horizontal scroll demo (same logic as main page)
// ─────────────────────────────────────────────
function HorizontalScrollDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ left: false, right: true });

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const isAtStart = el.scrollLeft <= 20;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 20;
    setScrollState({ left: !isAtStart, right: !isAtEnd });
  }

  return (
    <div className="relative">
      <div
        className={`absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none bg-gradient-to-r from-white to-transparent transition-opacity ${scrollState.left ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`absolute right-0 top-0 bottom-0 w-16 z-20 pointer-events-none bg-gradient-to-l from-white to-transparent transition-opacity ${scrollState.right ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-nowrap overflow-x-auto gap-8 md:gap-12 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="shrink-0 snap-start aspect-square w-[160px] md:w-[200px] bg-[#333333]/5 border border-[#333333]/10 flex items-center justify-center"
          >
            <span className="font-['Bahnschrift'] text-[8pt] tracking-widest opacity-30">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function DesignNotesPage() {
  return (
    <div className="min-h-screen bg-white text-[#333333]">
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-2">
        <Link
          href="/"
          className="font-['Bahnschrift'] text-[7.5pt] tracking-[0.3em] opacity-40 hover:opacity-80 transition-opacity uppercase no-underline"
        >
          ← BACK TO PORTFOLIO
        </Link>
      </div>

      {/* Page title */}
      <header className="max-w-4xl mx-auto px-6 pt-10 pb-16">
        <h1 className="font-['Bahnschrift'] text-[16pt] md:text-[20pt] tracking-[0.2em] leading-tight text-[#333333] uppercase">
          DESIGN SYSTEM &amp; NOTES
        </h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24 flex flex-col gap-20">

        {/* ── 1. カラーパレット ── */}
        <section>
          <SectionHeading>COLOR PALETTE</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PALETTE.map((c) => (
              <div key={c.label} className="flex flex-col gap-3">
                <div className="w-full aspect-square" style={c.style} />
                <div className="flex flex-col gap-1">
                  <span className="font-['Bahnschrift'] text-[7.5pt] tracking-[0.12em] text-[#333333]">
                    {c.label}
                  </span>
                  <span className="font-['Mobo'] text-[7.5pt] opacity-50 leading-snug">
                    {c.usage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. タイポグラフィ ── */}
        <section>
          <SectionHeading>TYPOGRAPHY</SectionHeading>
          <div className="flex flex-col gap-10">
            {TYPOGRAPHY.map((t) => (
              <div
                key={t.name}
                className="flex flex-col gap-2 border-b border-[#333333]/10 pb-8 last:border-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                  <span className="font-['Bahnschrift'] text-[8pt] tracking-[0.3em] text-[#333333] uppercase">
                    {t.name}
                  </span>
                  <span className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.2em] opacity-30 uppercase">
                    {t.note} / {t.role} / {t.spec}
                  </span>
                </div>
                <p className={t.className}>{t.sample}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. レイアウト ── */}
        <section>
          <SectionHeading>LAYOUT</SectionHeading>

          {/* ページ構造ダイアグラム */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[520px]">

              {/* ── ブラウザ幅（viewport）── */}
              <div className="relative border border-dashed border-[#333333]/20 bg-[#333333]/[0.02] py-6 px-3">

                {/* viewport ラベル */}
                <div className="absolute -top-3 left-3 bg-white px-2">
                  <span className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.2em] opacity-30 uppercase">viewport（全幅）</span>
                </div>

                {/* ── max-w-4xl コンテンツ幅 ── */}
                <div className="relative max-w-[480px] mx-auto border border-dashed border-[#333333]/30 bg-white">

                  {/* max-width 矢印ラベル（上） */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-0 whitespace-nowrap">
                    <div className="w-3 h-px bg-[#333333]/40" />
                    <span className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.15em] opacity-50 uppercase px-1.5 bg-white">max-w-4xl — 896px</span>
                    <div className="w-3 h-px bg-[#333333]/40" />
                  </div>

                  {/* ── px-6 パディング ── */}
                  <div className="relative flex items-stretch">

                    {/* 左パディング */}
                    <div className="relative w-6 shrink-0 bg-[#333333]/[0.06] flex items-center justify-center">
                      <span className="font-['Bahnschrift'] text-[5.5pt] tracking-tight opacity-40 [writing-mode:vertical-rl] rotate-180">px-6</span>
                      {/* 左側の寸法線 */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 flex flex-col items-center gap-0.5">
                        <div className="w-px h-3 bg-[#333333]/30" />
                        <div className="w-2 h-px bg-[#333333]/30" />
                      </div>
                    </div>

                    {/* コンテンツエリア */}
                    <div className="flex-1 py-4 px-2 flex flex-col gap-2">
                      {/* ダミーコンテンツ */}
                      <div className="font-['Bahnschrift'] text-[6pt] tracking-[0.3em] opacity-30 uppercase mb-1">ABOUT</div>
                      <div className="h-2 bg-[#333333]/10 rounded-full w-3/4" />
                      <div className="h-2 bg-[#333333]/10 rounded-full w-full" />
                      <div className="h-2 bg-[#333333]/10 rounded-full w-5/6" />
                      <div className="h-2 bg-[#333333]/10 rounded-full w-2/3" />
                    </div>

                    {/* 右パディング */}
                    <div className="relative w-6 shrink-0 bg-[#333333]/[0.06] flex items-center justify-center">
                      <span className="font-['Bahnschrift'] text-[5.5pt] tracking-tight opacity-40 [writing-mode:vertical-rl]">px-6</span>
                    </div>

                  </div>

                  {/* 左右パディング 寸法ラベル（下） */}
                  <div className="flex items-center justify-between px-0 pb-1 pt-0.5">
                    <div className="flex items-center gap-1">
                      <div className="h-px w-6 bg-[#333333]/30" />
                      <span className="font-['Bahnschrift'] text-[6pt] opacity-30 uppercase tracking-tight">24px</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-['Bahnschrift'] text-[6pt] opacity-30 uppercase tracking-tight">24px</span>
                      <div className="h-px w-6 bg-[#333333]/30" />
                    </div>
                  </div>

                </div>{/* /max-w-4xl */}
              </div>{/* /viewport */}

              {/* ── ブレークポイント図（横幅比較）── */}
              <div className="mt-8 flex flex-col gap-2">
                <span className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.3em] opacity-40 uppercase">BREAKPOINT</span>

                {/* SP: 768px未満 */}
                <div className="flex items-center gap-3">
                  <span className="font-['Bahnschrift'] text-[6.5pt] opacity-30 w-20 shrink-0 text-right">＜ 768px</span>
                  <div className="relative h-5 bg-[#333333]/8 border border-dashed border-[#333333]/20 flex items-center justify-center" style={{ width: "45%" }}>
                    <span className="font-['Bahnschrift'] text-[6pt] tracking-widest opacity-30">MOBILE</span>
                  </div>
                  <span className="font-['Bahnschrift'] text-[6.5pt] opacity-30">1カラム・フォントS</span>
                </div>

                {/* PC: 768px以上 */}
                <div className="flex items-center gap-3">
                  <span className="font-['Bahnschrift'] text-[6.5pt] opacity-30 w-20 shrink-0 text-right">≥ 768px</span>
                  <div className="relative h-5 bg-[#333333]/8 border border-dashed border-[#333333]/20 flex items-center justify-center" style={{ width: "80%" }}>
                    <div className="absolute left-0 top-0 bottom-0 border-r-2 border-[#333333]/30" style={{ left: "56.25%" }} />
                    <span className="font-['Bahnschrift'] text-[6pt] tracking-widest opacity-30">DESKTOP</span>
                  </div>
                  <span className="font-['Bahnschrift'] text-[6.5pt] opacity-30">2カラム・フォントL</span>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ── 4. コンポーネント ── */}
        <section>
          <SectionHeading>COMPONENTS</SectionHeading>
          <div className="flex flex-col gap-12">

            {/* ナビリンク hover */}
            <div>
              <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-5">
                NAV LINK — scale + アンダーライン伸長
              </p>
              <div className="relative inline-flex flex-col items-center group cursor-default">
                <span className="font-['Bahnschrift'] text-[12.2pt] tracking-widest text-[#333333] group-hover:scale-110 transition-transform duration-200 inline-block">
                  WORKS
                </span>
                <span className="absolute -bottom-1 w-full h-[2px] bg-[#333333] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-200" />
              </div>
            </div>

            {/* VIEW ALL アニメーションリンク */}
            <div>
              <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-5">
                VIEW ALL LINK — テキスト opacity + 下線が右から伸びる
              </p>
              <div className="relative inline-flex flex-col items-end group cursor-default w-36">
                <div className="flex items-center gap-2 font-['Bahnschrift'] text-[9.5pt] tracking-[0.2em] text-[#333333]/60 group-hover:text-[#333333] transition-colors duration-300 uppercase">
                  VIEW ALL <span className="text-[12pt] mb-0.5">→</span>
                </div>
                <div className="h-[1px] bg-[#333333] w-full origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </div>

            {/* SNS アイコン hover */}
            <div>
              <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-5">
                SNS ICONS — scale 1.1 + opacity 0.6→0.4 (framer-motion whileHover)
              </p>
              <div className="flex items-center gap-10 text-[28px] text-[#333333]">
                {[FaXTwitter, FaSoundcloud, FaYoutube, FaInstagram].map((Icon, i) => (
                  <span
                    key={i}
                    className="opacity-70 hover:opacity-40 hover:scale-110 transition-all duration-200 cursor-default inline-block"
                  >
                    <Icon />
                  </span>
                ))}
              </div>
            </div>

            {/* 横スクロールギャラリー */}
            <div>
              <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-5">
                HORIZONTAL SCROLL — スクロールバー非表示 + 端フェード（端で消える）
              </p>
              <HorizontalScrollDemo />
              <p className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.2em] opacity-25 uppercase mt-3">
                [&amp;::-webkit-scrollbar]:hidden / scrollbar-width:none / snap-x / bg-gradient fade
              </p>
            </div>

            {/* ギャラリーページのホバー */}
            <div>
              <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-5">
                GALLERY CARD — scale-110 + frosted overlay + タイトル表示
              </p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-6 max-w-sm">
                {["01", "02", "03", "04"].map((n) => (
                  <div
                    key={n}
                    className="group relative aspect-square bg-[#333333]/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-default"
                  >
                    <div className="absolute inset-0 bg-[#333333]/8 transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                      <p className="font-['Mobo'] text-[8pt] text-center leading-relaxed tracking-wider text-[#333333]">
                        作品{n}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.2em] opacity-25 uppercase mt-3">
                group-hover:scale-110 duration-700 / bg-white/30 backdrop-blur-sm
              </p>
            </div>

          </div>
        </section>

        {/* ── 5. ADMIN ── */}
        <section>
          <SectionHeading>ADMIN</SectionHeading>
          <div className="flex flex-col gap-12">

            {/* 背景色 */}
            <div>
              <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-5">
                BACKGROUND — ポートフォリオ #ffffff に対して #f5f5f5
              </p>
              <div className="flex gap-4 items-end">
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-16 aspect-square" style={{ background: "#ffffff", border: "1px solid #e5e5e5" }} />
                  <span className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.1em] opacity-50">#ffffff</span>
                  <span className="font-['Bahnschrift'] text-[6pt] opacity-30">portfolio</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-16 aspect-square" style={{ background: "#f5f5f5", border: "1px solid #e5e5e5" }} />
                  <span className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.1em] opacity-50">#f5f5f5</span>
                  <span className="font-['Bahnschrift'] text-[6pt] opacity-30">admin</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-16 aspect-square bg-amber-50 border border-amber-100" />
                  <span className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.1em] opacity-50">amber-50</span>
                  <span className="font-['Bahnschrift'] text-[6pt] opacity-30">未コミット</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-16 aspect-square bg-blue-50 border border-blue-100" />
                  <span className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.1em] opacity-50">blue-50</span>
                  <span className="font-['Bahnschrift'] text-[6pt] opacity-30">ステータス</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-16 aspect-square bg-green-600" />
                  <span className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.1em] opacity-50">green-600</span>
                  <span className="font-['Bahnschrift'] text-[6pt] opacity-30">コミット</span>
                </div>
              </div>
            </div>

            {/* タブナビゲーション */}
            <div>
              <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-5">
                TAB NAVIGATION — active: bg-[#333333] text-white / inactive: text-gray-500 hover:bg-gray-100
              </p>
              <TabDemo />
            </div>

            {/* ステータスバナー */}
            <div>
              <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-5">
                STATUS BANNERS — 未コミット警告 / ステータスメッセージ
              </p>
              <div className="flex flex-col gap-2">
                <div className="bg-amber-50 border border-amber-100 px-4 py-2 text-xs text-amber-700 font-['Bahnschrift'] tracking-wide rounded">
                  ⚠ 未コミットの変更があります。右上の「全てコミット」でGitHubに反映されます。
                </div>
                <div className="bg-blue-50 border border-blue-100 px-4 py-2 text-xs text-blue-700 font-['Bahnschrift'] tracking-wide rounded flex items-center justify-between">
                  <span>コミット完了！サイトに反映されるまで1〜2分かかります。</span>
                  <button className="ml-2 opacity-60 hover:opacity-100">✕</button>
                </div>
              </div>
            </div>

            {/* アコーディオン + 削除確認 */}
            <div>
              <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-5">
                ACCORDION LIST — ⠿ ドラッグハンドル + シェブロン展開 + 2段階削除確認 + Undo/Redo
              </p>
              <div className="max-w-sm flex flex-col gap-2">
                <AccordionDemo />
                {/* 新規追加フォームの見た目 */}
                <div className="bg-white border-2 border-dashed border-blue-300 rounded overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50">
                    <span className="text-xs font-['Bahnschrift'] text-blue-400 tracking-widest shrink-0">NEW</span>
                    <span className="flex-1 truncate font-['Bahnschrift'] tracking-wide text-xs text-blue-500">（タイトル未入力）</span>
                    <button className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors shrink-0">
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* プレビューパネル + スマホフレーム */}
            <div>
              <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-5">
                PREVIEW PANEL — 左40%固定・sticky / PC↔スマホ切り替え / スマホフレームモックアップ
              </p>
              <div className="flex gap-6 items-start">
                {/* パネル */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 w-44 shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-['Bahnschrift'] tracking-widest opacity-50 uppercase">Preview</p>
                    <div className="flex gap-1">
                      {["PC", "スマホ"].map((m, i) => (
                        <button key={m} className={`px-2 py-1 text-xs font-['Bahnschrift'] tracking-widest rounded transition-colors ${i === 1 ? "bg-[#333333] text-white" : "text-gray-400 hover:bg-gray-100"}`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <PhoneFrameDemo />
                </div>
                {/* コミットボタン */}
                <div className="flex flex-col gap-3">
                  <p className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.2em] opacity-40 uppercase">
                    COMMIT BUTTON（未コミット時のみ表示）
                  </p>
                  <button className="px-4 py-2 text-xs font-['Bahnschrift'] tracking-widest bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm whitespace-nowrap">
                    全てコミット ↑
                  </button>
                  <p className="font-['Bahnschrift'] text-[6.5pt] tracking-[0.2em] opacity-30 uppercase">
                    全体で唯一 green-600 を使用
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>


      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 pb-10 text-center">
        <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-30 uppercase">
          INAGA PORTFOLIO — DESIGN SYSTEM &amp; NOTES
        </p>
      </footer>
    </div>
  );
}
