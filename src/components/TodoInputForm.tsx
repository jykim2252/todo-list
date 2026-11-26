import React, { useState, useRef } from 'react';
import { PlusCircle, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { TodoCategory } from '../types/todo';
import { getTodayYYMMDD, getTomorrowYYMMDD, isValidYYMMDD } from '../lib/dateUtils';

interface TodoInputFormProps {
  onAddTodo: (text: string, date: string, category: TodoCategory) => boolean;
}

const CATEGORIES: TodoCategory[] = ['업무', '개인', '건강', '취미', '기타'];

export const TodoInputForm: React.FC<TodoInputFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState(getTodayYYMMDD());
  const [category, setCategory] = useState<TodoCategory>('업무');
  const [dateError, setDateError] = useState<string | null>(null);

  const textInputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (val: string) => {
    // 숫자만 허용, 최대 6자리
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setDate(clean);

    if (clean.length === 6) {
      if (!isValidYYMMDD(clean)) {
        setDateError('올바른 날짜(YYMMDD)를 입력해주세요.');
      } else {
        setDateError(null);
      }
    } else if (clean.length > 0) {
      setDateError('6자리(YYMMDD)로 입력해주세요.');
    } else {
      setDateError(null);
    }
  };

  const handleQuickDate = (quickDate: string) => {
    setDate(quickDate);
    setDateError(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) {
      textInputRef.current?.focus();
      return;
    }

    let finalDate = date;
    if (!isValidYYMMDD(finalDate)) {
      finalDate = getTodayYYMMDD();
    }

    const success = onAddTodo(trimmed, finalDate, category);
    if (success) {
      setText('');
      // 기본 날짜는 현재 선택값 유지 또는 오늘로 재설정 가능 (여기서는 선택된 날짜 유지)
      textInputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 IME 조합 중 Enter 처리
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const todayStr = getTodayYYMMDD();
  const tomorrowStr = getTomorrowYYMMDD();

  return (
    <section className="todo-form-card" aria-label="새 할 일 작성">
      <h2 className="todo-form-title">
        <PlusCircle size={20} color="var(--color-primary)" />
        <span>새로운 할 일 추가</span>
      </h2>

      <form onSubmit={handleSubmit} className="input-group">
        {/* 할 일 텍스트 입력창 */}
        <div className="text-input-wrap">
          <input
            ref={textInputRef}
            type="text"
            className="todo-text-input"
            placeholder="어떤 일을 하실 예정인가요? (최대 200자)"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 200))}
            onKeyDown={handleKeyDown}
            maxLength={200}
            aria-label="할 일 내용"
            required
          />
        </div>

        {/* 옵션 행: 날짜(YYMMDD) 및 범주(Category) */}
        <div className="form-options-row">
          {/* 요구사항 1: 날짜를 YYMMDD 형태로 입력 */}
          <div className="field-block">
            <span className="field-label" id="date-label">
              <CalendarIcon size={14} style={{ display: 'inline', marginRight: 4 }} />
              날짜 (YYMMDD):
            </span>
            <div className="date-input-wrap">
              <input
                type="text"
                className="yymmdd-input"
                placeholder="YYMMDD"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                maxLength={6}
                aria-labelledby="date-label"
                title="6자리 날짜 (예: 261126)"
              />
              <button
                type="button"
                className={`quick-date-btn ${date === todayStr ? 'active' : ''}`}
                onClick={() => handleQuickDate(todayStr)}
                title="오늘로 설정"
              >
                오늘
              </button>
              <button
                type="button"
                className={`quick-date-btn ${date === tomorrowStr ? 'active' : ''}`}
                onClick={() => handleQuickDate(tomorrowStr)}
                title="내일로 설정"
              >
                내일
              </button>
            </div>
          </div>

          {/* 요구사항 2: 업무, 개인, 건강, 취미 등 범주 선택 */}
          <div className="field-block">
            <label className="field-label" htmlFor="category-select">
              <Tag size={14} style={{ display: 'inline', marginRight: 4 }} />
              범주:
            </label>
            <select
              id="category-select"
              className="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as TodoCategory)}
              aria-label="할 일 범주 선택"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 추가 버튼 */}
          <button
            type="submit"
            className="submit-btn"
            disabled={!text.trim()}
            aria-label="할 일 등록"
          >
            <PlusCircle size={18} />
            <span>할 일 등록</span>
          </button>
        </div>

        {dateError && (
          <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)', margin: 0 }}>
            {dateError} (등록 시 자동으로 오늘 날짜가 적용됩니다)
          </p>
        )}
      </form>
    </section>
  );
};
