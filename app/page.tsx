"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { FaXTwitter, FaSoundcloud, FaYoutube, FaInstagram, FaRegEnvelope } from "react-icons/fa6";
import { musicWorks, designWorks, newsData } from "@/lib/works"; 
import { VisualizerStyle2 } from '@/components/VisualizerStyle2';

/* --- 共通パーツ (AnimatedLink, ContactLink, HorizontalScrollGalleryなどは以前のまま維持) --- */
/* 省略：前回の回答のパーツ定義部分をそのまま使用してください */

function AnimatedLink({ href, text, onClick }: { href: string; text: string; onClick?: () => void }) {
  return (
    <motion.a 
      href={href} onClick={onClick} initial="initial" whileHover="hover" 
      className="relative group text-[#333333] font-['Bahnschrift'] text-[12.2pt] tracking-widest px-2 py-1 flex flex-col items-center cursor-pointer"
    >
      <motion.span variants={{ initial: { scale: 1 }, hover: { scale: 1.1 } }}>{text}</motion.span>
      <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-[#333333] origin-center" />
    </motion.a>
  );
}

function ContactLink({ href, icon, text }: { href: string; icon: any; text: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-6 text-[#333333] w-fit">
      <motion.span whileHover={{ scale: 1.1 }} className="text-[16pt] md:text-[20pt] shrink-0 group-hover:text-[#333333]/60 transition-colors">
        {icon}
      </motion.span>
      <motion.div initial="initial" whileHover="hover" className="relative flex flex-col">
        <motion.span variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }} transition={{ duration: 0.2 }} className="font-['Bahnschrift'] tracking-normal text-[12pt] md:text-[14pt]">
          {text}
        </motion.span>
        <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-[#333333] origin-center" />
      </motion.div>
    </a>
  );
}

function HorizontalScrollGallery({ items, type }: { items: any[], type: 'music' | 'design' }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ left: false, right: true });
  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 20;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 20;
      setScrollState({ left: !isAtStart, right: !isAtEnd });
    }
  };
  return (
    <div className="relative group">
      <div className={`absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none bg-gradient-to-r from-white to-transparent ${scrollState.left ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute right-0 top-0 bottom-0 w-16 z-20 pointer-events-none bg-gradient-to-l from-white to-transparent ${scrollState.right ? 'opacity-100' : 'opacity-0'}`} />
      <div ref={scrollRef} onScroll={handleScroll} className="flex flex-nowrap overflow-x-auto gap-8 md:gap-12 pb-16 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((work) => (
          <motion.div key={work.id} className="group/item flex flex-col items-center gap-4 snap-start shrink-0 basis-auto w-auto">
            <a href={`/work-slug/${work.slug}`} className="block">
              <div className="relative shadow-2xl bg-white border border-[#333333]/5 overflow-hidden h-[220px] md:h-[300px] w-auto">
                <img src={encodeURI(`/images/${type.toUpperCase()} WORKS/${work.filename}`)} alt={work.title} className="h-full w-auto object-cover transition-transform duration-500 group-hover/item:scale-105" />
              </div>
              <div className="font-['Mobo'] px-1 mt-6 text-center">
                <p className="text-[11pt] md:text-[12.2pt] hover:opacity-60 transition-opacity leading-relaxed tracking-wider mb-4">{work.title}</p>
              </div>
            </a>
            {type === 'music' && (
              <div className="flex justify-center gap-6 text-[22px] md:text-[26px] opacity-70">
                <motion.a href={work.soundcloud} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }} className="hover:text-[#ff3300] transition-colors"><FaSoundcloud /></motion.a>
                <motion.a href={work.youtube} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }} className="hover:text-[#ff0000] transition-colors"><FaYoutube /></motion.a>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <motion.a href={`/work-type/${type}`} className="absolute -bottom-2 right-0 z-30 group flex flex-col items-end">
        <div className="flex items-center gap-2 font-['Bahnschrift'] text-[9.5pt] tracking-[0.2em] text-[#333333]/60 group-hover:text-[#333333] transition-colors duration-300 uppercase">
          VIEW ALL <span className="text-[12pt] mb-0.5">→</span>
        </div>
        <motion.div className="h-[1px] bg-[#333333] w-full origin-right" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />
      </motion.a>
    </div>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeaderBg, setShowHeaderBg] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowHeaderBg(latest > 300);
  });

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#333333] relative overflow-x-hidden">
      
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 w-full h-20 z-[100] flex items-center justify-between px-6 md:px-10 overflow-hidden">
        <motion.div animate={{ opacity: showHeaderBg ? 1 : 0 }} className="hidden md:block absolute inset-0 z-[-2]" style={{ backgroundImage: "url('/images/top_logo.png')", backgroundSize: 'cover', backgroundPosition: 'bottom center' }} />
        <motion.div animate={{ opacity: showHeaderBg ? 0.7 : 0 }} className="hidden md:block absolute inset-0 z-[-1] bg-white backdrop-blur-md shadow-sm" />
        <nav className="hidden md:flex gap-8 items-center h-full">
          <AnimatedLink href="#about" text="ABOUT" />
          <AnimatedLink href="#works" text="WORKS" />
          <AnimatedLink href="#news" text="NEWS" />
          <AnimatedLink href="#contact" text="CONTACT" />
        </nav>
        <div className="hidden md:flex gap-10 text-[28px] items-center h-full">
          <motion.a href="https://x.com/inaga_P" whileHover={{ scale: 1.1 }} target="_blank" rel="noopener noreferrer" className="p-1 transition-colors hover:text-[#333333]/60"><FaXTwitter /></motion.a>
          <motion.a href="https://soundcloud.com/sgextgl4iyy9" whileHover={{ scale: 1.1 }} target="_blank" rel="noopener noreferrer" className="p-1 transition-colors hover:text-[#333333]/60"><FaSoundcloud /></motion.a>
          <motion.a href="https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" whileHover={{ scale: 1.1 }} target="_blank" rel="noopener noreferrer" className="p-1 transition-colors hover:text-[#333333]/60"><FaYoutube /></motion.a>
          <motion.a href="https://www.instagram.com/inaga__inaga" whileHover={{ scale: 1.1 }} target="_blank" rel="noopener noreferrer" className="p-1 transition-colors hover:text-[#333333]/60"><FaInstagram /></motion.a>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-[110] fixed top-6 right-6 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none">
          <motion.span animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-8 h-0.5 bg-[#333333] block" />
          <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-8 h-0.5 bg-[#333333] block" />
          <motion.span animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-8 h-0.5 bg-[#333333] block" />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-0 bg-white/40 backdrop-blur-3xl z-[105] flex flex-col items-center justify-center gap-16">
              <nav className="flex flex-col items-center gap-10 text-[18pt] font-['Bahnschrift'] tracking-widest text-[#333333]">
                <AnimatedLink href="#about" text="ABOUT" onClick={() => setIsOpen(false)} />
                <AnimatedLink href="#works" text="WORKS" onClick={() => setIsOpen(false)} />
                <AnimatedLink href="#news" text="NEWS" onClick={() => setIsOpen(false)} />
                <AnimatedLink href="#contact" text="CONTACT" onClick={() => setIsOpen(false)} />
              </nav>
              <div className="flex gap-10 text-[32px] text-[#333333]/80">
                <motion.a href="https://x.com/inaga_P" whileHover={{ scale: 1.1 }} target="_blank" rel="noopener noreferrer"><FaXTwitter /></motion.a>
                <motion.a href="https://soundcloud.com/sgextgl4iyy9" whileHover={{ scale: 1.1 }} target="_blank" rel="noopener noreferrer"><FaSoundcloud /></motion.a>
                <motion.a href="https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" whileHover={{ scale: 1.1 }} target="_blank" rel="noopener noreferrer"><FaYoutube /></motion.a>
                <motion.a href="https://www.instagram.com/inaga__inaga" whileHover={{ scale: 1.1 }} target="_blank" rel="noopener noreferrer"><FaInstagram /></motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="relative z-10">

        {/* 🟢 ファーストビュー：スマホでは高さ制限を解除 (h-auto) し、画像の高さなりに表示 */}
        <main className="h-auto md:min-h-screen w-full flex flex-col justify-start md:justify-center items-center bg-white overflow-hidden">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="w-full flex items-center justify-center">
            <img src="/images/top_logo_smartphone.png" alt="inaga" className="block md:hidden w-full h-auto object-cover self-start" />
            <img src="/images/top_logo.png" alt="inaga" className="hidden md:block w-full h-auto object-cover" />
          </motion.div>
        </main>
        
        {/* メインロゴ */}
        {/* <main className="min-h-screen w-full flex flex-col justify-start md:justify-center items-center bg-white overflow-hidden">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="w-full flex items-center justify-center">
            <img src="/images/top_logo_smartphone.png" alt="inaga" className="block md:hidden w-full h-auto object-cover self-start" />
            <img src="/images/top_logo.png" alt="inaga" className="hidden md:block w-full h-auto object-cover" />
          </motion.div>
        </main> */}

        {/* 🟢 ABOUT（余白を削減: ptのみ残しpbを小さく） */}
        <section id="about" className="max-w-4xl mx-auto pt-[40px] md:pt-[60px] pb-[10px] px-6 flex flex-col justify-center text-left scroll-mt-24">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-8 tracking-widest uppercase">ABOUT</h2>
            <div className="font-['Mobo'] text-[9.5pt] md:text-[12.2pt] leading-[2.1] tracking-[0.12em]">
              <p className="text-[32pt] md:text-[45.7pt] font-['Mobo-bold'] leading-tight my-10 tracking-widest -ml-1 md:-ml-2">いなが</p>
              <p>2004年11月24日生まれの21歳。札幌在住。</p>
              <p>音楽やグラフィックデザインを制作。</p>
              <p>北海道大学工学部情報エレクトロニクス学科所属。</p>
            </div>
          </motion.div>
        </section>

        {/* 🟢 プレイヤーセクション（SoundCloudを削除し、上下余白を極小に） */}
        <section className="w-full py-[10px]">
          <VisualizerStyle2 />
        </section>

        {/* 🟢 WORKS（余白を削減: ptを小さく設定） */}
        <section id="works" className="max-w-4xl mx-auto pt-[20px] pb-[60px] px-6 flex flex-col justify-center text-left scroll-mt-24">
          <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-12 tracking-widest uppercase">WORKS</h2>
          <div className="mb-16">
            <h3 className="text-[16pt] font-['Bahnschrift'] mb-8 tracking-widest border-b border-[#333333]/20 pb-2 uppercase">MUSIC</h3>
            <HorizontalScrollGallery items={musicWorks} type="music" />
          </div>
          <div>
            <h3 className="text-[16pt] font-['Bahnschrift'] mb-8 tracking-widest border-b border-[#333333]/20 pb-2 uppercase">DESIGN</h3>
            <HorizontalScrollGallery items={designWorks} type="design" />
          </div>
        </section>

        {/* NEWS */}
        <section id="news" className="max-w-4xl mx-auto py-[60px] px-6 min-h-[40vh] flex flex-col justify-center text-left scroll-mt-24">
          <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-8 tracking-widest uppercase">NEWS</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/5 overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto p-8 space-y-6">
              {newsData.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row md:gap-8 border-b border-[#333333]/10 pb-4 last:border-0 font-['Mobo']">
                  <span className="font-['Bahnschrift'] opacity-70 w-32 tracking-widest text-[9.5pt] md:text-[10pt] shrink-0">{item.date}</span>
                  <div className="flex flex-col gap-2">
                    <span className="text-[9.5pt] md:text-[12.2pt] leading-[2.1] tracking-[0.12em tracking-wider">{item.content}</span>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[9pt] font-['Bahnschrift'] tracking-widest opacity-50 hover:opacity-100 underline underline-offset-4 transition-opacity w-fit uppercase">Visit Link →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="max-w-4xl mx-auto pt-[60px] pb-[170px] px-6 min-h-[40vh] flex flex-col justify-center text-left scroll-mt-24">
          <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-12 tracking-widest uppercase">CONTACT</h2>
          <div className="flex flex-col gap-10">
            <ContactLink href="mailto:inagainagainaga@gmail.com" icon={<FaRegEnvelope />} text="inagainagainaga@gmail.com" />
            <ContactLink href="https://x.com/inaga_P" icon={<FaXTwitter />} text="@inaga_P" />
          </div>
        </section>

      </div>

      {/* フッター */}
      <footer className="bg-[#333333] text-white py-24 flex flex-col items-center gap-10">
        <nav className="flex flex-wrap justify-center gap-8 text-[10pt] md:text-[12.2pt]">
          <motion.a href="#about" initial="initial" whileHover="hover" className="relative font-['Bahnschrift'] tracking-widest px-2 py-1 flex flex-col items-center">
            ABOUT
            <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-white origin-center" />
          </motion.a>
          <motion.a href="#works" initial="initial" whileHover="hover" className="relative font-['Bahnschrift'] tracking-widest px-2 py-1 flex flex-col items-center">
            WORKS
            <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-white origin-center" />
          </motion.a>
          <motion.a href="#news" initial="initial" whileHover="hover" className="relative font-['Bahnschrift'] tracking-widest px-2 py-1 flex flex-col items-center">
            NEWS
            <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-white origin-center" />
          </motion.a>
          <motion.a href="#contact" initial="initial" whileHover="hover" className="relative font-['Bahnschrift'] tracking-widest px-2 py-1 flex flex-col items-center">
            CONTACT
            <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-white origin-center" />
          </motion.a>
        </nav>
        <div className="text-[8pt] font-['Bahnschrift'] opacity-50 tracking-[0.3em] text-center px-6 uppercase leading-loose">
          © 2026 INAGA | DEVELOPED BY{" "}
          <a href="https://github.com/oganes-son/inaga-portfolio" target="_blank" rel="noopener noreferrer" className="no-underline hover:opacity-100 transition-opacity">
            OGANESSON
          </a>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none" title="BACK TO TOP">
          <img src={encodeURI("/images/footer_logo.png")} alt="BACK TO TOP" className="max-w-[200px] w-full px-6 opacity-60" />
        </button>
      </footer>
    </div>
  );
}