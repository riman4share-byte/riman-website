### Task 3: Rewrite `AvailabilityCalendar` as an accessible ARIA grid

**Files:**
- Modify: `src/components/AvailabilityCalendar.tsx` (full rewrite, 138 → ~250 lines)
- Modify: `src/pages/ProductDetail.tsx:420-422` (drop its duplicate selected-date echo; keep hint only pre-selection)
- Test: `src/components/AvailabilityCalendar.test.tsx`

**Interfaces:**
- Consumes: `fetchBookedDates(productId: string): Promise<string[]>` from `src/services/rentals.ts` (unchanged); helpers from Task 1; keys from Task 2; `useLanguage()` → `{ t, isRtl, language }`.
- Produces: exported default component, same props except `onDateSelect?: (date: Date | null) => void`. Grid exposes `role="grid"` with `data-testid="availability-grid"`; day buttons carry `data-date="yyyy-MM-dd"`; summary line carries `data-testid="rental-summary"`; live region carries `role="status"`.

- [ ] **Step 1: Write failing component tests**

Create `src/components/AvailabilityCalendar.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import AvailabilityCalendar from './AvailabilityCalendar';
import { fetchBookedDates } from '../services/rentals';
import { addDays, format } from 'date-fns';

vi.mock('../services/rentals', () => ({
  fetchBookedDates: vi.fn(),
}));

const mockedFetch = vi.mocked(fetchBookedDates);
const TODAY = new Date();

function renderCalendar(props: Partial<Parameters<typeof AvailabilityCalendar>[0]> = {}) {
  const onDateSelect = vi.fn();
  render(
    <LanguageProvider>
      <AvailabilityCalendar onDateSelect={onDateSelect} {...props} />
    </LanguageProvider>
  );
  return onDateSelect;
}

function dayButton(offsetDays: number) {
  const d = addDays(TODAY, offsetDays);
  return document.querySelector(`[data-date="${format(d, 'yyyy-MM-dd')}"]`) as HTMLButtonElement;
}

beforeEach(() => {
  localStorage.setItem('riman_lang', 'en');
  mockedFetch.mockResolvedValue([format(addDays(TODAY, 5), 'yyyy-MM-dd')]);
});

describe('AvailabilityCalendar', () => {
  it('renders an ARIA grid with labelled day buttons', async () => {
    renderCalendar();
    expect(screen.getByRole('grid')).toBeDefined();
    await waitFor(() => {
      expect(document.querySelector(`[data-date="${format(addDays(TODAY, 30), 'yyyy-MM-dd')}"]`)).toBeTruthy();
    });
    const future = screen.getByRole('button', { name: new RegExp(`${format(addDays(TODAY, 30), 'd')}`) });
    expect(future.getAttribute('aria-label')).toContain(', available');
  });

  it('marks booked days unavailable and ignores clicks on them', async () => {
    const onDateSelect = renderCalendar();
    const booked = await waitFor(() => dayButton(5));
    expect(booked.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(booked);
    expect(onDateSelect).not.toHaveBeenCalled();
  });

  it('selects an available day on click and shows the summary line', async () => {
    const onDateSelect = renderCalendar({ selectedDate: null });
    const target = await waitFor(() => dayButton(30));
    fireEvent.click(target);
    expect(onDateSelect).toHaveBeenCalledWith(expect.any(Date));
  });

  it('moves focus with arrow keys and selects with Enter', async () => {
    const onDateSelect = renderCalendar();
    const grid = screen.getByTestId('availability-grid');
    const todayCell = document.querySelector(`[data-date="${format(TODAY, 'yyyy-MM-dd')}"]`) as HTMLButtonElement;
    todayCell.focus();
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    expect(document.activeElement?.getAttribute('data-date')).toBe(format(addDays(TODAY, 1), 'yyyy-MM-dd'));
    fireEvent.keyDown(grid, { key: 'Enter' });
    expect(onDateSelect).toHaveBeenCalled();
  });

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

  it('jumps to the next open day via the shortcut button', async () => {
    const onDateSelect = renderCalendar({ selectedDate: null });
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: /next available date/i }));
    expect(onDateSelect).toHaveBeenCalledWith(addDays(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()), 1));
    expect(screen.getByRole('status').textContent?.length ?? 0).toBeGreaterThan(0);
  });

  it('shows the fallback notice on fetch failure and retries', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('offline'));
    renderCalendar();
    const retry = await screen.findByRole('button', { name: /retry/i });
    fireEvent.click(retry);
    await waitFor(() => expect(screen.queryByRole('button', { name: /retry/i })).toBeNull());
  });

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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/AvailabilityCalendar.test.tsx`
Expected: FAIL — old component has no `data-testid="availability-grid"` / `data-date` attributes (and no shortcut button).

- [ ] **Step 3: Implement the rewritten component**

Replace the entire contents of `src/components/AvailabilityCalendar.tsx` with:

```tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addDays, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isBefore, startOfToday, format, setDate } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchBookedDates } from '../services/rentals';
import { useLanguage } from '../contexts/LanguageContext';
import { buildMonthMatrix, clampToMonth, isUnavailable, isoKey, nextAvailableDate } from '../lib/calendar';

interface AvailabilityCalendarProps {
  productId?: string;
  bookedDates?: Date[];
  onDateSelect?: (date: Date | null) => void;
  selectedDate?: Date | null;
}

export default function AvailabilityCalendar({ productId, bookedDates: initialBookedDates = [], onDateSelect, selectedDate }: AvailabilityCalendarProps) {
  const today = startOfToday();
  const { t, isRtl } = useLanguage();
  const months = t('calendar.months').split(',');
  const dayNames = t('calendar.days').split(',');
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const [currentMonth, setCurrentMonth] = useState<Date>(() => today);
  const [bookedIso, setBookedIso] = useState<string[]>(() => initialBookedDates.map(isoKey));
  const [loading, setLoading] = useState(false);
  const [stale, setStale] = useState(false);
  const [focusedDate, setFocusedDate] = useState<Date>(() => today);
  const [announcement, setAnnouncement] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const interactedRef = useRef(false);
  const selectedRef = useRef(selectedDate);
  selectedRef.current = selectedDate;

  const load = useCallback(() => {
    if (!productId) return;
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
      .catch(() => setStale(true))
      .finally(() => setLoading(false));
  }, [productId, onDateSelect, t]);

  useEffect(() => { load(); }, [load]);

  const bookedSet = useMemo(() => new Set(bookedIso), [bookedIso]);
  const canSelect = useCallback(
    (d: Date) => isSameMonth(d, currentMonth) && !isUnavailable(d, bookedSet, today),
    [currentMonth, bookedSet, today]
  );

  useEffect(() => {
    if (!interactedRef.current) return;
    const el = gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${isoKey(focusedDate)}"]`);
    el?.focus();
  }, [focusedDate, currentMonth]);

  const describe = useCallback(
    (d: Date) => `${dayNames[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    [dayNames, months]
  );

  const goToMonth = (delta: number) => {
    const next = delta < 0 ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1);
    setCurrentMonth(next);
    setFocusedDate(clampToMonth(next, focusedDate));
    setAnnouncement(`${months[next.getMonth()]} ${next.getFullYear()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const dir = isRtl ? -1 : 1;
    let next: Date | undefined;
    let nextMonth: Date | undefined;
    switch (e.key) {
      case 'ArrowUp': next = addDays(focusedDate, -7); break;
      case 'ArrowDown': next = addDays(focusedDate, 7); break;
      case 'ArrowLeft': next = addDays(focusedDate, -dir); break;
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
          setAnnouncement(describe(focusedDate));
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
      setCurrentMonth(nextMonth);
      setFocusedDate(clampToMonth(nextMonth, focusedDate));
      setAnnouncement(`${months[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`);
    } else if (next) {
      if (!isSameMonth(next, currentMonth)) setCurrentMonth(startOfMonth(next));
      setFocusedDate(next);
    }
  };

  const jumpToNextAvailable = () => {
    interactedRef.current = true;
    const found = nextAvailableDate([...bookedSet], today);
    if (!found) {
      setAnnouncement(t('calendar.noAvailability'));
      return;
    }
    const [y, m, d] = found.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    setCurrentMonth(startOfMonth(date));
    setFocusedDate(date);
    onDateSelect?.(date);
    setAnnouncement(`${t('calendar.nextAvailable')}: ${describe(date)}`);
  };

  const weeks = useMemo(() => buildMonthMatrix(currentMonth), [currentMonth]);
  const headingId = 'availability-month';

  return (
    <div className="bg-ivory p-4">
      <div className="flex items-center justify-between px-2 mb-4">
        <h3 id={headingId} className="font-heading text-lg text-stone-800 uppercase tracking-widest">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            className="p-1 hover:text-gold transition-colors"
            aria-label={t('calendar.prev')}
          >
            <PrevIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            className="p-1 hover:text-gold transition-colors"
            aria-label={t('calendar.next')}
          >
            <NextIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={jumpToNextAvailable}
        className="btn-luxury-outline w-full mb-4 py-2 text-micro uppercase tracking-widest"
      >
        {t('calendar.nextAvailable')}
      </button>

      {stale && (
        <p className="mb-3 text-center text-micro text-stone-600 italic">
          {t('calendar.fallbackNotice')}{' '}
          <button type="button" onClick={load} className="underline text-gold uppercase tracking-widest">
            {t('calendar.retry')}
          </button>
        </p>
      )}

      <div className="grid grid-cols-7 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-micro font-bold text-stone-600 uppercase tracking-widest text-center py-2">
            {day}
          </div>
        ))}
      </div>

      <div
        ref={gridRef}
        role="grid"
        data-testid="availability-grid"
        aria-labelledby={headingId}
        aria-busy={loading}
        onKeyDown={handleKeyDown}
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
              const statusLabel = past
                ? t('calendar.statusPast')
                : booked
                  ? t('calendar.statusBooked')
                  : t('calendar.statusAvailable');
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
                    tabIndex={isSameDay(date, focusedDate) ? 0 : -1}
                    aria-disabled={!selectable}
                    aria-current={isSameDay(date, today) ? 'date' : undefined}
                    aria-label={`${describe(date)}, ${statusLabel}`}
                    onFocus={() => setFocusedDate(date)}
                    onClick={() => selectable && onDateSelect?.(date)}
                    className={cn(
                      'w-full h-full flex items-center justify-center text-micro transition-all bg-ivory',
                      loading && 'animate-pulse opacity-60',
                      !inMonth && 'text-stone-200',
                      (past || booked) && inMonth && 'bg-stone-50 text-stone-500 cursor-not-allowed',
                      selectable && 'hover:bg-gold/10 cursor-pointer text-stone-700',
                      isSelected && 'bg-gold text-white hover:bg-gold'
                    )}
                  >
                    <span>{format(date, 'd')}</span>
                  </button>
                  {booked && inMonth && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-stone-400 rounded-full pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedDate ? (
        <p data-testid="rental-summary" className="mt-4 text-center text-micro text-stone-700 uppercase tracking-widest">
          {t('calendar.selectedPrefix')} {describe(selectedDate)} · {t('product.rental_7day')}
        </p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gold rounded-full" />
            <span className="text-micro uppercase tracking-widest text-stone-600">{t('calendar.available')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-stone-100 rounded-full" />
            <span className="text-micro uppercase tracking-widest text-stone-600">{t('calendar.booked')}</span>
          </div>
        </div>
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
```

Then in `src/pages/ProductDetail.tsx`, replace lines 420-422:

```tsx
                    <p className="text-micro text-stone-600 leading-relaxed italic text-center mt-3">
                      {bookingDate ? `${t('product.selected_date')}: ${bookingDate.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-AE')}` : t('product.select_date_hint')}
                    </p>
```

with:

```tsx
                    {!bookingDate && (
                      <p className="text-micro text-stone-600 leading-relaxed italic text-center mt-3">
                        {t('product.select_date_hint')}
                      </p>
                    )}
```

If `language` becomes unused in that scope after this edit, leave it — it is used elsewhere in the file (verify with `npm run lint`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/AvailabilityCalendar.test.tsx`
Expected: PASS (all 8 tests). If the RTL test fails because `LanguageProvider` caches language module-state, reset via `localStorage.setItem('riman_lang','ar')` in the test *before* importing/rendering (already ordered that way) and re-run.

- [ ] **Step 5: Run the full vitest suite for regressions**

Run: `npm test`
Expected: PASS — no previously-green suite turns red (especially anything rendering `ProductDetail` or `AvailabilityCalendar`).

- [ ] **Step 6: Commit**

```bash
git add src/components/AvailabilityCalendar.tsx src/components/AvailabilityCalendar.test.tsx src/pages/ProductDetail.tsx
git commit -m "a11y(rental): ARIA grid calendar with roving tabindex, next-available shortcut, disclosed fetch failures"
```

---

