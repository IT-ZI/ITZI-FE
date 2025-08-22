// src/components/profile/ImageUploader.jsx
import { useRef, useState, useEffect } from "react";
import cameraIcon from "../../assets/img/camera.png";
import profile2   from "../../assets/img/profile2.png";

export default function ImageUploader({
  size = 120,
  defaultSrc = profile2,
  onChange,
  className = "",
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const openPicker = () => inputRef.current?.click();

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    onChange?.(f);
  };

  // 메모리 누수 방지 (URL.revokeObjectURL)
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className={`image-uploader-wrap ${className}`}>
      <div className="avatar" style={{ width: size, height: size }}>
        <img
          className="avatar-img"
          src={previewUrl || defaultSrc}
          alt="프로필 이미지"
          draggable={false}
        />

        <button
          type="button"
          className="camera-btn"
          onClick={openPicker}
          aria-label="이미지 선택"
        >
          <img src={cameraIcon} alt="" />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
