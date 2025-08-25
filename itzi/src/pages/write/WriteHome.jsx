import React, { useState } from 'react';
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import profileImage from "../../assets/img/profile2.png";
import step1 from "../../assets/img/step1.png";
import step2 from "../../assets/img/step2.png";
import step3 from "../../assets/img/step3.png";
import Banner1 from "../../assets/img/banner_1.png";
import Banner2 from "../../assets/img/banner_2.png";
import BookmarkOn from "../../assets/img/ic_bookmark_on.svg";
import BookmarkOff from "../../assets/img/ic_bookmark_off.svg";

const Card = ({ post, onToggleBookmark }) => {
    return (
        <div className="card">
            <div className="thumb">
                <div className="img_wrap">
                    <img src={post.image} alt={post.title} />
                </div>
                <div className="badge">D-{post.dday} 제휴 모집 중</div>
            </div>

            <div className="card_body">
                <div className="title_row">
                    <div className="title">{post.title}</div>
                    <div className="bookmark_wrap">
                        <span className="bookmark_count">{post.bookmarkCount}</span>
                        <button className="bookmark_btn" onClick={() => onToggleBookmark(post.id)}>
                            <img src={post.bookmarked ? BookmarkOn : BookmarkOff} alt="bookmark" />
                        </button>
                    </div>
                </div>

                <div className="row">
                    <span className="label">대상</span>
                    <span className="section">|</span>
                    <span>{post.target}</span>
                    {post.negotiable?.target && <span className="tag">협의 가능</span>}
                </div>
                <div className="row">
                    <span className="label">기간</span>
                    <span className="section">|</span>
                    <span>{post.period}</span>
                    {post.negotiable?.period && <span className="tag">협의 가능</span>}
                </div>
                <div className="row">
                    <span className="label">혜택</span>
                    <span className="section">|</span>
                    <span>{post.benefit}</span>
                    {post.negotiable?.benefit && <span className="tag">협의 가능</span>}
                </div>
            </div>
        </div>
    );
};

/* ---------- 그리드 래퍼 ---------- */
const CardGrid = ({ initial }) => {
    const [posts, setPosts] = useState(initial);

    const toggleBookmark = (id) => {
        setPosts(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, bookmarked: !p.bookmarked, bookmarkCount: p.bookmarkCount + (p.bookmarked ? -1 : 1) }
                    : p
            )
        );
    };

    if (posts.length === 0) {
        return (
            <div className="empty_message">
                아직 작성한 홍보 게시글이 없습니다.<br />
                제휴 외에도 자체 혜택과 이벤트를 자유롭게 홍보해 보세요!
            </div>
        );
    }

    return (
        <div className="category_content">
            <div className="grid">
                {posts.map(p => (
                    <Card key={p.id} post={p} onToggleBookmark={toggleBookmark} />
                ))}
            </div>
        </div>
    );
};

/* ---------- 탭: 제휴 모집 게시글 ---------- */
export const RecruitTab = () => {
    const dummy = [
        {
            id: 1,
            title: "성신여대 X 카페 스피호",
            image: Banner1,
            target: "성신여대 재학생",
            period: "2025.09.01 ~ 2025.12.31",
            benefit: "아메리카노 20% 할인",
            bookmarkCount: 12,
            bookmarked: false,
            dday: 20,
            negotiable: { target: false, period: true, benefit: true },
        },
        {
            id: 2,
            title: "성신여대 X 체리블라썸나이스",
            image: Banner2,
            target: "성신여대 학생증 소지자",
            period: "2025.09.10 ~ 2025.12.31",
            benefit: "디저트 세트 15% 할인",
            bookmarkCount: 8,
            bookmarked: true,
            dday: 50,
            negotiable: { target: true, period: true, benefit: true },
        },
        {
            id: 3,
            title: "성신여대 X 빵굽는하루",
            image: Banner1,
            target: "성신여대 재학생",
            period: "2025.08.20 ~ 2025.10.30",
            benefit: "모든 빵 10% 할인",
            bookmarkCount: 5,
            bookmarked: false,
            dday: 3,
            negotiable: { target: true, period: true, benefit: true },
        },
        {
            id: 4,
            title: "성신여대 X 라떼하우스",
            image: Banner2,
            target: "성신여대 학생/교직원",
            period: "2025.09.15 ~ 2025.11.30",
            benefit: "라떼 메뉴 무료 사이즈업",
            bookmarkCount: 15,
            bookmarked: true,
            dday: 15,
            negotiable: { target: true, period: true, benefit: false },
        },
        {
            id: 5,
            title: "성신여대 X 스윗티드링크",
            image: Banner1,
            target: "성신여대 재학생",
            period: "2025.09.01 ~ 2025.12.15",
            benefit: "음료 1+1 이벤트",
            bookmarkCount: 20,
            bookmarked: false,
            dday: 30,
            negotiable: { target: false, period: true, benefit: true },
        },
    ];
    return <CardGrid initial={dummy} />;
};

/* ---------- 탭: 혜택 홍보 게시글 (예시 더미) ---------- */
export const BenefitTab = () => {
    const dummy = [
        {
            id: 101,
            title: "가을 축제 부스 혜택 안내",
            image: Banner2,
            target: "성신여대 재학생",
            period: "2025.09.20 ~ 2025.10.05",
            benefit: "게임 참여 시 굿즈 증정",
            bookmarkCount: 9,
            bookmarked: false,
            dday: 12,
            negotiable: { target: true, period: true, benefit: true },
        },
        {
            id: 102,
            title: "총학 특별 쿠폰 배포",
            image: Banner1,
            target: "학생증 소지자",
            period: "2025.09.01 ~ 2025.09.30",
            benefit: "제휴 매장 10% 쿠폰",
            bookmarkCount: 17,
            bookmarked: true,
            dday: 5,
            negotiable: { target: false, period: false, benefit: true },
        },
    ];
    return <CardGrid initial={dummy} />;
};

const WriteHome = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isRecruitTab = location.pathname.includes("/cooperation/write/recruit");
    const isBenefitTab = location.pathname.includes("/cooperation/write/benefit");

    const ctaLabel = isBenefitTab ? "+ 혜택 홍보 글쓰기" : "+ 제휴 모집 글쓰기";
    const ctaTarget = isBenefitTab ? "/cooperation/write/benefit/new" : "/cooperation/write/new";


    // 제휴 요청 가능 on/off
    const [requestable, setRequestable] = useState(true);

    return (
        <div className='Writehome_wrap'>
            <aside className='profile'>
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
                    <button>프로필 수정</button>
                </div>
                <div className="home">
                    <button>홈</button>
                </div>
                <div className="cooperation">
                    <div className="write">
                        <p>게시판 글쓰기</p>
                        <button
                            className="list1"
                            onClick={() => navigate("/cooperation/write/recruit")}
                        >
                            제휴 모집/ 혜택 홍보 글쓰기
                        </button>
                    </div>
                    <div className="step_container">
                        <p>제휴 맺기</p>
                        <div className="step">
                            <button className="list2">
                                <img src={step1} alt="" />
                                <p>선택하기</p>
                            </button>
                            <button className="list2">
                                <img src={step2} alt="" />
                                <p>제휴 맺기</p>
                            </button>
                            <button className="list2">
                                <img src={step3} alt="" />
                                <p>진행하기</p>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="logout">
                    <button>로그아웃</button>
                </div>
            </aside>
            <main className='board'>
                <div className="board_head">
                    <div className="subtitle">게시판 글쓰기</div>
                    <h3 className="title">제휴 모집 / 혜택 홍보 글쓰기</h3>
                </div>
                <div className="board_top">
                    <div className="tabs">
                        <NavLink to="/cooperation/write/recruit" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
                            제휴 모집 게시글
                        </NavLink>
                        <NavLink to="/cooperation/write/benefit" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
                            혜택 홍보 게시글
                        </NavLink>
                    </div>
                    <div className="right_tools">
                        <div className="switch_row">
                            <span>제휴 요청 가능 상태</span>
                            <button
                                className={`seg_toggle ${requestable ? 'on' : 'off'}`}
                                onClick={() => setRequestable(v => !v)}
                                aria-pressed={requestable}
                                aria-label={`제휴 요청 가능 ${requestable ? 'on' : 'off'}`}
                                type="button"
                            >
                                <span className="opt off">off</span>
                                <span className="opt on">on</span>
                                <span className="knob" />
                            </button>
                        </div>

                        <button
                            className="write_btn"
                            onClick={() => navigate(ctaTarget)}
                        >
                            {ctaLabel}
                        </button>
                    </div>
                </div>
                {/* 탭 컨텐츠 */}
                <div className="board_body">
                    <Outlet />
                </div>
            </main >
        </div >
    )
}

export default WriteHome
