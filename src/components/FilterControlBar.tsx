import React from 'react';
import { Search, X, Trash2 } from 'lucide-react';
import { FilterStatus, FilterCategory, TodoCategory } from '../types/todo';

interface FilterControlBarProps {
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  filterCategory: FilterCategory;
  onFilterCategoryChange: (category: FilterCategory) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  completedCount: number;
  onOpenBatchDeleteModal: () => void;
}

const CATEGORIES: TodoCategory[] = ['업무', '개인', '건강', '취미', '기타'];

export const FilterControlBar: React.FC<FilterControlBarProps> = ({
  filterStatus,
  onFilterStatusChange,
  filterCategory,
  onFilterCategoryChange,
  searchQuery,
  onSearchQueryChange,
  completedCount,
  onOpenBatchDeleteModal,
}) => {
  return (
    <div className="control-bar" aria-label="할 일 필터 및 검색">
      {/* 검색 및 일괄 삭제 */}
      <div className="search-and-batch">
        <div className="search-input-wrap">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="할 일 검색..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            aria-label="할 일 내용 검색"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchQueryChange('')}
              aria-label="검색어 지우기"
              title="검색어 지우기"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="batch-delete-btn"
          onClick={onOpenBatchDeleteModal}
          disabled={completedCount === 0}
          title={
            completedCount === 0
              ? '완료된 항목이 없습니다'
              : `완료된 ${completedCount}개 항목 일괄 삭제`
          }
          aria-label={`완료 항목 ${completedCount}개 일괄 삭제`}
        >
          <Trash2 size={16} />
          <span>완료 삭제 ({completedCount})</span>
        </button>
      </div>

      {/* 상태 필터 탭 */}
      <div className="filter-tabs" role="tablist" aria-label="상태별 필터">
        <button
          type="button"
          role="tab"
          aria-selected={filterStatus === 'all'}
          className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => onFilterStatusChange('all')}
        >
          전체
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filterStatus === 'active'}
          className={`filter-tab ${filterStatus === 'active' ? 'active' : ''}`}
          onClick={() => onFilterStatusChange('active')}
        >
          진행 중
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filterStatus === 'completed'}
          className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterStatusChange('completed')}
        >
          완료
        </button>
      </div>

      {/* 범주 필터 칩 */}
      <div className="category-chips" aria-label="범주별 필터">
        <button
          type="button"
          className={`category-chip ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => onFilterCategoryChange('all')}
        >
          전체 범주
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-chip ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => onFilterCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
