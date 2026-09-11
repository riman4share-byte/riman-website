import { useState, useEffect, useMemo } from 'react';
import { fetchBookedDates } from '../services/rentals';
import { startOfToday, addDays, isSameDay, isBefore, parseISO } from 'date-fns';

export interface AvailabilityWindow {
  start: Date | null;
  end: Date | null;
  isAvailable: boolean;
}

export function useProductAvailability(productId: string | undefined): AvailabilityWindow {
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    setLoading(true);
    fetchBookedDates(productId)
      .then(dates => {
        if (!cancelled) {
          setBookedDates(dates.map(d => parseISO(d)));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [productId]);

  const window = useMemo((): AvailabilityWindow => {
    if (loading || bookedDates.length === 0) {
      return { start: null, end: null, isAvailable: true };
    }
    const today = startOfToday();
    const sorted = [...bookedDates].sort((a, b) => a.getTime() - b.getTime());
    let cursor = today;
    if (isBefore(cursor, today)) cursor = today;
    for (const booked of sorted) {
      if (isSameDay(cursor, booked)) {
        cursor = addDays(cursor, 1);
      } else if (isBefore(cursor, booked)) {
        const gap = Math.floor((booked.getTime() - cursor.getTime()) / 86400000);
        if (gap >= 1) {
          return { start: cursor, end: addDays(cursor, Math.min(gap, 6)), isAvailable: true };
        }
        cursor = addDays(booked, 1);
      }
    }
    return { start: cursor, end: addDays(cursor, 6), isAvailable: true };
  }, [bookedDates, loading]);

  return window;
}