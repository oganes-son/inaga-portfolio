"use client";
import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaSoundcloud, FaYoutube } from 'react-icons/fa6';
import { SiNiconico, SiSpotify, SiApplemusic, SiAmazonmusic } from 'react-icons/si';
import { motion } from 'framer-motion';
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';
import { musicWorks, playerTrack } from '@/lib/works';
import type { Work } from '@/lib/works';

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

export const VisualizerStyle2 = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seekbarCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { analyser, isReady, initAudioContext, resumeAudioContext } = useAudioVisualizer(audioRef.current);

  const work: Work | undefined = musicWorks.find((w) => w.slug === playerTrack.slug);

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 再生時間の取得
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

  return (
    <div className="relative w-full min-h-[600px] md:h-[500px] bg-white overflow-hidden flex items-center justify-center py-12 md:py-0">
      <audio ref={audioRef} src={`/music/${playerTrack.mp3Filename}`} loop crossOrigin="anonymous" />
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full mix-blend-multiply pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col md:flex-row items-center gap-12 pointer-events-none">

        {/* アートワーク */}
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

        {/* テキスト・コントロール */}
        <div className="flex flex-col text-[#333333] w-full pointer-events-auto items-center md:items-start">
          <h2 className="text-[18pt] md:text-[24pt] font-['Mobo-bold'] leading-tight tracking-wider mb-2 md:-ml-[1.5px]">
            {work?.title ?? ""}
          </h2>
          <p className="text-[10pt] font-['Bahnschrift'] tracking-[0.3em] opacity-40 mb-6 md:mb-10 uppercase">INAGA</p>

          {/* シークバー + 波形ビジュアライザー */}
          <div className="w-full max-w-md mb-0 md:mb-8 flex flex-col gap-2">
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

          {/* スマホ専用再生ボタン */}
          <div className="md:hidden flex justify-center w-full mb-8">
            <button onClick={togglePlay} className="text-[32pt] text-[#333333] active:scale-90 transition-transform">
              {isPlaying ? <FaPause /> : <FaPlay className="ml-2" />}
            </button>
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
        </div>
      </div>
    </div>
  );
};
