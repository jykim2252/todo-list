import React from 'react';
import { useTodos } from './hooks/useTodos';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { TodoInputForm } from './components/TodoInputForm';
import { FilterControlBar } from './components/FilterControlBar';
import { TodoItem } from './components/TodoItem';
import { ConfirmModal } from './components/ConfirmModal';
import { UndoToast } from './components/UndoToast';
import { Inbox, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const {
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
  } = useTodos();

  return (
    <div className="app-container">
      {/* 상단 헤더 */}
      <Header />

      {/* 스토리지 에러 배너 (있을 경우만) */}
      {storageError && (
        <div
          style={{
            backgroundColor: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: 'var(--font-size-sm)',
          }}
          role="alert"
        >
          <AlertCircle size={18} />
          <span>{storageError}</span>
        </div>
      )}

      {/* 요구사항 3: 통계 대시보드 ('오늘 남은 할 일', '내일 해야 할 일') */}
      <DashboardStats
        todayRemaining={stats.todayRemaining}
        tomorrowRemaining={stats.tomorrowRemaining}
        total={stats.total}
        completedCount={stats.completedCount}
        completionRate={stats.completionRate}
      />

      {/* 요구사항 1 & 2: 날짜(YYMMDD) 및 범주(Category) 지원하는 할 일 생성 폼 */}
      <TodoInputForm onAddTodo={addTodo} />

      {/* 필터 및 검색 바 */}
      <FilterControlBar
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        completedCount={stats.completedCount}
        onOpenBatchDeleteModal={() => setIsBatchModalOpen(true)}
      />

      {/* 할 일 목록 영역 */}
      <main className="todo-list-section" aria-label="할 일 목록">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))
        ) : (
          <div className="empty-state">
            <Inbox className="empty-icon" />
            <h3 className="empty-title">
              {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                ? '조건에 맞는 할 일이 없습니다'
                : '등록된 할 일이 없습니다'}
            </h3>
            <p className="empty-desc">
              {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                ? '필터나 검색어를 변경해 보세요.'
                : '위 입력창에서 새로운 할 일을 등록해 보세요!'}
            </p>
          </div>
        )}
      </main>

      {/* 삭제 실행 취소 토스트 */}
      {lastDeleted && (
        <UndoToast
          deletedTodo={lastDeleted.todo}
          onUndo={undoDelete}
          onDismiss={dismissUndo}
        />
      )}

      {/* 완료 항목 일괄 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={isBatchModalOpen}
        title="완료된 할 일 삭제"
        description={`완료 처리된 ${stats.completedCount}개의 할 일을 정말 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
        confirmText="전체 삭제"
        cancelText="취소"
        onConfirm={clearCompleted}
        onCancel={() => setIsBatchModalOpen(false)}
      />
    </div>
  );
};

export default App;
