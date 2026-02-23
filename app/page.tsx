"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { FaXTwitter, FaSoundcloud, FaYoutube, FaInstagram, FaRegEnvelope } from "react-icons/fa6";

// 🟢 1. 各種アニメーションコンポーネント
function AnimatedLink({ href, text }: { href: string; text: string }) {
  return (
    <motion.a href={href} initial="initial" whileHover="hover" className="relative group text-[#333333] font-['Bahnschrift'] tracking-widest px-2 py-1 flex flex-col items-center">
      <motion.span variants={{ initial: { scale: 1 }, hover: { scale: 1.1 } }} transition={{ duration: 0.2 }}>{text}</motion.span>
      <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-[#333333] origin-center" />
    </motion.a>
  );
}

function FooterAnimatedLink({ href, text }: { href: string; text: string }) {
  return (
    <motion.a href={href} initial="initial" whileHover="hover" className="relative group text-white font-['Bahnschrift'] tracking-widest px-2 py-1 flex flex-col items-center">
      <motion.span variants={{ initial: { scale: 1 }, hover: { scale: 1.1 } }} transition={{ duration: 0.2 }}>{text}</motion.span>
      <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-white origin-center" />
    </motion.a>
  );
}

// 🟢 2. スクロールギャラリーコンポーネント
function HorizontalScrollGallery({ items, type }: { items: any[], type: 'music' | 'design' }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ left: false, right: true, started: false });

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 10;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      setScrollState({ 
        left: !isAtStart, 
        right: !isAtEnd, 
        started: el.scrollLeft > 20 
      });
    }
  };

  return (
    <div className="relative group">
      {/* グラデーションヒント */}
      <div className={`absolute left-0 top-0 bottom-0 w-20 z-20 pointer-events-none transition-opacity duration-500 bg-gradient-to-r from-[#f4f7f6] to-transparent ${scrollState.left ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute right-0 top-0 bottom-0 w-20 z-20 pointer-events-none transition-opacity duration-500 bg-gradient-to-l from-[#f4f7f6] to-transparent ${scrollState.right ? 'opacity-100' : 'opacity-0'}`} />

      {/* スクロール本体 */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-10 pb-12 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {items.map((work) => (
          <motion.div key={work.id} className="group/item flex flex-col gap-4 snap-start shrink-0">
            <a href={`/works/${work.slug || 'paradigm-shift'}`} className="block">
              <div className="relative rounded-lg shadow-2xl border border-[#333333]/5 bg-white overflow-hidden h-[300px]">
                <img src={`/images/${type === 'music' ? 'MUSIC' : 'DESIGN'} WORKS/${work.filename}`} alt={work.title} className="h-full w-auto object-contain transition-transform duration-500 group-hover/item:scale-105" />
              </div>
              <div className="font-['Mobo'] px-1 mt-4">
                <p className="text-[12.2pt] hover:opacity-60 transition-opacity">{work.title}</p>
              </div>
            </a>
            {type === 'music' && (
              <div className="flex gap-6 text-[28px] text-[#333333] px-1">
                <a href={work.soundcloud} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform inline-block"><FaSoundcloud /></a>
                <a href={work.youtube} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform inline-block"><FaYoutube /></a>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 🟢 「一覧を表示」リンク：背景なし・下線アニメーションに変更 */}
      <AnimatePresence>
        {scrollState.started && (
          <motion.a
            href={`/works/${type}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-4 right-0 z-30 group flex flex-col items-end"
          >
            {/* テキスト部分 */}
            <div className="flex items-center gap-2 font-['Bahnschrift'] text-[9pt] md:text-[10pt] tracking-[0.2em] text-[#333333]/60 group-hover:text-[#333333] transition-colors duration-300">
              VIEW ALL <span className="text-[12pt] mb-0.5">→</span>
            </div>
            
            {/* 下線アニメーション：AnimatedLinkと同様のロジック */}
            <motion.div 
              className="h-[1px] bg-[#333333] w-full origin-right"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.a>
        )}
      </AnimatePresence>
      
    </div>
  );
}

// 🟢 3. メインページコンポーネント
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowHeader(latest > 50);
  });

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const musicWorks = [
    { id: 1, slug: "paradigm-shift", filename: "ALBUM　PARADIGM SHIFT.png", title: "ALBUM　PARADIGM SHIFT", soundcloud: "https://soundcloud.com/sgextgl4iyy9", youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" },
    { id: 2, slug: "cyber-metroplex", filename: "CYBER METROPLEX.png", title: "CYBER METROPLEX", soundcloud: "https://soundcloud.com/sgextgl4iyy9", youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" },
    { id: 3, slug: "fantasie-impromptu", filename: "Fantasie Impromptu (Remix).png", title: "Fantasie Impromptu (Remix)", soundcloud: "https://soundcloud.com/sgextgl4iyy9", youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" },
    { id: 4, slug: "purify", filename: "Purify.png", title: "Purify", soundcloud: "https://soundcloud.com/sgextgl4iyy9", youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" },
  ];

  const designWorks = [
    { id: 1, slug: "aquarhythm", filename: "AQUARHYTHM(From 楡陵祭).png", title: "AQUARHYTHM(From 楡陵祭)" },
    { id: 2, slug: "colorful-smoke", filename: "COLORFUL SMOKE.png", title: "COLORFUL SMOKE" },
    { id: 3, slug: "harmonite", filename: "HARMONITE (From楡陵祭).png", title: "HARMONITE (From楡陵祭)" },
    { id: 4, slug: "lunar-prober", filename: "LUNAR PROBER.png", title: "LUNAR PROBER" },
    { id: 5, slug: "reconst", filename: "RECONST.png", title: "RECONST" },
    { id: 6, slug: "outen", filename: "横転.png", title: "横転" },
    { id: 7, slug: "nengajo-2026", filename: "年賀状2026.png", title: "年賀状2026" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#333333] relative overflow-x-hidden">
      
      {/* ヘッダーエリア設定 */}
      <div className="fixed top-0 left-0 w-full h-10 z-[101]" onMouseEnter={() => setIsHoveringHeader(true)} />

      {/* headerヘッダー */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: (showHeader || isHoveringHeader || isOpen) ? 0 : -100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        onMouseLeave={() => setIsHoveringHeader(false)}
        className="fixed top-0 left-0 w-full h-0 md:h-20 md:bg-white/90 md:backdrop-blur-md z-[100] flex items-center justify-between px-6 md:px-10 md:shadow-sm"
      >
        <nav className="hidden md:flex gap-8 text-[12.2pt]">
          <AnimatedLink href="#about" text="ABOUT" />
          <AnimatedLink href="#works" text="WORKS" />
          <AnimatedLink href="#news" text="NEWS" />
          <AnimatedLink href="#contact" text="CONTACT" />
        </nav>

        <div className="hidden md:flex gap-6 text-[28px]">
          <a href="https://x.com/inaga_P" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaXTwitter /></a>
          <a href="https://soundcloud.com/sgextgl4iyy9" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaSoundcloud /></a>
          <a href="https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaYoutube /></a>
          <a href="https://www.instagram.com/inaga__inaga" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaInstagram /></a>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-[110] fixed top-6 right-6 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none">
          <motion.span animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-8 h-0.5 bg-[#333333] block" />
          <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-8 h-0.5 bg-[#333333] block" />
          <motion.span animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-8 h-0.5 bg-[#333333] block" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 bg-white/40 backdrop-blur-xl z-[105] flex flex-col items-center justify-center">
              <nav className="flex flex-col items-center gap-10 text-[18pt] font-['Bahnschrift'] tracking-widest text-[#333333]">
                <a href="#about" onClick={() => setIsOpen(false)}>ABOUT</a>
                <a href="#works" onClick={() => setIsOpen(false)}>WORKS</a>
                <a href="#news" onClick={() => setIsOpen(false)}>NEWS</a>
                <a href="#contact" onClick={() => setIsOpen(false)}>CONTACT</a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div className="relative z-10">
        
        {/* ファーストビュー：全画面ロゴ */}
        <main className="min-h-screen w-full flex flex-col justify-start md:justify-center items-center bg-white overflow-hidden">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="w-full flex items-center justify-center">
            <img src="/images/top_logo_smartphone.png" alt="inaga" className="block md:hidden w-full h-auto object-cover self-start" />
            <img src="/images/top_logo.png" alt="inaga" className="hidden md:block w-full h-auto object-cover" />
          </motion.div>
        </main>

        {/* ABOUTアバウト */}
        <section id="about" className="max-w-4xl mx-auto py-32 px-6 min-h-screen flex flex-col justify-center relative overflow-hidden">
          <AboutBackgroundImage />
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-left relative z-10">
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-8 tracking-widest">ABOUT</h2>
            <div className="space-y-6 leading-relaxed font-['Mobo'] font-normal text-[12.2pt]">
              <p className="text-[32pt] md:text-[45.7pt] font-['Mobo-bold'] leading-tight mt-10 mb-12">いなが</p>
              <p>2004年11月24日生まれの21歳。札幌在住。</p>
              <p>音楽やグラフィックデザインを制作。</p>
              <p>北海道大学工学部情報エレクトロニクス学科所属。</p>
            </div>
          </motion.div>
        </section>

        {/* WORKSワークス */}
        <section id="works" className="max-w-4xl mx-auto py-32 px-6 min-h-screen flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-left w-full">
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-12 tracking-widest">WORKS</h2>
            <div className="mb-20">
              <h3 className="text-[16pt] font-['Bahnschrift'] mb-8 tracking-widest border-b border-[#333333]/20 pb-2">MUSIC</h3>
              <HorizontalScrollGallery items={musicWorks} type="music" />
            </div>
            <div>
              <h3 className="text-[16pt] font-['Bahnschrift'] mb-8 tracking-widest border-b border-[#333333]/20 pb-2">DESIGN</h3>
              <HorizontalScrollGallery items={designWorks} type="design" />
            </div>
          </motion.div>
        </section>

        {/* NEWSニュース */}
        <section id="news" className="max-w-4xl mx-auto py-32 px-6 min-h-[60vh] flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left">
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-8 tracking-widest">NEWS</h2>
            <div className="bg-white/50 rounded-2xl shadow-sm backdrop-blur-sm overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-[#333333]/20">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col md:flex-row md:gap-8 border-b border-[#333333]/10 pb-4 last:border-0">
                    <span className="font-['Bahnschrift'] opacity-70 w-32">2026.02.23</span>
                    <span className="font-['Mobo'] text-[12.2pt]">ニュース項目 {i}：内容をここにいれる～。</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* CONTACTコンタクト */}
        <section id="contact" className="max-w-4xl mx-auto py-32 px-6 min-h-[60vh] flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-left">
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-12 tracking-widest">CONTACT</h2>
            <div className="flex flex-col gap-10">
              <motion.a href="mailto:inagainagainaga@gmail.com" initial="initial" whileHover="hover" className="relative group flex items-center gap-6 text-[15pt] md:text-[18pt] text-[#333333] w-fit">
                <motion.div className="flex items-center gap-6" variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }} transition={{ duration: 0.2 }}>
                  <FaRegEnvelope className="text-[20pt] md:text-[24pt]" />
                  <span className="font-['Bahnschrift'] tracking-tight">inagainagainaga@gmail.com</span>
                </motion.div>
                <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-[#333333] origin-center" />
              </motion.a>

              <motion.a href="https://x.com/inaga_P" target="_blank" rel="noopener noreferrer" initial="initial" whileHover="hover" className="relative group flex items-center gap-6 text-[15pt] md:text-[18pt] text-[#333333] w-fit">
                <motion.div className="flex items-center gap-6" variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }} transition={{ duration: 0.2 }}>
                  <FaXTwitter className="text-[20pt] md:text-[24pt]" />
                  <span className="font-['Bahnschrift'] tracking-tight">@inaga_P</span>
                </motion.div>
                <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-[#333333] origin-center" />
              </motion.a>
            </div>
          </motion.div>
        </section>

      </div>

      {/* フッターfooter */}
      <footer className="bg-[#333333] text-white py-16 relative z-10 flex flex-col items-center gap-10">
        <nav className="flex flex-wrap justify-center gap-8 text-[12.2pt]">
          <FooterAnimatedLink href="#about" text="ABOUT" />
          <FooterAnimatedLink href="#works" text="WORKS" />
          <FooterAnimatedLink href="#news" text="NEWS" />
          <FooterAnimatedLink href="#contact" text="CONTACT" />
        </nav>
        <div className="text-[8pt] font-['Bahnschrift'] opacity-50 tracking-widest text-center px-6">
          © 2026 INAGA | DEVELOPED BY OGANESSON
        </div>
      </footer>

      <div className="bg-[#333333] w-full flex justify-center pb-10 relative z-10">
        <img src="/images/footer_logo.png" alt="Footer decoration" className="max-w-[250px] w-full px-6 h-auto" />
      </div>

    </div>
  );
}

// アバウト背景アニメーション部品
function AboutBackgroundImage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], ["100%", "0%", "0%", "-100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.3, 0.3, 0]);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none select-none">
      <motion.div style={{ x, opacity }} className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full flex justify-end items-center">
        <div className="relative w-[80%] h-[80%] flex justify-end">
          <img src="/images/top_logo_nocut.png" alt="" className="h-full w-auto object-contain object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7f6] via-[#f4f7f6]/40 to-transparent w-full h-full" />
        </div>
      </motion.div>
    </div>
  );
}