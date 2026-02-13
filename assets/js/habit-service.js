import { HABIT_NAME_MAX_LENGTH, HABIT_NAME_MIN_LENGTH } from './constants.js';
import { fromDateKey, toISODate } from './date-utils.js';

/**
 * Validate habit name and uniqueness.
 * @param {string} value
 * @param {Array<{name: string}>} habits
 * @returns {{ valid: boolean, normalized: string, error: string | null }}
 */
export function validateHabitName(value, habits) {
  const normalized = value.trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return { valid: false, normalized, error: 'Habit name is required.' };
  }

  if (normalized.length < HABIT_NAME_MIN_LENGTH) {
    return {
      valid: false,
      normalized,
      error: `Habit name must be at least ${HABIT_NAME_MIN_LENGTH} characters.`,
    };
  }

  if (normalized.length > HABIT_NAME_MAX_LENGTH) {
    return {
      valid: false,
      normalized,
      error: `Habit name must be ${HABIT_NAME_MAX_LENGTH} characters or fewer.`,
    };
  }

  const isDuplicate = habits.some((habit) => habit.name.toLowerCase() === normalized.toLowerCase());
  if (isDuplicate) {
    return { valid: false, normalized, error: 'This habit already exists.' };
  }

  return { valid: true, normalized, error: null };
}

/**
 * Create a new habit entity.
 * @param {string} name
 * @returns {{id: string, name: string, completedDates: string[], createdAt: number}}
 */
export function createHabit(name) {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    completedDates: [],
    createdAt: Date.now(),
  };
}

/**
 * Toggle completion status for a specific date.
 * @param {Object} habit
 * @param {string} dateKey
 * @param {boolean} isComplete
 */
export function updateHabitCompletion(habit, dateKey, isComplete) {
  const existing = new Set(habit.completedDates);

  if (isComplete) {
    existing.add(dateKey);
  } else {
    existing.delete(dateKey);
  }

  habit.completedDates = [...existing].sort();
}

/**
 * Compute a continuous streak ending at dateKey.
 * @param {{completedDates: string[]}} habit
 * @param {string} dateKey
 * @returns {number}
 */
export function getStreakCount(habit, dateKey) {
  const completed = new Set(habit.completedDates);
  const pointer = fromDateKey(dateKey);
  let streak = 0;

  while (completed.has(toISODate(pointer))) {
    streak += 1;
    pointer.setDate(pointer.getDate() - 1);
  }

  return streak;
}

/**
 * Number of completed habits on a date.
 * @param {Array<{completedDates: string[]}>} habits
 * @param {string} dateKey
 * @returns {number}
 */
export function getCompletionCount(habits, dateKey) {
  return habits.reduce((count, habit) => count + Number(habit.completedDates.includes(dateKey)), 0);
}
