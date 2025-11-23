"use client";

import { useSearchParams } from "next/navigation";
import dataList from "@/app/database";
import Link from "next/link";
import { useState } from "react";

export default function SelectArtistPage() {
  const searchParams = useSearchParams(); // 1. useSearchParams로 URL의 쿼리 파라미터 읽기
  const indexParameter = searchParams.get("index"); // 2. "index" 파라미터의 값을 가져오기 (문자열로 반환됨)
  const index = parseInt(indexParameter || "0", 10); // 3. 문자열을 숫자로 변환 (없으면 0으로 기본값 설정, 10진수 변환)
  const [tab, setTab] = useState<"artist" | "genreInfo">("artist");

  return (
    <div>
        <Link href="/02_select_genre">↩︎ GENRE</Link>
        <h1>Select Artist</h1>

        {/* 탭 버튼 */}
        <div>
          <button onClick={() => setTab("artist")}>ARTIST</button>
          <button onClick={() => setTab("genreInfo")}>GENRE INFO</button>
        </div>

        {/* 탭 내용 */}
        {tab === "artist" ? (
          <div>
            {dataList[index].artist.map((artist: string, i: number) => (
              <div key={i}>
                <p>{artist}</p>
                <p>{dataList[index].song[i]}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>{dataList[index].GenreInfo}</p>
          </div>
        )}
    </div>
  )
}