"use client";
import { motion } from "framer-motion";
import { FaXTwitter, FaSoundcloud, FaYoutube, FaInstagram } from "react-icons/fa6";

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
  
  // 🟢 作品データ：タイトルをファイル名（拡張子を除いたもの）に修正しました
  const musicWorks = [
    { id: 1, filename: "ALBUM　PARADIGM SHIFT.png", title: "ALBUM　PARADIGM SHIFT", date: "202X.XX.XX" },
    { id: 2, filename: "CYBER METROPLEX.png", title: "CYBER METROPLEX", date: "202X.XX.XX" },
    { id: 3, filename: "Fantasie Impromptu (Remix).png", title: "Fantasie Impromptu (Remix)", date: "202X.XX.XX" },
    { id: 4, filename: "Purify.png", title: "Purify", date: "202X.XX.XX" },
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

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#333333] relative overflow-x-hidden">
      
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 w-full h-20 bg-white z-50 flex items-center justify-between px-10 shadow-sm">
        <nav className="flex gap-8 text-[12.2pt]">
          <AnimatedLink href="#about" text="ABOUT" />
          <AnimatedLink href="#works" text="WORKS" />
          <AnimatedLink href="#news" text="NEWS" />
          <AnimatedLink href="#contact" text="CONTACT" />
        </nav>

        <div className="flex gap-6 text-[28px]">
          <a href="https://x.com/inaga_P" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaXTwitter /></a>
          <a href="https://soundcloud.com/sgextgl4iyy9" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaSoundcloud /></a>
          <a href="https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaYoutube /></a>
          <a href="https://www.instagram.com/inaga__inaga" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><FaInstagram /></a>
        </div>
      </header>

      <div className="relative z-10 pt-20">
        
        {/* ファーストビュー */}
        <main className="h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} className="w-full text-center">
            <img src="/images/top_logo.png" alt="inaga" className="w-full h-auto object-cover mb-6" />
          </motion.div>
        </main>

        {/* ABOUTセクション */}
        <section id="about" className="max-w-4xl mx-auto py-32 px-6 min-h-screen flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-left">
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-8 tracking-widest">ABOUT</h2>
            <div className="space-y-6 leading-relaxed font-['Mobo'] font-normal text-[12.2pt]">
              <p className="text-[45.7pt] font-['Mobo-bold'] leading-none mb-6">いなが</p>
              <p>2004年11月24日生まれの21歳。札幌在住。</p>
              <p>音楽やグラフィックデザインを制作。</p>
              <p>北海道大学工学部情報エレクトロニクス学科所属。</p>
            </div>
          </motion.div>
        </section>

        {/* WORKSセクション */}
        <section id="works" className="max-w-4xl mx-auto py-32 px-6 min-h-screen flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-left w-full">
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-12 tracking-widest">WORKS</h2>
            
            {/* MUSIC エリア */}
            <div className="mb-16">
              <h3 className="text-[16pt] font-['Bahnschrift'] mb-6 tracking-widest border-b border-[#333333]/20 pb-2">MUSIC</h3>
              <div className="flex overflow-x-auto gap-6 pb-6 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {musicWorks.map((work) => (
                  <div key={`music-${work.id}`} className="group relative overflow-hidden min-w-[280px] aspect-square bg-white rounded-2xl shadow-sm snap-start flex flex-col justify-end font-['Mobo'] text-[12.2pt] cursor-pointer border border-[#333333]/10">
                    <img src={`/images/MUSIC WORKS/${work.filename}`} alt={work.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-110" />
                    <div className="relative z-10 p-6 bg-gradient-to-t from-white via-white/80 to-transparent">
                      <p className="font-bold mb-1">{work.title}</p>
                      <p className="text-sm opacity-70">{work.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESIGN エリア */}
            <div>
              <h3 className="text-[16pt] font-['Bahnschrift'] mb-6 tracking-widest border-b border-[#333333]/20 pb-2">DESIGN</h3>
              <div className="flex overflow-x-auto gap-6 pb-6 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {designWorks.map((work) => (
                  <div key={`design-${work.id}`} className="group relative overflow-hidden min-w-[280px] aspect-square bg-white rounded-2xl shadow-sm snap-start flex flex-col justify-end font-['Mobo'] text-[12.2pt] cursor-pointer border border-[#333333]/10">
                    <img src={`/images/DESIGN WORKS/${work.filename}`} alt={work.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-110" />
                    <div className="relative z-10 p-6 bg-gradient-to-t from-white via-white/80 to-transparent">
                      <p className="font-bold mb-1">{work.title}</p>
                      <p className="text-sm opacity-70">グラフィックデザイン</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </section>

        {/* NEWSセクション */}
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

        {/* CONTACTセクション */}
        <section id="contact" className="max-w-4xl mx-auto py-32 px-6 min-h-[60vh] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h2 className="text-[21.3pt] font-['Bahnschrift'] font-normal mb-12 tracking-widest">CONTACT</h2>
            
            <div className="font-['Mobo'] font-normal text-[12.2pt]">
              <p className="mb-12 leading-relaxed">
                お仕事のご依頼やお問い合わせは、以下のボタンよりお気軽にご連絡ください。
              </p>
              
              {/* 🟢 ボタン形式のリンクエリア */}
              <div className="flex flex-wrap gap-8">
                {/* Mailボタン */}
                <a 
                  href="mailto:example@gmail.com" 
                  className="group flex items-center gap-4 text-[24pt] font-bold border-b-2 border-[#333333] pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all duration-300"
                >
                  <span className="font-['Bahnschrift']">Mail</span>
                  <motion.span 
                    className="text-[18pt]"
                    variants={{ initial: { x: 0 }, hover: { x: 10 } }}
                  >
                    →
                  </motion.span>
                </a>

                {/* Xボタン */}
                <a 
                  href="https://x.com/inaga_P" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 text-[24pt] font-bold border-b-2 border-[#333333] pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all duration-300"
                >
                  <span className="font-['Bahnschrift']">X</span>
                  <motion.span 
                    className="text-[18pt]"
                    variants={{ initial: { x: 0 }, hover: { x: 10 } }}
                  >
                    →
                  </motion.span>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

      </div>

      {/* フッター */}
      <footer className="bg-[#333333] text-white py-16 relative z-10 flex flex-col items-center gap-10">
        <nav className="flex flex-wrap justify-center gap-8 text-[12.2pt]">
          <FooterAnimatedLink href="#about" text="ABOUT" />
          <FooterAnimatedLink href="#works" text="WORKS" />
          <FooterAnimatedLink href="#news" text="NEWS" />
          <FooterAnimatedLink href="#contact" text="CONTACT" />
        </nav>
      </footer>

      {/* フッター画像 */}
      <div className="bg-[#333333] w-full flex justify-center pb-10 relative z-10">
        <img src="/images/footer_logo.png" alt="Footer decoration" className="max-w-[250px] w-full px-6 h-auto" />
      </div>

    </div>
  );
}