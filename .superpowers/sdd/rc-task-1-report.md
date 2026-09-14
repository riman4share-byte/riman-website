# Task 1 Report: Pure calendar helpers (`src/lib/calendar.ts`)

**Status:** DONE
**Commit:** `28cbfdd` — feat(rental): pure calendar helpers (month matrix, next-available, clamping)
**Branch:** `salon-rebrand`

## What Was Implemented

Transcribed both files verbatim from `rc-task-1-brief.md`:

- `src/lib/calendar.ts` — five exported helpers:
  - `isoKey(date: Date): string` — local-date `"yyyy-MM-dd"` key via `format`
  - `buildMonthMatrix(month: Date): Date[][]` — Sunday-start whole-week grid padded with out-of-month days (`startOfWeek(startOfMonth)` → `endOfWeek(endOfMonth)`, chunked by 7)
  - `isUnavailable(date, bookedSet, today): boolean` — strict past (midnight comparison) OR booked-key lookup
  - `nextAvailableDate(bookedIso, from? = startOfToday(), horizonDays? = 180): string | null` — scans `0..horizonDays` inclusive for first open day
  - `clampToMonth(month, daySource): Date` — day-of-month of `daySource`, clamped to target month length via `Math.min(date, endOfMonth.getDate())`
  - Plus the brief's single private helper `midnight(date)` for day-level comparisons.
- `src/lib/calendar.test.ts` — 9 tests across 5 describe blocks, verbatim from the brief.

No comments in either file. No helpers or exports beyond what the brief specifies.

## TDD Evidence

### RED

Command: `npm test -- src/lib/calendar.test.ts`

Expected failure per brief Step 2 — module does not exist yet. Output excerpt:

```
FAIL  src/lib/calendar.test.ts [ src/lib/calendar.test.ts ]
Error: Failed to resolve import "./calendar" from "src/lib/calendar.test.ts". Does the file exist?

 Test Files  1 failed (1)
      Tests  no tests
```

### GREEN

Command: `npm test -- src/lib/calendar.test.ts`

```
 Test Files  1 passed (1)
      Tests  9 passed (9)
   Duration  9.13s
```

## Full Suite

Command: `npm test` (run before committing)

```
 Test Files  24 passed (24)
      Tests  109 passed (109)
```

All existing suites remain green; output pristine (no warnings/errors beyond Git's benign LF→CRLF autocrlf notice on commit).

## Files Changed

- Created `src/lib/calendar.ts` (40 lines)
- Created `src/lib/calendar.test.ts` (61 lines)

Commit `28cbfdd` contains exactly these two paths (verified via `git show --stat`). No other working-tree changes were staged; nothing pushed.

## Self-Review Findings

- **Completeness:** All five functions present with signatures identical to the brief's interface spec. All brief test cases included verbatim (9 tests). ✅
- **Quality:** No comments; names match brief exactly; single private `midnight` helper is part of the brief's code block. ✅
- **Discipline (YAGNI):** Nothing added beyond the brief — implementation is a byte-for-byte transcription. ✅
- **Testing:** RED then GREEN evidence captured above; full suite green before commit. ✅

## Concerns

None blocking. Two notes for downstream tasks:

1. `nextAvailableDate`'s loop is inclusive of `horizonDays` (`i <= horizonDays`), i.e. it checks up to 181 days when the default is used. This matches the brief and its tests (horizon 30 + 31 booked days → null); noting in case Task 3/4 UI copy assumes an exact 180-day window.
2. `clampToMonth` uses `endOfMonth(target).getDate()` for month length — correct including leap years; no issue, just confirming behavior for later consumers.

The repo has many unrelated uncommitted changes; none were touched.
