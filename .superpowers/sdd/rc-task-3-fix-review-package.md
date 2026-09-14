# Review package Task 3 fix (bfb635c..6502e60)
## Commits
6502e60 fix(rental): announce day status when selection blocked

## Stat
 src/components/AvailabilityCalendar.test.tsx | 10 ++++++++++
 src/components/AvailabilityCalendar.tsx      | 17 +++++++++++------
 2 files changed, 21 insertions(+), 6 deletions(-)

## Diff (-U10)
diff --git a/src/components/AvailabilityCalendar.test.tsx b/src/components/AvailabilityCalendar.test.tsx
index 6a96751..0f98e72 100644
--- a/src/components/AvailabilityCalendar.test.tsx
+++ b/src/components/AvailabilityCalendar.test.tsx
@@ -62,20 +62,30 @@ describe('AvailabilityCalendar', () => {
     const onDateSelect = renderCalendar();
     const grid = screen.getByTestId('availability-grid');
     const todayCell = document.querySelector(`[data-date="${format(TODAY, 'yyyy-MM-dd')}"]`) as HTMLButtonElement;
     todayCell.focus();
     fireEvent.keyDown(grid, { key: 'ArrowRight' });
     expect(document.activeElement?.getAttribute('data-date')).toBe(format(addDays(TODAY, 1), 'yyyy-MM-dd'));
     fireEvent.keyDown(grid, { key: 'Enter' });
     expect(onDateSelect).toHaveBeenCalled();
   });
 
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
   it('pages months with PageUp/PageDown keeping the focused day', async () => {
     renderCalendar();
     const grid = screen.getByTestId('availability-grid');
     const todayCell = document.querySelector(`[data-date="${format(TODAY, 'yyyy-MM-dd')}"]`) as HTMLButtonElement;
     todayCell.focus();
     fireEvent.keyDown(grid, { key: 'PageDown' });
     expect(screen.getByRole('heading', { level: 3 })).toBeDefined();
     const nextMonthSameDay = format(new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, Math.min(TODAY.getDate(), 28)), 'yyyy-MM-dd');
     expect(document.activeElement?.getAttribute('data-date')).toBe(nextMonthSameDay);
   });
diff --git a/src/components/AvailabilityCalendar.tsx b/src/components/AvailabilityCalendar.tsx
index 1e6384a..785a975 100644
--- a/src/components/AvailabilityCalendar.tsx
+++ b/src/components/AvailabilityCalendar.tsx
@@ -60,20 +60,29 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
     if (!interactedRef.current) return;
     const el = gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${isoKey(focusedDate)}"]`);
     el?.focus();
   }, [focusedDate, currentMonth]);
 
   const describe = useCallback(
     (d: Date) => `${dayNames[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
     [dayNames, months]
   );
 
+  const statusLabelFor = useCallback(
+    (d: Date) => {
+      if (isBefore(d, today)) return t('calendar.statusPast');
+      if (bookedSet.has(isoKey(d))) return t('calendar.statusBooked');
+      return t('calendar.statusAvailable');
+    },
+    [bookedSet, t, today]
+  );
+
   const goToMonth = (delta: number) => {
     const next = delta < 0 ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1);
     setCurrentMonth(next);
     setFocusedDate(clampToMonth(next, focusedDate));
     setAnnouncement(`${months[next.getMonth()]} ${next.getFullYear()}`);
   };
 
   const handleKeyDown = (e: React.KeyboardEvent) => {
     const dir = isRtl ? -1 : 1;
     let next: Date | undefined;
@@ -85,21 +94,21 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
       case 'ArrowRight': next = addDays(focusedDate, dir); break;
       case 'Home': next = startOfWeek(focusedDate); break;
       case 'End': next = endOfWeek(focusedDate); break;
       case 'PageUp': nextMonth = subMonths(currentMonth, 1); break;
       case 'PageDown': nextMonth = addMonths(currentMonth, 1); break;
       case ' ':
       case 'Enter':
         e.preventDefault();
         interactedRef.current = true;
         if (!canSelect(focusedDate)) {
-          setAnnouncement(describe(focusedDate));
+          setAnnouncement(`${describe(focusedDate)}, ${statusLabelFor(focusedDate)}`);
           return;
         }
         onDateSelect?.(focusedDate);
         setAnnouncement(`${t('calendar.selectedPrefix')} ${describe(focusedDate)}`);
         return;
       default: return;
     }
     e.preventDefault();
     interactedRef.current = true;
     if (nextMonth) {
@@ -191,25 +200,21 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
         className="grid grid-cols-7 gap-px bg-stone-100 border border-stone-100"
       >
         {weeks.map((week, wi) => (
           <div role="row" key={`w${wi}`} className="contents">
             {week.map(date => {
               const inMonth = isSameMonth(date, currentMonth);
               const past = isBefore(date, today);
               const booked = bookedSet.has(isoKey(date));
               const selectable = inMonth && !past && !booked;
               const isSelected = !!selectedDate && isSameDay(date, selectedDate);
-              const statusLabel = past
-                ? t('calendar.statusPast')
-                : booked
-                  ? t('calendar.statusBooked')
-                  : t('calendar.statusAvailable');
+              const statusLabel = statusLabelFor(date);
               return (
                 <div
                   role="gridcell"
                   key={isoKey(date)}
                   aria-selected={isSelected}
                   className="relative aspect-square"
                 >
                   <button
                     type="button"
                     data-date={isoKey(date)}
