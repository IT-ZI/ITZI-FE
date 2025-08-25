import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "../components/common/ProfileDropdown";
import priorbutton from "../assets/img/priorbutton.png";

import "../assets/scss/pages/AgreementCreatePage.scss";

export default function AgreementCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const partnerName = location.state?.partnerName || "샤브온당";
  const formData = location.state?.formData || {};

  // ✅ 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [agreementData, setAgreementData] = useState(null);
  // ✅ 팝업 상태 추가
  const [showSignaturePopup, setShowSignaturePopup] = useState(false);
  // ✅ 전송 완료 팝업 상태
  const [showSentPopup, setShowSentPopup] = useState(false);
  // ✅ 서명 상태 관리 추가
  const [signatures, setSignatures] = useState([
    {
      party: "성신총학_소망이랑",
      representative: "대표자: 박시현",
      signature: "서명: (전자서명)",
      isSigned: false // ✅ 서명 여부 상태
    },
    {
      party: "샤브온당",
      representative: "대표자: 김은화",
      signature: "서명: (전자서명)",
      isSigned: false // ✅ 상대방은 항상 false
    }
  ]);
  // ✅ 완료/수정 상태 관리 추가
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ 로딩 시뮬레이션 (실제로는 AI API 호출)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // ✅ AI가 생성한 협약서 데이터 (임시)
      setAgreementData({
        title: "성신총학_소망이랑 & 샤브온당 제휴 업무협약서",
        preamble: "성신총학_소망이랑(이하 '학생회')와 샤브온당(이하 '매장')은 제휴 혜택 제공을 위한 업무협약을 다음과 같이 체결합니다.",
        articles: [
          {
            number: "제 1 조",
            title: "목적",
            content: "학생·교직원의 생활 편의 증진 및 지역 상권 활성화를 목적으로 제휴 혜택 제공에 관한 제반 사항을 규정한다."
          },
          {
            number: "제 2 조",
            title: "대상 및 기간",
            content: "혜택 제공 대상은 성신여대 재학생 및 교직원으로 한정한다. 혜택 제공 기간은 2025년 9월 1일부터 2025년 9월 14일까지로 한다."
          },
          {
            number: "제 3 조",
            title: "혜택 및 조건",
            content: "매장은 다음과 같은 혜택을 제공한다: 제휴 기간 동안 결제 금액의 10% 할인 제공, 혜택 이용 시 학생증 또는 교직원증 제시 필수, 타 할인·쿠폰·행사와의 중복 적용 불가, 일부 품목은 제외될 수 있으며 제외 품목은 매장 내 고지한다"
          },
          {
            number: "제 4 조",
            title: "역할 및 의무",
            content: "제휴 제안자는 학교 커뮤니티, SNS, 오프라인 안내물 등을 통해 제휴 내용을 적극 홍보한다. 제휴 대상자는 약정된 혜택을 안정적으로 제공하고, 매장 내 고지물을 비치한다."
          },
          {
            number: "제 5 조",
            title: "효력 및 해지",
            content: "본 협약은 2025년 9월 1일에 효력이 발생하며, 제휴 기간 종료 시 자동으로 종료된다. 일방이 본 협약을 중대하게 위반한 경우, 상대방은 서면(전자문서 포함) 통지로 즉시 해지할 수 있다. 불가피한 사유로 혜택 제공이 어려운 경우, 지체 없이 사전 통지한다."
          },
          {
            number: "제 6 조",
            title: "기타",
            content: "본 협약에 명시되지 않은 사항은 상호 협의 또는 관련 법령·관례에 따른다. 전자서명·전자문서는 자필 서명과 동일한 효력을 갖는다. 본 협약서는 각 당사자가 1부씩 보관한다."
          }
        ],
        date: "2025년 8월 10일"
      });
    }, 3000); // ✅ 3초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  // ✅ 제휴 서명 요청 보내기 함수 수정
  const handleSignatureRequest = () => {
    console.log("제휴 서명 요청 보내기");
    setShowSignaturePopup(true); // ✅ 팝업 열기
  };

  // ✅ 팝업 닫기 함수 추가
  const closeSignaturePopup = () => {
    setShowSignaturePopup(false);
  };
  // ✅ 전송 완료 팝업 닫기
  const closeSentPopup = () => {
    setShowSentPopup(false);
    // 확인을 눌렀을 때만 상대측 버튼 색/텍스트 변경
    setPartnerRequestSent(true);
  };

  // ✅ 서명 처리 함수 추가
  const handleSign = (index) => {
    setSignatures(prev => 
      prev.map((sig, i) => 
        i === index ? { ...sig, isSigned: true } : sig
      )
    );
  };

  // ✅ 상대방 요청 전송 여부(색상 변경용)
  const [partnerRequestSent, setPartnerRequestSent] = useState(false);

  // ✅ 제휴 동의 요청 보내기에서 '보내기' 처리
  const handleSendRequest = () => {
    // 실제 API 성공 응답을 받았다고 가정
    setShowSignaturePopup(false);
    setShowSentPopup(true);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // ✅ 완료/수정 처리 함수 수정
  const handleComplete = () => {
    const isUserSigned = signatures.find(s => s.party === "성신총학_소망이랑")?.isSigned;
    const isReadyToComplete = isUserSigned && partnerRequestSent;
    if (!isReadyToComplete) return; // 조건 만족 전에는 동작하지 않음
    if (!isCompleted) {
      // ✅ 처음 완료 버튼 클릭 시
      console.log("협약 완료");
      setIsCompleted(true);
      // ✅ 제휴맺기 페이지로 복귀하며 완료 상태 전달
      navigate("/partnering", { state: { completedPartnerName: partnerName } });
    } else if (isCompleted && !isEditing) {
      // ✅ 완료 후 수정 버튼 클릭 시
      console.log("수정 모드 시작");
      setIsEditing(true);
    } else if (isEditing) {
      // ✅ 수정 완료 시
      console.log("수정 완료");
      setIsEditing(false);
    }
  };

  return (
    <main className="agreement-create-page">
      <div className="page-container">
        {/* ✅ 헤더 */}
        <header className="page-header">
          <button className="back-btn" onClick={handleBack}>
            <img src={priorbutton} alt="뒤로가기" />
          </button>
          <h1 className="page-title">{partnerName}</h1>
          <button className="signature-request-btn" onClick={handleSignatureRequest}>
            제휴 서명 요청 보내기
          </button>
        </header>

        {/* ✅ 메인 콘텐츠 */}
        <div className="main-content">
          <div className="content-container">
            {isLoading ? (
              // ✅ 로딩 화면
              <div className="loading-overlay">
                <div className="loading-content">
                  <span>변환 중입니다....</span>
                </div>
              </div>
            ) : (
              // ✅ 협약서 내용
              <div className="agreement-content">
                <h2 className="agreement-title">{agreementData?.title}</h2>
                <p className="preamble">{agreementData?.preamble}</p>
                
                <div className="articles">
                  {agreementData?.articles.map((article, index) => (
                    <div key={index} className="article">
                      <h3>{article.number} ({article.title})</h3>
                      <p>{article.content}</p>
                    </div>
                  ))}
                </div>

                <p className="agreement-date">{agreementData?.date}</p>

                {/* ✅ 서명 박스들 - 제휴 업무협약서 레이아웃 내부 */}
                <div className="signatures">
                  {signatures.map((sig, index) => (
                    <div key={index} className="signature-box">
                      <h4>{sig.party}</h4>
                      <p>{sig.representative}</p>
                      <p>{sig.signature}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* ✅ 서명하기 버튼들 - 제휴 업무협약서 레이아웃 밖, 전체 레이아웃 안(큰 컨테이너 내부) */}
            {!isLoading && (
              <>
                <div className="signature-buttons-section">
                  <div className="signature-buttons">
                    {signatures.map((sig, index) => (
                      <div key={index} className="signature-button-container">
                        {sig.party === "성신총학_소망이랑" ? (
                          <button 
                            className={`sign-btn ${sig.isSigned ? 'signed' : 'active'}`}
                            onClick={() => handleSign(index)}
                            disabled={sig.isSigned}
                          >
                            {sig.isSigned ? '서명 완료' : '서명하기'}
                          </button>
                        ) : (
                          <button className={`sign-btn disabled ${partnerRequestSent ? 'requested' : ''}`} disabled>
                            {partnerRequestSent ? '서명 완료' : '서명하기'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="signature-note">
                  서명 후 아래 '완료' 버튼을 눌러야 협약이 최종 완료됩니다.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ✅ 푸터 */}
        <footer className="page-footer">
          <div className="footer-buttons">
            <button className="cancel-btn" onClick={handleCancel}>
              변환 취소
            </button>
            <button 
              className={`complete-btn ${
                (signatures.find(s => s.party === "성신총학_소망이랑")?.isSigned && partnerRequestSent)
                  ? 'enabled'
                  : 'disabled'
              } ${isCompleted ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
              onClick={handleComplete}
              disabled={!(signatures.find(s => s.party === "성신총학_소망이랑")?.isSigned && partnerRequestSent)}
            >
              {/* ✅ 버튼 텍스트 동적 변경 */}
              {!isCompleted ? '완료' : isEditing ? '수정 완료' : '수정'}
            </button>
          </div>
        </footer>
      </div>

      {/* ✅ 제휴 서명 요청 팝업 */}
      {showSignaturePopup && (
        <div className="signature-request-popup">
          <div className="popup-content">
            <div className="popup-title">제휴 동의 요청 보내기</div>
            <div className="popup-subtitle">
              상대에게 제휴 동의를 요청하시겠습니까?<br />
              한번 전송하면 취소할 수 없습니다.
            </div>
            <div className="popup-buttons">
              <button className="close-btn" onClick={closeSignaturePopup}>
                닫기
              </button>
              <button className="send-btn" onClick={handleSendRequest}>보내기</button>
            </div>
          </div>
        </div>
      )}
      {showSentPopup && (
        <div className="signature-request-popup">
          <div className="popup-content">
            <div className="popup-title">전송이 완료되었습니다</div>
            <div className="popup-subtitle">상대방에게 제휴 동의 요청을 전송했어요.</div>
            <div className="popup-buttons">
              <button className="send-btn" onClick={closeSentPopup}>확인</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}