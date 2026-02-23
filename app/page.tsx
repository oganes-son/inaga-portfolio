"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { FaXTwitter, FaSoundcloud, FaYoutube, FaInstagram, FaRegEnvelope } from "react-icons/fa6";
/* 🟢 lib/works.ts から作品データとニュースデータをインポート */
import { musicWorks, designWorks, newsData } from "@/lib/works"; 

/* ================================================================
  1. デザイン調整用コンポーネント
  ================================================================
*/

// ヘッダー・スマホメニュー用のリンク
function AnimatedLink({ href, text, onClick }: { href: string; text: string; onClick?: () => void }) {
  return (
    <motion.a 
      href={href} 
      onClick={onClick}
      initial="initial" whileHover="hover" 
      className="relative group text-[#333333] font-['Bahnschrift'] text-[12.2pt] tracking-widest px-2 py-1 flex flex-col items-center cursor-pointer"
    >
      <motion.span variants={{ initial: { scale: 1 }, hover: { scale: 1.1 } }}>{text}</motion.span>
      <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-[#333333] origin-center" />
    </motion.a>
  );
}

// フッター専用リンク
function FooterAnimatedLink({ href, text }: { href: string; text: string }) {
  return (
    <motion.a href={href} initial="initial" whileHover="hover" className="relative group text-white font-['Bahnschrift'] text-[12.2pt] tracking-widest px-2 py-1 flex flex-col items-center">
      <motion.span variants={{ initial: { scale: 1 }, hover: { scale: 1.1 } }}>{text}</motion.span>
      <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[2px] bg-white origin-center" />
    </motion.a>
  );
}

// CONTACTセクション用リンク
function ContactLink({ href, icon, text }: { href: string; icon: any; text: string }) {
  return (
    <motion.a 
      href={href} target="_blank" rel="noopener noreferrer"
      initial="initial" whileHover="hover" 
      className="relative group flex items-center gap-6 text-[12pt] md:text-[14pt] text-[#333333] w-fit"
    >
      <motion.div className="flex items-center gap-6" variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }} transition={{ duration: 0.2 }}>
        <span className="text-[16pt] md:text-[20pt]">{icon}</span>
        <span className="font-['Bahnschrift'] tracking-widest">{text}</span>
      </motion.div>
      <motion.span variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.2 }} className="absolute -bottom-1 w-full h-[1px] bg-[#333333] origin-center" />
    </motion.a>
  );
}

/* ================================================================
  2. WORKSギャラリーコンポーネント
  ================================================================
*/

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
      <div className={`absolute left-0 top-0 bottom-0 w-24 z-20 pointer-events-none transition-opacity duration-500 bg-gradient-to-r from-[#f4f7f6] to-transparent ${scrollState.left ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute right-0 top-0 bottom-0 w-24 z-20 pointer-events-none transition-opacity duration-500 bg-gradient-to-l from-[#f4f7f6] to-transparent ${scrollState.right ? 'opacity-100' : 'opacity-0'}`} />

      <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto gap-10 pb-16 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((work) => (
          <motion.div key={work.id} className="group/item flex flex-col items-center gap-4 snap-start shrink-0">
            <a href={`/work-slug/${work.slug}`} className="block w-full">
              <div className="relative rounded-lg shadow-2xl border border-[#333333]/5 bg-white overflow-hidden h-[300px]">
                <img 
                  src={encodeURI(`/images/${type.toUpperCase()} WORKS/${work.filename}`)} 
                  alt={work.title} 
                  className="h-full w-auto mx-auto object-contain transition-transform duration-500 group-hover/item:scale-105" 
                />
              </div>
              <div className="font-['Mobo'] px-1 mt-4 text-center">
                <p className="text-[12.2pt] hover:opacity-60 transition-opacity leading-relaxed">{work.title}</p>
              </div>
            </a>
            {type === 'music' && (
              <div className="flex justify-center gap-6 text-[28px] text-[#333333] px-1 w-full">
                <a href={work.soundcloud} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform inline-block"><FaSoundcloud /></a>
                <a href={work.youtube} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform inline-block"><FaYoutube /></a>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.a href={`/work-type/${type}`} className="absolute -bottom-2 right-0 z-30 group flex flex-col items-end">
        <div className="flex items-center gap-2 font-['Bahnschrift'] text-[9.5pt] tracking-[0.2em] text-[#333333]/60 group-hover:text-[#333333] transition-colors duration-300">
          VIEW ALL <span className="text-[12pt] mb-0.5">→</span>
        </div>
        <motion.div className="h-[1px] bg-[#333333] w-full origin-right" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />
      </motion.a>
    </div>
  );
}

/* ================================================================
  3. メインページ本体
  ================================================================
*/

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setShowHeader(latest > 60));

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#333333] relative overflow-x-hidden">
      
      <div className="fixed top-0 left-0 w-full h-12 z-[101]" onMouseEnter={() => setIsHoveringHeader(true)} />

      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: (showHeader || isHoveringHeader || isOpen) ? 0 : -100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        onMouseLeave={() => setIsHoveringHeader(false)}
        className="fixed top-0 left-0 w-full h-0 md:h-20 md:bg-white/90 md:backdrop-blur-md z-[100] flex items-center justify-between px-6 md:px-10 md:shadow-sm"
      >
        <nav className="hidden md:flex gap-8 items-center h-full">
          <AnimatedLink href="#about" text="ABOUT" />
          <AnimatedLink href="#works" text="WORKS" />
          <AnimatedLink href="#news" text="NEWS" />
          <AnimatedLink href="#contact" text="CONTACT" />
        </nav>

        <div className="hidden md:flex gap-10 text-[28px] items-center h-full">
          <a href="https://x.com/inaga_P" target="_blank" rel="noopener noreferrer" className="p-1 hover:scale-110 transition-transform flex items-center justify-center"><FaXTwitter /></a>
          <a href="https://soundcloud.com/sgextgl4iyy9" target="_blank" rel="noopener noreferrer" className="p-1 hover:scale-110 transition-transform flex items-center justify-center"><FaSoundcloud /></a>
          <a href="https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" target="_blank" rel="noopener noreferrer" className="p-1 hover:scale-110 transition-transform flex items-center justify-center"><FaYoutube /></a>
          <a href="https://www.instagram.com/inaga__inaga" target="_blank" rel="noopener noreferrer" className="p-1 hover:scale-110 transition-transform flex items-center justify-center"><FaInstagram /></a>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-[110] fixed top-6 right-6 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none">
          <motion.span animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-8 h-0.5 bg-[#333333] block" />
          <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-8 h-0.5 bg-[#333333] block" />
          <motion.span animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-8 h-0.5 bg-[#333333] block" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-white/40 backdrop-blur-xl z-[105] flex flex-col items-center justify-center"
            >
              <nav className="flex flex-col items-center gap-10 text-[18pt] font-['Bahnschrift'] tracking-widest text-[#333333]">
                <AnimatedLink href="#about" text="ABOUT" onClick={() => setIsOpen(false)} />
                <AnimatedLink href="#works" text="WORKS" onClick={() => setIsOpen(false)} />
                <AnimatedLink href="#news" text="NEWS" onClick={() => setIsOpen(false)} />
                <AnimatedLink href="#contact" text="CONTACT" onClick={() => setIsOpen(false)} />
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div className="relative z-10">
        
        <main className="min-h-screen w-full flex flex-col justify-start md:justify-center items-center bg-white overflow-hidden">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="w-full flex items-center justify-center">
            <img src="/images/top_logo_smartphone.png" alt="inaga" className="block md:hidden w-full h-auto object-cover self-start" />
            <img src="/images/top_logo.png" alt="inaga" className="hidden md:block w-full h-auto object-cover" />
          </motion.div>
        </main>

        {/* 🟢 ABOUT セクション */}
        <section id="about" className="max-w-4xl mx-auto py-[60px] px-6 flex flex-col justify-center text-left">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-8 tracking-widest">ABOUT</h2>
            <div className="space-y-6 font-['Mobo'] text-[12.2pt] leading-snug">
              <p className="text-[32pt] md:text-[45.7pt] font-['Mobo-bold'] leading-tight mt-4 mb-6">いなが</p>
              <p>2004年11月24日生まれの21歳。札幌在住。</p>
              <p>音楽やグラフィックデザインを制作。</p>
              <p>北海道大学工学部情報エレクトロニクス学科所属。</p>
            </div>
          </motion.div>
        </section>

        {/* 🟢 WORKS セクション */}
        <section id="works" className="max-w-4xl mx-auto py-[60px] px-6 flex flex-col justify-center text-left">
          <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-12 tracking-widest">WORKS</h2>
          <div className="mb-16">
            <h3 className="text-[16pt] font-['Bahnschrift'] mb-8 tracking-widest border-b border-[#333333]/20 pb-2">MUSIC WORKS</h3>
            <HorizontalScrollGallery items={musicWorks} type="music" />
          </div>
          <div>
            <h3 className="text-[16pt] font-['Bahnschrift'] mb-8 tracking-widest border-b border-[#333333]/20 pb-2">DESIGN WORKS</h3>
            <HorizontalScrollGallery items={designWorks} type="design" />
          </div>
        </section>

        {/* 🟢 NEWS セクション */}
        <section id="news" className="max-w-4xl mx-auto py-[60px] px-6 min-h-[40vh] flex flex-col justify-center text-left">
          <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-8 tracking-widest">NEWS</h2>
          <div className="bg-white/50 rounded-2xl shadow-sm backdrop-blur-sm overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-[#333333]/20">
              {newsData.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row md:gap-8 border-b border-[#333333]/10 pb-4 last:border-0 font-['Mobo']">
                  <span className="font-['Bahnschrift'] opacity-70 w-32 tracking-widest text-[10pt]">
                    {item.date}
                  </span>
                  <span className="text-[11pt] leading-relaxed">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:opacity-50 underline underline-offset-4 transition-opacity">
                        {item.content}
                      </a>
                    ) : (
                      item.content
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🟢 CONTACT セクション */}
        <section id="contact" className="max-w-4xl mx-auto py-[60px] px-6 min-h-[40vh] flex flex-col justify-center text-left">
          <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-12 tracking-widest">CONTACT</h2>
          <div className="flex flex-col gap-10">
            <ContactLink href="mailto:inagainagainaga@gmail.com" icon={<FaRegEnvelope />} text="inagainagainaga@gmail.com" />
            <ContactLink href="https://x.com/inaga_P" icon={<FaXTwitter />} text="@inaga_P" />
          </div>
        </section>

      </div>

      <footer className="bg-[#333333] text-white py-16 flex flex-col items-center gap-10">
        <nav className="flex flex-wrap justify-center gap-8 text-[12.2pt]">
          <FooterAnimatedLink href="#about" text="ABOUT" />
          <FooterAnimatedLink href="#works" text="WORKS" />
          <FooterAnimatedLink href="#news" text="NEWS" />
          <FooterAnimatedLink href="#contact" text="CONTACT" />
        </nav>
        <div className="text-[8pt] font-['Bahnschrift'] opacity-50 tracking-[0.3em] text-center px-6 uppercase">
          © 2026 INAGA | DEVELOPED BY OGANESSON
        </div>
        
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
          title="BACK TO TOP"
        >
          <img 
            src={encodeURI("/images/footer_logo.png")} 
            alt="BACK TO TOP" 
            className="max-w-[200px] w-full px-6 opacity-60" 
          />
        </button>
      </footer>
    </div>
  );
}