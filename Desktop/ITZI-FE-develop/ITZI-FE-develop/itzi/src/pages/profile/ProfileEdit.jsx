import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../../components/profile/ImageUploader";
import SelectField from "../../components/profile/SelectField";
import TagInput from "../../components/profile/TagInput";
import ExploreSection from "../../components/profile/ExploreSection";

const purposeOptions = [
  { value: "explore",   label: "혜택 탐색" },
  { value: "promotion", label: "제휴 및 혜택 홍보" },
];

const accountTypeOptions = [
  { value: "school",     label: "학교" },
  { value: "department", label: "학과" },
  { value: "club",       label: "동아리/소모임" },
  { value: "store",      label: "매장" },
];

const storeIndustryOptions = [
  { value: "food-cafe",   label: "음식점/카페" },
  { value: "fashion",     label: "의류/패션" },
  { value: "beauty",      label: "뷰티/미용" },
  { value: "fitness",     label: "헬스/피트니스" },
  { value: "stationery",  label: "문구/서점" },
  { value: "living",      label: "생활/잡화" },
  { value: "medical",     label: "병원/약국" },
  { value: "electronics", label: "전자/IT" },
  { value: "transport",   label: "교통/이동" }
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileEdit() {
  const nav = useNavigate();

  const [profileName, setProfileName] = useState("");
  const [userName, setUserName]       = useState("");
  const [phone, setPhone]             = useState("");
  const [email, setEmail]             = useState("");

  const [purpose, setPurpose]         = useState(purposeOptions[0].value); // 토글 항상 수정 가능
  const [accountType, setAccountType] = useState("");

  const [primaryName, setPrimaryName]       = useState("");
  const [deptName, setDeptName]             = useState("");
  const [repPhone, setRepPhone]             = useState("");
  const [address, setAddress]               = useState("");
  const [representative, setRepresentative] = useState("");
  const [link, setLink]                     = useState("");
  const [oneLine, setOneLine]               = useState("");

  const [industry, setIndustry]         = useState("");
  const [openingHours, setOpeningHours] = useState("");

  const [keywords, setKeywords] = useState([]);

  const [schoolName, setSchoolName] = useState("");
  const [interests, setInterests]   = useState([]); // string[]

  const formatPhone = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const placeholders = (() => {
    switch (accountType) {
      case "school":
        return {
          primary: "학교 이름 (예: 00대학교 / '00대' X)",
          dept: "부서명 또는 담당 부서",
          repPhone: "대표 전화번호",
          address: "주소",
          repName: "대표자 이름",
          link: "관련 링크",
          oneLine: "프로필 한 줄 소개 (50자 이내)",
        };
      case "department":
        return {
          primary: "학교 이름 (예: 00대학교 / '00대' X)",
          dept: "학과 부서명 또는 담당 부서",
          repPhone: "대표 전화번호",
          address: "주소",
          repName: "대표자 이름",
          link: "관련 링크",
          oneLine: "프로필 한 줄 소개 (50자 이내)",
        };
      case "club":
        return {
          primary: "동아리 이름",
          dept: "부서명 또는 담당 부서(선택)",
          repPhone: "대표 전화번호",
          address: "주소",
          repName: "대표자 이름",
          link: "관련 링크",
          oneLine: "프로필 한 줄 소개 (50자 이내)",
        };
      case "store":
        return {
          primary: "매장 이름",
          dept: "부서명 또는 담당 부서(선택)",
          repPhone: "대표 전화번호",
          address: "주소",
          repName: "대표자 이름",
          link: "관련 링크",
          oneLine: "매장 한 줄 소개 (50자 이내)",
        };
      default:
        return {
          primary: "계정 유형을 먼저 선택해 주세요",
          dept: "부서명 또는 담당 부서",
          repPhone: "대표 전화번호",
          address: "주소",
          repName: "대표자 이름",
          link: "관련 링크",
          oneLine: "프로필 한 줄 소개 (50자 이내)",
        };
    }
  })();

  // 저장 가능 여부 (promotion일 때만 추가 검증)
  const canSubmit = useMemo(() => {
    if (!profileName.trim()) return false;
    if (!userName.trim()) return false;
    if (!phone.trim()) return false;
    if (!emailRegex.test(email.trim())) return false;

    if (purpose === "promotion") {
      if (!accountType) return false;
      if (!primaryName.trim()) return false;
      if (oneLine.length > 50) return false;
      if (accountType === "store" && !industry) return false;
    }
    return true;
  }, [
    profileName, userName, phone, email,
    accountType, primaryName, oneLine, industry,
    purpose,
  ]);

  const onSave = (e) => {
    e.preventDefault();
    if (!canSubmit) {
      alert("필수 항목을 확인해 주세요.");
      return;
    }
    console.log({
      purpose, // 선택된 목적
      // 공통
      profileName, userName, phone, email,
      // promotion
      accountType, primaryName, deptName, repPhone, address,
      representative, link, oneLine, industry, openingHours, keywords,
      // explore
      schoolName, interests,
    });
    nav(-1);
  };

  return (
    <div className="profile-edit">
      <h1 className="title">프로필 수정</h1>

      <div className="panel">
        <form className="card" onSubmit={onSave}>
          {/* 1) 프로필 사진 */}
          <section className="block profile-photo-block">
            <h2 className="block-title">프로필 사진</h2>
            <div className="photo-center">
              <ImageUploader size={120} onChange={(f) => console.log("image:", f)} />
            </div>
          </section>

          {/* 2) 기본 정보 */}
          <section className="block">
            <h2 className="block-title">기본 정보</h2>
            <div className="grid">
              <label className="field input-with-colored-asterisk">
                <div className="control">
                  <span className="asterisk" aria-hidden="true">*</span>
                  <input
                    className="input"
                    aria-label="프로필 이름"
                    aria-required="true"
                    placeholder="프로필 이름"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>
              </label>

              <label className="field input-with-colored-asterisk">
                <div className="control">
                  <span className="asterisk" aria-hidden="true">*</span>
                  <input
                    className="input"
                    aria-label="사용자(본인) 이름"
                    aria-required="true"
                    placeholder="사용자(본인) 이름"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </label>

              <label className="field input-with-colored-asterisk">
                <div className="control">
                  <span className="asterisk" aria-hidden="true">*</span>
                  <input
                    className="input"
                    aria-label="휴대폰 번호"
                    aria-required="true"
                    placeholder="휴대폰 번호"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                  />
                </div>
              </label>

              <label className="field input-with-colored-asterisk">
                <div className="control">
                  <span className="asterisk" aria-hidden="true">*</span>
                  <input
                    className="input"
                    aria-label="이메일"
                    aria-required="true"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {!emailRegex.test(email) && email.length > 0 && (
                  <small className="hint error">이메일 형식을 확인해 주세요.</small>
                )}
              </label>
            </div>
          </section>

          {/* 3) 서비스 사용 목적 (항상 수정 가능) */}
          <section className="block">
            <h2 className="block-title">서비스 사용 목적</h2>
            <SelectField
              value={purpose}
              options={purposeOptions}
              onChange={setPurpose}
              placeholder="서비스 사용 목적"
              panelHeight={120}
              width={423}
            />
            <div className="custom-divider" />
          </section>

          {/* 4) 분기 렌더 */}
          {purpose === "explore" ? (
            <ExploreSection
              schoolName={schoolName}
              setSchoolName={setSchoolName}
              interests={interests}
              setInterests={setInterests}
              categories={storeIndustryOptions} // 옵션 재활용
              max={5}
            />
          ) : (
            <>
              {/* === promotion 화면 === */}
              <section className="block">
                <h2 className="block-title">계정 유형 선택</h2>
                <label className="field input-with-colored-asterisk">
                  <div className="control">
                    <span className="asterisk" aria-hidden="true">*</span>
                    <SelectField
                      value={accountType}
                      options={accountTypeOptions}
                      onChange={(v) => {
                        setAccountType(v);
                        setPrimaryName("");
                        setDeptName("");
                        setIndustry("");
                        setOpeningHours("");
                      }}
                      placeholder="계정의 유형을 선택해 주세요"
                      panelHeight={220}
                      width={423}
                    />
                  </div>
                </label>
              </section>

              <section className="block">
                <h2 className="block-title">상세 정보</h2>
                <div className="grid">
                  {/* ✅ 별표 + 패딩 적용 위해 control 래퍼 추가 */}
                  <label className="field input-with-colored-asterisk">
                    <div className="control">
                      <span className="asterisk" aria-hidden="true">*</span>
                      <input
                        className="input"
                        aria-label={placeholders.primary}
                        aria-required="true"
                        placeholder={placeholders.primary}
                        value={primaryName}
                        onChange={(e) => setPrimaryName(e.target.value)}
                      />
                    </div>
                  </label>

                  {accountType !== "store" && (
                    <label className="field">
                      <input
                        className="input"
                        aria-label={placeholders.dept}
                        placeholder={placeholders.dept}
                        value={deptName}
                        onChange={(e) => setDeptName(e.target.value)}
                      />
                    </label>
                  )}

                  {accountType === "store" && (
                    <>
                      {/* ✅ 업종도 별표 필요 → control 래퍼 추가 */}
                      <label className="field input-with-colored-asterisk">
                        <div className="control">
                          <span className="asterisk" aria-hidden="true">*</span>
                          <SelectField
                            value={industry}
                            options={storeIndustryOptions}
                            onChange={setIndustry}
                            placeholder="업종을 선택해 주세요"
                            panelHeight={520}
                            width={423}
                          />
                        </div>
                      </label>

                      <label className="field">
                        <input
                          className="input"
                          aria-label="운영 시간"
                          placeholder="운영 시간 (예: 매일 10:00 - 21:00)"
                          value={openingHours}
                          onChange={(e) => setOpeningHours(e.target.value)}
                        />
                      </label>
                    </>
                  )}

                  <label className="field">
                    <input
                      className="input"
                      aria-label={placeholders.repPhone}
                      placeholder={placeholders.repPhone}
                      value={repPhone}
                      onChange={(e) => setRepPhone(formatPhone(e.target.value))}
                    />
                  </label>

                  <label className="field">
                    <input
                      className="input"
                      aria-label={placeholders.address}
                      placeholder={placeholders.address}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </label>

                  <label className="field">
                    <input
                      className="input"
                      aria-label={placeholders.repName}
                      placeholder={placeholders.repName}
                      value={representative}
                      onChange={(e) => setRepresentative(e.target.value)}
                    />
                  </label>

                  <label className="field">
                    <input
                      className="input"
                      aria-label={placeholders.link}
                      placeholder={placeholders.link}
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </label>

                  <label className="field span-2">
                    <textarea
                      className="textarea"
                      rows={3}
                      aria-label={placeholders.oneLine}
                      placeholder={placeholders.oneLine}
                      value={oneLine}
                      maxLength={50}
                      onChange={(e) => setOneLine(e.target.value)}
                    />
                  </label>
                </div>
              </section>

              <section className="block">
                <h2 className="block-title">키워드</h2>
                <p className="tooltip">
                  홍보 및 검색 노출에 활용될 키워드를 입력해주세요. (최대 5개)
                </p>
                <TagInput
                  value={keywords}
                  onChange={setKeywords}
                  max={5}
                  placeholder="키워드를 입력해 주세요. ex) 맛집, 대학생"
                />
              </section>
            </>
          )}

          {/* 저장 */}
          <div className="actions">
            <button className="btn-save" type="submit" disabled={!canSubmit}>
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
