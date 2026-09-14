# Review package final fixes (6e9269d..46540b1)
## Commits
46540b1 fix(rental): announce fetch failure, ARIA columnheaders, cover selection-clearing

## Stat
 src/components/AvailabilityCalendar.test.tsx |  8 ++++++++
 src/components/AvailabilityCalendar.tsx      | 20 +++++++++++---------
 2 files changed, 19 insertions(+), 9 deletions(-)

## Diff (-U10)
diff --git a/src/components/AvailabilityCalendar.test.tsx b/src/components/AvailabilityCalendar.test.tsx
index 0f98e72..fc13d58 100644
--- a/src/components/AvailabilityCalendar.test.tsx
+++ b/src/components/AvailabilityCalendar.test.tsx
@@ -99,20 +99,28 @@ describe('AvailabilityCalendar', () => {
   });
 
   it('shows the fallback notice on fetch failure and retries', async () => {
     mockedFetch.mockRejectedValueOnce(new Error('offline'));
     renderCalendar();
     const retry = await screen.findByRole('button', { name: /retry/i });
     fireEvent.click(retry);
     await waitFor(() => expect(screen.queryByRole('button', { name: /retry/i })).toBeNull());
   });
 
+  it('clears the selection and announces when a refetch reveals it booked', async () => {
+    const d = addDays(TODAY, 10);
+    mockedFetch.mockResolvedValue([format(d, 'yyyy-MM-dd')]);
+    const onDateSelect = renderCalendar({ productId: 'p1', selectedDate: d });
+    await waitFor(() => expect(onDateSelect).toHaveBeenCalledWith(null));
+    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('booked'));
+  });
+
   it('flips horizontal arrow direction under RTL', async () => {
     localStorage.setItem('riman_lang', 'ar');
     renderCalendar();
     const grid = screen.getByTestId('availability-grid');
     const todayCell = document.querySelector(`[data-date="${format(TODAY, 'yyyy-MM-dd')}"]`) as HTMLButtonElement;
     todayCell.focus();
     fireEvent.keyDown(grid, { key: 'ArrowRight' });
     expect(document.activeElement?.getAttribute('data-date')).toBe(format(addDays(TODAY, -1), 'yyyy-MM-dd'));
   });
 });
diff --git a/src/components/AvailabilityCalendar.tsx b/src/components/AvailabilityCalendar.tsx
index 785a975..61fdeda 100644
--- a/src/components/AvailabilityCalendar.tsx
+++ b/src/components/AvailabilityCalendar.tsx
@@ -37,21 +37,24 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
     setLoading(true);
     setStale(false);
     fetchBookedDates(productId)
       .then(dates => {
         setBookedIso(dates);
         if (selectedRef.current && dates.includes(isoKey(selectedRef.current))) {
           onDateSelect?.(null);
           setAnnouncement(t('calendar.statusBooked'));
         }
       })
-      .catch(() => setStale(true))
+      .catch(() => {
+        setStale(true);
+        setAnnouncement(t('calendar.fallbackNotice'));
+      })
       .finally(() => setLoading(false));
   }, [productId, onDateSelect, t]);
 
   useEffect(() => { load(); }, [load]);
 
   const bookedSet = useMemo(() => new Set(bookedIso), [bookedIso]);
   const canSelect = useCallback(
     (d: Date) => isSameMonth(d, currentMonth) && !isUnavailable(d, bookedSet, today),
     [currentMonth, bookedSet, today]
   );
@@ -175,37 +178,36 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
 
       {stale && (
         <p className="mb-3 text-center text-micro text-stone-600 italic">
           {t('calendar.fallbackNotice')}{' '}
           <button type="button" onClick={load} className="underline text-gold uppercase tracking-widest">
             {t('calendar.retry')}
           </button>
         </p>
       )}
 
-      <div className="grid grid-cols-7 mb-2">
-        {dayNames.map(day => (
-          <div key={day} className="text-micro font-bold text-stone-600 uppercase tracking-widest text-center py-2">
-            {day}
-          </div>
-        ))}
-      </div>
-
       <div
         ref={gridRef}
         role="grid"
         data-testid="availability-grid"
         aria-labelledby={headingId}
         aria-busy={loading}
         onKeyDown={handleKeyDown}
         className="grid grid-cols-7 gap-px bg-stone-100 border border-stone-100"
       >
+        <div role="row" className="contents">
+          {dayNames.map(day => (
+            <div key={day} role="columnheader" className="text-micro font-bold text-stone-600 uppercase tracking-widest text-center py-2 bg-ivory">
+              {day}
+            </div>
+          ))}
+        </div>
         {weeks.map((week, wi) => (
           <div role="row" key={`w${wi}`} className="contents">
             {week.map(date => {
               const inMonth = isSameMonth(date, currentMonth);
               const past = isBefore(date, today);
               const booked = bookedSet.has(isoKey(date));
               const selectable = inMonth && !past && !booked;
               const isSelected = !!selectedDate && isSameDay(date, selectedDate);
               const statusLabel = statusLabelFor(date);
               return (
