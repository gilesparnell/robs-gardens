/**
 * Determine which week (1 or 2) a given date falls in,
 * relative to an anchor Monday that is defined as Week 1.
 */
export function getWeekForDate(anchorDate: string, date: Date): 1 | 2 {
  const anchor = new Date(anchorDate);
  anchor.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - anchor.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return (diffWeeks % 2 === 0) ? 1 : 2;
}

export function getCurrentWeek(anchorDate: string): 1 | 2 {
  return getWeekForDate(anchorDate, new Date());
}
