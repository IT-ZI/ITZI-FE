// src/components/layout/ProfileDropdown.jsx
import { useNavigate } from "react-router-dom";
import profileImage from "../../assets/img/profile2.png";
import step1 from "../../assets/img/step1.png";
import step2 from "../../assets/img/step2.png";
import step3 from "../../assets/img/step3.png";

const ProfileDropdown = () => {
  const nav = useNavigate();

  // 모든 이벤트 버블링/기본동작 막는 함수
  const stopAll = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      className="profiledropdown"
      onMouseDown={stopAll}
      onClick={stopAll}
      role="menu"
    >
      <div className="myname">
        <div className="myname_img">
          <img className="img" src={profileImage} alt="" />
        </div>
        <div className="myname_name">
          <h3>성신총학_소망이랑</h3>
          <p>성신여자대학교 총학생회</p>
        </div>
      </div>

      <div className="correction">
        <button
          type="button"
          onClick={(e) => {
            stopAll(e);
            nav("/profile/edit");
          }}
        >
          프로필 수정
        </button>
      </div>

      <div className="home">
        <button
          type="button"
          onClick={(e) => {
            stopAll(e);
            nav("/");
          }}
        >
          홈
        </button>
      </div>

      <div className="cooperation">
        <div className="write">
          <p>게시판 글쓰기</p>
          <button className="list1" type="button" onClick={stopAll}>
            제휴 모집/ 혜택 홍보 글쓰기
          </button>
        </div>

        <div className="step_container">
          <p>제휴 맺기</p>
          <div className="step">
            {/* ✅ 선택하기 → /select 이동 */}
            <button
              className="list2"
              type="button"
              onClick={(e) => {
                stopAll(e);
                nav("/select");
              }}
            >
              <img src={step1} alt="" />
              <p>선택하기</p>
            </button>

            <button
              className="list2"
              type="button"
              onClick={(e) => {
                stopAll(e);
                nav("/partner/partnering");
              }}
            >
              <img src={step2} alt="" />
              <p>제휴 맺기</p>
            </button>

            <button
              className="list2"
              type="button"
              onClick={(e) => {
                stopAll(e);
                nav("/partner/progress");
              }}
            >
              <img src={step3} alt="" />
              <p>진행하기</p>
            </button>
          </div>
        </div>
      </div>

      <div className="logout">
        <button type="button" onClick={stopAll}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
