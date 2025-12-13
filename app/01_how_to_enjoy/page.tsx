"use client";

import Link from "next/link";

export default function HowToEnjoy() {
  return(
    <div className="page-container">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-gray">
        <img src="/img/icon_home.svg" alt="홈" className="w-4 h-4" />
        <span className="T3_12_DB">HOME</span>
      </Link>

      <div className="flex flex-col items-center pt-20 px-6">
        <h1 className="T1_20_DB mb-6 text-center whitespace-nowrap">[ HOW TO ENJOY ]</h1>
        
        <img src="/img/icon_piano_white.svg" alt="피아노" className="scale-120 mb-2" />
        
        <div className="B1_16_G9 leading-relaxed text-center whitespace-nowrap space-y-4 mb-12">
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

      <div 
      className="absolute bottom-44 left-1/2 transform -translate-x-1/2"
      style={{ filter: 'drop-shadow(0 0 10px #BAEE2A)' }}>
        <Link 
          href="/02_select_genre" 
          className="T1_20_DB px-8 py-4 border-3 border-green text-center bg-black block clip-corner-3">
          NEXT
        </Link>
      </div>
    </div>
  )
}