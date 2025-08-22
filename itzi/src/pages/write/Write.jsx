import React from 'react';

const Write = () => {
    return (
        <div className='Write_wrap'>
            <div className="write_header">
                <img src="" alt="" />
                <h3>제휴 모집 글쓰기</h3>
            </div>
            <div className="write_body">
                <h4>사진 업로드</h4>
                <div className="img_section">
                    <img src="" alt="" />
                </div>

                <h4>기본 정보</h4>
                <input type="text" className="board_input" placeholder='모집 글 제목' />
                <div className="coop">
                    <input type="text" className="board_input" placeholder='모집 글 제목' />
                    <div className="check">
                        
                    </div>
                </div>
            </div>
            <div className="write_footer">
                <div className="footer_left">
                    <button></button>
                    <button></button>
                </div>
                <div className="footer_right">
                    <button></button>
                    <button></button>
                </div>
            </div>
        </div>
    )
}

export default Write
