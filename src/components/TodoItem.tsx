import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Check, X, Calendar as CalendarIcon } from 'lucide-react';
import { Todo, TodoCategory } from '../types/todo';
import { formatDisplayDate, getTodayYYMMDD, getTomorrowYYMMDD, isValidYYMMDD } from '../lib/dateUtils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string, date?: string, category?: TodoCategory) => boolean;
  onDelete: (id: string) => void;
}

const CATEGORIES: TodoCategory[] = ['업무', '개인', '건강', '취미', '기타'];

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDate, setEditDate] = useState(todo.date);
  const [editCategory, setEditCategory] = useState<TodoCategory>(todo.category);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditText(todo.text);
    setEditDate(todo.date);
    setEditCategory(todo.category);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    const validDate = isValidYYMMDD(editDate) ? editDate : todo.date;
    const success = onUpdate(todo.id, trimmed, validDate, editCategory);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const todayStr = getTodayYYMMDD();
  const tomorrowStr = getTomorrowYYMMDD();
  const isToday = todo.date === todayStr;
  const isTomorrow = todo.date === tomorrowStr;

  return (
    <article
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      aria-label={`할 일: ${todo.text}`}
    >
      {isEditing ? (
        <div className="edit-form">
          <input
            ref={editInputRef}
            type="text"
            className="edit-text-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value.slice(0, 200))}
            onKeyDown={handleKeyDown}
            maxLength={200}
            aria-label="수정할 내용 입력"
          />
          <div className="edit-row">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                className="yymmdd-input"
                style={{ width: '85px', minHeight: '32px', fontSize: '12px' }}
                value={editDate}
                onChange={(e) =>
                  setEditDate(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="YYMMDD"
                maxLength={6}
                aria-label="날짜 수정 (YYMMDD)"
              />
              <select
                className="category-select"
                style={{ minHeight: '32px', padding: '4px 8px', fontSize: '12px' }}
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as TodoCategory)}
                aria-label="범주 수정"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-actions">
              <button
                type="button"
                className="btn-sm-primary"
                onClick={handleSaveEdit}
                disabled={!editText.trim()}
              >
                <Check size={14} style={{ display: 'inline', marginRight: 2 }} /> 저장
              </button>
              <button
                type="button"
                className="btn-sm-cancel"
                onClick={handleCancelEdit}
              >
                <X size={14} style={{ display: 'inline', marginRight: 2 }} /> 취소
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="item-left">
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              aria-label={`${todo.text} 완료 여부`}
            />
            <div className="todo-content">
              <span className="todo-text">{todo.text}</span>
              <div className="todo-badges">
                {/* 요구사항 2 범주 뱃지 */}
                <span className={`category-badge ${todo.category}`}>
                  {todo.category}
                </span>

                {/* 요구사항 1 날짜 뱃지 */}
                <span
                  className={`date-badge ${isToday ? 'is-today' : ''} ${
                    isTomorrow ? 'is-tomorrow' : ''
                  }`}
                  title={`기한: ${todo.date}`}
                >
                  <CalendarIcon size={12} />
                  {formatDisplayDate(todo.date)}
                </span>
              </div>
            </div>
          </div>

          <div className="item-actions">
            <button
              type="button"
              className="action-btn"
              onClick={handleStartEdit}
              aria-label={`${todo.text} 수정`}
              title="수정"
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              className="action-btn delete"
              onClick={() => onDelete(todo.id)}
              aria-label={`${todo.text} 삭제`}
              title="삭제"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </>
      )}
    </article>
  );
};
