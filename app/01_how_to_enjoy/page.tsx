"use client";

import Link from "next/link";

export default function HowToEnjoy() {
  return(
    <div className="w-[360px] h-[800px] bg-[#111111] text-white mx-auto relative">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-[#787878]">
        <img src="/img/icon_home.svg" alt="home logo" className="w-4 h-4" />
        <span className="text-sm">HOME</span>
      </Link>

      <div className="flex flex-col items-center pt-20 px-6">
        <h1 className="text-2xl font-bold mb-6 text-center">[ HOW TO ENJOY ]</h1>
        
        <img src="/img/icon_piano_white.svg" alt="piano logo" className="w-8 h-8 mb-8" />
        
        <div className="text-sm leading-relaxed text-center space-y-4 mb-12 font-galmuri">
          <p>
            재즈의 역사는<br/>
            '즉흥성'과 '대중성'의 사이에 있습니다.<br/>
            뉴올리언즈의 거리에서 시작된 비트는 <br/> 
            시카고, 뉴욕을 지나 미국 전역으로 번졌죠.
          </p>
          <p>
            시대의 흐름 속에서 재즈는<br/>
            다양한 스타일과 해석으로 변주되었습니다.<br/>
            이 페이지는 그 변화를<br/>
            장르와 시대별로 정리했습니다.
          </p>
          <p>
            재즈의 계보를 따라가며,<br/>
            즉흥의 역사를 살펴보세요.
          </p>
        </div>
      </div>

      <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2">
        <Link 
          href="/02_select_genre" 
          className="px-8 py-3 border-2 border-[#BAEE2A] font-bold text-center shadow-[0_0_10px]"
        >
          NEXT
        </Link>
      </div>
    </div>
  )
}
