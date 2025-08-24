// 아주 가벼운 데모용 전역 스토어 (헤더 배지/드롭다운과 사이드바 숫자 공유)
const listeners = new Set();

export const notifyState = {
  unread: 0,                 // 헤더 빨간 배지 숫자
  items: [],                 // 드롭다운 항목 텍스트 배열
  toProceedCount: 0,         // 사이드바 "제휴 맺기 N" 숫자
};

export function setNotify(partial) {
  Object.assign(notifyState, partial);
  listeners.forEach((fn) => fn(notifyState));
}
export function onNotify(cb) { listeners.add(cb); return () => listeners.delete(cb); }

// 데모에서 헤더와도 쉽게 연결할 수 있게 window로 노출
if (typeof window !== "undefined") {
  window.__notify = { get: () => notifyState, set: setNotify, on: onNotify };
}