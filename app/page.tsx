'use client';

import Link from "next/link";

export default function Home() {
  return(
    <div className="page-container bg-[url('/img/bg_main.png')] bg-cover bg-center">
      <img 
        src="/img/jazz_logo.png" 
        className="scale-68 absolute top-4 left-1/2 transform -translate-x-1/2"
        style={{ animation: 'blink 2s ease-in-out infinite' }}
      />
      
      <p className="T2_16_DB text-center text-gray absolute top-66 left-1/2 transform -translate-x-1/2 whitespace-nowrap">HISTORY OF JAZZ</p>
      <video 
        src="/img/window.mp4" autoPlay loop muted 
        className="absolute top-79.5 left-1/2 transform -translate-x-1/2 object-cover scale-45" 
        style={{ filter: 'drop-shadow(0 0 40px #BAEE2A99)' }}
      />
      
      <div 
        className="absolute bottom-38 left-1/2 transform -translate-x-1/2"
        style={{ filter: 'drop-shadow(0 0 10px #BAEE2A)' }}>
        <Link 
          href="/01_how_to_enjoy" 
          className="T1_20_DB px-5 py-2.5 border-3 border-green text-center bg-black block clip-corner-3">
            ENTER
        </Link>
      </div>
      
      <p className="T3_12_DB text-center text-gray absolute bottom-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap">©2025 FIG.1 STUDIO</p>

      <audio src="/music/7-2 Giant Steps.m4a" autoPlay loop />
    </div>
  )
}