import x from "../../assets/img/x.png"
import { useState } from "react";
import xButton from "../../assets/img/xButton.png"
import Dropdown from "../../components/common/Dropdown.jsx"
import { useEffect } from "react";
import axios from "axios";

const CooperationModal = ({onClose, onSend}) => {

  const [kwInput, setKwInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [detail, setDetail]   = useState('');
  const [content,setContent] = useState(null);
  

  const postId=33;
  const userId=1;
  const receiverId =20; 

  const callApi = async () => {
    const periodType = date.mode === "manual" ? "CUSTOM" : "SAME_AS_POST";
    const orgType    = organization.mode === "manual" ? "CUSTOM" : "AUTO";

    const payload = {
      receiverId,
      postId,
      purpose: purpose.trim(),
      periodType,
      ...(periodType === "CUSTOM" ? { periodValue: date.text.trim() } : {}),
      orgType,
      ...(orgType === "CUSTOM" ? { orgValue: organization.text.trim() } : {}),
      detail: detail.trim(),
      content: null,  
      keywords,                   
    };

    console.log("payload : ", payload);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `https://api.onlyoneprivate.store/partnership/${userId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("res.data:", data);

      const contentFromAI = data.result.content;
      setContent(contentFromAI);

      console.log(contentFromAI);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const patchContent = async() => {
    try{
      const url = `https://api.onlyoneprivate.store/partnership/${data.result.partnershipId}/send`;

      const payload = {
        content: content.trim(),
      }

      console.log("patch")

      const {data} = await axios.patch(url, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch(err) {
      console.log(err);
    } finally{
      console.log("연동 성공");
    }
  }

  const MAX = 5; // 키워드 최대 개수 
  const MAX_LEN = 10; // 한 키워드 최대 길이 

  const [date, setDate]   = useState({ mode: 'same', text: '' }); // 희망 제휴 시간 
  const [organization, setOrganization] = useState({ mode: 'auto', text: '' }); // 우리 단체 정보 

  const addKeywordsFromString = (raw) => {
    if (!raw) return;
    const exist = new Set(keywords.map(k => k.toLowerCase())); // 중복 방지(대소문자 무시)
    const incoming = raw.split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.slice(0, MAX_LEN)); // 10자 제한(길면 잘라냄)

    const next = [...keywords];
    for (const token of incoming) {
      if (next.length >= MAX) break;
      if (!exist.has(token.toLowerCase())) {
        next.push(token);
        exist.add(token.toLowerCase());
      }
    }
    setKeywords(next);
  };

  const handleKwChange = (e) => {
    const v = e.target.value;
    // 입력 중 콤마가 들어오면 바로 분리
    if (v.includes(",")) {
      addKeywordsFromString(v);
      setKwInput("");
    } else {
      setKwInput(v);
    }
  };

  const handleKwKeyDown = (e) => {
    // 한글 입력중 조합(IME)일 때는 건너뛰기
    if (e.isComposing) return;

    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeywordsFromString(kwInput);
      setKwInput("");
    }
    // 입력값 없을 때 백스페이스로 마지막 태그 삭제
    if (e.key === "Backspace" && !kwInput && keywords.length) {
      e.preventDefault();
      setKeywords(prev => prev.slice(0, -1));
    }
  };

  const handleKwBlur = () => {
    // 포커스 아웃 시 남은 입력 반영
    if (kwInput) {
      addKeywordsFromString(kwInput);
      setKwInput("");
    }
  };

  const removeKeyword = (idx) => {
    setKeywords(prev => prev.filter((_, i) => i !== idx));
  };


  useEffect(() => {
    console.log(date);
    console.log(organization);
  }, [date, organization]);

  return (
    <div className="cooperationModal" onClick={onClose}>
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <p>샤브온당</p>
          <img src={x} alt="" onClick={onClose}/>
        </div>
        <div className="content">
            <div className="content_left">
              <div className="content_container1">
                <h3>문의 목적</h3>
                <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="ex)예: 학과 행사 간식 제휴, 정기 할인 제휴 등"></input>
              </div>
              <div className="content_container2">
                <h3>희망 제휴 기간</h3>
                <Dropdown
                  preset="sameManual"
                  value={date}
                  onChange={setDate}
                  selectPlaceholder="희망 제휴 기간을 선택 및 작성해 주세요."
                />
              </div>
              <div className="content_container2">
                <h3>우리 단체 정보</h3>
                <Dropdown
                  preset="autoManual"
                  value={organization}
                  onChange={setOrganization}
                  selectPlaceholder="우리 단체 기본 정보를 간단히 작성해 주세요."
                />
              </div>
              <div className="content_container3">
                <h3>문의 내용 상세</h3>
                <textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="어떤 혜택과 방식을 원하는지 자유롭게 작성해 주세요."></textarea>
              </div>
              <div className="content_container4">
                <div className="content_header">
                  <h3>AI 작성 요청 키워드 입력</h3>
                  <p>AI 작성 참고용 키워드를 입력해보세요!(10자 이내/최대 5개)</p>
                </div>
                <input
                  type="text"
                  value={kwInput}
                  onChange={handleKwChange}
                  onKeyDown={handleKwKeyDown}
                  onBlur={handleKwBlur}
                  placeholder="ex) 예: 친절함, 제목 필수, 기승전결"
                />
                <div className="ai_keyword_box">
                  {keywords.map((kw, i) => (
                    <span className="chip" key={`${kw}-${i}`}>
                      {kw}
                      <img src={xButton} alt="" className="chip-x" onClick={() => removeKeyword(i)}/>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="content_center"></div>
            <div className="content_right">
                <h3>AI 문의 글 작성</h3>
                <div className="ai_box">
                  {content === null && 
                    <div className="click" onClick={callApi}>
                        <p>{loading? '변환 중입니다..' : "AI문의 글 변환"}</p>
                    </div>          
                  }
                  {content !== null && (
                    <textarea className="AI_content" value={content} onChange={(e) => setContent(e.target.value)}/>
                  )}
                </div>
            </div>
        </div>
        <div className="Button">
          <div className="sendbutton" onClick={patchContent} >
            보내기
          </div>
        </div>
      </div>
    </div>
  )
}

export default CooperationModal

