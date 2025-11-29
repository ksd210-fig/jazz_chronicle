"use client";

import { useSearchParams } from "next/navigation";
import dataList from "../database";

export default function Game() {
    const searchParams = useSearchParams();
    const indexParameter = searchParams.get("index");
    const songParameter = searchParams.get("song");

    const index = parseInt(indexParameter || "0", 10);
    const songIndex = parseInt(songParameter || "0", 10);

    return(
        <div>
            <p>{dataList[index].song[songIndex]}</p>
            <audio src={dataList[index].sound[songIndex]} autoPlay loop/>
        </div>
    )
}