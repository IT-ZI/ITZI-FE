import { useEffect, useRef, useState } from "react";
import delIcon from "../../assets/img/del.png"; // 삭제 아이콘

export default function TagInput({
  value = [],
  onChange = () => {},
  max = 5,
  placeholder = "키워드를 입력해 주세요. ex) 맛집, 대학생",
}) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const composingRef = useRef(false);       // ✅ IME 조합 여부
  const topInputRef = useRef(null);

  const isFull = value.length >= max;
  const chipsTypingClass = focused || text.length > 0 ? "is-typing" : "";

  const sanitize = (s) => s.replace(/\s+/g, " ").trim();

  const commit = () => {
    const raw = sanitize(text);
    if (!raw) return;

    // 쉼표/개행으로 여러 개 한 번에 입력 가능
    const parts = raw
      .split(/[,\n]/g)
      .map(sanitize)
      .filter(Boolean);

    if (parts.length === 0) return;

    let next = [...value];
    for (const p of parts) {
      if (next.length >= max) break;
      if (!next.includes(p)) next.push(p);
    }
    onChange(next);
    setText(""); // 입력창 비움
  };

  const handleKeyDown = (e) => {
    // ✅ 한국어/중국어 등 IME 조합 중에는 커밋 금지
    if (composingRef.current || e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      e.preventDefault();
      if (!isFull) commit();
      return;
    }
    if ((e.key === "," || e.key === "Comma") && !isFull) {
      e.preventDefault();
      commit();
      return;
    }
    // 선택: 스페이스로도 커밋하려면 주석 해제 (연속 스페이스 방지 포함)
    // if (e.key === " " && !isFull && text.trim().length > 0) {
    //   e.preventDefault();
    //   commit();
    //   return;
    // }

    if (e.key === "Backspace" && text.length === 0 && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleBlur = () => {
    setFocused(false);
    // ✅ 포커스 아웃될 때 남은 텍스트 자동 커밋
    if (!isFull) commit();
  };

  const removeAt = (idx) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
    topInputRef.current?.focus();
  };

  useEffect(() => {
    if (value.length >= max) setText("");
  }, [value, max]);

  return (
    <div className="tag-input">
      {/* 상단 입력창 */}
      <input
        ref={topInputRef}
        className="input top-input"
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        onCompositionStart={() => (composingRef.current = true)}  // ✅ IME 시작
        onCompositionEnd={() => (composingRef.current = false)}   // ✅ IME 종료
        disabled={isFull}
        aria-label="키워드 입력"
      />

      {/* 칩 컨테이너 */}
      <div className={`chips ${chipsTypingClass}`} aria-live="polite">
        {value.map((kw, idx) => (
          <span className="chip" key={`${kw}-${idx}`}>
            <span className="chip-label">{kw}</span>
            <button
              type="button"
              className="chip-del"
              aria-label={`${kw} 삭제`}
              onClick={() => removeAt(idx)}
            >
              <img src={delIcon} alt="" />
            </button>
          </span>
        ))}

        {/* 칩 박스 내부에서도 추가 입력 가능 */}
        {!isFull && (
          <input
            className="chip-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            onCompositionStart={() => (composingRef.current = true)}
            onCompositionEnd={() => (composingRef.current = false)}
            placeholder={value.length === 0 ? "" : "추가 입력…"}
            aria-label="키워드 추가 입력"
          />
        )}
      </div>
    </div>
  );
}