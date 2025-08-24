// src/components/layout/Nav.jsx
import banner1 from "../../assets/img/banner.png";
import banner2 from "../../assets/img/banner2.png";
import alarm from "../../assets/img/alarm.png";
import profile from "../../assets/img/profile2.png";
import next from "../../assets/img/next.png";
import { useState, useRef, useEffect } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { NavLink, useNavigate, useLocation, matchPath } from "react-router-dom";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const wrapRef = useRef(null);

  const [alarms, setAlarms] = useState([
    "[샤브온당] 에서 제휴를 수락했습니다.",
    "[투고샐러드] 에서 제휴를 거절했습니다.",
    "[카페구월] 에서 제휴 문의가 들어왔습니다.",
    "[오르비에토] 에서 제휴 문의가 들어왔습니다.",
  ]);

  const toggleProfile = () => setIsOpen((v) => !v);
  const toggleAlarm = () => setIsAlarmOpen((v) => !v);

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsAlarmOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const onArrowClick = (text, idx) => {
    const m = text.match(/\[([^\]]+)\]/);
    const brand = m ? m[1] : "샤브온당";
    setAlarms((prev) => prev.filter((_, i) => i !== idx));
    setIsAlarmOpen(false);
    nav("/partnering", { state: { openStartModal: true, brand } });
  };

  // ✅ 제휴 영역으로 간주할 모든 경로 패턴 (필요시 자유롭게 추가)
  const COOP_PATTERNS = [
    "/cooperation",
    "/partnering/*",
    "/partner/*",
    "/select",
    "/profile/*",
    "/inquiry/*",
  ];

  const coopActive = COOP_PATTERNS.some((pattern) =>
    matchPath({ path: pattern, end: false }, loc.pathname)
  );

  return (
    <div className="nav" ref={wrapRef}>
      <div className="container">
        <div className="nav_left">
          <div className="banner">
            <img className="banner1" src={banner1} alt="" />
            <img className="banner2" src={banner2} alt="" />
          </div>

          <div className="button_container" role="tablist" aria-label="상단 탭">
            <NavLink
              to="/benefits"
              className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
            >
              혜택이 잇ZI
            </NavLink>
            <p>|</p>
            <NavLink
              to="/cooperation"
              className={() => `tab ${coopActive ? "active" : ""}`}
            >
              제휴를 잇ZI
            </NavLink>
          </div>
        </div>

        <div className="nav_right">
          <div className="icon_container">
            <button type="button" className="alarm-btn" onClick={toggleAlarm}>
              <img className="alarm" src={alarm} alt="알림" />
              {alarms.length > 0 && (
                <span className="alarm-badge">{alarms.length}</span>
              )}
            </button>

            <button
              type="button"
              className="profile-btn"
              onClick={toggleProfile}
              aria-label="프로필"
              title="프로필"
            >
              <img className="profile" src={profile} alt="" />
            </button>
          </div>
        </div>
      </div>

      <div className="toggle">{isOpen && <ProfileDropdown />}</div>

      {isAlarmOpen && (
        <div className="alarm-wrap">
          {alarms.map((text, i) => (
            <div key={i} className="alarm-card">
              <span className="txt">{text}</span>
              <button
                type="button"
                className="chev-btn"
                onClick={() => onArrowClick(text, i)}
                aria-label="제휴맺기 이동"
                title="제휴맺기 이동"
              >
                <img src={next} alt="next" className="chev-icon" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Nav;
