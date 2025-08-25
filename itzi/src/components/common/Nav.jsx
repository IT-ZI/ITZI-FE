import banner1 from "../../assets/img/banner.png";
import banner2 from "../../assets/img/banner2.png";
import alarm from "../../assets/img/alarm.png";
import profile from "../../assets/img/profile2.png";
import next from "../../assets/img/ic_next.svg";
import { useState, useRef, useEffect } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { NavLink, useNavigate, useLocation, matchPath } from "react-router-dom";
import PartnerStartModal from "../popup/PartnerStartModal"; // ✅ 추가

const COOP_PATTERNS = [
  "/cooperation",
  "/partnering/*",
  "/partner/*",
  "/select",
  "/profile/*",
  "/inquiry/*",
];

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  // Nav 전체를 감싸는 ref (바깥 클릭 감지)
  const wrapRef = useRef(null);

  const [alarms, setAlarms] = useState([
    "[샤브온당] 에서 제휴를 수락했습니다.",
    "[투고샐러드] 에서 제휴를 거절했습니다.",
    "[카페구월] 에서 제휴 문의가 들어왔습니다.",
    "[오르비에토] 에서 제휴 문의가 들어왔습니다.",
  ]);

  // ✅ 추가: 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");

  const toggleProfile = () => setIsOpen((v) => !v);
  const toggleAlarm = () => setIsAlarmOpen((v) => !v);

  // 바깥 클릭 시 드롭다운/알람 닫기
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsAlarmOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // 라우트 변경 시 토글 닫기
  useEffect(() => {
    setIsOpen(false);
    setIsAlarmOpen(false);
  }, [loc.pathname]);

  const onArrowClick = (text, idx) => {
    const m = text.match(/\[([^\]]+)\]/);
    const brand = m ? m[1] : "샤브온당";

    // 알림 리스트에서 제거 + 토글 닫기
    setAlarms((prev) => prev.filter((_, i) => i !== idx));
    setIsAlarmOpen(false);

    // ✅ 수정: 샤브온당일 때만 모달 열기
    if (brand === "샤브온당") {
      setSelectedBrand(brand);
      setModalOpen(true);
    } else {
      // 기존 로직 유지 (다른 브랜드는 partnering으로)
      nav("/partnering", { state: { openStartModal: true, brand } });
    }
  };

  const coopActive = COOP_PATTERNS.some((pattern) =>
    matchPath({ path: pattern, end: false }, loc.pathname)
  );

  return (
    <>
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
              {/* 아이콘 버튼: 테두리/배경 리셋된 전용 클래스 사용 */}
              <button
                type="button"
                className="icon-btn alarm-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleAlarm();
                }}
                aria-label="알림"
                title="알림"
              >
                <img className="alarm" src={alarm} alt="알림" />
                {alarms.length > 0 && (
                  <span className="alarm-badge">{alarms.length}</span>
                )}
              </button>

              <button
                type="button"
                className="icon-btn profile-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleProfile();
                }}
                aria-label="프로필"
                title="프로필"
              >
                <img className="profile" src={profile} alt="프로필" />
              </button>
            </div>
          </div>
        </div>

        <div className="toggle">{isOpen && <ProfileDropdown />}</div>

        {isAlarmOpen && (
          <div
            className="alarm-wrap"
            // 내부 클릭은 바깥으로 전파되지 않게 (닫힘 방지)
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {alarms.map((text, i) => (
              <div key={i} className="alarm-card">
                <span className="txt">{text}</span>
                <button
                  type="button"
                  className="chev-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onArrowClick(text, i);
                  }}
                  aria-label="자세히 보기"
                  title="자세히 보기"
                >
                  <img src={next} alt="next" className="chev-icon" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ 추가: PartnerStartModal */}
      <PartnerStartModal
        open={modalOpen}
        brand={selectedBrand}
        onClose={() => setModalOpen(false)}
        onGo={() => {
          nav("/partner/partnering");
          setModalOpen(false);
        }}
      />
    </>
  );
};

export default Nav;