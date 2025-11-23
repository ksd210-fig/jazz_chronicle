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
        <h1 className="text-2xl font-bold mb-6 text-center">Select Genre</h1>
        <div>
          <p>Genre : {dataList[index].genre}</p>
          <p>City : {dataList[index].city}</p>
          <p>Year : {dataList[index].year}</p>
          <p>Improvisation : {"●".repeat(dataList[index].improvisation)}{"◦".repeat(5 - dataList[index].improvisation)}</p>
        </div>
        <p>*Improvisation=즉흥성</p>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button className="px-4 py-2 border-2 border-[#787878] font-bold text-center" onClick={() => {
            const newIndex = index - 1;
            setIndex(newIndex < 0 ? dataList.length - 1 : newIndex);
          }}>◀︎</button>
          <Link className="px-4 py-2 border-2 border-[#787878] font-bold text-center" href={`/03_select_artist?index=${index}`}>Next</Link>
          <button className="px-4 py-2 border-2 border-[#787878] font-bold text-center" onClick={() => {
            const newIndex = index + 1;
            setIndex(newIndex >= dataList.length ? 0 : newIndex);
            }}>▶︎</button>
        </div>
      </div>
    </div>
  )
}