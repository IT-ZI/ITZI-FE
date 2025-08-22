import { useMemo } from "react";

export default function ExploreSection({
  schoolName = "",
  setSchoolName = () => {},
  interests = [],
  setInterests = () => {},
  categories = [],
  max = 5,
}) {
  const isFull = interests.length >= max;

  const toggle = (val) => {
    if (interests.includes(val)) {
      setInterests(interests.filter((v) => v !== val));
    } else {
      if (isFull) return;
      setInterests([...interests, val]);
    }
  };

  const selectedSet = useMemo(() => new Set(interests), [interests]);

  return (
    <>
      {/* 사용자 인증 */}
      <section className="block">
        <h2 className="block-title">
          사용자 인증{" "}
          <small className="hint">
            (선택) 사용자 인증을 하시면 맞춤형 혜택 제공이 가능합니다.
          </small>
        </h2>

        <label className="field input-with-colored-asterisk">
          <div className="control">
            <span className="asterisk" aria-hidden="true">*</span>
            <input
              className="input"
              placeholder="학교 이름 (ex, 00대학교 / '00대' X)"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>
        </label>

        <div className="verify-actions">
          <button type="button" className="verify-btn">학생 인증</button>
          <button type="button" className="verify-btn">교직원 인증</button>
        </div>

        <div className="verify-notes">
          <span>학생증을 준비해 주세요.</span>
          <span>교직원증을 준비해 주세요.</span>
        </div>
      </section>

      {/* 관심 업종 */}
      <section className="block">
        <h2 className="block-title">
          관심 업종{" "}
          <small className="hint">
            (선택) 관심 업종을 선택해주세요. (최대 {max}개)
          </small>
        </h2>

        {/* ✅ 요구된 전체 박스 (423x136 / 배경/보더/라운드) */}
        <div
          className="interest-box"
          role="group"
          aria-label="관심 업종 선택"
        >
          <div className="pill-grid">
            {categories.map((c) => {
              const on = selectedSet.has(c.value);
              return (
                <button
                  type="button"
                  key={c.value}
                  className={`pill ${on ? "on" : ""} ${!on && isFull ? "disabled" : ""}`}
                  onClick={() => toggle(c.value)}
                  disabled={!on && isFull}
                  aria-pressed={on}
                  aria-label={`${c.label}${on ? " 선택됨" : ""}`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
