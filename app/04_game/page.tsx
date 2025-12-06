/**
 * Game flow
 * 1. URL에서 index/song 파라미터를 읽는다
 * 2. 음악과 autochart를 비동기로 로드한다
 * 3. 차트가 준비되면 READY → COUNTDOWN 상태로 전이
 * 4. 5초 카운트다운 후 음악 재생 및 게임 루프 시작
 * 5. 매 프레임 audio.currentTime 기준으로 노트를 렌더/판정
 * 6. Perfect(≤0.05s)/Great/Good/Miss 기준으로 점수·콤보·통계를 기록
 * 7. 노래 종료 시 RESULT 화면에 성적을 노출한다
 */

// 1. url에서 index와 song index 가져오기
// 2. 음악 파일 로딩 
// 3. autochart.ts 로딩 + 자동 차트 생성
// 4. 게임 상태(state)를 “ready”로 전환
// 5. 5초 카운트다운 시작
// 6. 카운트다운 종료 → 음악 재생 시작
// 7. GameLoop에서 매 프레임 실행되는 일 (핵심)
// 7-1. 현재 시간(now = audio.currentTime) 측정
// 7-2. 노트 스폰 / 화면 표시
// 7-3. 판정선에 맞춰서 노트 판정 및 이펙트(텍스트 : perfect, great, good, miss) 표시
// 7-4. 판정 (입력 처리) : <= 0.05 → Perfect 10점, <= 0.10 → Great 5점, <= 0.15 → Good 1점, > 0.15 → Miss 0점
// 8. 점수 UI 실시간 업데이트 : 점수
// 9. 노래 종료 감지
// 10. 결과 화면 표시 (종합 결과) : 점수, 미스 횟수, 판정 통계, 랭킹 등


export default function GamePage() {
  return (
    <div className="w-[360px] h-[800px] bg-black text-white mx-auto relative">
      <h1>Game</h1>
    </div>
  )
}