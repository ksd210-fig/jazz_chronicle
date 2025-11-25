"use client";

import Link from "next/link";
import { useState } from "react";
import dataList from "@/app/database";

export default function SelectGenre() {
  const [index, setIndex] = useState(0);

  return(
    <div className="w-[360px] h-[800px] bg-[#111111] text-white mx-auto relative">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-[#787878]">
        <img src="/img/icon_home.svg" alt="home logo" className="w-4 h-4" />
        <span className="text-sm">HOME</span>
      </Link>
      <div className="flex flex-col items-center pt-20 px-6">
        <h1 className="text-2xl font-bold mb-6 text-center">[ Select Genre ]</h1>
        <img src={dataList[index].map} alt="map" className="w-full h-full mb-4" />
        
        {/* 정보 패널 */}
        <div className="w-full border-2 border-[#787878] bg-[#111111] mb-4">
          {/* 제목 바 */}
          <div className="bg-[#556B2F] px-4 py-2">
            <h2 className="text-[#BAEE2A] font-bold text-sm">{dataList[index].genre}</h2>
          </div>
          
          {/* 정보 테이블 */}
          <div className="px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm">CITY</span>
              <span className="text-white text-sm">{dataList[index].city}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm">YEAR</span>
              <span className="text-white text-sm">{dataList[index].year}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">*IMPROV.</span>
              <span className="text-white text-sm">
                {"●".repeat(dataList[index].improvisation)}{"◦".repeat(5 - dataList[index].improvisation)}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-[#787878] mb-4">*IMPROVISATION=즉흥성</p>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <button 
            className="px-4 py-2 bg-[#111111] border-2 border-[#787878] text-white font-bold text-center hover:bg-[#1a1a1a]"
            onClick={() => {
              const newIndex = index - 1;
              setIndex(newIndex < 0 ? dataList.length - 1 : newIndex);
            }}
          >
            ◀︎
          </button>
          <Link 
            className="px-6 py-2 bg-[#111111] border-2 border-[#787878] text-white font-bold text-center hover:bg-[#1a1a1a]"
            href={`/03_select_artist?index=${index}`}
          >
            SELECT
          </Link>
          <button 
            className="px-4 py-2 bg-[#111111] border-2 border-[#787878] text-white font-bold text-center hover:bg-[#1a1a1a]"
            onClick={() => {
              const newIndex = index + 1;
              setIndex(newIndex >= dataList.length ? 0 : newIndex);
            }}
          >
            ▶︎
          </button>
        </div>
      </div>
    </div>
  )
}