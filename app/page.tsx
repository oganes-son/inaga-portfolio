"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { FaXTwitter, FaSoundcloud, FaYoutube, FaInstagram, FaRegEnvelope } from "react-icons/fa6";

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

export default function Home() {

  {/*作品はここにおいて！*/}
  const musicWorks = [
    { 
      id: 1, 
      filename: "ALBUM　PARADIGM SHIFT.png", 
      title: "ALBUM　PARADIGM SHIFT", 
      soundcloud: "https://soundcloud.com/sgextgl4iyy9",
      youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ"
    },
    { 
      id: 2, 
      filename: "CYBER METROPLEX.png", 
      title: "CYBER METROPLEX",
      soundcloud: "https://soundcloud.com/sgextgl4iyy9",
      youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ"
    },
    { 
      id: 3, 
      filename: "Fantasie Impromptu (Remix).png", 
      title: "Fantasie Impromptu (Remix)",
      soundcloud: "https://soundcloud.com/sgextgl4iyy9",
      youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ"
    },
    { 
      id: 4, 
      filename: "Purify.png", 
      title: "Purify",
      soundcloud: "https://soundcloud.com/sgextgl4iyy9",
      youtube: "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ"
    },
  ];

  const designWorks = [
    { id: 1, filename: "AQUARHYTHM(From 楡陵祭).png", title: "AQUARHYTHM(From 楡陵祭)" },
    { id: 2, filename: "COLORFUL SMOKE.png", title: "COLORFUL SMOKE" },
    { id: 3, filename: "HARMONITE (From楡陵祭).png", title: "HARMONITE (From楡陵祭)" },
    { id: 4, filename: "LUNAR PROBER.png", title: "LUNAR PROBER" },
    { id: 5, filename: "RECONST.png", title: "RECONST" },
    { id: 6, filename: "横転.png", title: "横転" },
    { id: 7, filename: "年賀状2026.png", title: "年賀状2026" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  // 画面幅がPCサイズ(768px以上)になったらメニューを閉じる
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#333333] relative overflow-x-hidden">
      
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 w-full h-0 md:h-20 md:bg-white/90 md:backdrop-blur-md z-[100] flex items-center justify-between px-6 md:px-10 md:shadow-sm">
        {/* PC用ナビゲーション (md以上で表示) */}
        <nav className="hidden md:flex gap-8 text-[12.2pt]">
          <AnimatedLink href="#about" text="ABOUT" />
          <AnimatedLink href="#works" text="WORKS" />
          <AnimatedLink href="#news" text="NEWS" />
          <AnimatedLink href="#contact" text="CONTACT" />
        </nav>

        {/* PC用SNSアイコン (md以上で表示) */}
        <div className="hidden md:flex gap-6 text-[28px]">
          <a href="https://x.com/inaga_P" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaXTwitter /></a>
          <a href="https://soundcloud.com/sgextgl4iyy9" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaSoundcloud /></a>
          <a href="https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaYoutube /></a>
          <a href="https://www.instagram.com/inaga__inaga" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaInstagram /></a>
        </div>

        {/* スマホ用ハンバーガーボタン */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden z-[110] fixed top-6 right-6 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
        >
          <motion.span 
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-8 h-0.5 bg-[#333333] block" 
          />
          <motion.span 
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-8 h-0.5 bg-[#333333] block" 
          />
          <motion.span 
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-8 h-0.5 bg-[#333333] block" 
          />
        </button>

        {/* スマホ用フルスクリーンメニュー */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-white/40 backdrop-blur-xl z-[105] flex flex-col items-center justify-center"
            >
              <nav className="flex flex-col items-center gap-10 text-[18pt] font-['Bahnschrift'] tracking-widest">
                <a href="#about" onClick={() => setIsOpen(false)}>ABOUT</a>
                <a href="#works" onClick={() => setIsOpen(false)}>WORKS</a>
                <a href="#news" onClick={() => setIsOpen(false)}>NEWS</a>
                <a href="#contact" onClick={() => setIsOpen(false)}>CONTACT</a>
              </nav>
              
              <div className="flex gap-8 text-[28px] mt-16">
                <a href="https://x.com/inaga_P" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
                <a href="https://soundcloud.com/sgextgl4iyy9" target="_blank" rel="noopener noreferrer"><FaSoundcloud /></a>
                <a href="https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                <a href="https://www.instagram.com/inaga__inaga" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="relative z-10">
        
        {/*ファーストビューfirst view*/}
        {/* 🟢 justify-start でスマホ時は上寄せ。md以上は md:justify-center で中央。 */}
        <main className="min-h-screen md:h-[calc(100vh-80px)] w-full flex flex-col justify-start md:justify-center items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} className="w-full text-center">
            {/* スマホ用ロゴ: top_logo_smartphone.png */}
            <img src="/images/top_logo_smartphone.png" alt="inaga" className="block md:hidden w-full h-auto object-contain" />
            {/* PC用ロゴ: top_logo.png */}
            <img src="/images/top_logo.png" alt="inaga" className="hidden md:block w-full h-auto object-cover" />
          </motion.div>
        </main>

        {/* ABOUTセクション */}
        <section id="about" className="max-w-4xl mx-auto py-32 px-6 min-h-screen flex flex-col justify-center relative overflow-hidden">
          
          {/*スクロール連動の背景画像*/}
          <AboutBackgroundImage />

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 0.8 }} 
            className="text-left relative z-10"
          >
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-8 tracking-widest">ABOUT</h2>
            <div className="space-y-6 leading-relaxed font-['Mobo'] font-normal text-[12.2pt]">
              <p className="text-[32pt] md:text-[45.7pt] font-['Mobo-bold'] leading-tight mt-10 mb-12">いなが</p>
              <p>2004年11月24日生まれの21歳。札幌在住。</p>
              <p>音楽やグラフィックデザインを制作。</p>
              <p>北海道大学工学部情報エレクトロニクス学科所属。</p>
            </div>
          </motion.div>
        </section>

        {/*ワークスWORKS*/}
        <section id="works" className="max-w-4xl mx-auto py-32 px-6 min-h-screen flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-left w-full">
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-12 tracking-widest">WORKS</h2>
            
            {/*ミュージックMUSIC*/}
            <div className="mb-20">
              <h3 className="text-[16pt] font-['Bahnschrift'] mb-8 tracking-widest border-b border-[#333333]/20 pb-2">MUSIC</h3>
              <div className="flex overflow-x-auto gap-10 pb-12 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {musicWorks.map((work) => (
                  <div key={`music-${work.id}`} className="group flex flex-col gap-4 snap-start shrink-0">
                    <div className="relative rounded-lg shadow-2xl border border-[#333333]/5 bg-white overflow-hidden h-[300px]">
                      <img 
                        src={`/images/MUSIC WORKS/${work.filename}`} 
                        alt={work.title} 
                        className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    <div className="font-['Mobo'] px-1">
                      {/* 🟢 Moboフォントを適用 */}
                      <p className="font-['Mobo'] text-[12.2pt] mb-3">{work.title}</p>
                      <div className="flex gap-6 text-[28px] text-[#333333] mt-3">
                        <a href={work.soundcloud} target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110 inline-block">
                          <FaSoundcloud />
                        </a>
                        <a href={work.youtube} target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110 inline-block">
                          <FaYoutube />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* デザインDESIGN */}
            <div>
              <h3 className="text-[16pt] font-['Bahnschrift'] mb-8 tracking-widest border-b border-[#333333]/20 pb-2">DESIGN</h3>
              <div className="flex overflow-x-auto gap-10 pb-12 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {designWorks.map((work) => (
                  <div key={`design-${work.id}`} className="group flex flex-col gap-4 snap-start shrink-0">
                    <div className="relative rounded-lg shadow-2xl border border-[#333333]/5 bg-white overflow-hidden h-[300px]">
                      <img 
                        src={`/images/DESIGN WORKS/${work.filename}`} 
                        alt={work.title} 
                        className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    <div className="font-['Mobo'] px-1">
                      {/* 🟢 Moboフォントを適用 */}
                      <p className="font-['Mobo'] text-[12.2pt]">{work.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/*NEWS*/}
        <section id="news" className="max-w-4xl mx-auto py-32 px-6 min-h-[60vh] flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-left">
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-8 tracking-widest">NEWS</h2>
            <div className="bg-white/50 p-8 rounded-2xl shadow-sm backdrop-blur-sm font-['Mobo'] font-normal text-[12.2pt] space-y-6">
              <div className="flex flex-col md:flex-row md:gap-8 border-b border-[#333333]/10 pb-4">
                <span className="font-['Bahnschrift'] opacity-70 mb-1 md:mb-0 w-32">202X.XX.XX</span>
                <span>ポートフォリオサイトを公開しました。</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/*CONTACT*/}
        <section id="contact" className="max-w-4xl mx-auto py-32 px-6 min-h-[60vh] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-12 tracking-widest">CONTACT</h2>
            
            <div className="flex flex-col gap-10">
              <motion.a 
                href="mailto:inagainagainaga@gmail.com" 
                initial="initial" 
                whileHover="hover"
                className="relative group flex items-center gap-6 text-[15pt] md:text-[18pt] text-[#333333] w-fit"
              >
                <motion.div 
                  className="flex items-center gap-6"
                  variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
                  transition={{ duration: 0.2 }}
                >
                  <FaRegEnvelope className="text-[20pt] md:text-[24pt]" />
                  <span className="font-['Bahnschrift'] tracking-tight">
                    inagainagainaga@gmail.com
                  </span>
                </motion.div>
                <motion.span 
                  variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} 
                  transition={{ duration: 0.2 }} 
                  className="absolute -bottom-1 w-full h-[2px] bg-[#333333] origin-center" 
                />
              </motion.a>

              <motion.a 
                href="https://x.com/inaga_P" 
                target="_blank" 
                rel="noopener noreferrer"
                initial="initial" 
                whileHover="hover"
                className="relative group flex items-center gap-6 text-[15pt] md:text-[18pt] text-[#333333] w-fit"
              >
                <motion.div 
                  className="flex items-center gap-6"
                  variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
                  transition={{ duration: 0.2 }}
                >
                  <FaXTwitter className="text-[20pt] md:text-[24pt]" />
                  <span className="font-['Bahnschrift'] tracking-tight">
                    @inaga_P
                  </span>
                </motion.div>
                <motion.span 
                  variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} 
                  transition={{ duration: 0.2 }} 
                  className="absolute -bottom-1 w-full h-[2px] bg-[#333333] origin-center" 
                />
              </motion.a>
            </div>
          </motion.div>
        </section>

      </div>

      {/*フッター*/}
      <footer className="bg-[#333333] text-white py-16 relative z-10 flex flex-col items-center gap-10">
        <nav className="flex flex-wrap justify-center gap-8 text-[12.2pt]">
          <FooterAnimatedLink href="#about" text="ABOUT" />
          <FooterAnimatedLink href="#works" text="WORKS" />
          <FooterAnimatedLink href="#news" text="NEWS" />
          <FooterAnimatedLink href="#contact" text="CONTACT" />
        </nav>
      </footer>

      {/*フッター画像*/}
      <div className="bg-[#333333] w-full flex justify-center pb-10 relative z-10">
        <img src="/images/footer_logo.png" alt="Footer decoration" className="max-w-[250px] w-full px-6 h-auto" />
      </div>

    </div>
  );
}

//アバウトABOUTの背景画像のアニメーション
function AboutBackgroundImage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], ["100%", "0%", "0%", "-100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.3, 0.3, 0]);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none select-none">
      <motion.div
        style={{ x, opacity }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full flex justify-end items-center"
      >
        <div className="relative w-[80%] h-[80%] flex justify-end">
          <img 
            src="/images/top_logo_nocut.png" 
            alt="" 
            className="h-full w-auto object-contain object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7f6] via-[#f4f7f6]/40 to-transparent w-full h-full" />
        </div>
      </motion.div>
    </div>
  );
}