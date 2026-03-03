"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSoundcloud, FaYoutube } from "react-icons/fa6";
import { SiNiconico, SiSpotify, SiApplemusic, SiAmazonmusic } from "react-icons/si";
import { musicWorks, designWorks } from "@/lib/works";

export default function WorkDetail() {
  const params = useParams();
  const slug = params.slug as string;

  // 全データから該当作品を検索
  const allWorks = [...musicWorks, ...designWorks];
  const work = allWorks.find((w) => w.slug === slug);
  const isMusic = musicWorks.some((w) => w.slug === slug);

  if (!work) return <div className="p-20 text-center font-['Bahnschrift']">Work not found.</div>;

  return (
    /* 【背景設定】bg-[#ffffff] (白) */
    <div className="min-h-screen bg-[#ffffff] text-[#333333] pt-20 pb-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* ヘッダーエリア：戻るボタン */}
        <header className="mb-12">
          <a href={`/work-type/${isMusic ? 'music' : 'design'}`} className="inline-flex items-center gap-2 font-['Bahnschrift'] text-[10pt] opacity-50 hover:opacity-100 transition-opacity mb-8 tracking-widest uppercase">
            <FaArrowLeft /> BACK TO LIST
          </a>
        </header>

        {/* メインレイアウト：PCは2カラム(grid-cols-2)、スマホは1カラム */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          
          {/* 左カラム：作品画像エリア */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full shadow-2xl bg-white border border-[#333333]/5 rounded-none overflow-hidden">
            <img src={encodeURI(`/images/${isMusic ? 'MUSIC' : 'DESIGN'} WORKS/${work.filename}`)} alt={work.title} className="w-full h-auto object-contain" />
          </motion.div>

          {/* 右カラム：テキスト情報エリア */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col">
            
            {/* 【タイトル】text-[28pt]〜 : サイズ / tracking-wider : 文字間隔 */}
            <h1 className="text-[28pt] md:text-[34pt] font-['Mobo-bold'] leading-tight tracking-wider mb-4 -ml-[1.5px]">
              {work.title}
            </h1>

            {/* 【カテゴリラベル】Music/Album Design または Design */}
            <div className="font-['Bahnschrift'] text-[11pt] md:text-[12pt] opacity-60 tracking-widest uppercase mb-12 border-b border-[#333333]/10 pb-2 w-fit">
              {isMusic ? 'MUSIC / ALBUM DESIGN' : 'DESIGN'}
            </div>

            {/* 🟢 【解説文】
                work.description が "" (空文字) の時は何も表示しない設定 
            */}
            {work.description && work.description !== "" && (
              <div className="font-['Mobo'] text-[11.5pt] leading-relaxed whitespace-pre-wrap opacity-80 tracking-wider mb-10">
                {work.description}
              </div>
            )}

            {/* 🟢 【復活：使用ツール欄】
                データ(lib/works.ts)に tools プロパティがある場合のみ表示
            */}
            {work.tools && (
              <div className="mb-12 py-6 border-t border-b border-[#333333]/5">
                {/* Tools Used
                    ラベル: font-['Bahnschrift'] / text-[9pt] / 文字間: tracking-[0.2em]
                    本文: font-['Mobo'] / text-[10.5pt] / 文字間: tracking-wider */}
                <p className="font-['Bahnschrift'] text-[9pt] opacity-40 tracking-[0.2em] mb-3 uppercase">Tools Used</p>
                <p className="font-['Mobo'] text-[10.5pt] opacity-70 tracking-wider leading-relaxed">
                  {work.tools}
                </p>
              </div>
            )}

            {/* 【SNSアイコン】
                サイズ: text-[28pt] / 透明度: opacity-70（通常）→ hover:opacity-40
                ホバー拡大: whileHover scale 1.1（無彩色のまま）
                表示条件: URLが入力されているアイコンのみ表示 */}
            {isMusic && (
              <div className="flex items-center gap-8 mt-4 text-[28pt]">
                {([
                  { key: "soundcloud", Icon: FaSoundcloud },
                  { key: "youtube",    Icon: FaYoutube    },
                  { key: "niconico",   Icon: SiNiconico   },
                  { key: "spotify",    Icon: SiSpotify    },
                  { key: "appleMusic", Icon: SiApplemusic },
                  { key: "amazonMusic",Icon: SiAmazonmusic},
                ] as const).map(({ key, Icon }) =>
                  work[key] ? (
                    <motion.a key={key} href={work[key]!} target="_blank" rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="opacity-70 hover:opacity-40 transition-opacity">
                      <Icon />
                    </motion.a>
                  ) : null
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}