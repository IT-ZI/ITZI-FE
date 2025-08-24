export default function ConfirmModal({ kind, name, onCancel, onConfirm }) {
    const isAccept = kind === "accept";
    return (
      <div className="modal-wrap" onClick={onCancel}>
        <div className="modal small" onClick={(e) => e.stopPropagation()}>
          <header><h4>{isAccept ? "제휴 시작하기" : "제휴 거절하기"}</h4></header>
          <div className="modal-body center">
            {isAccept
              ? `${name}의 제휴가 수락되었습니다.\n제휴를 진행하시겠습니까?`
              : `${name}와의 제휴를 거절하시겠습니까?\n전송 후에는 거절 취소가 불가능합니다.`}
          </div>
          <footer>
            <button className="btn ghost" onClick={onCancel}>
              {isAccept ? "취소하기" : "닫기"}
            </button>
            <button className="btn primary" onClick={onConfirm}>
              {isAccept ? "시작하기" : "전송하기"}
            </button>
          </footer>
        </div>
      </div>
    );
  }