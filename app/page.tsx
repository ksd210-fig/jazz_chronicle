'use client';

import Link from "next/link";
import { useRef } from "react";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);

  return(
    <div className="w-[360px] h-[800px] bg-[url('/img/bg_main.png')] bg-cover bg-center text-white mx-auto relative">
      <img src="/img/jazz_logo.png" className="scale-68 absolute top-4 left-1/2 transform -translate-x-1/2"></img>
      
      <p className="T2_16_DB text-center text-[#787878] absolute top-70 left-1/2 transform -translate-x-1/2 whitespace-nowrap">HISTORY OF JAZZ</p>
      <video src="/img/window.mp4" autoPlay loop muted className="absolute top-79.5 left-1/2 transform -translate-x-1/2 object-cover scale-48"></video>
      
      <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2">
        <Link 
          href="/01_how_to_enjoy" 
          className="T1_20_DB px-4 py-4 border-3 border-[#BAEE2A] text-center shadow-[0_0_10px]">
            ENTER
        </Link>
      </div>
      
      <p className="T3_12_DB text-center text-[#787878] absolute bottom-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap">©2025 FIG.1 STUDIO</p>

      <audio ref={audioRef} src="/music/7-2 Giant Steps.m4a" autoPlay loop></audio>
    </div>
  )
}