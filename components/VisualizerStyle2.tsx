"use client";
import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaSoundcloud, FaYoutube } from 'react-icons/fa6';
import { SiNiconico, SiSpotify, SiApplemusic, SiAmazonmusic } from 'react-icons/si';
import { motion } from 'framer-motion';
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';
import { musicWorks, playerTrack } from '@/lib/works';
import type { Work } from '@/lib/works';

// 時間表示用ヘルパー：秒数を "0:00" 形式に変換
const formatTime = (time: number) => {
  if (isNaN(time) || time === Infinity) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// SNSアイコン定義（page.tsxと共通の仕様）
const SNS_ICONS = [
  { key: "soundcloud", Icon: FaSoundcloud },
  { key: "youtube",    Icon: FaYoutube    },
  { key: "niconico",   Icon: SiNiconico   },
  { key: "spotify",    Icon: SiSpotify    },
  { key: "appleMusic", Icon: SiApplemusic },
  { key: "amazonMusic",Icon: SiAmazonmusic},
];

export const VisualizerStyle2 = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { isReady, initAudioContext, resumeAudioContext } = useAudioVisualizer(audioRef.current);

  // playerTrack.slug から対応する音楽作品を検索
  const work: Work | undefined = musicWorks.find((w) => w.slug === playerTrack.slug);

  // 再生・一時停止の切り替え
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!isReady) initAudioContext();

    if (audioRef.current.paused) {
      audioRef.current.play();
      resumeAudioContext();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // シークバー操作：再生位置の変更
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 曲の秒数取得ロジック
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration)) setDuration(audio.duration);
    };
    const updateTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('canplay', updateDuration);
    audio.addEventListener('timeupdate', updateTime);

    if (audio.readyState >= 1) updateDuration();

    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('canplay', updateDuration);
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  return (
    /* スマホでは min-h-[600px] で余白を確保し、PCでは h-[500px] で固定 */
    <div className="relative w-full min-h-[600px] md:h-[500px] bg-white overflow-hidden flex items-center justify-center py-12 md:py-0">
      {/* 音声ソース: /music/{mp3Filename} */}
      <audio ref={audioRef} src={`/music/${playerTrack.mp3Filename}`} loop crossOrigin="anonymous" />
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full mix-blend-multiply pointer-events-none" />

      {/* コンテンツエリア */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col md:flex-row items-center gap-12 pointer-events-none">

        {/* 左側：アートワーク（playerTrackのslugに対応する作品画像） */}
        <div className="relative shrink-0 w-[240px] h-[240px] md:w-[280px] md:h-[280px] shadow-2xl bg-white pointer-events-auto group">
          {work && (
            <img
              src={encodeURI(`/images/MUSIC WORKS/${work.filename}`)}
              alt={work.title}
              className="w-full h-full object-cover"
            />
          )}
          <button onClick={togglePlay} className="hidden md:flex absolute inset-0 items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? <FaPause className="text-white text-5xl" /> : <FaPlay className="text-white text-5xl ml-2" />}
          </button>
        </div>

        {/* 右側：テキスト情報エリア */}
        <div className="flex flex-col text-[#333333] w-full pointer-events-auto items-center md:items-start">

          {/* タイトル・アーティスト名
              フォント: font-['Mobo-bold'] / サイズ: text-[18pt](スマホ) md:text-[24pt](PC)
              文字間: tracking-wider */}
          <h2 className="text-[18pt] md:text-[24pt] font-['Mobo-bold'] leading-tight tracking-wider mb-2 md:-ml-[1.5px]">
            {work?.title ?? ""}
          </h2>
          <p className="text-[10pt] font-['Bahnschrift'] tracking-[0.3em] opacity-40 mb-6 md:mb-10 uppercase">INAGA</p>

          {/* シークバー */}
          <div className="w-full max-w-md mb-0 md:mb-8 flex flex-col gap-2">
            <input
              type="range" min="0" max={duration > 0 ? duration : 100} value={currentTime} onChange={handleSeek}
              className="w-full h-[2px] bg-[#333333]/10 appearance-none cursor-pointer accent-[#333333]"
              style={{ background: `linear-gradient(to right, #333333 ${(currentTime / (duration || 1)) * 100}%, #eee ${(currentTime / (duration || 1)) * 100}%)` }}
            />
            <div className="flex justify-between font-['Bahnschrift'] text-[9pt] opacity-40">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* スマホ専用再生ボタン */}
          <div className="md:hidden flex justify-center w-full mb-8">
            <button onClick={togglePlay} className="text-[32pt] text-[#333333] active:scale-90 transition-transform">
              {isPlaying ? <FaPause /> : <FaPlay className="ml-2" />}
            </button>
          </div>

          {/* SNSアイコン: URLが入力されているものだけ表示
              アイコンサイズ: text-[26px]
              ホバー: スケール1.1倍・無彩色（opacity変化） */}
          <div className="flex gap-6 text-[26px] mt-2">
            {work && SNS_ICONS.map(({ key, Icon }) =>
              work[key as keyof Work] ? (
                <motion.a key={key} href={work[key as keyof Work] as string}
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="opacity-70 hover:opacity-40 transition-opacity">
                  <Icon />
                </motion.a>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
