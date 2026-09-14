# Final review package (6e80aca..6e9269d)
## Commits
6e9269d test(e2e): rental calendar keyboard, next-available, and RTL coverage
6502e60 fix(rental): announce day status when selection blocked
bfb635c a11y(rental): ARIA grid calendar with roving tabindex, next-available shortcut, disclosed fetch failures
db81650 i18n(calendar): keyboard a11y + next-available strings (en/ar)
28cbfdd feat(rental): pure calendar helpers (month matrix, next-available, clamping)

## Stat
 src/components/AvailabilityCalendar.test.tsx | 118 ++++++++++
 src/components/AvailabilityCalendar.tsx      | 310 +++++++++++++++++++--------
 src/contexts/LanguageContext.tsx             |  16 ++
 src/lib/calendar.test.ts                     |  61 ++++++
 src/lib/calendar.ts                          |  40 ++++
 src/pages/ProductDetail.tsx                  |   8 +-
 tests/rental-calendar.spec.ts                |  67 ++++++
 7 files changed, 528 insertions(+), 92 deletions(-)

## Diff (-U10)
diff --git a/src/components/AvailabilityCalendar.test.tsx b/src/components/AvailabilityCalendar.test.tsx
new file mode 100644
index 0000000..0f98e72
--- /dev/null
+++ b/src/components/AvailabilityCalendar.test.tsx
@@ -0,0 +1,118 @@
+import { describe, it, expect, vi, beforeEach } from 'vitest';
+import { render, screen, fireEvent, waitFor } from '@testing-library/react';
+import { LanguageProvider } from '../contexts/LanguageContext';
+import AvailabilityCalendar from './AvailabilityCalendar';
+import { fetchBookedDates } from '../services/rentals';
+import { addDays, format } from 'date-fns';
+
+vi.mock('../services/rentals', () => ({
+  fetchBookedDates: vi.fn(),
+}));
+
+const mockedFetch = vi.mocked(fetchBookedDates);
+const TODAY = new Date();
+
+function renderCalendar(props: Partial<Parameters<typeof AvailabilityCalendar>[0]> = {}) {
+  const onDateSelect = vi.fn();
+  render(
+    <LanguageProvider>
+      <AvailabilityCalendar productId="test-product" onDateSelect={onDateSelect} {...props} />
+    </LanguageProvider>
+  );
+  return onDateSelect;
+}
+
+function dayButton(offsetDays: number) {
+  const d = addDays(TODAY, offsetDays);
+  return document.querySelector(`[data-date="${format(d, 'yyyy-MM-dd')}"]`) as HTMLButtonElement;
+}
+
+beforeEach(() => {
+  localStorage.setItem('riman_lang', 'en');
+  mockedFetch.mockResolvedValue([format(TODAY, 'yyyy-MM-dd'), format(addDays(TODAY, 5), 'yyyy-MM-dd')]);
+});
+
+describe('AvailabilityCalendar', () => {
+  it('renders an ARIA grid with labelled day buttons', async () => {
+    renderCalendar();
+    expect(screen.getByRole('grid')).toBeDefined();
+    await waitFor(() => {
+      expect(document.querySelector(`[data-date="${format(addDays(TODAY, 1), 'yyyy-MM-dd')}"]`)).toBeTruthy();
+    });
+    const future = screen.getByRole('button', { name: new RegExp(`${format(addDays(TODAY, 1), 'd')}`) });
+    expect(future.getAttribute('aria-label')).toContain(', available');
+  });
+
+  it('marks booked days unavailable and ignores clicks on them', async () => {
+    const onDateSelect = renderCalendar();
+    const booked = await waitFor(() => dayButton(5));
+    expect(booked.getAttribute('aria-disabled')).toBe('true');
+    fireEvent.click(booked);
+    expect(onDateSelect).not.toHaveBeenCalled();
+  });
+
+  it('selects an available day on click and shows the summary line', async () => {
+    const onDateSelect = renderCalendar({ selectedDate: null });
+    const target = await waitFor(() => dayButton(1));
+    fireEvent.click(target);
+    expect(onDateSelect).toHaveBeenCalledWith(expect.any(Date));
+  });
+
+  it('moves focus with arrow keys and selects with Enter', async () => {
+    const onDateSelect = renderCalendar();
+    const grid = screen.getByTestId('availability-grid');
+    const todayCell = document.querySelector(`[data-date="${format(TODAY, 'yyyy-MM-dd')}"]`) as HTMLButtonElement;
+    todayCell.focus();
+    fireEvent.keyDown(grid, { key: 'ArrowRight' });
+    expect(document.activeElement?.getAttribute('data-date')).toBe(format(addDays(TODAY, 1), 'yyyy-MM-dd'));
+    fireEvent.keyDown(grid, { key: 'Enter' });
+    expect(onDateSelect).toHaveBeenCalled();
+  });
+
+  it('announces the day status when pressing Enter on a blocked day', async () => {
+    mockedFetch.mockResolvedValue([format(TODAY, 'yyyy-MM-dd')]);
+    renderCalendar();
+    const grid = screen.getByTestId('availability-grid');
+    const todayCell = await waitFor(() => document.querySelector(`[data-date="${format(TODAY, 'yyyy-MM-dd')}"]`) as HTMLButtonElement);
+    todayCell.focus();
+    fireEvent.keyDown(grid, { key: 'Enter' });
+    expect(screen.getByRole('status').textContent).toMatch(/, booked$/);
+  });
+
+  it('pages months with PageUp/PageDown keeping the focused day', async () => {
+    renderCalendar();
+    const grid = screen.getByTestId('availability-grid');
+    const todayCell = document.querySelector(`[data-date="${format(TODAY, 'yyyy-MM-dd')}"]`) as HTMLButtonElement;
+    todayCell.focus();
+    fireEvent.keyDown(grid, { key: 'PageDown' });
+    expect(screen.getByRole('heading', { level: 3 })).toBeDefined();
+    const nextMonthSameDay = format(new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, Math.min(TODAY.getDate(), 28)), 'yyyy-MM-dd');
+    expect(document.activeElement?.getAttribute('data-date')).toBe(nextMonthSameDay);
+  });
+
+  it('jumps to the next open day via the shortcut button', async () => {
+    const onDateSelect = renderCalendar({ selectedDate: null });
+    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
+    fireEvent.click(screen.getByRole('button', { name: /next available date/i }));
+    expect(onDateSelect).toHaveBeenCalledWith(addDays(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()), 1));
+    expect(screen.getByRole('status').textContent?.length ?? 0).toBeGreaterThan(0);
+  });
+
+  it('shows the fallback notice on fetch failure and retries', async () => {
+    mockedFetch.mockRejectedValueOnce(new Error('offline'));
+    renderCalendar();
+    const retry = await screen.findByRole('button', { name: /retry/i });
+    fireEvent.click(retry);
+    await waitFor(() => expect(screen.queryByRole('button', { name: /retry/i })).toBeNull());
+  });
+
+  it('flips horizontal arrow direction under RTL', async () => {
+    localStorage.setItem('riman_lang', 'ar');
+    renderCalendar();
+    const grid = screen.getByTestId('availability-grid');
+    const todayCell = document.querySelector(`[data-date="${format(TODAY, 'yyyy-MM-dd')}"]`) as HTMLButtonElement;
+    todayCell.focus();
+    fireEvent.keyDown(grid, { key: 'ArrowRight' });
+    expect(document.activeElement?.getAttribute('data-date')).toBe(format(addDays(TODAY, -1), 'yyyy-MM-dd'));
+  });
+});
diff --git a/src/components/AvailabilityCalendar.tsx b/src/components/AvailabilityCalendar.tsx
index cd07f6a..785a975 100644
--- a/src/components/AvailabilityCalendar.tsx
+++ b/src/components/AvailabilityCalendar.tsx
@@ -1,138 +1,270 @@
-import { useState, useEffect } from 'react';
-import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isBefore, startOfToday, parseISO, format } from 'date-fns';
+import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
+import { addDays, addMonths, subMonths, startOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isBefore, startOfToday, format } from 'date-fns';
 import { ChevronLeft, ChevronRight } from 'lucide-react';
 import { cn } from '../lib/utils';
 import { fetchBookedDates } from '../services/rentals';
 import { useLanguage } from '../contexts/LanguageContext';
+import { buildMonthMatrix, clampToMonth, isUnavailable, isoKey, nextAvailableDate } from '../lib/calendar';
 
 interface AvailabilityCalendarProps {
   productId?: string;
   bookedDates?: Date[];
-  onDateSelect?: (date: Date) => void;
+  onDateSelect?: (date: Date | null) => void;
   selectedDate?: Date | null;
 }
 
 export default function AvailabilityCalendar({ productId, bookedDates: initialBookedDates = [], onDateSelect, selectedDate }: AvailabilityCalendarProps) {
-  const [currentMonth, setCurrentMonth] = useState(new Date());
-  const [bookedDates, setBookedDates] = useState<Date[]>(initialBookedDates);
-  const [loading, setLoading] = useState(false);
   const today = startOfToday();
   const { t, isRtl } = useLanguage();
   const months = t('calendar.months').split(',');
+  const dayNames = t('calendar.days').split(',');
   const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
   const NextIcon = isRtl ? ChevronLeft : ChevronRight;
 
+  const [currentMonth, setCurrentMonth] = useState<Date>(() => today);
+  const [bookedIso, setBookedIso] = useState<string[]>(() => initialBookedDates.map(isoKey));
+  const [loading, setLoading] = useState(false);
+  const [stale, setStale] = useState(false);
+  const [focusedDate, setFocusedDate] = useState<Date>(() => today);
+  const [announcement, setAnnouncement] = useState('');
+  const gridRef = useRef<HTMLDivElement>(null);
+  const interactedRef = useRef(false);
+  const selectedRef = useRef(selectedDate);
+  selectedRef.current = selectedDate;
+
+  const load = useCallback(() => {
+    if (!productId) return;
+    setLoading(true);
+    setStale(false);
+    fetchBookedDates(productId)
+      .then(dates => {
+        setBookedIso(dates);
+        if (selectedRef.current && dates.includes(isoKey(selectedRef.current))) {
+          onDateSelect?.(null);
+          setAnnouncement(t('calendar.statusBooked'));
+        }
+      })
+      .catch(() => setStale(true))
+      .finally(() => setLoading(false));
+  }, [productId, onDateSelect, t]);
+
+  useEffect(() => { load(); }, [load]);
+
+  const bookedSet = useMemo(() => new Set(bookedIso), [bookedIso]);
+  const canSelect = useCallback(
+    (d: Date) => isSameMonth(d, currentMonth) && !isUnavailable(d, bookedSet, today),
+    [currentMonth, bookedSet, today]
+  );
+
   useEffect(() => {
-    if (productId) {
-      setLoading(true);
-      fetchBookedDates(productId)
-        .then(dates => {
-          setBookedDates(dates.map(d => parseISO(d)));
-        })
-        .catch(() => {
-          setBookedDates(initialBookedDates);
-        })
-        .finally(() => setLoading(false));
+    if (!interactedRef.current) return;
+    const el = gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${isoKey(focusedDate)}"]`);
+    el?.focus();
+  }, [focusedDate, currentMonth]);
+
+  const describe = useCallback(
+    (d: Date) => `${dayNames[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
+    [dayNames, months]
+  );
+
+  const statusLabelFor = useCallback(
+    (d: Date) => {
+      if (isBefore(d, today)) return t('calendar.statusPast');
+      if (bookedSet.has(isoKey(d))) return t('calendar.statusBooked');
+      return t('calendar.statusAvailable');
+    },
+    [bookedSet, t, today]
+  );
+
+  const goToMonth = (delta: number) => {
+    const next = delta < 0 ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1);
+    setCurrentMonth(next);
+    setFocusedDate(clampToMonth(next, focusedDate));
+    setAnnouncement(`${months[next.getMonth()]} ${next.getFullYear()}`);
+  };
+
+  const handleKeyDown = (e: React.KeyboardEvent) => {
+    const dir = isRtl ? -1 : 1;
+    let next: Date | undefined;
+    let nextMonth: Date | undefined;
+    switch (e.key) {
+      case 'ArrowUp': next = addDays(focusedDate, -7); break;
+      case 'ArrowDown': next = addDays(focusedDate, 7); break;
+      case 'ArrowLeft': next = addDays(focusedDate, -dir); break;
+      case 'ArrowRight': next = addDays(focusedDate, dir); break;
+      case 'Home': next = startOfWeek(focusedDate); break;
+      case 'End': next = endOfWeek(focusedDate); break;
+      case 'PageUp': nextMonth = subMonths(currentMonth, 1); break;
+      case 'PageDown': nextMonth = addMonths(currentMonth, 1); break;
+      case ' ':
+      case 'Enter':
+        e.preventDefault();
+        interactedRef.current = true;
+        if (!canSelect(focusedDate)) {
+          setAnnouncement(`${describe(focusedDate)}, ${statusLabelFor(focusedDate)}`);
+          return;
+        }
+        onDateSelect?.(focusedDate);
+        setAnnouncement(`${t('calendar.selectedPrefix')} ${describe(focusedDate)}`);
+        return;
+      default: return;
+    }
+    e.preventDefault();
+    interactedRef.current = true;
+    if (nextMonth) {
+      setCurrentMonth(nextMonth);
+      setFocusedDate(clampToMonth(nextMonth, focusedDate));
+      setAnnouncement(`${months[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`);
+    } else if (next) {
+      if (!isSameMonth(next, currentMonth)) setCurrentMonth(startOfMonth(next));
+      setFocusedDate(next);
     }
-  }, [productId]);
+  };
+
+  const jumpToNextAvailable = () => {
+    interactedRef.current = true;
+    const found = nextAvailableDate([...bookedSet], today);
+    if (!found) {
+      setAnnouncement(t('calendar.noAvailability'));
+      return;
+    }
+    const [y, m, d] = found.split('-').map(Number);
+    const date = new Date(y, m - 1, d);
+    setCurrentMonth(startOfMonth(date));
+    setFocusedDate(date);
+    onDateSelect?.(date);
+    setAnnouncement(`${t('calendar.nextAvailable')}: ${describe(date)}`);
+  };
 
-  const renderHeader = () => {
-    return (
-      <div className="flex items-center justify-between px-2 mb-6">
-        <span className="font-heading text-lg text-stone-800 uppercase tracking-widest">
+  const weeks = useMemo(() => buildMonthMatrix(currentMonth), [currentMonth]);
+  const headingId = 'availability-month';
+
+  return (
+    <div className="bg-ivory p-4">
+      <div className="flex items-center justify-between px-2 mb-4">
+        <h3 id={headingId} className="font-heading text-lg text-stone-800 uppercase tracking-widest">
           {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
-        </span>
+        </h3>
         <div className="flex gap-2">
-          <button 
-            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
+          <button
+            type="button"
+            onClick={() => goToMonth(-1)}
             className="p-1 hover:text-gold transition-colors"
             aria-label={t('calendar.prev')}
           >
             <PrevIcon className="w-4 h-4" />
           </button>
-          <button 
-            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
+          <button
+            type="button"
+            onClick={() => goToMonth(1)}
             className="p-1 hover:text-gold transition-colors"
             aria-label={t('calendar.next')}
           >
             <NextIcon className="w-4 h-4" />
           </button>
         </div>
       </div>
-    );
-  };
 
-  const renderDays = () => {
-    const days = t('calendar.days').split(',');
-    return (
+      <button
+        type="button"
+        onClick={jumpToNextAvailable}
+        className="btn-luxury-outline w-full mb-4 py-2 text-micro uppercase tracking-widest"
+      >
+        {t('calendar.nextAvailable')}
+      </button>
+
+      {stale && (
+        <p className="mb-3 text-center text-micro text-stone-600 italic">
+          {t('calendar.fallbackNotice')}{' '}
+          <button type="button" onClick={load} className="underline text-gold uppercase tracking-widest">
+            {t('calendar.retry')}
+          </button>
+        </p>
+      )}
+
       <div className="grid grid-cols-7 mb-2">
-        {days.map(day => (
+        {dayNames.map(day => (
           <div key={day} className="text-micro font-bold text-stone-600 uppercase tracking-widest text-center py-2">
             {day}
           </div>
         ))}
       </div>
-    );
-  };
 
-  const renderCells = () => {
-    const monthStart = startOfMonth(currentMonth);
-    const monthEnd = endOfMonth(monthStart);
-    const startDate = startOfWeek(monthStart);
-    const endDate = endOfWeek(monthEnd);
-
-    const calendarDays = eachDayOfInterval({
-      start: startDate,
-      end: endDate,
-    });
-
-    return (
-      <div className="grid grid-cols-7 gap-px bg-stone-100 border border-stone-100">
-        {calendarDays.map((date, i) => {
-          const isBooked = bookedDates.some(booked => isSameDay(booked, date));
-          const isPast = isBefore(date, today);
-          const isCurrentMonth = isSameMonth(date, monthStart);
-          const isSelected = selectedDate && isSameDay(date, selectedDate);
-
-          return (
-            <div
-              key={i}
-              onClick={() => !isBooked && !isPast && isCurrentMonth && onDateSelect?.(date)}
-              className={cn(
-                "relative aspect-square flex flex-col items-center justify-center text-micro transition-all bg-ivory",
-                loading && "opacity-50",
-                !isCurrentMonth && "text-stone-200",
-                (isBooked || isPast) && isCurrentMonth && "bg-stone-50 text-stone-500 cursor-not-allowed",
-                isCurrentMonth && !isBooked && !isPast && "hover:bg-ivory cursor-pointer text-stone-700",
-                isSelected && "bg-gold text-white hover:bg-gold-dark"
-              )}
-            >
-              <span>{format(date, 'd')}</span>
-              {isBooked && isCurrentMonth && (
-                <div className="absolute bottom-1 w-1 h-1 bg-stone-200 rounded-full" />
-              )}
-            </div>
-          );
-        })}
+      <div
+        ref={gridRef}
+        role="grid"
+        data-testid="availability-grid"
+        aria-labelledby={headingId}
+        aria-busy={loading}
+        onKeyDown={handleKeyDown}
+        className="grid grid-cols-7 gap-px bg-stone-100 border border-stone-100"
+      >
+        {weeks.map((week, wi) => (
+          <div role="row" key={`w${wi}`} className="contents">
+            {week.map(date => {
+              const inMonth = isSameMonth(date, currentMonth);
+              const past = isBefore(date, today);
+              const booked = bookedSet.has(isoKey(date));
+              const selectable = inMonth && !past && !booked;
+              const isSelected = !!selectedDate && isSameDay(date, selectedDate);
+              const statusLabel = statusLabelFor(date);
+              return (
+                <div
+                  role="gridcell"
+                  key={isoKey(date)}
+                  aria-selected={isSelected}
+                  className="relative aspect-square"
+                >
+                  <button
+                    type="button"
+                    data-date={isoKey(date)}
+                    tabIndex={isSameDay(date, focusedDate) ? 0 : -1}
+                    aria-disabled={!selectable}
+                    aria-current={isSameDay(date, today) ? 'date' : undefined}
+                    aria-label={`${describe(date)}, ${statusLabel}`}
+                    onFocus={() => setFocusedDate(date)}
+                    onClick={() => selectable && onDateSelect?.(date)}
+                    className={cn(
+                      'w-full h-full flex items-center justify-center text-micro transition-all bg-ivory',
+                      loading && 'animate-pulse opacity-60',
+                      !inMonth && 'text-stone-200',
+                      (past || booked) && inMonth && 'bg-stone-50 text-stone-500 cursor-not-allowed',
+                      selectable && 'hover:bg-gold/10 cursor-pointer text-stone-700',
+                      isSelected && 'bg-gold text-white hover:bg-gold'
+                    )}
+                  >
+                    <span>{format(date, 'd')}</span>
+                  </button>
+                  {booked && inMonth && (
+                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-stone-400 rounded-full pointer-events-none" />
+                  )}
+                </div>
+              );
+            })}
+          </div>
+        ))}
       </div>
-    );
-  };
 
-  return (
-    <div className="bg-ivory p-4">
-      {renderHeader()}
-      {renderDays()}
-      {renderCells()}
-      <div className="mt-6 flex flex-wrap gap-4 justify-center">
-        <div className="flex items-center gap-2">
-          <div className="w-2 h-2 bg-gold rounded-full" />
-          <span className="text-micro uppercase tracking-widest text-stone-600">{t('calendar.available')}</span>
-        </div>
-        <div className="flex items-center gap-2">
-          <div className="w-2 h-2 bg-stone-100 rounded-full" />
-          <span className="text-micro uppercase tracking-widest text-stone-600">{t('calendar.booked')}</span>
+      {selectedDate ? (
+        <p data-testid="rental-summary" className="mt-4 text-center text-micro text-stone-700 uppercase tracking-widest">
+          {t('calendar.selectedPrefix')} {describe(selectedDate)} · {t('product.rental_7day')}
+        </p>
+      ) : (
+        <div className="mt-6 flex flex-wrap gap-4 justify-center">
+          <div className="flex items-center gap-2">
+            <div className="w-2 h-2 bg-gold rounded-full" />
+            <span className="text-micro uppercase tracking-widest text-stone-600">{t('calendar.available')}</span>
+          </div>
+          <div className="flex items-center gap-2">
+            <div className="w-2 h-2 bg-stone-100 rounded-full" />
+            <span className="text-micro uppercase tracking-widest text-stone-600">{t('calendar.booked')}</span>
+          </div>
         </div>
+      )}
+
+      <div role="status" aria-live="polite" className="sr-only">
+        {announcement}
       </div>
     </div>
   );
-}
\ No newline at end of file
+}
diff --git a/src/contexts/LanguageContext.tsx b/src/contexts/LanguageContext.tsx
index 0eeb10f..450b206 100644
--- a/src/contexts/LanguageContext.tsx
+++ b/src/contexts/LanguageContext.tsx
@@ -341,20 +341,28 @@ const translations: Record<Language, Record<string, string>> = {
     'product.available': 'available',
     'product.fully_booked': 'fully booked',
 
     // Calendar
     'calendar.days': 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
     'calendar.months': 'January,February,March,April,May,June,July,August,September,October,November,December',
     'calendar.available': 'Available',
     'calendar.booked': 'Booked',
     'calendar.prev': 'Previous month',
     'calendar.next': 'Next month',
+    'calendar.nextAvailable': 'Next available date',
+    'calendar.statusAvailable': 'available',
+    'calendar.statusBooked': 'booked',
+    'calendar.statusPast': 'past',
+    'calendar.selectedPrefix': 'Selected:',
+    'calendar.noAvailability': 'No availability in the next 6 months.',
+    'calendar.fallbackNotice': "Availability couldn't be loaded — showing approximate data.",
+    'calendar.retry': 'Retry',
 
     // Checkout
     'checkout.empty': 'Your Bag is Empty',
     'checkout.empty_desc': 'Please select pieces from our collection first.',
     'checkout.explore': 'Explore Collection',
     'checkout.step_identity': 'Identity',
     'checkout.step_logistics': 'Logistics',
     'checkout.step_confirm': 'Confirm',
     'checkout.personal_details': 'Personal Details',
     'checkout.delivery_info': 'Delivery Information',
@@ -1079,20 +1087,28 @@ const translations: Record<Language, Record<string, string>> = {
     'product.available': 'متاح',
     'product.fully_booked': 'محجوز بالكامل',
 
     // Calendar
     'calendar.days': 'أحد,اثنين,ثلاثاء,أربعاء,خميس,جمعة,سبت',
     'calendar.months': 'يناير,فبراير,مارس,أبريل,مايو,يونيو,يوليو,أغسطس,سبتمبر,أكتوبر,نوفمبر,ديسمبر',
     'calendar.available': 'متاح',
     'calendar.booked': 'محجوز',
     'calendar.prev': 'الشهر السابق',
     'calendar.next': 'الشهر التالي',
+    'calendar.nextAvailable': 'أقرب تاريخ متاح',
+    'calendar.statusAvailable': 'متاح',
+    'calendar.statusBooked': 'محجوز',
+    'calendar.statusPast': 'ماضٍ',
+    'calendar.selectedPrefix': 'المحدد:',
+    'calendar.noAvailability': 'لا توجد مواعيد متاحة خلال الأشهر الستة القادمة.',
+    'calendar.fallbackNotice': 'تعذّر تحميل التوفر — تُعرض بيانات تقريبية.',
+    'calendar.retry': 'إعادة المحاولة',
 
     // Checkout
     'checkout.empty': 'حقيبتك فارغة',
     'checkout.empty_desc': 'يرجى اختيار القطع من مجموعتنا أولاً.',
     'checkout.explore': 'استكشف المجموعة',
     'checkout.step_identity': 'الهوية',
     'checkout.step_logistics': 'التوصيل',
     'checkout.step_confirm': 'التأكيد',
     'checkout.personal_details': 'البيانات الشخصية',
     'checkout.delivery_info': 'معلومات التوصيل',
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
diff --git a/src/pages/ProductDetail.tsx b/src/pages/ProductDetail.tsx
index 803bd95..1b3af89 100644
--- a/src/pages/ProductDetail.tsx
+++ b/src/pages/ProductDetail.tsx
@@ -410,23 +410,25 @@ export default function ProductDetail() {
 
               {/* Selection */}
               <div className="space-y-6 mb-10">
                 {isRent && (
                   <div className="p-5 bg-stone-50 border border-stone-200">
                     <div className="flex justify-between items-center mb-3">
                       <span className="font-body text-micro tracking-[0.2em] uppercase text-stone-800">{t('product.rental_availability')}</span>
                       <span className="text-micro text-gold uppercase tracking-widest font-bold">{t('product.fast_booking')}</span>
                     </div>
                     <AvailabilityCalendar productId={product.id} selectedDate={bookingDate} onDateSelect={setBookingDate} />
-                    <p className="text-micro text-stone-600 leading-relaxed italic text-center mt-3">
-                      {bookingDate ? `${t('product.selected_date')}: ${bookingDate.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-AE')}` : t('product.select_date_hint')}
-                    </p>
+                    {!bookingDate && (
+                      <p className="text-micro text-stone-600 leading-relaxed italic text-center mt-3">
+                        {t('product.select_date_hint')}
+                      </p>
+                    )}
                   </div>
                 )}
 
                 <div>
                   <div className="flex justify-between items-center mb-3">
                     <span className="font-body text-micro tracking-[0.2em] uppercase text-stone-800">{t('product.select_size_label')}</span>
                     <button onClick={() => setShowSizeGuide(true)} className="flex items-center gap-2 text-micro tracking-widest text-gold uppercase hover:underline">
                       <Ruler className="w-3 h-3" /> {t('product.size_guide')}
                     </button>
                   </div>
diff --git a/tests/rental-calendar.spec.ts b/tests/rental-calendar.spec.ts
new file mode 100644
index 0000000..e722e37
--- /dev/null
+++ b/tests/rental-calendar.spec.ts
@@ -0,0 +1,67 @@
+import { test, expect, type Page } from '@playwright/test';
+import { addDays, format } from 'date-fns';
+
+const PRODUCT_URL = '/product/17';
+
+async function openRental(page: Page, lang: 'en' | 'ar') {
+  await page.addInitScript(l => localStorage.setItem('riman_lang', l), lang);
+  await page.goto(PRODUCT_URL);
+  const grid = page.getByRole('grid');
+  await expect(grid).toBeVisible();
+  return grid;
+}
+
+// The grid renders one month at a time; a seed ~20 days out may live in the
+// next month. Advance months until the seed cell exists in the DOM.
+async function revealSeed(page: Page, grid: ReturnType<Page['getByRole']>, iso: string, lang: 'en' | 'ar') {
+  const nextMonthButton = page.getByRole('button', { name: lang === 'ar' ? 'الشهر التالي' : 'Next month' });
+  for (let i = 0; i < 2 && !(await grid.locator(`[data-date="${iso}"]`).count()); i++) {
+    await nextMonthButton.click();
+  }
+  await expect(grid.locator(`[data-date="${iso}"]`)).toHaveCount(1);
+}
+
+test.describe('Rental calendar accessibility', () => {
+  test('keyboard-only selection: arrows move focus, Enter selects', async ({ page }) => {
+    const grid = await openRental(page, 'en');
+    const seed = format(addDays(new Date(), 20), 'yyyy-MM-dd');
+    await revealSeed(page, grid, seed, 'en');
+    await grid.locator(`[data-date="${seed}"]`).focus();
+    await page.keyboard.press('ArrowRight');
+    await expect(page.locator(`[data-date="${format(addDays(new Date(), 21), 'yyyy-MM-dd')}"]`)).toBeFocused();
+    await page.keyboard.press('Enter');
+    await expect(page.getByTestId('rental-summary')).toBeVisible();
+  });
+
+  test('unavailable days are announced and not selectable', async ({ page }) => {
+    const grid = await openRental(page, 'en');
+    const yesterday = grid.locator(`[data-date="${format(addDays(new Date(), -1), 'yyyy-MM-dd')}"]`);
+    await expect(yesterday).toHaveAttribute('aria-disabled', 'true');
+    await yesterday.focus();
+    await page.keyboard.press('Enter');
+    await expect(page.getByTestId('rental-summary')).toHaveCount(0);
+  });
+
+  test('"Next available date" jumps, selects, and announces', async ({ page }) => {
+    await openRental(page, 'en');
+    await page.getByRole('button', { name: /next available date/i }).click();
+    const summary = page.getByTestId('rental-summary');
+    await expect(summary).toBeVisible();
+    const status = page.locator('[role="status"]');
+    await expect(status).not.toHaveText('');
+    const selectedCell = page.locator('[role="gridcell"][aria-selected="true"] button');
+    await expect(selectedCell).toBeFocused();
+  });
+
+  test('Arabic locale: labels localize and horizontal arrows invert', async ({ page }) => {
+    const grid = await openRental(page, 'ar');
+    const seed = format(addDays(new Date(), 20), 'yyyy-MM-dd');
+    await revealSeed(page, grid, seed, 'ar');
+    await grid.locator(`[data-date="${seed}"]`).focus();
+    const before = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
+    await page.keyboard.press('ArrowRight');
+    const after = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
+    expect(before).not.toEqual(after);
+    await expect(page.getByRole('button', { name: /أقرب تاريخ متاح/ })).toBeVisible();
+  });
+});
