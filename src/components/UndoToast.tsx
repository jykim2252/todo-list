import React, { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Todo } from '../types/todo';

interface UndoToastProps {
  deletedTodo: Todo;
  onUndo: () => void;
  onDismiss: () => void;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  deletedTodo,
  onUndo,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [deletedTodo, onDismiss]);

  return (
    <aside
      className="undo-toast"
      role="status"
      aria-live="polite"
      aria-label="할 일 삭제 알림"
    >
      <span>
        "
        {deletedTodo.text.length > 15
          ? `${deletedTodo.text.slice(0, 15)}...`
          : deletedTodo.text}
        " 항목이 삭제되었습니다.
      </span>
      <button type="button" className="undo-btn" onClick={onUndo}>
        <RotateCcw size={14} style={{ display: 'inline', marginRight: 4 }} />
        실행 취소
      </button>
    </aside>
  );
};
