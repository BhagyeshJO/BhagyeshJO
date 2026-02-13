import { STORAGE_KEY } from './constants.js';

/**
 * Read persisted habits from localStorage.
 * Guards against malformed input and reports recoverable errors.
 * @returns {{ habits: Array<{id: string, name: string, completedDates: string[], createdAt: number}>, error: string | null }}
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { habits: [], error: null };
    }

    const data = JSON.parse(raw);
    if (!Array.isArray(data.habits)) {
      return { habits: [], error: 'Stored habit data was invalid and has been reset.' };
    }

    return {
      habits: data.habits.map((habit) => ({
        id: String(habit.id),
        name: String(habit.name ?? '').trim(),
        completedDates: Array.isArray(habit.completedDates)
          ? [...new Set(habit.completedDates.map(String))].sort()
          : [],
        createdAt: Number(habit.createdAt) || Date.now(),
      })),
      error: null,
    };
  } catch {
    return { habits: [], error: 'Could not read saved habits. Starting with a clean state.' };
  }
}

/**
 * Persist habits collection to localStorage.
 * @param {Array} habits
 * @returns {{ ok: boolean, error: string | null }}
 */
export function saveHabits(habits) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        habits,
        updatedAt: Date.now(),
      }),
    );

    return { ok: true, error: null };
  } catch {
    return {
      ok: false,
      error: 'Unable to save habits locally. Your browser storage may be full or unavailable.',
    };
  }
}
