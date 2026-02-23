// app/works/paradigm-shift/page.tsx
"use client";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSoundcloud, FaYoutube } from "react-icons/fa6";

export default function WorkDetail() {
  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#333333] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* 戻るボタン */}
        <a href="/#works" className="inline-flex items-center gap-2 font-['Bahnschrift'] opacity-50 hover:opacity-100 transition-opacity mb-12">
          <FaArrowLeft /> BACK TO GALLERY
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* 左：メイン画像 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <img 
              src="/images/MUSIC WORKS/ALBUM　PARADIGM SHIFT.png" 
              className="w-full rounded-lg shadow-2xl"
              alt="PARADIGM SHIFT"
            />
          </motion.div>

          {/* 右：解説テキスト */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-[28pt] font-['Mobo-bold'] mb-4 leading-tight">ALBUM<br/>PARADIGM SHIFT</h1>
            <p className="font-['Bahnschrift'] opacity-50 mb-8 tracking-widest text-[12pt]">MUSIC / ALBUM DESIGN</p>
            
            <div className="space-y-6 font-['Mobo'] leading-relaxed text-[11pt]">
              <p>作品の制作意図やコンセプトがここに入ります。めっちゃすごいすごいすごい！！サンプルとかおいても面白いかもね。</p>
              <p>使用ツール：お金, 時間, やる気, おいしいごはん</p>
            </div>

            <div className="mt-12 flex gap-8 text-[32px]">
              <a href="#" className="hover:scale-110 transition-transform"><FaSoundcloud /></a>
              <a href="#" className="hover:scale-110 transition-transform"><FaYoutube /></a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}