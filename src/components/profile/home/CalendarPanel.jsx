import { useState } from "react";
import leftIcon from "../../../assets/img/calendar_left.png";
import rightIcon from "../../../assets/img/calendar_right.png";
import "../../../assets/scss/pages/Calendar.scss";

/* 임시 이벤트 */
const seedEvents = [
  { title: "성신여대 X 샤브온당 - 상권 제휴", color: "#FF7777", start: "2025-09-01", end: "2025-09-15" },
  { title: "성신여대 X 카페 스파츠 - 상권 제휴", color: "#FFBD77", start: "2025-09-01", end: "2025-09-20" },
  { title: "성신여대 X 신일김밥", color: "#A3CF92", start: "2025-09-29", end: "2025-10-03" },
];

/* 유틸 */
const fmt = (y,m,d)=>`${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const toDate = (s)=>new Date(s+"T00:00:00");

/* 월 메타 */
function monthMeta(base){
  const y = base.getFullYear();
  const m = base.getMonth();
  const first = new Date(y,m,1);
  const start = new Date(first);
  start.setDate(first.getDate()-first.getDay()); // 일(0) 시작, 6주
  const weeks = Array.from({length:6},(_,w)=>{
    const ws = new Date(start); ws.setDate(start.getDate()+w*7);
    const we = new Date(ws);   we.setDate(ws.getDate()+6);
    return {ws,we};
  });
  const last = new Date(y,m+1,0);
  return {y,m,first,last,start,weeks};
}

/* 막대 계산(주 단위) + 첫 세그먼트 표시(head) */
function useBars(current, events){
  const {y,m,weeks} = monthMeta(current);
  const monthStart = new Date(y,m,1);
  const monthEnd   = new Date(y,m+1,0);
  const bars = [];

  weeks.forEach((w,wIdx)=>{
    const taken = Array(7).fill(0);
    events.forEach((e,eIdx)=>{
      const es = toDate(e.start), ee = toDate(e.end);
      const clipStart = es < monthStart ? monthStart : es;
      const clipEnd   = ee > monthEnd   ? monthEnd   : ee;
      if (clipEnd < w.ws || clipStart > w.we) return;

      const segStart = clipStart < w.ws ? w.ws : clipStart;
      const segEnd   = clipEnd   > w.we ? w.we : clipEnd;

      const startDow = segStart.getDay();
      const span = Math.floor((segEnd - segStart)/86400000) + 1;

      let level = 0;
      for(let d=0; d<span; d++) level = Math.max(level, taken[startDow+d]||0);
      for(let d=0; d<span; d++) taken[startDow+d] = level+1;

      bars.push({
        weekIndex: wIdx,
        startDow,
        span,
        level,
        color: e.color,
        title: e.title,
        /* 👉 이 달력에서 “처음 나타나는” 세그먼트인지 여부 */
        head: segStart.getTime() === clipStart.getTime(),
        key: `${eIdx}-${wIdx}-${startDow}`,
      });
    });
  });
  return { bars };
}

export default function CompactCalendar(){
  const [base, setBase] = useState(new Date(2025,8,1)); // 2025-09
  const { y, m, weeks } = monthMeta(base);
  const { bars } = useBars(base, seedEvents);

  const prevMonth = ()=>setBase(new Date(y,m-1,1));
  const nextMonth = ()=>setBase(new Date(y,m+1,1));

  // 요일은 월요일부터 UI 표시 (렌더 순서만 조정)
  const DOW = ["월","화","수","목","금","토","일"];

  const now = new Date();
  const todayStr = fmt(now.getFullYear(), now.getMonth()+1, now.getDate());

  return (
    <div className="cal-wrap">
      <h3 className="cal-title">제휴/혜택 캘린더</h3>

      <div className="calendar cal-compact">
        <div className="cal-head">
          <button className="nav prev" onClick={prevMonth} aria-label="이전 달">
            <img src={leftIcon} alt="이전" />
          </button>
          <div className="month">{y}년 {m+1}월</div>
          <button className="nav next" onClick={nextMonth} aria-label="다음 달">
            <img src={rightIcon} alt="다음" />
          </button>
        </div>

        <div className="cal-body">
          <table className="cal-grid">
            <thead>
              <tr>{DOW.map(d=> <th key={d}>{d}</th>)}</tr>
            </thead>
            <tbody>
              {weeks.map((w,wIdx)=>(
                <tr key={wIdx}>
                  {Array.from({length:7},(_,i)=>{
                    // 월요일 시작 보정: w.ws는 일요일, +1부터 시작
                    const date = new Date(w.ws); date.setDate(w.ws.getDate()+((i+1)%7));
                    const inMonth = date.getMonth()===m;
                    const isToday = fmt(date.getFullYear(), date.getMonth()+1, date.getDate())===todayStr;
                    return (
                      <td key={i} className={`${inMonth?"":"dim"} ${isToday?"today":""}`}>
                        <span className="d">{date.getDate()}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* 오버레이 막대 */}
          <div className="cal-bars">
            {bars.map(b=>(
              <div
                key={b.key}
                className={`cal-bar ${b.head ? "head" : ""}`}
                style={{
                  left:  `calc(${b.startDow} * (100% / 7) + 3px)`,
                  width: `calc(${b.span} * (100% / 7) - 8px)`,
                  top:   `calc(var(--dow-h) + var(--date-h) + var(--bar-gap) + ${b.weekIndex} * ((100% - var(--dow-h)) / 6) + ${b.level} * var(--level-gap))`,
                  background: b.color,
                }}
                title={b.title}
              >
                <span className="label">{b.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
