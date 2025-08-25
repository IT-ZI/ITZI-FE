import { useId, useMemo, useState } from 'react';
import { useEffect } from 'react';

const PRESETS = {
  autoManual: [
    { value: 'auto',   label: '자동 입력' },
    { value: 'manual', label: '직접 입력' },
  ],
  sameManual: [
    { value: 'same',   label: '게시물과 동일' },
    { value: 'manual', label: '직접 입력' },
  ],
};

export default function Dropdown({
  preset = 'autoManual',        
  value,                        
  onChange,                       
  selectClassName = '',
  inputClassName = '',
  inputPlaceholder = '직접 입력해주세요.',
  selectPlaceholder = '',
}) {
  const id = useId();
  const options = useMemo(() => PRESETS[preset] ?? PRESETS.autoManual, [preset]);

  // ✅ placeholder가 있으면 ''로 시작 → placeholder가 보임
  const initialMode = value?.mode ?? (selectPlaceholder ? '' : options[0].value);
  const [mode, setMode] = useState(initialMode);
  const [text, setText] = useState(value?.text ?? '');

  const emit = (next) => onChange?.(next);

  const handleSelect = (e) => {
    const m = e.target.value;
    setMode(m);
     if (m === 'manual') {
      setText('');                          // 수동 시작할 때 인풋은 항상 빈값
      emit({ mode: 'manual', text: '' });
    } else {
      setText('');                          // 수동이 아니면 text는 의미 없으니 항상 비움
      emit({ mode: m, text: '' });
    }
  };

  const handleInput = (e) => {
    const t = e.target.value;
    setText(t);
    emit({ mode: 'manual', text: t });
  };

  useEffect(() => {
    if (value?.mode !== undefined) setMode(value.mode);
    if (value?.text !== undefined) setText(value.text ?? '');
  }, [value?.mode, value?.text]);


  return (
    <div className="dropdown-field">
      {mode !== 'manual' ? (
        <select
          id={id}
          className={`dropdown-select ${mode === '' ? 'is-placeholder' : ''} ${selectClassName}`}
          value={mode}
          onChange={handleSelect}
        >
          {/* ✅ placeholder 옵션 */}
          {selectPlaceholder && (
            <option value="" disabled hidden>
              {selectPlaceholder}
            </option>
          )}
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <div className="dropdown-manual">
          <input
            type="text"
            className={`dropdown-input ${inputClassName}`}
            value={text}
            onChange={handleInput}
            placeholder={inputPlaceholder}
          />
        </div>
      )}
    </div>
  );
}
