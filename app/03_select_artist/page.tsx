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
    Left: -110,    // 왼쪽으로 120px
    Center: 0,     // 중앙
    Right: 110      // 오른쪽으로 120px
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
  const searchParams = useSearchParams(); // 1. useSearchParams로 URL의 쿼리 파라미터 읽기
  const indexParameter = searchParams.get("index"); // 2. "index" 파라미터의 값을 가져오기 (문자열로 반환됨)
  const index = parseInt(indexParameter || "0", 10); // 3. 문자열을 숫자로 변환 (없으면 0으로 기본값 설정, 10진수 변환)
  const [tab, setTab] = useState<"artist" | "genreInfo">("artist");
  const [selectedSong, setSelectedSong] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && dataList[index].sound[selectedSong]) {
      audioRef.current.src = dataList[index].sound[selectedSong];
      audioRef.current.play();
    }
  }, [selectedSong, index]);

  return (
    <div className="w-[360px] h-[800px] bg-[#111111] text-white mx-auto relative">
        <Link href="/02_select_genre" className="absolute top-4 left-4 flex items-center gap-2 text-[#787878]">
          ↩︎ GENRE
        </Link>
        <div className="flex flex-col items-center pt-20 px-6">
          <h1 className="text-2xl font-bold mb-6 text-center">{dataList[index].genre}</h1>
          <p>{dataList[index].year}</p>
        </div>

        {/* 탭 버튼 */}
        <div className="flex justify-center gap-4">
          <button onClick={() => setTab("artist")} className="border-2 border-[#BAEE2A] px-4 py-2">ARTIST</button>
          <button onClick={() => setTab("genreInfo")} className="border-2 border-[#BAEE2A] px-4 py-2">GENRE INFO</button>
        </div>

        {/* 탭 내용 */}
        <div className="flex items-center justify-center relative h-60">
          {dataList[index].artistImage.map((image: string, i: number) => {
            const targetPosition = getImagePosition(i, selectedSong);
            const initialPosition = getImagePosition(i, 0);
            const transform = getImageTransform(i, selectedSong);
            
            // 초기 위치 (selectedSong=0일 때의 위치) - 이미지가 시작하는 위치
            const fixedPosition = initialPosition === "Center" 
              ? "left-1/2" 
              : initialPosition === "Left" 
              ? "left-8" 
              : "right-8";
            
            return (
              <img 
                key={i}
                src={image} 
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
          <div className="flex flex-col gap-0">
            {dataList[index].artist.map((artist: string, i: number) => {
              const isSelected = getImagePosition(i, selectedSong) === "Center";
              return (
                <div 
                  key={i} 
                  className={`text-left cursor-pointer ${
                    isSelected ? "bg-[#556B2F] text-[#BAEE2A]" : "bg-transparent text-white"
                  }`}
                  onClick={() => setSelectedSong(i)}
                >
                  <div className="flex items-center justify-between px-4 py-2">
                    <div>
                      <p className="font-dogica-pixel">{dataList[index].song[i]}</p>
                      <p className="font-dogica-pixel">{artist}</p>
                    </div>
                    {isSelected && (
                      <button className="px-3 py-2 border-2 border-[#BAEE2A] text-[#BAEE2A] font-dogica-pixel">
                        GAME
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <p>{dataList[index].GenreInfo}</p>
          </div>
        )}
        <audio ref={audioRef} />
    </div>
  )
}