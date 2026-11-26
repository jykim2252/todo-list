/**
 * YYMMDD 관련 날짜 헬퍼 유틸리티 모듈
 */

/**
 * 주어진 Date 객체를 6자리 YYMMDD 문자열로 변환합니다.
 */
export function formatToYYMMDD(d: Date = new Date()): string {
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

/**
 * 오늘 날짜를 YYMMDD 형식으로 반환합니다.
 */
export function getTodayYYMMDD(): string {
  return formatToYYMMDD(new Date());
}

/**
 * 내일 날짜를 YYMMDD 형식으로 반환합니다.
 */
export function getTomorrowYYMMDD(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatToYYMMDD(tomorrow);
}

/**
 * 문자열이 유효한 YYMMDD 형식(6자리 숫자 및 유효한 날짜)인지 검증합니다.
 */
export function isValidYYMMDD(val: string): boolean {
  if (!/^\d{6}$/.test(val)) return false;

  const yy = parseInt(val.slice(0, 2), 10);
  const mm = parseInt(val.slice(2, 4), 10);
  const dd = parseInt(val.slice(4, 6), 10);

  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;

  // 2000년대 기준으로 날짜 정밀 검증
  const fullYear = 2000 + yy;
  const testDate = new Date(fullYear, mm - 1, dd);

  return (
    testDate.getFullYear() === fullYear &&
    testDate.getMonth() === mm - 1 &&
    testDate.getDate() === dd
  );
}

/**
 * YYMMDD 문자열을 읽기 쉬운 라벨로 변환합니다.
 * 예: 오늘인 경우 "오늘 (26.11.26)", 내일인 경우 "내일 (26.11.27)", 그 외 "2026.11.26"
 */
export function formatDisplayDate(val: string): string {
  if (!isValidYYMMDD(val)) return val || '날짜 미지정';

  const yy = val.slice(0, 2);
  const mm = val.slice(2, 4);
  const dd = val.slice(4, 6);
  const formatted = `20${yy}.${mm}.${dd}`;

  const today = getTodayYYMMDD();
  const tomorrow = getTomorrowYYMMDD();

  if (val === today) return `오늘 (${formatted})`;
  if (val === tomorrow) return `내일 (${formatted})`;

  return formatted;
}

/**
 * YYMMDD 문자열을 'YYYY-MM-DD' 형식으로 변환 (HTML date input 호환용)
 */
export function yymmddToIso(val: string): string {
  if (!isValidYYMMDD(val)) return '';
  const yy = val.slice(0, 2);
  const mm = val.slice(2, 4);
  const dd = val.slice(4, 6);
  return `20${yy}-${mm}-${dd}`;
}

/**
 * 'YYYY-MM-DD' 형식을 YYMMDD로 변환
 */
export function isoToYymmdd(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
  const parts = iso.split('-');
  return `${parts[0].slice(-2)}${parts[1]}${parts[2]}`;
}
