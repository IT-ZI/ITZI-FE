import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const Write = () => {
    const [endDate, setEndDate] = useState(null);

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
                    <div className="discription">사진 불러오기</div>
                </div>

                <h4>기본 정보</h4>
                <input type="text" className="board_input" placeholder='모집 글 제목' />
                <div className="coop">
                    <input type="text" className="board_input" placeholder='제휴 대상' />
                    <div className="check">
                        <input type='checkbox' id='checkbox' />
                        <div className="able">협의 가능</div>
                    </div>
                </div>
                <div className="coop">
                    <input type="text" className="board_input" placeholder='제휴 기간' />
                    <div className="check">
                        <input type='checkbox' id='checkbox' />
                        <div className="able">협의 가능</div>
                    </div>
                </div>
                <div className="coop">
                    <input type="text" className="board_input" placeholder='제휴 혜택' />
                    <div className="check">
                        <input type='checkbox' id='checkbox' />
                        <div className="able">협의 가능</div>
                    </div>
                </div>
                <div className="coop">
                    <input type="text" className="board_input" placeholder='제휴 조건' />
                    <div className="check">
                        <input type='checkbox' id='checkbox' />
                        <div className="able">협의 가능</div>
                    </div>
                </div>

                <h4>상세 내용</h4>
                <div className="ai_section">
                    <div className="ai_auto">AI 자동 작성</div>
                    <div className="ai_desc">기본 정보를 입력하신 후 작성할 수 있습니다</div>
                </div>

                <h4>모집 글 노출 기간</h4>
                <div className="date_section">
                    <DatePicker
                        label="모집 글 노출 마감일을 선택해 주세요."
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        format="YYYY.MM.DD"
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                placeholder: "모집 글 노출 마감일을 선택해 주세요.",
                                inputProps: { placeholder: "모집 글 노출 마감일을 선택해 주세요." },
                            },
                        }}
                    />
                </div>
            </div>
            <div className="write_footer">
                <div className="footer_left">
                    <button className='delete'>삭제</button>
                    <button className='upload'>업로드</button>
                </div>
                <div className="footer_right">
                    <button className='draft'>임시 저장</button>
                    <button className='preview'>미리보기</button>
                </div>
            </div>
        </div>
    )
}

export default Write
