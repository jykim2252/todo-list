import { describe, it, expect } from 'vitest';
import {
  isValidYYMMDD,
  getTodayYYMMDD,
  getTomorrowYYMMDD,
  formatDisplayDate,
} from './dateUtils';

describe('dateUtils', () => {
  it('YYMMDD 형식 유효성 검사', () => {
    expect(isValidYYMMDD('261126')).toBe(true);
    expect(isValidYYMMDD('240229')).toBe(true); // 2024 윤년
    expect(isValidYYMMDD('250229')).toBe(false); // 2025 평년 2월 29일 불가
    expect(isValidYYMMDD('261301')).toBe(false); // 13월 불가
    expect(isValidYYMMDD('260001')).toBe(false); // 0월 불가
    expect(isValidYYMMDD('261132')).toBe(false); // 32일 불가
    expect(isValidYYMMDD('12345')).toBe(false); // 5자리 불가
    expect(isValidYYMMDD('26112a')).toBe(false); // 문자 포함 불가
  });

  it('오늘 및 내일 YYMMDD 계산', () => {
    const today = getTodayYYMMDD();
    const tomorrow = getTomorrowYYMMDD();
    expect(today).toMatch(/^\d{6}$/);
    expect(tomorrow).toMatch(/^\d{6}$/);
    expect(isValidYYMMDD(today)).toBe(true);
    expect(isValidYYMMDD(tomorrow)).toBe(true);
  });

  it('화면 표시용 날짜 포맷 (오늘/내일 라벨 지원)', () => {
    const today = getTodayYYMMDD();
    const tomorrow = getTomorrowYYMMDD();
    expect(formatDisplayDate(today)).toContain('오늘');
    expect(formatDisplayDate(tomorrow)).toContain('내일');
  });
});
