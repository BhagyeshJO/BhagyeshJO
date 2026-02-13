const STORAGE_KEY = 'habit-tracker-v1';

const state = {
  habits: [],
  selectedDate: toISODate(new Date()),
  viewYear: new Date().getFullYear(),
  viewMonth: new Date().getMonth(),
};

const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');
const habitItemTemplate = document.getElementById('habit-item-template');
const emptyState = document.getElementById('empty-state');
const selectedDateLabel = document.getElementById('selected-date-label');
const calendarTitle = document.getElementById('calendar-title');
const calendarGrid = document.getElementById('calendar-grid');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

init();

function init() {
  loadState();
  bindEvents();
  render();
}

function bindEvents() {
  habitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = habitInput.value.trim();

    if (!name) {
      return;
    }

    state.habits.push({
      id: crypto.randomUUID(),
      name,
      completedDates: [],
      createdAt: Date.now(),
    });

    habitInput.value = '';
    persistState();
    render();
  });

  prevMonthBtn.addEventListener('click', () => {
    const previous = new Date(state.viewYear, state.viewMonth - 1, 1);
    state.viewYear = previous.getFullYear();
    state.viewMonth = previous.getMonth();
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    const next = new Date(state.viewYear, state.viewMonth + 1, 1);
    state.viewYear = next.getFullYear();
    state.viewMonth = next.getMonth();
    renderCalendar();
  });
}

function render() {
  renderHabits();
  renderCalendar();
}

function renderHabits() {
  const selectedDate = new Date(`${state.selectedDate}T00:00:00`);
  selectedDateLabel.textContent = selectedDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  habitList.innerHTML = '';

  state.habits.forEach((habit) => {
    const item = habitItemTemplate.content.firstElementChild.cloneNode(true);
    const nameEl = item.querySelector('.habit-name');
    const metaEl = item.querySelector('.habit-meta');
    const checkbox = item.querySelector('.habit-checkbox');
    const deleteBtn = item.querySelector('.delete-btn');

    nameEl.textContent = habit.name;
    metaEl.textContent = `Streak: ${calculateStreak(habit)} day${calculateStreak(habit) === 1 ? '' : 's'}`;
    checkbox.checked = habit.completedDates.includes(state.selectedDate);

    checkbox.addEventListener('change', () => {
      toggleHabitCompletion(habit.id, state.selectedDate, checkbox.checked);
    });

    deleteBtn.addEventListener('click', () => {
      state.habits = state.habits.filter((entry) => entry.id !== habit.id);
      persistState();
      render();
    });

    habitList.appendChild(item);
  });

  emptyState.style.display = state.habits.length ? 'none' : 'block';
}

function renderCalendar() {
  const monthStart = new Date(state.viewYear, state.viewMonth, 1);
  const monthLabel = monthStart.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
  calendarTitle.textContent = monthLabel;

  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  calendarGrid.innerHTML = '';

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);

    const dateKey = toISODate(date);
    const dayBtn = document.createElement('button');
    dayBtn.className = 'day-cell';

    if (date.getMonth() !== state.viewMonth) {
      dayBtn.classList.add('outside');
    }

    if (dateKey === toISODate(new Date())) {
      dayBtn.classList.add('today');
    }

    if (dateKey === state.selectedDate) {
      dayBtn.classList.add('selected');
    }

    const completionCount = getCompletionCountForDate(dateKey);
    if (state.habits.length > 0 && completionCount === state.habits.length) {
      dayBtn.classList.add('complete');
    }

    dayBtn.innerHTML = `<span>${date.getDate()}</span><small>${completionCount}/${state.habits.length} done</small>`;

    dayBtn.addEventListener('click', () => {
      state.selectedDate = dateKey;
      state.viewYear = date.getFullYear();
      state.viewMonth = date.getMonth();
      render();
    });

    calendarGrid.appendChild(dayBtn);
  }
}

function toggleHabitCompletion(habitId, dateKey, isComplete) {
  const habit = state.habits.find((entry) => entry.id === habitId);
  if (!habit) {
    return;
  }

  if (isComplete && !habit.completedDates.includes(dateKey)) {
    habit.completedDates.push(dateKey);
  }

  if (!isComplete) {
    habit.completedDates = habit.completedDates.filter((date) => date !== dateKey);
  }

  habit.completedDates.sort();
  persistState();
  render();
}

function getCompletionCountForDate(dateKey) {
  return state.habits.reduce((count, habit) => {
    return count + Number(habit.completedDates.includes(dateKey));
  }, 0);
}

function calculateStreak(habit) {
  const completed = new Set(habit.completedDates);
  let streak = 0;
  const pointer = new Date(`${state.selectedDate}T00:00:00`);

  while (completed.has(toISODate(pointer))) {
    streak += 1;
    pointer.setDate(pointer.getDate() - 1);
  }

  return streak;
}

function persistState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      habits: state.habits,
    }),
  );
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored?.habits)) {
      state.habits = stored.habits.map((habit) => ({
        id: String(habit.id),
        name: String(habit.name),
        completedDates: Array.isArray(habit.completedDates) ? habit.completedDates : [],
        createdAt: Number(habit.createdAt) || Date.now(),
      }));
    }
  } catch {
    state.habits = [];
  }
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
