import { useRef, useState, useCallback, type RefObject } from 'react';

export const useAudioVisualizer = (audioRef: RefObject<HTMLAudioElement | null>) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // 初回再生時に1度だけ作成（同じ audio 要素は src を変えてもそのまま使える）
  const initAudioContext = useCallback(() => {
    const audioElement = audioRef.current;
    if (!audioElement || audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const node = audioContext.createAnalyser();
      node.fftSize = 2048;

      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(node);
      node.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      setAnalyser(node);
    } catch (e) {
      console.error("AudioContext initialization failed:", e);
    }
  }, [audioRef]);

  const resumeAudioContext = useCallback(() => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  return { analyser, isReady: analyser !== null, initAudioContext, resumeAudioContext };
};
