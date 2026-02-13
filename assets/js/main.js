import { CALENDAR_CELL_COUNT } from './constants.js';
import { dom } from './dom.js';
import { formatLongDate, formatMonthYear, toISODate } from './date-utils.js';
import { createHabit, getCompletionCount, getStreakCount, updateHabitCompletion } from './habit-service.js';
import { loadState, saveHabits } from './storage.js';

/**
 * Application state container.
 */
const state = {
  habits: [],
  selectedDate: toISODate(new Date()),
  viewYear: new Date().getFullYear(),
  viewMonth: new Date().getMonth(),
};

init();

/** Bootstraps app state, handlers, and initial render. */
function init() {
  const persisted = loadState();
  state.habits = persisted.habits.filter((habit) => habit.name.length > 0);

  bindEvents();
  render();
}

/** Attach all user interaction listeners. */
function bindEvents() {
  dom.habitForm.addEventListener('submit', handleHabitSubmit);
  dom.prevMonthButton.addEventListener('click', () => updateViewMonth(-1));
  dom.nextMonthButton.addEventListener('click', () => updateViewMonth(1));
}

/**
 * @param {SubmitEvent} event
 */
function handleHabitSubmit(event) {
  event.preventDefault();

  const name = dom.habitInput.value.trim();
  if (!name) {
    return;
  }

  state.habits.push(createHabit(name));
  dom.habitInput.value = '';

  persistAndRender();
}

/**
 * @param {number} deltaMonth
 */
function updateViewMonth(deltaMonth) {
  const next = new Date(state.viewYear, state.viewMonth + deltaMonth, 1);
  state.viewYear = next.getFullYear();
  state.viewMonth = next.getMonth();
  renderCalendar();
}

/** Persist habits then render all UI. */
function persistAndRender() {
  saveHabits(state.habits);
  render();
}

/** Render full UI tree. */
function render() {
  renderHabitList();
  renderCalendar();
}

/** Render habit cards for selected date. */
function renderHabitList() {
  dom.selectedDateLabel.textContent = formatLongDate(state.selectedDate);
  dom.habitList.innerHTML = '';

  for (const habit of state.habits) {
    const item = dom.habitItemTemplate.content.firstElementChild.cloneNode(true);

    const nameEl = item.querySelector('.habit-item__name');
    const metaEl = item.querySelector('.habit-item__meta');
    const checkbox = item.querySelector('.habit-item__checkbox');
    const deleteButton = item.querySelector('.danger-btn');

    const streak = getStreakCount(habit, state.selectedDate);

    nameEl.textContent = habit.name;
    metaEl.textContent = `Streak: ${streak} day${streak === 1 ? '' : 's'}`;
    checkbox.checked = habit.completedDates.includes(state.selectedDate);

    checkbox.addEventListener('change', () => {
      updateHabitCompletion(habit, state.selectedDate, checkbox.checked);
      persistAndRender();
    });

    deleteButton.addEventListener('click', () => {
      state.habits = state.habits.filter((entry) => entry.id !== habit.id);
      persistAndRender();
    });

    dom.habitList.appendChild(item);
  }

  dom.emptyState.hidden = state.habits.length > 0;
}

/** Render 6-week month grid and completion status per day. */
function renderCalendar() {
  const monthStart = new Date(state.viewYear, state.viewMonth, 1);
  const todayKey = toISODate(new Date());

  dom.calendarTitle.textContent = formatMonthYear(monthStart);
  dom.calendarGrid.innerHTML = '';

  // Start at the Sunday before/equal month start.
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  for (let offset = 0; offset < CALENDAR_CELL_COUNT; offset += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + offset);

    const dateKey = toISODate(date);
    const completionCount = getCompletionCount(state.habits, dateKey);

    const dayButton = document.createElement('button');
    dayButton.type = 'button';
    dayButton.className = 'day-cell';
    dayButton.setAttribute('role', 'gridcell');
    dayButton.setAttribute('aria-label', `${date.toDateString()} ${completionCount}/${state.habits.length} habits done`);

    if (date.getMonth() !== state.viewMonth) {
      dayButton.classList.add('day-cell--outside');
    }

    if (dateKey === todayKey) {
      dayButton.classList.add('day-cell--today');
    }

    if (dateKey === state.selectedDate) {
      dayButton.classList.add('day-cell--selected');
    }

    if (state.habits.length > 0 && completionCount === state.habits.length) {
      dayButton.classList.add('day-cell--complete');
    }

    dayButton.innerHTML = `
      <span>${date.getDate()}</span>
      <small>${completionCount}/${state.habits.length} done</small>
    `;

    dayButton.addEventListener('click', () => {
      state.selectedDate = dateKey;
      state.viewYear = date.getFullYear();
      state.viewMonth = date.getMonth();
      render();
    });

    dom.calendarGrid.appendChild(dayButton);
  }
}
