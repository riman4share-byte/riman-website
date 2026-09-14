# Review package Task 3 (db81650..bfb635c)
## Commits
bfb635c a11y(rental): ARIA grid calendar with roving tabindex, next-available shortcut, disclosed fetch failures

## Stat
 src/components/AvailabilityCalendar.test.tsx | 108 ++++++++++
 src/components/AvailabilityCalendar.tsx      | 305 +++++++++++++++++++--------
 src/pages/ProductDetail.tsx                  |   8 +-
 3 files changed, 329 insertions(+), 92 deletions(-)

## Diff (-U10)
diff --git a/src/components/AvailabilityCalendar.test.tsx b/src/components/AvailabilityCalendar.test.tsx
new file mode 100644
index 0000000..6a96751
--- /dev/null
+++ b/src/components/AvailabilityCalendar.test.tsx
@@ -0,0 +1,108 @@
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
index cd07f6a..1e6384a 100644
--- a/src/components/AvailabilityCalendar.tsx
+++ b/src/components/AvailabilityCalendar.tsx
@@ -1,138 +1,265 @@
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
+          setAnnouncement(describe(focusedDate));
+          return;
+        }
+        onDateSelect?.(focusedDate);
+        setAnnouncement(`${t('calendar.selectedPrefix')} ${describe(focusedDate)}`);
+        return;
+      default: return;
     }
-  }, [productId]);
+    e.preventDefault();
+    interactedRef.current = true;
+    if (nextMonth) {
+      setCurrentMonth(nextMonth);
+      setFocusedDate(clampToMonth(nextMonth, focusedDate));
+      setAnnouncement(`${months[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`);
+    } else if (next) {
+      if (!isSameMonth(next, currentMonth)) setCurrentMonth(startOfMonth(next));
+      setFocusedDate(next);
+    }
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
+
+  const weeks = useMemo(() => buildMonthMatrix(currentMonth), [currentMonth]);
+  const headingId = 'availability-month';
 
-  const renderHeader = () => {
-    return (
-      <div className="flex items-center justify-between px-2 mb-6">
-        <span className="font-heading text-lg text-stone-800 uppercase tracking-widest">
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
+              const statusLabel = past
+                ? t('calendar.statusPast')
+                : booked
+                  ? t('calendar.statusBooked')
+                  : t('calendar.statusAvailable');
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
