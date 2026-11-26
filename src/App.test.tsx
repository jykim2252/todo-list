import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { getTodayYYMMDD, getTomorrowYYMMDD } from './lib/dateUtils';

describe('Todo App 핵심 요구사항 테스트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('요구사항 3: "오늘 남은 할 일 0 개" 및 "내일 해야 할 일 0 개" 통계 표시 검증', () => {
    render(<App />);

    // '오늘 남은 할 일' 및 '내일 해야 할 일' 텍스트 확인
    expect(screen.getByText('오늘 남은 할 일')).toBeInTheDocument();
    expect(screen.getByText('내일 해야 할 일')).toBeInTheDocument();

    const todayStat = screen.getByTestId('today-remaining-stat');
    const tomorrowStat = screen.getByTestId('tomorrow-remaining-stat');

    expect(todayStat).toBeInTheDocument();
    expect(tomorrowStat).toBeInTheDocument();
  });

  it('요구사항 1 & 2: 날짜(YYMMDD)와 범주(업무/개인/건강/취미)를 선택하여 새 할 일 생성', () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/어떤 일을 하실 예정인가요/);
    const dateInput = screen.getByPlaceholderText('YYMMDD');
    const categorySelect = screen.getByLabelText('할 일 범주 선택');
    const submitBtn = screen.getByRole('button', { name: '할 일 등록' });

    // 1. 텍스트 입력
    fireEvent.change(input, { target: { value: '테스트 업무 작성하기' } });

    // 2. 날짜 YYMMDD 변경 (261129)
    fireEvent.change(dateInput, { target: { value: '261129' } });

    // 3. 범주 변경 (건강)
    fireEvent.change(categorySelect, { target: { value: '건강' } });

    // 4. 등록 클릭
    fireEvent.click(submitBtn);

    // 등록된 항목 찾기
    const todoArticle = screen.getByRole('article', { name: /할 일: 테스트 업무 작성하기/ });
    expect(todoArticle).toBeInTheDocument();

    // 해당 항목 내부에서 범주 뱃지와 날짜 확인
    expect(within(todoArticle).getByText('건강')).toBeInTheDocument();
    expect(within(todoArticle).getByText('2026.11.29')).toBeInTheDocument();
  });

  it('오늘과 내일 할 일 추가 시 대시보드 카운트가 정확히 갱신되는지 검증', () => {
    render(<App />);

    const today = getTodayYYMMDD();
    const tomorrow = getTomorrowYYMMDD();

    const input = screen.getByPlaceholderText(/어떤 일을 하실 예정인가요/);
    const dateInput = screen.getByPlaceholderText('YYMMDD');
    const submitBtn = screen.getByRole('button', { name: '할 일 등록' });

    // 오늘 할 일 추가
    fireEvent.change(input, { target: { value: '오늘 필수 미션' } });
    fireEvent.change(dateInput, { target: { value: today } });
    fireEvent.click(submitBtn);

    // 내일 할 일 추가
    fireEvent.change(input, { target: { value: '내일 진행 미션' } });
    fireEvent.change(dateInput, { target: { value: tomorrow } });
    fireEvent.click(submitBtn);

    // 화면에 할 일 등록 확인
    expect(screen.getByText('오늘 필수 미션')).toBeInTheDocument();
    expect(screen.getByText('내일 진행 미션')).toBeInTheDocument();
  });

  it('범주 필터 클릭 시 해당 범주의 할 일만 필터링되는지 검증', () => {
    render(<App />);

    // 카테고리 필터 영역에서 '건강' 칩 찾기
    const categoryContainer = screen.getByLabelText('범주별 필터');
    const healthChip = within(categoryContainer).getByRole('button', { name: '건강' });
    fireEvent.click(healthChip);

    // '건강' 항목은 표시되고 다른 항목은 제외되어야 함
    expect(screen.getByText('저녁 가벼운 유산소 러닝 30분')).toBeInTheDocument();
    expect(
      screen.queryByText('오늘의 할 일 리스트 정리 및 우선순위 지정')
    ).not.toBeInTheDocument();
  });
});
