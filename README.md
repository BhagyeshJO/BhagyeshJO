# Habit Tracker (Local-First)

A production-structured, dependency-free habit tracking web app.

## Features

- Add and remove daily habits
- Track completion on any selected date
- Automatic streak count per habit
- Calendar month view with daily progress badges
- Local persistence using `localStorage`
- Input validation and user-facing error feedback
- Minimal modern, responsive UI

## Project Structure

```text
.
├── index.html
├── assets
│   ├── css
│   │   └── main.css
│   └── js
│       ├── constants.js
│       ├── date-utils.js
│       ├── dom.js
│       ├── habit-service.js
│       ├── main.js
│       └── storage.js
└── README.md
```

## Run locally

You can open `index.html` directly, or serve it locally:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Design & Engineering Notes

- Modular JavaScript with separated concerns (state orchestration, storage, domain logic, date helpers, and DOM bindings).
- Defensive parsing for persisted data.
- Validation for required/min/max/duplicate habit names.
- User-facing error feedback for invalid input and storage failures.
- Accessibility improvements: form label, semantic regions, ARIA labels, and grid roles for calendar cells.
- No backend or external framework required.
