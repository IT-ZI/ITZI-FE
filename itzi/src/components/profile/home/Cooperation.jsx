import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Banner1 from '../../assets/img/banner_1.png';  // TODO: 추후 slick-dot 없는 제휴를 잇지 버전으로 이미지 파일 변경 필요
import Banner2 from '../../assets/img/banner_2.png';  // TODO: 추후 slick-dot 없는 제휴를 잇지 버전으로 이미지 파일 변경 필요
import SearchIcon from '../../assets/img/ic_search.svg';
import SearchingIcon from '../../assets/img/ic_searching.svg';
import BookmarkOn from '../../assets/img/ic_bookmark_on.svg';
import BookmarkOff from '../../assets/img/ic_bookmark_off.svg';
import PrevIcon from '../../assets/img/ic_prev.svg';
import NextIcon from '../../assets/img/ic_next.svg';
import CaretDown from '../../assets/img/ic_caret_down.svg';

// ✅ 최소추가: 공용 스크랩 저장소 유틸
import { getAll, upsert, toggleScrap, subscribe } from '../../utils/scrapStore';

const SortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = ['마감임박순', '인기순', '최신순', '오래된순'];

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleBlur = (e) => {
    if (!ref.current?.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <div className="sort_dropdown" ref={ref} onBlur={handleBlur}>
      <button
        className="sort_button"
        onClick={() => setOpen(true)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value}
        <img
          src={CaretDown}
          alt=""
          className={`caret ${open ? 'open' : ''}`}
          width={16}
          height={16}
        />
      </button>

      {open && (
        <ul className="sort_menu" role="listbox" aria-label="정렬 방식" tabIndex={-1}>
          {options.map((opt) => (
            <li
              key={opt}
              role="option"
              aria-selected={value === opt}
              className={`sort_option ${value === opt ? 'selected' : ''}`}
              tabIndex={0}
              onClick={() => { onChange(opt); setOpen(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { onChange(opt); setOpen(false); } }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Cooperation = () => {
  const userName = "시현";
  const userUniv = "성신여자대학교";

  const [activeTab, setActiveTab] = useState("전체");

  // ▼ 검색 UI
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);

  const onChangeSearch = (e) => {
    setSearchTerm(e.target.value);
    setSearching(true);
  };
  const onKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      setQuery(searchTerm.trim());
      setSearching(false);
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setSearching(false);
      inputRef.current?.blur();
    }
  };
  const onFocusSearch = () => setSearching(true);
  const onBlurSearch = () => setSearching(false);

  const tabs = ["전체", "매장", "학교", "학과", "동아리/소모임"];

  const [sortBy, setSortBy] = useState('마감임박순');

  const filterOptions = [
    '전체',
    '제휴 모집 중',
    '제휴 요청 가능',
    '간식 행사',
    '협찬',
    '행사/이벤트',
    '할인 혜택',
    '쿠폰 제공',
    '체험 부스',
    '굿즈 증정',
    '설문 참여 리워드',
  ];
  const [selectedFilters, setSelectedFilters] = useState(['전체']);

  const handleFilterClick = (opt) => {
    if (opt === '전체') {
      setSelectedFilters(['전체']);
    } else {
      let updated;
      if (selectedFilters.includes(opt)) {
        updated = selectedFilters.filter((f) => f !== opt);
      } else {
        updated = [...selectedFilters.filter((f) => f !== '전체'), opt];
      }
      if (updated.length === 0) updated = ['전체'];
      setSelectedFilters(updated);
    }
  };

  // 더미 데이터
  const [posts, setPosts] = useState([
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
      negotiable: { target: false, period: true, benefit: true }
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
      negotiable: { target: true, period: true, benefit: true }
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
      negotiable: { target: true, period: true, benefit: true }
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
      negotiable: { target: true, period: true, benefit: false }
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
      negotiable: { target: false, period: true, benefit: true }
    }
  ]);

  // ✅ 최소추가: 저장소 시드 + 외부 변경 구독 (최초 1회)
  useEffect(() => {
    // 1) 현재 카드들을 저장소에 업서트(초기 시드)
    posts.forEach((p) => {
      upsert({
        id: p.id,
        bookmarked: p.bookmarked,
        bookmarkCount: p.bookmarkCount,
        title: p.title,
        image: p.image,
        target: p.target,
        period: p.period,
        benefit: p.benefit,
        dday: p.dday,
      });
    });

    // 2) 저장소 상태로 로컬 posts 동기화
    const store = getAll();
    setPosts((prev) =>
      prev.map((p) => {
        const hit = store.find((x) => x.id === String(p.id));
        return hit
          ? {
              ...p,
              bookmarked: !!hit.scrab_done,
              bookmarkCount:
                typeof hit.scrab_count === 'number' ? hit.scrab_count : p.bookmarkCount,
            }
          : p;
      })
    );

    // 3) 외부 페이지(Select 등)에서 변경되면 실시간 반영
    const unsub = subscribe((list) => {
      setPosts((prev) =>
        prev.map((p) => {
          const hit = list.find((x) => x.id === String(p.id));
          return hit
            ? {
                ...p,
                bookmarked: !!hit.scrab_done,
                bookmarkCount:
                  typeof hit.scrab_count === 'number' ? hit.scrab_count : p.bookmarkCount,
              }
            : p;
        })
      );
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 1회만

  // ✅ 최소수정: 저장소 우선 토글 → 저장소값으로 로컬 반영
  const toggleBookmark = (id) => {
    toggleScrap(id);
    const store = getAll();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const hit = store.find((x) => x.id === String(id));
        return hit
          ? {
              ...p,
              bookmarked: !!hit.scrab_done,
              bookmarkCount:
                typeof hit.scrab_count === 'number' ? hit.scrab_count : p.bookmarkCount,
            }
          : p;
      })
    );
  };

  const parsePeriodEnd = (period) => {
    const end = period.split('~')[1]?.trim()?.replaceAll('.', '-');
    return end ? new Date(end) : new Date();
  };

  const filteredByTab = posts.filter(p => {
    if (activeTab === '전체') return true;
    if (activeTab === '대학생') return p.audience === '대학생';
    return p.univ === activeTab;
  });

  const filteredByCategory = filteredByTab.filter(p => {
    if (selectedFilters.includes('전체')) return true;
    return selectedFilters.includes(p.category);
  });

  const sorted = [...filteredByCategory].sort((a, b) => {
    switch (sortBy) {
      case '마감임박순':
        return a.dday - b.dday;
      case '인기순':
        return b.bookmarkCount - a.bookmarkCount;
      case '최신순':
        return parsePeriodEnd(b.period) - parsePeriodEnd(a.period);
      case '오래된순':
        return parsePeriodEnd(a.period) - parsePeriodEnd(b.period);
      default:
        return 0;
    }
  });

  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [activeTab, selectedFilters, sortBy]);

  const getPageNumbers = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const result = [1];
    const left = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);
    if (left > 2) result.push('…');
    for (let i = left; i <= right; i++) result.push(i);
    if (right < total - 1) result.push('…');
    result.push(total);
    return result;
  };

  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * PAGE_SIZE;
  const toRender = sorted.slice(start, start + PAGE_SIZE);

  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [safePage]);

  return (
    <div className='Cooperation_wrap'>
      {/* 이미지 배너 */}
      <div className="banner_wrap">
        <Slider
          dots
          arrows={false}
          infinite
          autoplay
          autoplaySpeed={2000}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          pauseOnHover
        >
          <div className="banner_slide">
            <img src={Banner1} alt="배너 1" className="banner_image" />
          </div>
          <div className="banner_slide">
            <img src={Banner2} alt="배너 2" className="banner_image" />
          </div>
        </Slider>
      </div>

      {/* 제목 및 검색창 */}
      <div className="here_itzi">
        <h3>잇ZI와 함께 제휴를 시작해보세요 🙌🏻</h3>
        <div className={`search_bar ${searching ? 'active' : ''}`}>
          <img src={searching ? SearchingIcon : SearchIcon} alt="" />
          <input
            ref={inputRef}
            className="search_input"
            type="text"
            placeholder="검색어를 입력해주세요"
            value={searchTerm}
            onChange={onChangeSearch}
            onKeyDown={onKeyDownSearch}
            onFocus={onFocusSearch}
            onBlur={onBlurSearch}
          />
        </div>
      </div>

      {/* 카테고리 및 정렬 */}
      <div className="category">
        <div className="category_tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab_btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="sort">
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* 게시물 필터링 */}
      <div className="post_filters">
        <div className="filter_row">
          <span style={{ marginRight: 8 }}></span>
          <div className="filter_chips">
            {filterOptions.map((opt) => {
              const active = selectedFilters.includes(opt);
              return (
                <button
                  key={opt}
                  className={`chip ${active ? 'active' : ''}`}
                  onClick={() => handleFilterClick(opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 목록 */}
      <div className="category_content" ref={listRef}>
        <div className="grid">
          {toRender.length === 0 ? (
            <div className="no_posts">표시할 혜택이 없습니다.</div>
          ) : (
            toRender.map(post => (
              <div key={post.id} className="card">
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
                      <button className="bookmark_btn" onClick={() => toggleBookmark(post.id)}>
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
            ))
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button
          className="icon_btn prev"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={safePage === 1}
          aria-label="이전 페이지"
        >
          <img src={PrevIcon} alt="" />
        </button>

        {getPageNumbers(safePage, totalPages).map((n, idx) =>
          n === '…' ? (
            <span key={`ellipsis-${idx}`} className="ellipsis">…</span>
          ) : (
            <button
              key={n}
              className="page_btn"
              onClick={() => setPage(n)}
              aria-current={safePage === n ? 'page' : undefined}
              aria-label={`${n} 페이지로 이동`}
            >
              {n}
            </button>
          )
        )}

        <button
          className="icon_btn next"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={safePage === totalPages}
          aria-label="다음 페이지"
        >
          <img src={NextIcon} alt="" />
        </button>
      </div>
    </div >
  )
}

export default Cooperation
