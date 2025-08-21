import prior from "../../assets/img/priorbutton.png"
import colorScrab from "../../assets/img/colorscrab.png"
import share from "../../assets/img/share.png"
import Image from "../../assets/img/shabuimage.png"
import storeImage from "../../assets/img/ramenstore.png"
import filledStar from "../../assets/img/star.png"
import Modal from "./cooperationModal"
import { useState } from "react"

const Cooperationlist = () => {

  const [isOpen, setIsOpen] = useState(false); 

  const openModal = () => {
    setIsOpen(true);
  }
  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <div className="cooperationlist">
      <div className="header">
        <img src={prior} alt="" />
      </div>
      <div className="total">
        <div className="container">
          <div className="inner_header">
            <div className="inner_header_left">
              <div className="day">D-18 제휴 모집 중</div>
              <div className="category">음식점/카페</div>
            </div>
            <div className="inner_header_right">
              <p className="count">29</p>
              <img className = "colorscrab" src={colorScrab} alt="" />
              <img className="share" src={share} alt="" />
            </div>
          </div>
          <div className="title">
            <h3>샤브온당 제휴 모집 - 편하게 문의해주세요!</h3>
          </div>
          <div className="box1">
            <div className="box1_left">
              <div className="line">
                <p className="title">대상</p>
                <p>|</p>
                <p>성신여대 제적생 및 교직원 대상</p>
              </div>
              <div className="line">
                <p className="title">기간</p>
                <p>|</p>
                <p>2025.09.01 ~ 2025.09.14</p>
              </div>
              <div className="line">
                <p className="title">혜택</p>
                <p>|</p>
                <p>매장 식사 시, 음료 1인당 1캔 무료 제공</p>
              </div>
              <div className="line">
                <p className="title">조건</p>
                <p>|</p>
                <p>성신여대 학생증 및 교직원증, 증명서 제시</p>
              </div>
            </div>
            <div className="box1_right">
              <img src={Image} alt="" />
            </div>
          </div>
          <div className="detail">
            <h3>상세 내용</h3>
            <div className="content">
              [성신여대 X 라라면가 상권 제휴] <br/><br/>
              안녕하세요, 성신여대 제37대 총학생회입니다.<br/>
              이번에는 라라면가와 함께 성신여대 재적생 및 교직원분들을 위한 특별 제휴를 진행합니다.
            </div>
          </div>
          <div className="box2">
            <h3>정보</h3>
            <div className="shop_detailbox">
              <div className="box2_left">
                <div className="top">
                  <div className="top_left">
                    <img className="storeImage" src={storeImage} alt="" />
                  </div>
                  <div className="top_right">
                    <div className="star">
                      <img src={filledStar} alt="" />
                      <img src={filledStar} alt="" />
                      <img src={filledStar} alt="" />
                      <img src={filledStar} alt="" />
                      <img src={filledStar} alt="" />
                    </div>
                    <div className="store_name">라라면가</div>
                  </div>
                </div>
                <div className="center">
                  <p>생방송투데이 출연<br/>성북구 성신여대 맛집 라라면가 입니다.</p>
                </div>
                <div className="bottom">
                  <div className="tag">성신여대 맛집</div>
                  <div className="tag">면요리</div>
                  <div className="tag">중화풍요리</div>
                  <div className="tag">우육탕면</div>
                  <div className="tag">꿔바로우</div>
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
                  <p>음식점 / 카페</p>
                </div>
                <div className="line">
                  <div className="line_title">
                    <p>운영시간</p>
                    <p>|</p>
                  </div>
                  <p>매일 11:30 - 21:00 / 브레이크 타임 16:00 -17:00</p>
                </div>
                <div className="line">
                  <div className="line_title">
                    <p>전화번호</p>
                    <p>|</p>
                  </div>
                  <p>0507-1309-4851</p>
                </div>
                <div className="line">
                  <div className="line_title">
                    <p>주소</p>
                    <p>|</p>
                  </div>
                  <p>서울 성북구 동소문로22길 57-25 1층</p>
                </div>
                <div className="line">
                  <div className="line_title">
                    <p>대표자명</p>
                    <p>|</p>
                  </div>
                  <p>최중면</p>
                </div>
                <div className="line">
                  <div className="line_title">
                    <p>링크</p>
                    <p>|</p>
                  </div>
                  <p>https://blog.naver.com/ns9277</p>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="cooperation_button" onClick={openModal}>
          <p>제휴</p>
          <p>문의하기</p>
        </div>
        {isOpen && <Modal onClose={closeModal}/>}
      </div>
    </div>
  )
}

export default Cooperationlist
