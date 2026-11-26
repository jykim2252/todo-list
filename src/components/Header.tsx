import React from 'react';
import { CheckSquare } from 'lucide-react';
import { getTodayYYMMDD, formatDisplayDate } from '../lib/dateUtils';

export const Header: React.FC = () => {
  const todayYYMMDD = getTodayYYMMDD();
  const displayToday = formatDisplayDate(todayYYMMDD);

  return (
    <header className="app-header">
      <div className="header-top">
        <h1 className="app-title">
          <CheckSquare size={28} className="text-primary" />
          <span>오늘의 할 일</span>
        </h1>
        <span className="current-date-badge" title="현재 날짜">
          {displayToday}
        </span>
      </div>
    </header>
  );
};
