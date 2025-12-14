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
  const positions = { Left: -70, Center: 0, Right: 70 };
  const position = getImagePosition(i, selectedSong);
  return `translateX(${positions[position as keyof typeof positions]}px)`;
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
    <div className="page-container">
        <Link href="/02_select_genre" className="absolute top-4 left-4 flex items-center gap-2 text-gray T3_12_DB">
          ↩︎ GENRE
        </Link>
        <div className="flex flex-col items-center pt-16 px-6">
          <div className="relative">
            <img src="/img/title-frame.png" alt="타이틀 프레임" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h1 className="T1_20_DB text-center">{dataList[index].genre}</h1>
              <p className="B2_16_DR">{dataList[index].year}</p>
            </div>
          </div>
        </div>

        {/* 탭 버튼 */}
        <div className="flex justify-center mt-8 T4_10_DB">
          <div className="flex border-[2px] border-gray whitespace-nowrap clip-corner-2">
            <button 
              type="button"
              onClick={() => setTab("artist")} 
              className={`w-1/2 px-5 py-2 border-r-[2px] border-gray flex items-center justify-center ${
                tab === "artist" 
                  ? "bg-green-press text-green" 
                  : "bg-black text-gray"
              }`}
            >
              ARTIST
            </button>
            <button 
              type="button"
              onClick={() => setTab("genreInfo")} 
              className={`w-1/2 px-5 py-2 border-gray flex items-center justify-center ${
                tab === "genreInfo" 
                  ? "bg-green-press text-green" 
                  : "bg-black text-gray"
              }`}
            >
              GENRE INFO
            </button>
          </div>
        </div>

        {/* 탭 내용 */}
        {tab === "artist" ? (
          <>
            <div className="flex items-center justify-center relative h-60">
              <img 
                src="/img/img_pinlight.png" 
                alt="핀라이트" 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 h-70 z-0 pointer-events-none" 
              />
              {dataList[index].artistImage.map((image: string, i: number) => {
                const targetPosition = getImagePosition(i, selectedSong);
                const transform = getImageTransform(i, selectedSong);
                
                return (
                  <img 
                    key={i}
                    src={image}
                    alt={dataList[index].artist[i]}
                    className={`transition-all duration-500 ease-in-out absolute left-1/2 ${
                      targetPosition === "Center" 
                        ? "z-10 saturate-100 bottom-[-25px]" 
                        : "z-5 saturate-0 bottom-0"
                    }`}
                    style={{
                      transform: `${transform} translateX(-50%)`
                    }}
                  />
                );
              })}
            </div>
          <div className="flex flex-col gap-1 mt-20 uppercase px-6">
            {dataList[index].artist.map((artist: string, i: number) => {
              const isSelected = getImagePosition(i, selectedSong) === "Center";
              return (
                <div 
                  key={i} 
                  className={`text-left cursor-pointer border-2 clip-corner-2 ${
                    isSelected 
                      ? "bg-green-press text-green border-gray-press" 
                      : "bg-transparent text-white border-transparent"
                  }`}
                  onClick={() => setSelectedSong(i)}
                >
                  <div className="flex items-center py-2 px-2">
                    <div className="flex-1">
                      <p className="T3_12_DB mb-1">{dataList[index].song[i]}</p>
                      <p className="C3_12_DR">{artist}</p>
                    </div>
                    <div 
                      className={`px-2 border-2 flex flex-col items-center justify-center clip-corner-2 ${isSelected ? 'border-green' : 'border-transparent'}`} 
                      style={{ minWidth: '56px', minHeight: '40px', flexShrink: 0 }}>
                      {isSelected && (
                        <Link
                          href={`/04_game?index=${index}&song=${i}`}
                          className="text-green flex flex-col items-center justify-center w-full h-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img src="/img/icon_game.svg" alt="게임" className="scale-[1.2] mt-1 mb-1" />
                          <p className="font-dogica-pixel text-[10px]">GAME</p>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </>
        ) : (
          <div className="px-6 py-4">
            <p className="B3_14_G9 leading-[1.9]">{dataList[index].GenreInfo}</p>
          </div>
        )}
        <audio ref={audioRef} />
    </div>
  )
}