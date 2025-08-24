import prior from "../../assets/img/priorbutton.png"
import colorScrab from "../../assets/img/colorscrab.png"
import share from "../../assets/img/share.png"
import emptyStar from "../../assets/img/emptystar.png"
import filledStar from "../../assets/img/star.png"
import { useState, useEffect } from "react"
import axios from "axios"

const BenefitList = () => {

  const [data, setData] = useState(null);

  // API 호출 함수 
  const callApi = () => {
    axios.get(`https://api.onlyoneprivate.store/promotion/${postId}`).then((res) => {
      console.log("res : ", res);
      console.log("res.data :", res.data);
      setData(res.data);
    })
    .catch((err) => {
      console.log("에러 : ", err);
    })
  }

  const postId=2;

  const keywords = data?.result?.sender?.keywords ?? [];
  const rating = Math.max(0, Math.min(Number(data?.result?.sender?.rating ?? 0), 5));
  const filledCount = Math.floor(rating);

  useEffect(() => {
    callApi();
  }, [postId]);

  return (
    <div className="benefitlist">
      <div className="header">
        <img src={prior} alt="" />
        <div className="scrap">
            <h3>성신여자대학교</h3>
            <h3>컴퓨터공학과</h3>
            <h3>AI 학과</h3>
        </div>
        <p>학생들이 많이 스크랩했어요!</p>
      </div>
      <div className="container">
        <div className="inner_header">
          <div className="inner_header_left">
            <div className="day">D-21</div>
            <div className="category">{data?.result?.category}</div>
          </div>
          <div className="inner_header_right">
            <p className="count">{data?.result?.bookmarkCount}</p>
            <img className = "colorscrab" src={colorScrab} alt="" />
            <img className="share" src={share} alt="" />
          </div>
        </div>
        <div className="title">
          <h3>{data?.result?.title}</h3>
        </div>
        <div className="box1">
          <div className="box1_left">
            <div className="line">
              <p className="title">대상</p>
              <p>|</p>
              <p>{data?.result?.target}</p>
            </div>
            <div className="line">
              <p className="title">기간</p>
              <p>|</p>
              <p>{data?.result?.startDate} ~ {data?.result?.endDate}</p>
            </div>
            <div className="line">
              <p className="title">혜택</p>
              <p>|</p>
              <p>{data?.result?.benefit}</p>
            </div>
            <div className="line">
              <p className="title">조건</p>
              <p>|</p>
              <p>{data?.result?.condition}</p>
            </div>
          </div>
          <div className="box1_right">
            <img src={data?.result?.postImage} alt="" />
          </div>
        </div>
        <div className="detail">
          <h3>상세 내용</h3>
          <div className="content">
            {data?.result?.content}
          </div>
        </div>
        <div className="box2">
          <h3>정보</h3>
          <div className="shop_detailbox">
            <div className="box2_left">
              <div className="top">
                <div className="top_left">
                  <img className="storeImage" src={data?.result?.sender?.image} alt="" />
                </div>
                <div className="top_right">
                  <div className="star">
                    {Array.from({ length: 5 }, (_, i) => (
                      <img
                        key={i}
                        src={i < filledCount ? filledStar : emptyStar}
                        alt={i < filledCount ? "별 채움" : "별 비움"}
                      />
                    ))}
                  </div>
                  <div className="store_name">{data?.result?.sender?.name}</div>
                </div>
              </div>
              <div className="center">
                <p>{data?.result?.sender?.info}</p>
              </div>
              <div className="bottom">
                {keywords.length>0? (
                  keywords.map((kw,i) => (
                    <div className="tag" key={`${kw}-${i}`}>{kw}</div>
                  ))
                ) : (
                  <div className="tag">키워드 없음</div>
                )}
              </div>
            </div>
            <div className="box2_center">

            </div>
            <div className="box2_right">
              <div className="line">
                <div className="line_title">
                  <p>업종</p>
                  <p>|</p>
                </div>
                <p>{data?.result?.category}</p>
              </div>
              <div className="line">
                <div className="line_title">
                  <p>운영시간</p>
                  <p>|</p>
                </div>
                <p>{data?.result?.author?.operatingHours ?? null}</p>
              </div>
              <div className="line">
                <div className="line_title">
                  <p>전화번호</p>
                  <p>|</p>
                </div>
                <p>{data?.result?.sender?.phone}</p>
              </div>
              <div className="line">
                <div className="line_title">
                  <p>주소</p>
                  <p>|</p>
                </div>
                <p>{data?.result?.sender?.address}</p>
              </div>
              <div className="line">
                <div className="line_title">
                  <p>대표자명</p>
                  <p>|</p>
                </div>
                <p>{data?.result?.sender?.ownerName}</p>
              </div>
              <div className="line">
                <div className="line_title">
                  <p>링크</p>
                  <p>|</p>
                </div>
                <p>{data?.result?.sender?.linkUrl}</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BenefitList
