"use client";

import Link from "next/link";
import { useState } from "react";
import dataList from "@/app/database";

export default function SelectGenre() {
  const [index, setIndex] = useState(0);

  return(
    <div>
      <h1>Select Genre</h1>
      <div>
        <p>Genre : {dataList[index].genre}</p>
        <p>City : {dataList[index].city}</p>
        <p>Year : {dataList[index].year}</p>
        <p>Improvisation : {dataList[index].improvisation}</p>
      </div>
      <p>*Improvisation=즉흥성</p>
      <div>
        <button onClick={() => {
          const newIndex = index - 1;
          setIndex(newIndex < 0 ? dataList.length - 1 : newIndex);
        }}>◀︎</button>
        <Link href="/03_select_artist">Next</Link>
        <button onClick={() => {
          const newIndex = index + 1;
          setIndex(newIndex >= dataList.length ? 0 : newIndex);
          }}>▶︎</button>

      </div>
    </div>
  )
}