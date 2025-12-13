"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import dataList from "@/app/database";

// ============================================
// Types
// ============================================

type GameState = "loading" | "ready" | "countdown" | "playing" | "result";
type Judgment = "PERFECT" | "GREAT" | "GOOD" | "MISS";

interface TapNote {
  type: "tap";
  lane: number;
  time: number;
  hit?: boolean;
  missed?: boolean;
  judgment?: Judgment;
}

interface HoldNote {
  type: "hold";
  lane: number;
  start: number;
  end: number;
  hit?: boolean;
  missed?: boolean;
  judgment?: Judgment;
}

type GameNote = TapNote | HoldNote;

interface ChartData {
  bpm: number | null;
  offset: number;
  notes: GameNote[];
}

interface GameStats {
  perfect: number;
  great: number;
  good: number;
  miss: number;
}

// ============================================
// Constants
// ============================================

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 700;
const LANE_COUNT = 4;
const HIT_LINE_Y = 600;
const NOTE_SPEED = 400; // pixels per second
const NOTE_HEIGHT = 20;

// 판정 윈도우 (초)
const PERFECT_WINDOW = 0.05;
const GREAT_WINDOW = 0.10;
const GOOD_WINDOW = 0.15;

// 점수
const SCORE_PERFECT = 300;
const SCORE_GREAT = 200;
const SCORE_GOOD = 100;

// 키 매핑
const KEY_MAP: Record<string, number> = {
  d: 0,
  f: 1,
  j: 2,
  k: 3,
};

// 레인 색상
const LANE_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"];

// ============================================
// Main Component
// ============================================

export default function GamePage() {
  // URL 파라미터
  const searchParams = useSearchParams();
  const index = parseInt(searchParams.get("index") || "0", 10);
  const songIndex = parseInt(searchParams.get("song") || "0", 10);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  const chartRef = useRef<ChartData | null>(null);
  const pressedLanesRef = useRef<Set<number>>(new Set());
  const comboRef = useRef(0);
  const lastJudgmentRef = useRef<Judgment | null>(null);
  const gameStateRef = useRef<GameState>("loading");

  // State
  const [gameState, setGameStateInternal] = useState<GameState>("loading");
  
  // gameState 변경 시 ref도 함께 업데이트
  const setGameState = useCallback((newState: GameState) => {
    gameStateRef.current = newState;
    setGameStateInternal(newState);
  }, []);
  const [countdown, setCountdown] = useState(5);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lastJudgment, setLastJudgment] = useState<Judgment | null>(null);
  const [stats, setStats] = useState<GameStats>({
    perfect: 0,
    great: 0,
    good: 0,
    miss: 0,
  });
  const [pressedLanes, setPressedLanes] = useState<Set<number>>(new Set());

  // 곡 정보
  const songData = dataList[index];
  const audioSrc = songData?.sound?.[songIndex] || "";
  const songTitle = songData?.song?.[songIndex] || "Unknown";
  const artistName = songData?.artist?.[songIndex] || "Unknown";

  // ============================================
  // Canvas Drawing Functions
  // ============================================

  /**
   * 레인 그리기
   */
  const drawLanes = useCallback((ctx: CanvasRenderingContext2D, currentPressedLanes: Set<number>) => {
    const laneWidth = CANVAS_WIDTH / LANE_COUNT;

    // 레인 배경
    for (let i = 0; i < LANE_COUNT; i++) {
      // 눌린 레인은 밝게 표시
      if (currentPressedLanes.has(i)) {
        ctx.fillStyle = LANE_COLORS[i] + "40"; // 40% opacity
      } else {
        ctx.fillStyle = i % 2 === 0 ? "#1a1a1a" : "#222222";
      }
      ctx.fillRect(i * laneWidth, 0, laneWidth, CANVAS_HEIGHT);

      // 레인 구분선
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(i * laneWidth, 0);
      ctx.lineTo(i * laneWidth, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // 판정선
    ctx.fillStyle = "#BAEE2A";
    ctx.fillRect(0, HIT_LINE_Y - 2, CANVAS_WIDTH, 4);

    // 판정선 위 히트 이펙트 (눌린 레인)
    for (let i = 0; i < LANE_COUNT; i++) {
      if (currentPressedLanes.has(i)) {
        ctx.fillStyle = LANE_COLORS[i];
        ctx.fillRect(i * laneWidth, HIT_LINE_Y - 30, laneWidth, 60);
        
        // 글로우 효과
        ctx.shadowColor = LANE_COLORS[i];
        ctx.shadowBlur = 20;
        ctx.fillRect(i * laneWidth + 5, HIT_LINE_Y - 25, laneWidth - 10, 50);
        ctx.shadowBlur = 0;
      }
    }

    // 키 힌트
    const keys = ["D", "F", "J", "K"];
    ctx.font = "14px DogicaPixel";
    ctx.textAlign = "center";
    for (let i = 0; i < LANE_COUNT; i++) {
      ctx.fillStyle = currentPressedLanes.has(i) ? "#FFFFFF" : "#666666";
      ctx.fillText(keys[i], i * laneWidth + laneWidth / 2, HIT_LINE_Y + 50);
    }
  }, []);

  /**
   * 노트 그리기
   */
  const drawNotes = useCallback((ctx: CanvasRenderingContext2D, now: number) => {
    if (!chartRef.current) return;

    const laneWidth = CANVAS_WIDTH / LANE_COUNT;
    const noteWidth = laneWidth * 0.7;
    const noteMargin = (laneWidth - noteWidth) / 2;

    for (const note of chartRef.current.notes) {
      // 이미 처리된 노트는 스킵
      if (note.hit || note.missed) continue;

      const noteTime = note.type === "tap" ? note.time : note.start;
      const y = HIT_LINE_Y - (noteTime - now) * NOTE_SPEED;

      // 화면 밖 노트는 스킵
      if (y < -100 || y > CANVAS_HEIGHT + 100) continue;

      const x = note.lane * laneWidth + noteMargin;

      if (note.type === "tap") {
        // Tap 노트
        ctx.fillStyle = LANE_COLORS[note.lane];
        ctx.fillRect(x, y - NOTE_HEIGHT / 2, noteWidth, NOTE_HEIGHT);

        // 테두리
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y - NOTE_HEIGHT / 2, noteWidth, NOTE_HEIGHT);
      } else {
        // Hold 노트
        const endY = HIT_LINE_Y - (note.end - now) * NOTE_SPEED;
        const holdHeight = y - endY;

        ctx.fillStyle = LANE_COLORS[note.lane] + "AA";
        ctx.fillRect(x, endY, noteWidth, holdHeight);

        // 시작/끝 표시
        ctx.fillStyle = LANE_COLORS[note.lane];
        ctx.fillRect(x, y - NOTE_HEIGHT / 2, noteWidth, NOTE_HEIGHT);
        ctx.fillRect(x, endY - NOTE_HEIGHT / 2, noteWidth, NOTE_HEIGHT);
      }
    }
  }, []);

  /**
   * 판정 텍스트 그리기
   */
  const drawJudgment = useCallback((ctx: CanvasRenderingContext2D) => {
    const judgment = lastJudgmentRef.current;
    if (!judgment) return;

    const colors: Record<Judgment, string> = {
      PERFECT: "#BAEE2A",
      GREAT: "#4ECDC4",
      GOOD: "#FFD93D",
      MISS: "#FF6B6B",
    };

    ctx.fillStyle = colors[judgment];
    ctx.font = "bold 24px DogicaPixel";
    ctx.textAlign = "center";
    ctx.fillText(judgment, CANVAS_WIDTH / 2, HIT_LINE_Y - 50);
  }, []);

  /**
   * 콤보 그리기
   */
  const drawCombo = useCallback((ctx: CanvasRenderingContext2D) => {
    const currentCombo = comboRef.current;
    if (currentCombo < 2) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px DogicaPixel";
    ctx.textAlign = "center";
    ctx.fillText(`${currentCombo}`, CANVAS_WIDTH / 2, HIT_LINE_Y - 100);

    ctx.fillStyle = "#888888";
    ctx.font = "12px DogicaPixel";
    ctx.fillText("COMBO", CANVAS_WIDTH / 2, HIT_LINE_Y - 75);
  }, []);

  // ============================================
  // Game Logic Functions
  // ============================================

  /**
   * 가장 가까운 노트 찾기
   */
  const findClosestNote = useCallback((lane: number, now: number): GameNote | null => {
    if (!chartRef.current) return null;

    let closest: GameNote | null = null;
    let minDiff = Infinity;

    for (const note of chartRef.current.notes) {
      if (note.lane !== lane || note.hit || note.missed) continue;

      const noteTime = note.type === "tap" ? note.time : note.start;
      const diff = Math.abs(noteTime - now);

      if (diff < minDiff && diff <= GOOD_WINDOW + 0.1) {
        minDiff = diff;
        closest = note;
      }
    }

    return closest;
  }, []);

  /**
   * 판정 처리
   */
  const judgeHit = useCallback((lane: number) => {
    console.log(`[Game] judgeHit 호출: 레인 ${lane}, 상태: ${gameStateRef.current}`);
    
    if (gameStateRef.current !== "playing" || !audioRef.current) {
      console.log(`[Game] judgeHit 종료: 상태가 playing이 아니거나 오디오 없음`);
      return;
    }

    const now = audioRef.current.currentTime;
    const note = findClosestNote(lane, now);

    console.log(`[Game] 가장 가까운 노트:`, note ? `시간 ${note.type === 'tap' ? note.time : note.start}` : '없음');

    if (!note) return;

    const noteTime = note.type === "tap" ? note.time : note.start;
    const diff = Math.abs(noteTime - now);

    let judgment: Judgment;
    let scoreAdd = 0;

    if (diff <= PERFECT_WINDOW) {
      judgment = "PERFECT";
      scoreAdd = SCORE_PERFECT;
    } else if (diff <= GREAT_WINDOW) {
      judgment = "GREAT";
      scoreAdd = SCORE_GREAT;
    } else if (diff <= GOOD_WINDOW) {
      judgment = "GOOD";
      scoreAdd = SCORE_GOOD;
    } else {
      judgment = "MISS";
      scoreAdd = 0;
    }

    // 노트 상태 업데이트
    note.hit = true;
    note.judgment = judgment;

    // Ref 업데이트 (게임 루프용)
    lastJudgmentRef.current = judgment;

    // 점수 및 콤보 업데이트
    setScore((prev) => prev + scoreAdd);
    setLastJudgment(judgment);

    if (judgment === "MISS") {
      comboRef.current = 0;
      setCombo(0);
    } else {
      comboRef.current += 1;
      const newCombo = comboRef.current;
      setCombo(newCombo);
      setMaxCombo((max) => Math.max(max, newCombo));
    }

    // 통계 업데이트
    setStats((prev) => ({
      ...prev,
      [judgment.toLowerCase()]: prev[judgment.toLowerCase() as keyof GameStats] + 1,
    }));
  }, [findClosestNote]);

  /**
   * 놓친 노트 체크
   */
  const checkMissedNotes = useCallback((now: number) => {
    if (!chartRef.current) return;

    for (const note of chartRef.current.notes) {
      if (note.hit || note.missed) continue;

      const noteTime = note.type === "tap" ? note.time : note.start;

      if (now > noteTime + GOOD_WINDOW) {
        note.missed = true;
        note.judgment = "MISS";

        // Ref 업데이트 (게임 루프용)
        comboRef.current = 0;
        lastJudgmentRef.current = "MISS";

        setCombo(0);
        setLastJudgment("MISS");
        setStats((prev) => ({ ...prev, miss: prev.miss + 1 }));
      }
    }
  }, []);

  // ============================================
  // Game Loop
  // ============================================

  const startGameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      if (gameState !== "playing") return;

      const now = audio.currentTime;

      // 캔버스 클리어
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 그리기
      drawLanes(ctx, pressedLanesRef.current);
      drawNotes(ctx, now);
      drawJudgment(ctx);
      drawCombo(ctx);

      // 놓친 노트 체크
      checkMissedNotes(now);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
  }, [gameState, drawLanes, drawNotes, drawJudgment, drawCombo, checkMissedNotes]);

  // ============================================
  // Effects
  // ============================================

  // 오디오 및 차트 로드
  useEffect(() => {
    if (!audioSrc) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = audioSrc;
    audio.load();

    let cancelled = false;

    const loadChart = async () => {
      try {
        const { generateAutoChart } = await import("./autochart");
        const chart = await generateAutoChart(audioSrc);

        if (cancelled) return;

        // 노트에 hit/missed 속성 추가
        chart.notes = chart.notes.map((note) => ({
          ...note,
          hit: false,
          missed: false,
        }));

        chartRef.current = chart as ChartData;
        setGameState("ready");
      } catch (error) {
        console.error("차트 생성 오류:", error);
      }
    };

    loadChart();

    return () => {
      cancelled = true;
    };
  }, [audioSrc]);

  // 카운트다운 시작 (ready → countdown)
  useEffect(() => {
    if (gameState !== "ready") return;

    setGameState("countdown");
    setCountdown(5);
  }, [gameState]);

  // 카운트다운 진행
  useEffect(() => {
    if (gameState !== "countdown") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState("playing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // 게임 시작 (playing 상태 진입 시)
  useEffect(() => {
    if (gameState !== "playing") return;

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => console.error("오디오 재생 오류:", err));
    }

    startGameLoop();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [gameState, startGameLoop]);

  // 오디오 종료 감지
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setGameState("result");
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  // judgeHit을 ref에 저장 (최신 버전 유지)
  const judgeHitRef = useRef(judgeHit);
  judgeHitRef.current = judgeHit;

  // 키보드 입력 (한 번만 등록)
  useEffect(() => {
    console.log("[Game] 키보드 이벤트 리스너 등록");
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      
      const key = e.key.toLowerCase();
      const lane = KEY_MAP[key];
      
      console.log(`[Game] 키 입력: ${key}, 레인: ${lane}`);
      
      if (lane !== undefined) {
        e.preventDefault();
        
        // 시각적 피드백
        pressedLanesRef.current.add(lane);
        setPressedLanes(new Set(pressedLanesRef.current));
        
        // 판정 호출 (ref 사용으로 항상 최신 함수 호출)
        judgeHitRef.current(lane);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const lane = KEY_MAP[key];
      
      if (lane !== undefined) {
        pressedLanesRef.current.delete(lane);
        setPressedLanes(new Set(pressedLanesRef.current));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      console.log("[Game] 키보드 이벤트 리스너 제거");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []); // 빈 의존성 배열 - 한 번만 등록

  // 터치 입력
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (gameStateRef.current !== "playing") return;
      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const laneWidth = rect.width / LANE_COUNT;
      const touchedLanes = new Set<number>();

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.clientX - rect.left;
        const lane = Math.floor(x / laneWidth);

        if (lane >= 0 && lane < LANE_COUNT) {
          touchedLanes.add(lane);
          pressedLanesRef.current.add(lane);
          judgeHitRef.current(lane);
        }
      }
      
      setPressedLanes(new Set(pressedLanesRef.current));
      
      // 100ms 후 터치 효과 제거
      setTimeout(() => {
        touchedLanes.forEach(lane => pressedLanesRef.current.delete(lane));
        setPressedLanes(new Set(pressedLanesRef.current));
      }, 100);
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    return () => canvas.removeEventListener("touchstart", handleTouchStart);
  }, []); // 빈 의존성 배열

  // 정확도 계산
  const totalNotes = stats.perfect + stats.great + stats.good + stats.miss;
  const accuracy = totalNotes > 0
    ? ((stats.perfect * 100 + stats.great * 80 + stats.good * 50) / (totalNotes * 100) * 100).toFixed(1)
    : "0.0";

  // 재시도
  const handleRetry = () => {
    setGameState("loading");
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setStats({ perfect: 0, great: 0, good: 0, miss: 0 });
    setLastJudgment(null);

    // Ref 리셋
    comboRef.current = 0;
    lastJudgmentRef.current = null;

    // 차트 리셋
    if (chartRef.current) {
      chartRef.current.notes = chartRef.current.notes.map((note) => ({
        ...note,
        hit: false,
        missed: false,
        judgment: undefined,
      }));
    }

    setTimeout(() => setGameState("ready"), 100);
  };

  // ============================================
  // Render
  // ============================================

  return (
    <div className="page-container overflow-hidden">
      {/* 헤더 */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start">
        <Link href="/02_select_genre" className="text-gray T3_12_DB">
          ↩︎ BACK
        </Link>
        <div className="text-right">
          <p className="T2_16_DB text-green">{score}</p>
          <p className="T4_10_DB text-gray">SCORE</p>
        </div>
      </div>

      {/* 곡 정보 */}
      <div className="absolute top-12 mt-4 left-0 right-0 text-center z-10">
        <p className="T4_10_DB text-gray">{artistName}</p>
        <p className="T3_12_DB text-white">{songTitle}</p>
      </div>

      {/* 캔버스 */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="block mx-auto mt-26"
        style={{ touchAction: "none" }}
      />

      {/* 로딩 오버레이 */}
      {gameState === "loading" && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <p className="T2_16_DB text-green animate-pulse">LOADING...</p>
        </div>
      )}

      {/* 카운트다운 오버레이 */}
      {gameState === "countdown" && countdown > 0 && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="text-center">
            <p className="text-8xl font-bold text-green">{countdown}</p>
            <p className="T3_12_DB text-gray mt-4">GET READY!</p>
          </div>
        </div>
      )}

      {/* 결과 화면 */}
      {gameState === "result" && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 gap-4">
          <p className="T1_20_DB text-green mb-4">RESULT</p>

          <div className="text-center space-y-2">
            <p className="T2_16_DB text-white">SCORE</p>
            <p className="text-4xl font-bold text-green">{score}</p>
          </div>

          <div className="flex gap-8 mt-4">
            <div className="text-center">
              <p className="T3_12_DB text-gray">MAX COMBO</p>
              <p className="T2_16_DB text-white">{maxCombo}</p>
            </div>
            <div className="text-center">
              <p className="T3_12_DB text-gray">ACCURACY</p>
              <p className="T2_16_DB text-white">{accuracy}%</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4 text-center">
            <div>
              <p className="T4_10_DB text-[#BAEE2A]">PERFECT</p>
              <p className="T3_12_DB text-white">{stats.perfect}</p>
            </div>
            <div>
              <p className="T4_10_DB text-[#4ECDC4]">GREAT</p>
              <p className="T3_12_DB text-white">{stats.great}</p>
            </div>
            <div>
              <p className="T4_10_DB text-[#FFD93D]">GOOD</p>
              <p className="T3_12_DB text-white">{stats.good}</p>
            </div>
        <div>
              <p className="T4_10_DB text-[#FF6B6B]">MISS</p>
              <p className="T3_12_DB text-white">{stats.miss}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleRetry}
              className="T3_12_DB px-6 py-3 border-2 border-green text-green clip-corner-2"
            >
              RETRY
            </button>
            <Link
              href="/"
              className="T3_12_DB px-6 py-3 border-2 border-gray text-gray clip-corner-2"
            >
              HOME
            </Link>
          </div>
        </div>
      )}

      {/* 오디오 */}
      <audio ref={audioRef} />
    </div>
  );
}
