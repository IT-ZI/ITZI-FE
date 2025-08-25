// src/utils/scrapStore.js
const KEY = "cooperation:benefits";
const EVT = "benefits:updated";

const norm = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .filter((it) => it && it.id != null)
    .map((it) => ({
      id: String(it.id),
      scrab_done: Boolean(
        it.scrab_done ?? it.scrap_done ?? it.scrab ?? it.bookmarked ?? false
      ),
      scrab_count: Number(
        it.scrab_count ?? it.scrap_count ?? it.bookmarkCount ?? it.defaultScrapCount ?? 0
      ),
      title: it.title ?? "",
      image: it.image ?? it.thumb ?? null,
      target: it.target ?? "",
      period: it.period ?? "",
      benefit: it.benefit ?? "",
      dday: typeof it.dday === "number" ? it.dday : 0,
    }));

const readRaw = () => {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
};
const writeRaw = (value) => {
  localStorage.setItem(KEY, JSON.stringify(value));
};

export function getAll() {
  return norm(readRaw() || []);
}

export function setAll(items) {
  writeRaw(norm(items));
  window.dispatchEvent(new Event(EVT));
}

export function upsert(item) {
  const list = getAll();
  const i = list.findIndex((x) => x.id === String(item.id));
  const next = norm([item])[0];
  if (i >= 0) list[i] = { ...list[i], ...next };
  else list.push(next);
  setAll(list);
}

export function toggleScrap(id, explicit) {
  const list = getAll();
  const idx = list.findIndex((x) => x.id === String(id));
  if (idx >= 0) {
    const on = explicit ?? !list[idx].scrab_done;
    list[idx].scrab_done = on;
    list[idx].scrab_count = Math.max(
      0,
      (list[idx].scrab_count ?? 0) + (on ? 1 : -1)
    );
    setAll(list);
  } else {
    list.push({ id: String(id), scrab_done: true, scrab_count: 1 });
    setAll(list);
  }
}

export function subscribe(handler) {
  const h = () => handler(getAll());
  window.addEventListener(EVT, h);
  return () => window.removeEventListener(EVT, h);
}
