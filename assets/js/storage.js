import { STORAGE_KEY } from './constants.js';

/**
 * Read persisted habits from localStorage.
 * Guards against malformed input.
 * @returns {{ habits: Array<{id: string, name: string, completedDates: string[], createdAt: number}> }}
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(raw ?? '{}');

    if (!Array.isArray(data.habits)) {
      return { habits: [] };
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
    };
  } catch {
    return { habits: [] };
  }
}

/**
 * Persist habits collection to localStorage.
 * @param {Array} habits
 */
export function saveHabits(habits) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      habits,
      updatedAt: Date.now(),
    }),
  );
}
