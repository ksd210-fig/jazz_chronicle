"use client";

import { useSearchParams } from "next/navigation";
import dataList from "../database";
import { useEffect, useRef, useState } from "react";

export default function Game() {
  const searchParams = useSearchParams();
  const index = parseInt(searchParams.get("index") || "0", 10);
  const songIndex = parseInt(searchParams.get("song") || "0", 10);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [countdown, setCountdown] = useState(3);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = (audio: HTMLAudioElement) => {
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          // 카운트다운이 끝나면 음악 재생
          audio.play().catch((err: unknown) => {
            console.error("Play error:", err);
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const src = dataList[index].sound[songIndex];
    audio.src = src;

    audio.load();
    startCountdown(audio);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [index, songIndex]);

  return (
    <div className="w-[360px] h-[800px] bg-[#111111] text-white mx-auto relative">
      <p>{dataList[index].artist[songIndex]}</p>
      <p>{dataList[index].song[songIndex]}</p>
      
      {/* 카운트다운 오버레이 */}
      {countdown > 0 && (
        <>
          <div className="absolute inset-0 bg-black opacity-50 z-50"></div>
          <div className="absolute inset-0 flex items-center justify-center z-[60]">
            <p className="text-8xl font-bold text-[#BAEE2A]">{countdown}</p>
          </div>
        </>
      )}
      
      <audio ref={audioRef} />
    </div>
  );
}