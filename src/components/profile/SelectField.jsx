// src/components/profile/SelectField.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import toggleSvg from "../../assets/img/toggle.png"; // 경로 확인! 없으면 public/img로

export default function SelectField({
  value,
  options = [],
  onChange,
  placeholder = "선택하세요",
  panelHeight = 200,
  width,            // 과거 호환용. 없으면 100%로
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const label = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found ? found.label : "";
  }, [options, value]);

  // 바깥 클릭 닫기
  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // 키보드 접근성
  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    } else if (e.key === "Escape") {
      close();
    }
  };

  const pick = (v) => {
    onChange?.(v);
    close();
  };

  return (
    <div
      ref={wrapRef}
      className={`select-field${open ? " is-open" : ""}`}
      style={{ width: width ? `${width}px` : "100%" }}
    >
      <button
        type="button"
        className={`select-control${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        <span className={`control-text${label ? "" : " is-placeholder"}`}>
          {label || placeholder}
        </span>
        <img className="toggle-icon" src={toggleSvg} alt="" aria-hidden="true" />
      </button>

      {open && (
        <ul
          className="options"
          role="listbox"
          style={{ maxHeight: panelHeight }}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className="option"
              onClick={() => pick(opt.value)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") pick(opt.value);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
