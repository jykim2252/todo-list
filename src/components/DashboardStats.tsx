import React from 'react';
import { Calendar, SunMedium, CheckCircle2 } from 'lucide-react';

interface DashboardStatsProps {
  todayRemaining: number;
  tomorrowRemaining: number;
  total: number;
  completedCount: number;
  completionRate: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  todayRemaining,
  tomorrowRemaining,
  total,
  completedCount,
  completionRate,
}) => {
  return (
    <section aria-label="할 일 현황 대시보드">
      {/* 요구사항 3: 오늘 남은 할 일 & 내일 해야 할 일 표시 카드 */}
      <div className="dashboard-grid">
        <div className="stat-card today" data-testid="today-remaining-stat">
          <div className="stat-card-header">
            <span className="stat-label">오늘 남은 할 일</span>
            <SunMedium className="stat-icon" color="var(--color-primary)" />
          </div>
          <div className="stat-value">{todayRemaining}개</div>
          <div className="stat-desc">오늘 기한인 미완료 항목</div>
        </div>

        <div className="stat-card tomorrow" data-testid="tomorrow-remaining-stat">
          <div className="stat-card-header">
            <span className="stat-label">내일 해야 할 일</span>
            <Calendar className="stat-icon" color="var(--color-success)" />
          </div>
          <div className="stat-value">{tomorrowRemaining}개</div>
          <div className="stat-desc">내일 예정된 할 일</div>
        </div>
      </div>

      {/* 전체 진행률 바 */}
      <div className="overall-progress-card">
        <div className="progress-header">
          <span className="progress-title">전체 달성 현황</span>
          <span className="progress-percent">{completionRate}% 달성</span>
        </div>
        <div
          className="progress-bar-bg"
          role="progressbar"
          aria-valuenow={completionRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="할 일 전체 달성률"
        >
          <div
            className="progress-bar-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="progress-meta">
          <span>전체 할 일 {total}개</span>
          <span>
            <CheckCircle2
              size={14}
              style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }}
            />
            완료됨 {completedCount}개
          </span>
        </div>
      </div>
    </section>
  );
};
