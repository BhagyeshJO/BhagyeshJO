# Habit Tracker (Windows Desktop App)

A local-first habit tracker you can run as an installable Windows desktop app.

## What you get

- Add and remove daily habits
- Mark completion by selected day
- Automatic streak count per habit
- Calendar month view with completion progress
- Local persistence (`localStorage` inside the desktop app)
- Validation and error feedback

## Project Structure

```text
.
├── assets
│   ├── css/main.css
│   └── js/
│       ├── constants.js
│       ├── date-utils.js
│       ├── dom.js
│       ├── habit-service.js
│       ├── main.js
│       └── storage.js
├── electron
│   └── main.cjs
├── index.html
├── package.json
└── README.md
```

## Run as desktop app (dev)

```bash
npm install
npm start
```

## Build Windows installer (.exe)

From your Windows machine:

```bash
npm install
npm run dist
```

The generated installer will be created in the `dist/` folder (NSIS target).

## Notes

- This app is fully local-first and does not require a backend.
- Habit data is saved per installed app profile on your machine.
