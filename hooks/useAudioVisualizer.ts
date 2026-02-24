import { useEffect, useRef, useState, useCallback } from 'react';

export const useAudioVisualizer = (audioElement: HTMLAudioElement | null) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isReady, setIsReady] = useState(false);

  const initAudioContext = useCallback(() => {
    // audioElement が null の場合は実行しない
    if (!audioElement || audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048; 

      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      setIsReady(true);
    } catch (e) {
      console.error("AudioContext initialization failed:", e);
    }
  }, [audioElement]);

  const resumeAudioContext = useCallback(() => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  return { analyser: analyserRef.current, isReady, initAudioContext, resumeAudioContext };
};