import { useState, useEffect, useMemo, useCallback } from 'react';
import { Todo, TodoCategory, FilterStatus, FilterCategory } from '../types/todo';
import { loadTodosFromStorage, saveTodosToStorage } from '../lib/storage';
import { getTodayYYMMDD, getTomorrowYYMMDD, isValidYYMMDD } from '../lib/dateUtils';

interface DeletedTodoRecord {
  todo: Todo;
  index: number;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastDeleted, setLastDeleted] = useState<DeletedTodoRecord | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // 초기 로드
  useEffect(() => {
    const { todos: loadedTodos, error } = loadTodosFromStorage();
    setTodos(loadedTodos);
    if (error) {
      setStorageError(error);
    }
  }, []);

  // 상태 변경 시 자동 저장
  const updateAndSaveTodos = useCallback((updater: (prev: Todo[]) => Todo[]) => {
    setTodos((prev) => {
      const next = updater(prev);
      const res = saveTodosToStorage(next);
      if (!res.success && res.error) {
        setStorageError(res.error);
      } else {
        setStorageError(null);
      }
      return next;
    });
  }, []);

  // 할 일 추가 (텍스트, YYMMDD 날짜, 범주)
  const addTodo = useCallback((text: string, date: string, category: TodoCategory) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    // 날짜 유효성 확인, 비정상일 경우 오늘 날짜로 대체
    const validDate = isValidYYMMDD(date) ? date : getTodayYYMMDD();

    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: trimmed.slice(0, 200),
      completed: false,
      date: validDate,
      category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    updateAndSaveTodos((prev) => [newTodo, ...prev]);
    return true;
  }, [updateAndSaveTodos]);

  // 완료/미완료 토글
  const toggleTodo = useCallback((id: string) => {
    updateAndSaveTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
      )
    );
  }, [updateAndSaveTodos]);

  // 내용 및 속성 수정
  const updateTodo = useCallback(
    (id: string, newText: string, newDate?: string, newCategory?: TodoCategory) => {
      const trimmed = newText.trim();
      if (!trimmed) return false;

      updateAndSaveTodos((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          return {
            ...t,
            text: trimmed.slice(0, 200),
            date: newDate && isValidYYMMDD(newDate) ? newDate : t.date,
            category: newCategory || t.category,
            updatedAt: Date.now(),
          };
        })
      );
      return true;
    },
    [updateAndSaveTodos]
  );

  // 개별 삭제 (실행 취소 지원)
  const deleteTodo = useCallback(
    (id: string) => {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) return;

      const target = todos[index];
      setLastDeleted({ todo: target, index });

      updateAndSaveTodos((prev) => prev.filter((t) => t.id !== id));
    },
    [todos, updateAndSaveTodos]
  );

  // 삭제 실행 취소 (Undo)
  const undoDelete = useCallback(() => {
    if (!lastDeleted) return;

    updateAndSaveTodos((prev) => {
      const next = [...prev];
      const targetIndex = Math.min(lastDeleted.index, next.length);
      next.splice(targetIndex, 0, lastDeleted.todo);
      return next;
    });

    setLastDeleted(null);
  }, [lastDeleted, updateAndSaveTodos]);

  // 실행 취소 알림 닫기
  const dismissUndo = useCallback(() => {
    setLastDeleted(null);
  }, []);

  // 완료 항목 일괄 삭제 실행
  const clearCompleted = useCallback(() => {
    updateAndSaveTodos((prev) => prev.filter((t) => !t.completed));
    setIsBatchModalOpen(false);
  }, [updateAndSaveTodos]);

  // 통계 계산: 오늘 남은 할 일 / 내일 해야 할 일 / 전체 / 완료
  const stats = useMemo(() => {
    const today = getTodayYYMMDD();
    const tomorrow = getTomorrowYYMMDD();

    let total = todos.length;
    let completedCount = 0;
    let todayRemaining = 0;
    let tomorrowRemaining = 0;

    for (const t of todos) {
      if (t.completed) {
        completedCount++;
      } else {
        if (t.date === today) {
          todayRemaining++;
        }
      }

      // 내일 해야 할 일: 내일 날짜로 설정된 미완료 할 일
      if (t.date === tomorrow && !t.completed) {
        tomorrowRemaining++;
      }
    }

    const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return {
      total,
      completedCount,
      todayRemaining,
      tomorrowRemaining,
      completionRate,
    };
  }, [todos]);

  // 필터 및 검색된 Todo 목록
  const filteredTodos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return todos.filter((todo) => {
      // 1. 상태 필터
      if (filterStatus === 'active' && todo.completed) return false;
      if (filterStatus === 'completed' && !todo.completed) return false;

      // 2. 카테고리 필터
      if (filterCategory !== 'all' && todo.category !== filterCategory) return false;

      // 3. 검색어 필터
      if (query && !todo.text.toLowerCase().includes(query)) return false;

      return true;
    });
  }, [todos, filterStatus, filterCategory, searchQuery]);

  return {
    todos,
    filteredTodos,
    stats,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    lastDeleted,
    storageError,
    isBatchModalOpen,
    setIsBatchModalOpen,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    undoDelete,
    dismissUndo,
    clearCompleted,
  };
}
