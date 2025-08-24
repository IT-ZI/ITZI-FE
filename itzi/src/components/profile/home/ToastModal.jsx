export default function ToastModal({ text, onClose }) {
    return (
      <div className="toast-wrap" onClick={onClose}>
        <div className="toast" onClick={(e) => e.stopPropagation()}>
          <div className="toast-text">{text}</div>
        </div>
      </div>
    );
  }