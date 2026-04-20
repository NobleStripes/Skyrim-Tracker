# Skyrim Tracker

A lightweight single-page quest journal for The Elder Scrolls V: Skyrim.

The app runs entirely in the browser, stores quest data in localStorage, and provides a themed interface for tracking quest progress across main quests, factions, Daedric quests, side quests, and miscellaneous objectives.

## Features

- Browse quests by category from the sidebar
- Search quests by title, notes, or location
- Filter quests by status
- Sort quests by recent, title, status, or category
- Add, edit, complete, and delete quests
- Export the current journal as JSON
- Reset the journal back to the default starter quests
- Persist data locally in the browser with no backend required
- Keyboard-accessible modal interactions and responsive layout improvements

## Project Structure

```text
Skyrim-Tracker/
|-- index.html
|-- styles.css
|-- app.js
`-- assets/
```

- `index.html`: App markup, filters, controls, and modal form
- `styles.css`: Theme, layout, responsive rules, and interaction styling
- `app.js`: State management, rendering, filtering, sorting, CRUD actions, export, and reset behavior
- `assets/`: Static visual assets such as the parchment background

## Running Locally

No build step or dependency installation is required.

1. Open `index.html` directly in a browser.
2. Or serve the folder with any simple static file server if you prefer.

Examples:

```powershell
cd c:\Users\User\Documents\Projects\Skyrim-Tracker
start index.html
```

If you use VS Code, opening the file in a browser or using a simple live server extension is sufficient.

## How It Works

The app initializes with a small set of default quests and then saves changes under the localStorage key `skyrimQuests`.

Data is normalized on load so malformed or incomplete entries do not break the app. If saved quest data cannot be parsed, the app falls back to the default quest list.

## Export and Reset

- `Export Journal` downloads the current quest list as a JSON file.
- `Reset Journal` restores the built-in default quests and clears active filters.

The exported file is intended as a lightweight backup of your local journal state.

## Current Limitations

- Data is stored per browser, not synced across devices
- There is no import flow yet for previously exported JSON files
- There is no automated test suite yet
- `Recently Added` sorting uses current in-memory order rather than explicit timestamps

## Suggested Next Steps

- Add JSON import support
- Track `createdAt` and `updatedAt` metadata for stronger sorting behavior
- Add lightweight tests for filtering and sorting helpers

## Credits

This fan-made tracker is inspired by The Elder Scrolls V: Skyrim.

Skyrim, The Elder Scrolls, and related names, world elements, and assets belong to Bethesda Softworks.

## License

No license file is currently included in this repository.