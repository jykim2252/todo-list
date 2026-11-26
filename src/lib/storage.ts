import { StorageData, Todo } from '../types/todo';

const STORAGE_KEY = 'antigravity_todo_app_data_v1';
const CURRENT_VERSION = 1;

/**
 * 기본 초기 데이터 (첫 방문 사용자용 샘플 데이터)
 */
function getDefaultTodos(): Todo[] {
  const now = Date.now();
  const todayYY = String(new Date().getFullYear()).slice(-2);
  const todayMM = String(new Date().getMonth() + 1).padStart(2, '0');
  const todayDD = String(new Date().getDate()).padStart(2, '0');
  const today = `${todayYY}${todayMM}${todayDD}`;

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomYY = String(tomorrowDate.getFullYear()).slice(-2);
  const tomMM = String(tomorrowDate.getMonth() + 1).padStart(2, '0');
  const tomDD = String(tomorrowDate.getDate()).padStart(2, '0');
  const tomorrow = `${tomYY}${tomMM}${tomDD}`;

  return [
    {
      id: 'sample-1',
      text: '디자인 시스템 토큰 및 요구사항 검토하기',
      completed: true,
      date: today,
      category: '업무',
      createdAt: now - 3600000,
      updatedAt: now - 1800000,
    },
    {
      id: 'sample-2',
      text: '오늘의 할 일 리스트 정리 및 우선순위 지정',
      completed: false,
      date: today,
      category: '업무',
      createdAt: now - 1800000,
      updatedAt: now - 1800000,
    },
    {
      id: 'sample-3',
      text: '저녁 가벼운 유산소 러닝 30분',
      completed: false,
      date: today,
      category: '건강',
      createdAt: now - 900000,
      updatedAt: now - 900000,
    },
    {
      id: 'sample-4',
      text: '새로 나온 프론트엔드 아키텍처 아티클 읽기',
      completed: false,
      date: tomorrow,
      category: '취미',
      createdAt: now - 300000,
      updatedAt: now - 300000,
    },
  ];
}

/**
 * 로컬스토리지에서 Todo 목록을 안전하게 로드합니다.
 */
export function loadTodosFromStorage(): { todos: Todo[]; error?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultTodos();
      saveTodosToStorage(initial);
      return { todos: initial };
    }

    const parsed: StorageData = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.todos)) {
      throw new Error('유효하지 않은 데이터 포맷입니다.');
    }

    // 데이터 스키마 유효성 점검 및 보정
    const validatedTodos: Todo[] = parsed.todos.map((item, idx) => ({
      id: String(item.id || `todo-${Date.now()}-${idx}`),
      text: String(item.text || ''),
      completed: Boolean(item.completed),
      date: typeof item.date === 'string' && /^\d{6}$/.test(item.date) ? item.date : todayYYMMDD(),
      category: ['업무', '개인', '건강', '취미', '기타'].includes(item.category)
        ? item.category
        : '개인',
      createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
      updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : Date.now(),
    }));

    return { todos: validatedTodos };
  } catch (err) {
    console.error('로컬스토리지 로드 실패:', err);
    return {
      todos: getDefaultTodos(),
      error: '저장된 할 일 데이터를 불러오는 중 오류가 발생하여 초기 데이터로 복구되었습니다.',
    };
  }
}

function todayYYMMDD(): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

/**
 * Todo 목록을 로컬스토리지에 저장합니다.
 */
export function saveTodosToStorage(todos: Todo[]): { success: boolean; error?: string } {
  try {
    const data: StorageData = {
      version: CURRENT_VERSION,
      todos,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { success: true };
  } catch (err) {
    console.error('로컬스토리지 저장 실패:', err);
    return {
      success: false,
      error: '저장 공간 부족 또는 브라우저 권한 문제로 데이터 자동 저장에 실패했습니다.',
    };
  }
}
