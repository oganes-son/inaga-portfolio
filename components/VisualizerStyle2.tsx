"use client";
import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaSoundcloud, FaYoutube } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';

// 時間表示用ヘルパー：秒数を "0:00" 形式に変換
const formatTime = (time: number) => {
  if (isNaN(time) || time === Infinity) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const VisualizerStyle2 = () => {
  // TypeScriptエラー対策：初期値 null を指定
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { analyser, isReady, initAudioContext, resumeAudioContext } = useAudioVisualizer(audioRef.current);
  const animationRef = useRef<number>(0);

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

  // 曲の秒数取得ロジック（0:00問題を解決）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
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

  // 背景波形の描画（Style 02: Spectrum Aurora）
  const render = () => {
    if (!canvasRef.current || !analyser) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      const activeBuffer = bufferLength * 0.7; 

      for (let i = 0; i < activeBuffer; i++) {
        const x = (i / activeBuffer) * canvas.width;
        const intensity = dataArray[i] / 255;
        const y = canvas.height - (intensity * canvas.height * 0.5) 
                  - (layer * 40) + (intensity > 0.01 ? Math.sin(i * 0.1 + Date.now() * 0.002 + layer) * 50 * intensity : 0);

        if (i === 0) ctx.lineTo(x, y);
        else {
          const prevX = ((i - 1) / activeBuffer) * canvas.width;
          const prevInt = dataArray[i-1] / 255;
          const prevY = canvas.height - (prevInt * canvas.height * 0.5) 
                        - (layer * 40) + (prevInt > 0.01 ? Math.sin((i - 1) * 0.1 + Date.now() * 0.002 + layer) * 50 * prevInt : 0);
          ctx.quadraticCurveTo(prevX, prevY, (prevX + x) / 2, (prevY + y) / 2);
        }
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = `rgba(51, 51, 51, ${0.04 - layer * 0.01})`;
      ctx.fill();
    }
    animationRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    if (isPlaying && isReady) render();
    else if (animationRef.current) cancelAnimationFrame(animationRef.current);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isPlaying, isReady]);

  return (
    /* 🟢 【修正】スマホでは min-h-[600px] で余白を確保し、PCでは h-[500px] で固定 */
    <div className="relative w-full min-h-[600px] md:h-[500px] bg-white overflow-hidden flex items-center justify-center py-12 md:py-0">
      <audio ref={audioRef} src="/music/Purify.mp3" loop crossOrigin="anonymous" />
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full mix-blend-multiply pointer-events-none" />

      {/* コンテンツエリア */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col md:flex-row items-center gap-12 pointer-events-none">
        
        {/* 左側：アートワーク（PCは従来通り画像ホバーで再生可能） */}
        <div className="relative shrink-0 w-[240px] h-[240px] md:w-[280px] md:h-[280px] shadow-2xl bg-white pointer-events-auto group">
          <img src="/images/MUSIC WORKS/Purify.png" alt="Purify" className="w-full h-full object-cover" />
          {/* 🟢 PC用再生ボタン：md:flex でPCのみ表示 */}
          <button onClick={togglePlay} className="hidden md:flex absolute inset-0 items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? <FaPause className="text-white text-5xl" /> : <FaPlay className="text-white text-5xl ml-2" />}
          </button>
        </div>

        {/* 右側：テキスト情報エリア */}
        <div className="flex flex-col text-[#333333] w-full pointer-events-auto items-center md:items-start">
          <h2 className="text-[18pt] md:text-[24pt] font-['Mobo-bold'] leading-tight tracking-wider mb-2">Purify</h2>
          <p className="text-[10pt] font-['Bahnschrift'] tracking-[0.3em] opacity-40 mb-10 uppercase">INAGA</p>
          
          {/* シークバー */}
          <div className="w-full max-w-md mb-8 flex flex-col gap-2">
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

          {/* 🟢 【スマホ専用再生ボタン】md:hidden でPCでは非表示、中央揃え */}
          <div className="md:hidden flex justify-center w-full mb-10">
            <button onClick={togglePlay} className="text-[32pt] text-[#333333] active:scale-90 transition-transform">
              {isPlaying ? <FaPause /> : <FaPlay className="ml-2" />}
            </button>
          </div>

          {/* SNSアイコン：間隔 gap-6 */}
          <div className="flex gap-6 text-[26px] opacity-70 mt-2">
            <motion.a href="#" whileHover={{ scale: 1.1 }} className="hover:text-[#ff3300] transition-colors"><FaSoundcloud /></motion.a>
            <motion.a href="#" whileHover={{ scale: 1.1 }} className="hover:text-[#ff0000] transition-colors"><FaYoutube /></motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};