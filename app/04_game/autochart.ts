"use client";

// ============================================
// Types
// ============================================

interface TapNote {
  type: "tap";
  lane: number;
  time: number;
}

interface HoldNote {
  type: "hold";
  lane: number;
  start: number;
  end: number;
}

type Note = TapNote | HoldNote;

interface ChartData {
  bpm: number | null;
  offset: number;
  notes: Note[];
}

interface BandConfig {
  name: string;
  lane: number;
  minHz: number;
  maxHz: number;
}

interface Onset {
  time: number;
  lane: number;
  energy: number;
}

// ============================================
// Constants
// ============================================

const FFT_SIZE = 2048;
const HOP_SIZE = 1024;
const MOVING_AVG_WINDOW = 80;      // 노이즈 감소를 위해 증가
const ONSET_THRESHOLD = 1.8;       // 감도 낮춤 (1.2 → 1.8)
const MIN_PEAK_DISTANCE_MS = 250;  // 노트 간격 증가 (100 → 250ms)
const HOLD_NOTE_THRESHOLD_MS = 100;

const BANDS: BandConfig[] = [
  { name: "low", lane: 0, minHz: 40, maxHz: 120 },
  { name: "mid", lane: 1, minHz: 180, maxHz: 400 },
  { name: "piano", lane: 2, minHz: 1000, maxHz: 3000 },
  { name: "high", lane: 3, minHz: 3000, maxHz: 8000 },
];

// ============================================
// FFT Implementation (Radix-2 Cooley-Tukey)
// ============================================

/**
 * Radix-2 FFT (Cooley-Tukey 알고리즘)
 * O(n log n) 복잡도
 */
function fft(real: Float32Array, imag: Float32Array): void {
  const n = real.length;
  
  // Bit-reversal permutation
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;
    
    if (i < j) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }
  
  // Cooley-Tukey iterative FFT
  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >> 1;
    const angle = (2 * Math.PI) / len;
    const wReal = Math.cos(angle);
    const wImag = -Math.sin(angle);
    
    for (let i = 0; i < n; i += len) {
      let curReal = 1;
      let curImag = 0;
      
      for (let j = 0; j < halfLen; j++) {
        const uReal = real[i + j];
        const uImag = imag[i + j];
        const tReal = curReal * real[i + j + halfLen] - curImag * imag[i + j + halfLen];
        const tImag = curReal * imag[i + j + halfLen] + curImag * real[i + j + halfLen];
        
        real[i + j] = uReal + tReal;
        imag[i + j] = uImag + tImag;
        real[i + j + halfLen] = uReal - tReal;
        imag[i + j + halfLen] = uImag - tImag;
        
        const nextReal = curReal * wReal - curImag * wImag;
        const nextImag = curReal * wImag + curImag * wReal;
        curReal = nextReal;
        curImag = nextImag;
      }
    }
  }
}

/**
 * FFT magnitude 계산
 */
function computeFFTMagnitudes(frameData: Float32Array): Float32Array {
  const n = frameData.length;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  
  // 실수부에 데이터 복사
  real.set(frameData);
  
  // FFT 수행
  fft(real, imag);
  
  // Magnitude 계산 (절반만 사용 - 나머지는 대칭)
  const magnitudes = new Float32Array(n / 2);
  for (let i = 0; i < n / 2; i++) {
    magnitudes[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]) / n;
  }
  
  return magnitudes;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Hz를 FFT bin 인덱스로 변환
 */
function hzToBin(hz: number, sampleRate: number, fftSize: number): number {
  return Math.round((hz / sampleRate) * fftSize);
}

/**
 * 특정 주파수 밴드의 에너지를 계산
 */
function computeBandEnergy(
  magnitudes: Float32Array,
  minHz: number,
  maxHz: number,
  sampleRate: number,
  fftSize: number
): number {
  const minBin = hzToBin(minHz, sampleRate, fftSize);
  const maxBin = hzToBin(maxHz, sampleRate, fftSize);
  
  let sum = 0;
  let count = 0;
  
  for (let bin = minBin; bin <= maxBin && bin < magnitudes.length; bin++) {
    sum += magnitudes[bin];
    count++;
  }
  
  return count > 0 ? sum / count : 0;
}

/**
 * 에너지 배열의 이동 평균 계산
 */
function movingAverage(energyHistory: number[], windowSize: number): number {
  if (energyHistory.length === 0) return 0;
  
  const start = Math.max(0, energyHistory.length - windowSize);
  const window = energyHistory.slice(start);
  
  return window.reduce((a, b) => a + b, 0) / window.length;
}

/**
 * onset 감지: 현재 에너지가 평균 * threshold보다 큰지 확인
 */
function detectOnset(
  currentEnergy: number,
  avgEnergy: number,
  threshold: number
): boolean {
  return avgEnergy > 0 && currentEnergy > avgEnergy * threshold;
}

/**
 * 시간 스냅핑 (BPM 기반 - 현재는 placeholder)
 */
function snapTime(time: number, _bpm: number | null): number {
  return time;
}

/**
 * 가까운 onset들을 hold note로 병합
 */
function makeHoldNotes(onsets: Onset[], thresholdMs: number): Note[] {
  if (onsets.length === 0) return [];
  
  const sorted = [...onsets].sort((a, b) => a.time - b.time);
  const thresholdSec = thresholdMs / 1000;
  
  const notes: Note[] = [];
  const processed = new Set<number>();
  
  for (let i = 0; i < sorted.length; i++) {
    if (processed.has(i)) continue;
    
    const current = sorted[i];
    let endTime = current.time;
    
    for (let j = i + 1; j < sorted.length; j++) {
      if (processed.has(j)) continue;
      
      const next = sorted[j];
      if (next.lane !== current.lane) continue;
      
      const gap = next.time - endTime;
      if (gap <= thresholdSec) {
        endTime = next.time;
        processed.add(j);
      } else {
        break;
      }
    }
    
    processed.add(i);
    
    if (endTime > current.time) {
      notes.push({
        type: "hold",
        lane: current.lane,
        start: current.time,
        end: endTime,
      });
    } else {
      notes.push({
        type: "tap",
        lane: current.lane,
        time: current.time,
      });
    }
  }
  
  return notes.sort((a, b) => {
    const timeA = a.type === "tap" ? a.time : a.start;
    const timeB = b.type === "tap" ? b.time : b.start;
    return timeA - timeB;
  });
}

// ============================================
// Main Function
// ============================================

/**
 * 오디오 URL로부터 자동 차트를 생성
 */
export async function generateAutoChart(audioUrl: string): Promise<ChartData> {
  console.log("[AutoChart] 차트 생성 시작:", audioUrl);
  
  // 1. 오디오 파일 로드
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  console.log("[AutoChart] 오디오 로드 완료");
  
  // 2. AudioContext로 디코딩
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  await audioCtx.close();
  
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0);
  const duration = audioBuffer.duration;
  
  console.log(`[AutoChart] 샘플레이트: ${sampleRate}, 길이: ${duration.toFixed(2)}초`);
  
  // 3. 밴드별 에너지 히스토리 및 마지막 onset 시간 추적
  const bandEnergyHistory: Map<number, number[]> = new Map();
  const lastOnsetTime: Map<number, number> = new Map();
  
  BANDS.forEach((band) => {
    bandEnergyHistory.set(band.lane, []);
    lastOnsetTime.set(band.lane, -Infinity);
  });
  
  const allOnsets: Onset[] = [];
  
  // 4. 프레임 단위로 FFT 분석
  const numFrames = Math.floor((channelData.length - FFT_SIZE) / HOP_SIZE);
  console.log(`[AutoChart] 분석할 프레임 수: ${numFrames}`);
  
  for (let frame = 0; frame < numFrames; frame++) {
    const frameStart = frame * HOP_SIZE;
    const currentTime = frameStart / sampleRate;
    
    // 프레임 데이터 추출 및 윈도잉 (Hann window)
    const frameData = new Float32Array(FFT_SIZE);
    for (let i = 0; i < FFT_SIZE; i++) {
      const hannWindow = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (FFT_SIZE - 1)));
      frameData[i] = channelData[frameStart + i] * hannWindow;
    }
    
    // FFT 수행
    const magnitudes = computeFFTMagnitudes(frameData);
    
    // 각 밴드별 분석
    for (const band of BANDS) {
      const energy = computeBandEnergy(
        magnitudes,
        band.minHz,
        band.maxHz,
        sampleRate,
        FFT_SIZE
      );
      
      const history = bandEnergyHistory.get(band.lane)!;
      history.push(energy);
      
      const avgEnergy = movingAverage(history, MOVING_AVG_WINDOW);
      
      if (detectOnset(energy, avgEnergy, ONSET_THRESHOLD)) {
        const lastTime = lastOnsetTime.get(band.lane)!;
        const timeSinceLastOnset = (currentTime - lastTime) * 1000;
        
        if (timeSinceLastOnset >= MIN_PEAK_DISTANCE_MS) {
          allOnsets.push({
            time: snapTime(currentTime, null),
            lane: band.lane,
            energy,
          });
          lastOnsetTime.set(band.lane, currentTime);
        }
      }
    }
  }
  
  console.log(`[AutoChart] 감지된 onset 수: ${allOnsets.length}`);
  
  // 5. onset을 노트로 변환
  const notes = makeHoldNotes(allOnsets, HOLD_NOTE_THRESHOLD_MS);
  
  console.log(`[AutoChart] 생성된 노트 수: ${notes.length}`);
  
  return {
    bpm: null,
    offset: 0,
    notes,
  };
}
