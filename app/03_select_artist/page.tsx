"use client";

import { useSearchParams } from "next/navigation";
import dataList from "@/app/database";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

function getImagePosition(i: number, selectedSong: number): string {
  if (i === selectedSong) return "Center";
  const diff = (i - selectedSong + 3) % 3;
  return diff === 1 ? "Right" : "Left";
}

function getImageTransform(i: number, selectedSong: number): string {
  // 고정된 위치 좌표 (중앙 기준, px 단위)
  const positions = {
    Left: -110,
    Center: 0,
    Right: 110
  };
  
  // 초기 위치 (selectedSong=0일 때의 위치)
  const initialPosition = getImagePosition(i, 0);
  const initialX = positions[initialPosition as keyof typeof positions];
  
  // 목표 위치 (현재 selectedSong 기준)
  const targetPosition = getImagePosition(i, selectedSong);
  const targetX = positions[targetPosition as keyof typeof positions];
  
  // 초기 위치에서 목표 위치까지의 이동 거리
  const translateX = targetX - initialX;
  
  return `translateX(${translateX}px)`;
}

export default function SelectArtistPage() {
  const searchParams = useSearchParams();
  const indexParameter = searchParams.get("index");
  const index = parseInt(indexParameter || "0", 10);
  const [tab, setTab] = useState<"artist" | "genreInfo">("artist");
  const [selectedSong, setSelectedSong] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current || !dataList[index].sound[selectedSong]) return;

    const audio = audioRef.current;
    const src = dataList[index].sound[selectedSong];

    if (audio.src !== src) {
      audio.src = src;
      audio.load();
    }

    const handleCanPlay = () => {
      audio.play().catch((err: unknown) => {
        console.error("Play error:", err);
      });
    };

    if (audio.readyState >= 3) {
      handleCanPlay();
    } else {
      audio.addEventListener("canplaythrough", handleCanPlay, { once: true });
    }

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
    };
  }, [selectedSong, index]);

  return (
    <div className="w-[360px] h-[800px] bg-[#111111] text-white mx-auto relative">
        <Link href="/02_select_genre" className="absolute top-4 left-4 flex items-center gap-2 text-[#787878] T3_12_DB">
          ↩︎ GENRE
        </Link>
        <div className="flex flex-col items-center pt-16 px-6">
          <div className="relative">
            <img src="/img/Title Frame.png" alt="Title Frame"></img>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h1 className="T1_20_DB text-center">{dataList[index].genre}</h1>
              <p className="B2_16_DR">{dataList[index].year}</p>
            </div>
          </div>
        </div>

        {/* 탭 버튼 */}
        <div className="flex justify-center mt-8 T4_10_DB">
          <div className="flex border-[2px] border-[#787878] whitespace-nowrap">
            <button 
              onClick={() => setTab("artist")} 
              className={`w-1/2 px-4 py-2 border-r border-[#787878] flex items-center justify-center ${
                tab === "artist" 
                  ? "bg-[#556B2F] text-[#BAEE2A]" 
                  : "bg-[#111111] text-[#787878]"
              }`}
            >
              ARTIST
            </button>
            <button 
              onClick={() => setTab("genreInfo")} 
              className={`w-1/2 px-4 py-2 flex items-center justify-center ${
                tab === "genreInfo" 
                  ? "bg-[#556B2F] text-[#BAEE2A]" 
                  : "bg-[#111111] text-[#787878]"
              }`}
            >
              GENRE INFO
            </button>
          </div>
        </div>

        {/* 탭 내용 */}
        <div className="flex items-center justify-center relative h-60">
          {dataList[index].artistImage.map((image: string, i: number) => {
            const targetPosition = getImagePosition(i, selectedSong);
            const initialPosition = getImagePosition(i, 0);
            const transform = getImageTransform(i, selectedSong);
            
            const fixedPosition = initialPosition === "Center" 
              ? "left-1/2" 
              : initialPosition === "Left" 
              ? "left-8" 
              : "right-8";
            
            return (
              <img 
                key={i}
                src={image}
                alt={dataList[index].artist[i]}
                className={`transition-all duration-500 ease-in-out absolute ${fixedPosition} ${
                  targetPosition === "Center" 
                    ? "z-10 saturate-100" 
                    : "saturate-0 scale-90"
                }`}
                style={{
                  transform: initialPosition === "Center" 
                    ? `${transform} translateX(-50%)` 
                    : transform
                }}
              />
            );
          })}
        </div>

        {tab === "artist" ? (
          <div className="flex flex-col gap-0 mt-4">
            {dataList[index].artist.map((artist: string, i: number) => {
              const isSelected = getImagePosition(i, selectedSong) === "Center";
              return (
                <div 
                  key={i} 
                  className={`text-left cursor-pointer ${
                    isSelected 
                      ? "bg-[#556B2F] text-[#BAEE2A]" 
                      : "bg-transparent text-white"
                  }`}
                  onClick={() => setSelectedSong(i)}
                >
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="flex-1">
                      <p className="T3_12_DB">{dataList[index].song[i]}</p>
                      <p className="C3_12_DR">{artist}</p>
                    </div>
                    {isSelected && (
                      <Link
                        href={`/04_game?index=${index}&song=${i}`}
                        className="px-3 py-1 border-2 border-[#BAEE2A] text-[#BAEE2A] flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img src="/img/icon_game.svg" alt="game" className="scale-[1.2] mb-1"></img>
                        <p className="font-dogica-pixel text-[10px]">GAME</p>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-4">
            <p className="B3_14_G9">{dataList[index].GenreInfo}</p>
          </div>
        )}
        <audio ref={audioRef} />
    </div>
  )
}