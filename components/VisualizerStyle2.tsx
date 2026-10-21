"use client";
import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaSoundcloud, FaYoutube, FaBackwardStep, FaForwardStep } from 'react-icons/fa6';
import { SiNiconico, SiSpotify, SiApplemusic, SiAmazonmusic } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';
import { workImageUrl, mp3Url, displayFilename } from '@/lib/works';
import type { Work, PlayerTrack } from '@/lib/works';

const formatTime = (time: number) => {
  if (isNaN(time) || time === Infinity) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SNS_ICONS = [
  { key: "soundcloud", Icon: FaSoundcloud },
  { key: "youtube",    Icon: FaYoutube    },
  { key: "niconico",   Icon: SiNiconico   },
  { key: "spotify",    Icon: SiSpotify    },
  { key: "appleMusic", Icon: SiApplemusic },
  { key: "amazonMusic",Icon: SiAmazonmusic},
];

const PC_CANVAS_HEIGHT = 64;  // PC: シークバーの上下に広がる高さ（px）
const SP_CANVAS_HEIGHT = 32;  // SP: 縦幅を小さく
const NUM_POINTS = 80;        // 波形サンプル点数
const USABLE_BINS = 120;      // 使用する周波数ビン数（低〜中域を重視）
const RESTART_THRESHOLD = 3;  // 前へボタン: 再生位置がこの秒数より後なら曲の頭に戻る

const pad2 = (n: number) => String(n).padStart(2, "0");

export const VisualizerStyle2 = ({ musicWorks, playerTracks }: { musicWorks: Work[]; playerTracks: PlayerTrack[] }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seekbarCanvasRef = useRef<HTMLCanvasElement>(null);

  // アドミンでチェックを入れた曲だけ、並び順どおりに再生
  const tracks = playerTracks
    .filter((t) => t.enabled && t.mp3Filename)
    .map((t) => {
      const work = musicWorks.find((w) => w.slug === t.slug);
      return { ...t, work, title: work?.title ?? displayFilename(t.mp3Filename).replace(/\.[^.]+$/, "") };
    });
  const isPlaylist = tracks.length > 1;

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const autoplayRef = useRef(false);
  const isFirstLoadRef = useRef(true);

  const { analyser, isReady, initAudioContext, resumeAudioContext } = useAudioVisualizer(audioRef);

  const track = tracks[Math.min(index, tracks.length - 1)];
  const work = track?.work;

  // ユーザー操作時に AudioContext を準備（ブラウザの自動再生制限対策）
  const prepareAudio = () => {
    if (!isReady) initAudioContext();
    resumeAudioContext();
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    prepareAudio();
    if (audio.paused) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  };

  const goTo = (i: number, play: boolean) => {
    if (tracks.length === 0) return;
    autoplayRef.current = play;
    setIndex((i + tracks.length) % tracks.length);
    setCurrentTime(0);
    setDuration(0);
  };

  const handlePrev = () => {
    const audio = audioRef.current;
    prepareAudio();
    if (audio && audio.currentTime > RESTART_THRESHOLD) {
      audio.currentTime = 0;
      return;
    }
    goTo(index - 1, isPlaying);
  };

  const handleNext = () => {
    prepareAudio();
    goTo(index + 1, isPlaying);
  };

  const handleSelect = (i: number) => {
    prepareAudio();
    if (i === index) { togglePlay(); return; }
    goTo(i, true);
  };

  // 曲の最後まで来たら次の曲へ（最後の曲の後は1曲目に戻る / 1曲だけならループ）
  const handleEnded = () => {
    const audio = audioRef.current;
    if (!isPlaylist && audio) {
      audio.currentTime = 0;
      audio.play().catch(() => setIsPlaying(false));
      return;
    }
    goTo(index + 1, true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 曲が切り替わったら読み込み直し、必要なら再生
  useEffect(() => {
    if (isFirstLoadRef.current) { isFirstLoadRef.current = false; return; }
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (autoplayRef.current) audio.play().catch(() => setIsPlaying(false));
  }, [index]);

  const updateDuration = () => {
    const audio = audioRef.current;
    if (audio?.duration && isFinite(audio.duration)) setDuration(audio.duration);
  };

  // ハイドレーション前に読み込みが終わっていた場合のイベント取りこぼし対策
  useEffect(() => {
    if ((audioRef.current?.readyState ?? 0) >= 1) updateDuration();
  }, []);

  // キャンバスサイズをコンテナに合わせる（ResizeObserver）
  useEffect(() => {
    const canvas = seekbarCanvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const w = canvas.offsetWidth;
      if (w > 0) {
        canvas.width = w;
        canvas.height = window.innerWidth >= 768 ? PC_CANVAS_HEIGHT : SP_CANVAS_HEIGHT;
      }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // 波形アニメーション（スムーズ曲線・PC/SP両対応）
  useEffect(() => {
    const canvas = seekbarCanvasRef.current;
    if (!analyser || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let animId: number;

    // ミッドポイント補間で滑らかな曲線を描く
    const drawSmoothFill = (pts: [number, number][]) => {
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 0; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2;
        const my = (pts[i][1] + pts[i + 1][1]) / 2;
        ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
      }
      ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
    };

    const draw = () => {
      animId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const W = canvas.width;
      const H = canvas.height;
      const centerY = H / 2;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(51, 51, 51, 0.09)';

      // 高さの差を強調するため v^1.8 でコントラストを増幅
      const heights = Array.from({ length: NUM_POINTS }, (_, i) => {
        const binIdx = Math.floor(i * USABLE_BINS / NUM_POINTS);
        const v = dataArray[binIdx] / 255;
        return Math.pow(v, 1.8) * (centerY - 2);
      });

      const upperPts: [number, number][] = [
        [0, centerY],
        ...heights.map((h, i) => [(i / (NUM_POINTS - 1)) * W, centerY - h] as [number, number]),
        [W, centerY],
      ];
      const lowerPts: [number, number][] = [
        [0, centerY],
        ...heights.map((h, i) => [(i / (NUM_POINTS - 1)) * W, centerY + h] as [number, number]),
        [W, centerY],
      ];

      ctx.beginPath();
      drawSmoothFill(upperPts);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      drawSmoothFill(lowerPts);
      ctx.closePath();
      ctx.fill();
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [analyser]);

  if (!track) return null;

  return (
    <div className="relative w-full min-h-[600px] md:min-h-[500px] bg-white overflow-hidden flex items-center justify-center py-12">
      <audio
        ref={audioRef}
        src={mp3Url(track.mp3Filename)}
        crossOrigin="anonymous"
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={updateDuration}
        onDurationChange={updateDuration}
        onCanPlay={updateDuration}
      />
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full mix-blend-multiply pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col md:flex-row items-center md:items-start gap-12 pointer-events-none">

        {/* アートワーク（曲の切り替え時にフェード） */}
        <div className="relative shrink-0 w-[240px] h-[240px] md:w-[280px] md:h-[280px] shadow-2xl bg-white pointer-events-auto group">
          <AnimatePresence mode="wait">
            {work && (
              <motion.img
                key={track.mp3Filename + index}
                src={workImageUrl(work.filename, 'music')}
                alt={work.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
          <button onClick={togglePlay} aria-label={isPlaying ? "一時停止" : "再生"}
            className="hidden md:flex absolute inset-0 items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? <FaPause className="text-white text-5xl" /> : <FaPlay className="text-white text-5xl ml-2" />}
          </button>
        </div>

        {/* テキスト・コントロール */}
        <div className="flex flex-col text-[#333333] w-full pointer-events-auto items-center md:items-start">
          <h2 className="text-[18pt] md:text-[24pt] font-['Mobo-bold'] leading-tight tracking-wider mb-2 md:-ml-[1.5px] text-center md:text-left">
            {track.title}
          </h2>
          <p className="text-[10pt] font-['Bahnschrift'] tracking-[0.3em] opacity-40 mb-6 md:mb-10 uppercase">
            INAGA{isPlaylist && <span className="ml-4">{pad2(index + 1)} / {pad2(tracks.length)}</span>}
          </p>

          {/* シークバー + 波形ビジュアライザー */}
          <div className="w-full max-w-md mb-0 md:mb-6 flex flex-col gap-2">
            {/* 波形キャンバスとシークバーを重ねるコンテナ */}
            <div className="relative h-[32px] md:h-[64px]">
              {/* 波形キャンバス（PC/SP両対応） */}
              <canvas
                ref={seekbarCanvasRef}
                className="absolute w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              />
              {/* シークバー（中央に配置） */}
              <input
                type="range" min="0" max={duration > 0 ? duration : 100} value={currentTime} onChange={handleSeek}
                aria-label="再生位置"
                className="absolute w-full h-[2px] appearance-none cursor-pointer accent-[#333333]"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: 0,
                  zIndex: 10,
                  background: `linear-gradient(to right, #333333 ${(currentTime / (duration || 1)) * 100}%, #eee ${(currentTime / (duration || 1)) * 100}%)`,
                }}
              />
            </div>
            <div className="flex justify-between font-['Bahnschrift'] text-[9pt] opacity-40">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* 再生コントロール
              スマホ: 常に表示（前へ/次へは複数曲のときのみ）
              PC: 複数曲のときのみ表示（1曲のときはアートワークのホバーで再生） */}
          <div className={`${isPlaylist ? "flex" : "flex md:hidden"} items-center justify-center md:justify-start gap-10 md:gap-8 w-full mb-8 md:mb-6`}>
            {isPlaylist && (
              <button onClick={handlePrev} aria-label="前の曲"
                className="text-[18pt] md:text-[14pt] opacity-70 hover:opacity-40 active:scale-90 transition">
                <FaBackwardStep />
              </button>
            )}
            <button onClick={togglePlay} aria-label={isPlaying ? "一時停止" : "再生"}
              className="text-[32pt] md:text-[20pt] text-[#333333] hover:opacity-60 active:scale-90 transition">
              {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
            </button>
            {isPlaylist && (
              <button onClick={handleNext} aria-label="次の曲"
                className="text-[18pt] md:text-[14pt] opacity-70 hover:opacity-40 active:scale-90 transition">
                <FaForwardStep />
              </button>
            )}
          </div>

          {/* SNSアイコン */}
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

          {/* トラックリスト（複数曲のとき） */}
          {isPlaylist && (
            <ol className="w-full max-w-md mt-8 border-t border-[#333333]/10 max-h-[220px] overflow-y-auto [scrollbar-width:thin]">
              {tracks.map((t, i) => {
                const active = i === index;
                return (
                  <li key={t.mp3Filename + i}>
                    <button onClick={() => handleSelect(i)}
                      aria-current={active ? "true" : undefined}
                      className={`w-full flex items-center gap-4 py-2.5 border-b border-[#333333]/5 text-left transition-opacity ${active ? "opacity-100" : "opacity-45 hover:opacity-80"}`}>
                      <span className="font-['Bahnschrift'] text-[9pt] tracking-widest w-6 shrink-0">
                        {active && isPlaying ? <PlayingBars /> : pad2(i + 1)}
                      </span>
                      <span className={`flex-1 truncate text-[10pt] tracking-wider ${active ? "font-['Mobo-bold']" : "font-['Mobo']"}`}>
                        {t.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

// 再生中の曲に表示する小さなイコライザー
function PlayingBars() {
  return (
    <span className="inline-flex items-end gap-[2px] h-[10px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="w-[2px] bg-[#333333] block"
          animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} />
      ))}
    </span>
  );
}
