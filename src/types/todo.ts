export type TodoCategory = '업무' | '개인' | '건강' | '취미' | '기타';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYMMDD 형식 (예: "261126")
  category: TodoCategory;
  createdAt: number; // 타임스탬프
  updatedAt: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type FilterCategory = 'all' | TodoCategory;

export interface StorageData {
  version: number;
  todos: Todo[];
}
