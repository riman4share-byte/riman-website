# Review package Task 1 (6e80aca..28cbfdd)
``
## Commits
28cbfdd feat(rental): pure calendar helpers (month matrix, next-available, clamping)

## Stat
 src/lib/calendar.test.ts | 61 ++++++++++++++++++++++++++++++++++++++++++++++++
 src/lib/calendar.ts      | 40 +++++++++++++++++++++++++++++++
 2 files changed, 101 insertions(+)

## Diff (-U10)
diff --git a/src/lib/calendar.test.ts b/src/lib/calendar.test.ts
new file mode 100644
index 0000000..80334d6
--- /dev/null
+++ b/src/lib/calendar.test.ts
@@ -0,0 +1,61 @@
+import { describe, it, expect } from 'vitest';
+import { addDays, parseISO, setDate, startOfMonth } from 'date-fns';
+import { buildMonthMatrix, clampToMonth, isUnavailable, isoKey, nextAvailableDate } from './calendar';
+
+const TODAY = new Date(2026, 7, 24);
+
+describe('isoKey', () => {
+  it('formats local dates as yyyy-MM-dd', () => {
+    expect(isoKey(new Date(2026, 8, 4))).toBe('2026-09-04');
+  });
+});
+
+describe('buildMonthMatrix', () => {
+  it('pads to whole weeks starting Sunday', () => {
+    const weeks = buildMonthMatrix(new Date(2026, 8, 15));
+    expect(weeks.length).toBeGreaterThanOrEqual(5);
+    for (const week of weeks) {
+      expect(week).toHaveLength(7);
+      expect(week[0].getDay()).toBe(0);
+    }
+    const first = weeks[0][0];
+    const last = weeks[weeks.length - 1][6];
+    expect(first.getTime()).toBeLessThanOrEqual(startOfMonth(new Date(2026, 8, 15)).getTime());
+    expect(last.getDay()).toBe(6);
+  });
+});
+
+describe('isUnavailable', () => {
+  it('flags strictly-past days, not today', () => {
+    expect(isUnavailable(addDays(TODAY, -1), new Set(), TODAY)).toBe(true);
+    expect(isUnavailable(TODAY, new Set(), TODAY)).toBe(false);
+  });
+  it('flags booked days', () => {
+    expect(isUnavailable(new Date(2026, 8, 10), new Set(['2026-09-10']), TODAY)).toBe(true);
+    expect(isUnavailable(new Date(2026, 8, 11), new Set(['2026-09-10']), TODAY)).toBe(false);
+  });
+});
+
+describe('nextAvailableDate', () => {
+  it('returns the first open day scanning forward', () => {
+    const booked = ['2026-08-24', '2026-08-25'];
+    expect(nextAvailableDate(booked, TODAY)).toBe('2026-08-26');
+  });
+  it('returns today when free', () => {
+    expect(nextAvailableDate([], TODAY)).toBe('2026-08-24');
+  });
+  it('returns null when the horizon is exhausted', () => {
+    const far = Array.from({ length: 31 }, (_, i) => isoKey(addDays(TODAY, i)));
+    expect(nextAvailableDate(far, TODAY, 30)).toBeNull();
+  });
+});
+
+describe('clampToMonth', () => {
+  it('clamps day-of-month into shorter months', () => {
+    const march31 = new Date(2026, 2, 31);
+    expect(clampToMonth(new Date(2026, 1, 1), march31)).toEqual(setDate(startOfMonth(new Date(2026, 1, 1)), 28));
+  });
+  it('keeps the same day when it fits', () => {
+    expect(clampToMonth(parseISO('2026-09-01'), new Date(2026, 7, 24))).toEqual(parseISO('2026-09-24'));
+  });
+});
diff --git a/src/lib/calendar.ts b/src/lib/calendar.ts
new file mode 100644
index 0000000..bbbb3a8
--- /dev/null
+++ b/src/lib/calendar.ts
@@ -0,0 +1,40 @@
+import { addDays, eachDayOfInterval, endOfMonth, startOfMonth, startOfWeek, endOfWeek, format, setDate, startOfToday } from 'date-fns';
+
+export function isoKey(date: Date): string {
+  return format(date, 'yyyy-MM-dd');
+}
+
+export function buildMonthMatrix(month: Date): Date[][] {
+  const start = startOfWeek(startOfMonth(month));
+  const end = endOfWeek(endOfMonth(month));
+  const days = eachDayOfInterval({ start, end });
+  const weeks: Date[][] = [];
+  for (let i = 0; i < days.length; i += 7) {
+    weeks.push(days.slice(i, i + 7));
+  }
+  return weeks;
+}
+
+function midnight(date: Date): number {
+  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
+}
+
+export function isUnavailable(date: Date, bookedSet: Set<string>, today: Date): boolean {
+  return midnight(date) < midnight(today) || bookedSet.has(isoKey(date));
+}
+
+export function nextAvailableDate(bookedIso: string[], from?: Date, horizonDays = 180): string | null {
+  const booked = new Set(bookedIso);
+  const start = from ?? startOfToday();
+  for (let i = 0; i <= horizonDays; i++) {
+    const key = isoKey(addDays(start, i));
+    if (!booked.has(key)) return key;
+  }
+  return null;
+}
+
+export function clampToMonth(month: Date, daySource: Date): Date {
+  const target = startOfMonth(month);
+  const day = Math.min(daySource.getDate(), endOfMonth(target).getDate());
+  return setDate(target, day);
+}
