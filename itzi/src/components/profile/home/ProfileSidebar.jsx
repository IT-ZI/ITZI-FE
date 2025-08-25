import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onNotify } from "../../../state/notifyStore";

import profileImage from "../../../assets/img/profile2.png";
import step1 from "../../../assets/img/step1.png";
import step2 from "../../../assets/img/step2.png";
import step3 from "../../../assets/img/step3.png";

export default function ProfileSidebar({ profile, toProceed }) {
  const nav = useNavigate();
  const [badge, setBadge] = useState(toProceed);

  useEffect(() => setBadge(toProceed), [toProceed]);
  useEffect(() => onNotify((s) => setBadge(s.toProceedCount)), []);

  return (
    <div className="profiledropdown panel">
      {/* 상단 프로필 */}
      <div className="myname">
        <div className="myname_img">
          <img className="img" src={profileImage} alt="profile" />
        </div>
        <div className="myname_name">
          <h3>{profile?.name || "성신총학_소망이랑"}</h3>
          <p>{profile?.org || "성신여자대학교 총학생회"}</p>
        </div>
      </div>

      {/* 프로필 수정 */}
      <div className="correction">
        <button onClick={() => nav("/profile/edit")}>프로필 수정</button>
      </div>

      {/* 홈 이동(선택 사항) */}
      <div className="home">
        <button onClick={() => nav("/")}>홈</button>
      </div>

      {/* 게시판 글쓰기 / 제휴 맺기 단계 */}
      <div className="cooperation">
        <div className="write">
          <p>게시판 글쓰기</p>
          <button className="list1">제휴 모집/ 혜택 홍보 글쓰기</button>
        </div>

        <div className="step_container">
          <p>제휴 맺기</p>
          <div className="step">
            <button className="list2" onClick={() => nav("/select")}>
              <img src={step1} alt="step1" />
              <p>선택하기</p>
            </button>

            <button className="list2" onClick={() => nav("/partnering")}>
              <img src={step2} alt="step2" />
              <p>제휴 맺기</p>
            </button>

            <button className="list2">
              <img src={step3} alt="step3" />
              <p>진행하기</p>
            </button>
          </div>
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="logout">
        <button>로그아웃</button>
      </div>
    </div>
  );
}