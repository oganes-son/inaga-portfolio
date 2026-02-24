"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSoundcloud, FaYoutube } from "react-icons/fa6";
import { musicWorks, designWorks } from "@/lib/works";

export default function WorkDetail() {
  const params = useParams();
  const slug = params.slug as string;

  // 全作品データから該当するものを抽出
  const allWorks = [...musicWorks, ...designWorks];
  const work = allWorks.find((w) => w.slug === slug);
  const isMusic = musicWorks.some((w) => w.slug === slug);

  if (!work) return <div className="p-20 text-center">Work not found.</div>;

  return (
    /* 🟢 【調整：全体背景】白(#ffffff)に固定 */
    <div className="min-h-screen bg-[#ffffff] text-[#333333] pt-20 pb-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* 戻るボタン */}
        <header className="mb-12">
          <a href={`/work-type/${isMusic ? 'music' : 'design'}`} className="inline-flex items-center gap-2 font-['Bahnschrift'] text-[10pt] opacity-50 hover:opacity-100 transition-opacity mb-8 tracking-widest uppercase">
            <FaArrowLeft /> BACK TO LIST
          </a>
        </header>

        {/* 🟢 メインレイアウト（PCでは2カラム、スマホでは1カラム） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          
          {/* 左カラム：作品画像 
              rounded-none : 画像は角を丸くしない
          */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="w-full shadow-2xl bg-white border border-[#333333]/5 rounded-none overflow-hidden"
          >
            <img 
              src={encodeURI(`/images/${isMusic ? 'MUSIC' : 'DESIGN'} WORKS/${work.filename}`)} 
              alt={work.title} 
              className="w-full h-auto object-contain" 
            />
          </motion.div>

          {/* 右カラム：作品情報（画像に合わせて配置） */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }} 
            className="flex flex-col"
          >
            {/* 🟢 【調整：タイトル】
                text-[28pt]〜[36pt] : 大きめのサイズ
                tracking-wider : 文字間隔を空ける
            */}
            <h1 className="text-[28pt] md:text-[34pt] font-['Mobo-bold'] leading-tight tracking-wider mb-4">
              {work.title}
            </h1>

            {/* 🟢 【調整：カテゴリラベル】
                tracking-widest : かなり広めの文字間隔
                opacity-60 : 少し薄くして品良く
            */}
            <div className="font-['Bahnschrift'] text-[11pt] md:text-[12pt] opacity-60 tracking-widest uppercase mb-12 border-b border-[#333333]/10 pb-2 w-fit">
              {isMusic ? 'MUSIC / ALBUM DESIGN' : 'DESIGN'}
            </div>

            {/* 🟢 【調整：作品説明文】
                leading-relaxed : 行間をゆったりと
                tracking-wider : 文字間隔を空ける
            */}
            <div className="font-['Mobo'] text-[11.5pt] leading-relaxed whitespace-pre-wrap opacity-80 tracking-wider mb-10">
              {work.description || "作品のコンセプトや、ここに伝えたいことを記述します。"}
            </div>

            {/* 🟢 【調整：新設 使用ツール（TOOLS USED）】
                説明文の下に設置。データ(lib/works.ts)にtoolsがある場合のみ表示。
            */}
            {(work as any).tools && (
              <div className="mb-12 py-6 border-t border-b border-[#333333]/5">
                <p className="font-['Bahnschrift'] text-[9pt] opacity-40 tracking-[0.2em] mb-3 uppercase">Tools Used</p>
                <p className="font-['Mobo'] text-[10.5pt] opacity-70 tracking-wider leading-relaxed">
                  {(work as any).tools}
                </p>
              </div>
            )}

            {/* 🟢 【調整：SNSアイコン】
                画像に合わせて左揃え。 gap-8 : アイコン同士の距離
            */}
            <div className="flex items-center gap-8 mt-4 text-[28pt] text-[#333333]/80">
              {work.soundcloud && (
                <a href={work.soundcloud} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform hover:text-[#ff3300]">
                  <FaSoundcloud />
                </a>
              )}
              {work.youtube && (
                <a href={work.youtube} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform hover:text-[#ff0000]">
                  <FaYoutube />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}