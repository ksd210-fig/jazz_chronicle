"use client";

import Link from "next/link";
import { useState } from "react";
import dataList from "@/app/database";

export default function SelectGenre() {
  const [index, setIndex] = useState(0);
  const currentData = dataList[index];

  // 이전/다음 장르로 이동
  const handlePrev = () => {
    setIndex((prev) => (prev - 1 < 0 ? dataList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1 >= dataList.length ? 0 : prev + 1));
  };

  // 정보 테이블 데이터
  const infoRows = [
    { label: "CITY", value: currentData.city },
    { label: "YEAR", value: currentData.year },
  ];


  return (
    <div className="page-container">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-gray">
        <img src="/img/icon_home.svg" alt="홈" className="w-4 h-4" />
        <span className="T3_12_DB">HOME</span>
      </Link>

      <div className="flex flex-col items-center pt-20 px-6">
        <h1 className="T1_20_DB mb-6 text-center">[ SELECT GENRE ]</h1>
        <img src={currentData.map} alt="map" className="w-full max-h-48 object-contain mt-12 mb-12" />

        {/* 정보 패널 */}
        <div className="w-full border-2 border-gray mb-4 clip-corner-2">
          {/* 제목 바 */}
          <div className="bg-green-press px-4 py-2 flex justify-center border-b border-gray">
            <h2 className="T2_16_DB text-green">{currentData.genre}</h2>
          </div>

          {/* 정보 테이블 */}
          <div className="relative px-4 py-3 bg-black C1_13_DR text-white">
            {/* 세로선 */}
            <div className="absolute left-[40%] top-0 bottom-0 border-l border-gray"></div>

            {/* 정보 행들 */}
            {infoRows.map((row, i) => (
              <div key={i} className="flex pb-2 mb-2">
                <div className="w-1/2 pr-2">
                  <span>{row.label}</span>
                </div>
                <div className="w-1/2 pl-2">
                  <span>{row.value}</span>
                </div>
              </div>
            ))}

            {/* IMPROV 행 */}
            <div className="flex">
              <div className="w-1/2 pr-2">
                <span>*IMPROV.</span>
              </div>
              <div className="w-1/2 pl-2 flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="C2_13_G7 text-white">
                    {i < currentData.improvisation ? "●" : "○"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray mb-4 text-left w-full">*IMPROVISATION=즉흥성</p>

      </div>
      
      {/* 네비게이션 버튼 */}
      <div className="absolute mt-4 left-1/2 transform -translate-x-1/2 flex items-center gap-6 T4_10_DB text-white text-center">
        <button 
          className="border-2 border-gray flex items-center justify-center p-3 clip-corner-2" 
          onClick={handlePrev} 
          type="button">
          <img src="/img/icon_arrow_left.svg" alt="이전" className="min-w-4 min-h-4 block" />
        </button>
        <Link 
          className="border-2 border-gray items-center justify-center px-4 py-3 clip-corner-2" 
          href={`/03_select_artist?index=${index}`}>
          SELECT
        </Link>
        <button 
          className="border-2 border-gray flex items-center justify-center p-3 clip-corner-2" 
          onClick={handleNext} 
          type="button">
          <img src="/img/icon_arrow_right.svg" alt="다음" className="min-w-4 min-h-4 block" />
        </button>
      </div>
    </div>
  );
}