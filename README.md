# Skyrim Tracker

A lightweight single-page quest journal for The Elder Scrolls V: Skyrim.

The app runs entirely in the browser, stores quest data in localStorage, and provides a themed interface for tracking quest progress across main quests, factions, Daedric quests, side quests, and miscellaneous objectives.

## Features

- Browse quests by category from the sidebar
- Search quests by title, notes, or location
- Filter quests by status
- Sort quests by recent, title, status, or category
- Add, edit, complete, and delete quests
- Show quest prerequisites and branch tags for mutually exclusive paths
- Keep multiple named journals and switch between character playthroughs from the app header
- Duplicate or delete journals so old playthroughs can be forked or cleaned up
|-- quest-data.js
|-- tests.html
|-- LICENSE
`-- assets/
```

- `index.html`: App markup, journal controls, filters, backup actions, and modal form
- `styles.css`: Theme, layout, responsive rules, and interaction styling
- `app.js`: State management, journal selection, details rendering, filtering, sorting, CRUD actions, import/export, full backup handling, and reset behavior
- `quest-data.js`: Shared quest and journal normalization, migration, import/export, backup, filtering, sorting, summary, and journal-details rendering helpers
- `tests.html`: Lightweight browser test page for import parsing, normalization, filtering, sorting, malformed-store handling, legacy migration, backup handling, and journal helper behavior
- `LICENSE`: Repository license terms
- `assets/`: Static visual assets such as the parchment background


Examples:

```powershell
cd c:\Users\User\Documents\Projects\Skyrim-Tracker
start index.html
```

If you use VS Code, opening the file in a browser or using a simple live server extension is sufficient.

## How It Works

The app initializes with a broader set of default quests, including several decision-dependent quest branches, and stores them inside named journals in localStorage.

Data is normalized on load so malformed or incomplete entries do not break the app. Legacy single-journal saves are migrated into the newer named-journal format automatically. If saved quest data cannot be parsed, the app falls back to the default journal.

Each quest can optionally include `prerequisites`, `branchGroup`, and `branch` metadata. The UI uses those fields to surface quest chains and mutually exclusive routes directly on the quest cards.

Each journal also tracks `createdAt` and `updatedAt` metadata. The app surfaces that data in the journal details panel alongside active, completed, and not-started quest counts for every saved playthrough.
## Import, Export, and Reset

- `New Journal` creates another named playthrough using the built-in starter journal.
- `Rename Journal` updates the active playthrough name.
- `Duplicate Journal` forks the active playthrough into a new named journal with copied quests.
- `Delete Journal` removes the active playthrough as long as at least one journal remains.
- `Import Journal` accepts either a Skyrim Tracker export file or a plain JSON quest array and saves it as a named journal.
- `Export Journal` downloads the currently selected journal as a JSON file, including its journal name and journal timestamps.
- `Import Backup` replaces the full journal list from a Skyrim Tracker backup file containing all playthroughs.
- `Export Backup` downloads a single backup file containing every saved journal plus the active-journal selection.
- `Reset Journal` restores only the active journal back to the built-in default quests and clears active filters.

The exported files are intended as lightweight backups of your local journal state.
- Add lightweight tests for quest card rendering behavior and the journal details panel UI
- Track explicit quest-level timestamps if you want recent sorting to survive imports and edits more precisely

## Credits


## License

- Import a saved journal into a named playthrough slot
- Export the current journal as JSON
- Reset the journal back to a broader starter journal with main, faction, Daedric, side, and branching quests
- `Export Journal` downloads the currently selected journal as a JSON file, including its journal name and journal timestamps.
|-- styles.css
|-- app.js
|-- quest-data.js

Each journal also tracks `createdAt` and `updatedAt` metadata. The app surfaces that data in the journal details panel alongside active, completed, and not-started quest counts for every saved playthrough.

- `index.html`: App markup, filters, controls, and modal form
- `styles.css`: Theme, layout, responsive rules, and interaction styling
- `tests.html`: Lightweight browser test page for import parsing, normalization, filtering, sorting, and journal helper behavior
- `assets/`: Static visual assets such as the parchment background

## Running Locally

No build step or dependency installation is required.

1. Open `index.html` directly in a browser.
2. Or serve the folder with any simple static file server if you prefer.
3. Open `tests.html` in a browser whenever you want to run the lightweight helper tests.

Examples:

```powershell
cd c:\Users\User\Documents\Projects\Skyrim-Tracker
start index.html
```

If you use VS Code, opening the file in a browser or using a simple live server extension is sufficient.

## How It Works

The app initializes with a broader set of default quests, including several decision-dependent quest branches, and stores them inside named journals in localStorage.

Data is normalized on load so malformed or incomplete entries do not break the app. Legacy single-journal saves are migrated into the newer named-journal format automatically. If saved quest data cannot be parsed, the app falls back to the default journal.

Each quest can optionally include `prerequisites`, `branchGroup`, and `branch` metadata. The UI uses those fields to surface quest chains and mutually exclusive routes directly on the quest cards.

## Import, Export, and Reset

- `New Journal` creates another named playthrough using the built-in starter journal.
- `Rename Journal` updates the active playthrough name.
- `Duplicate Journal` forks the active playthrough into a new named journal with copied quests.
- `Delete Journal` removes the active playthrough as long as at least one journal remains.
- `Import Journal` accepts either a Skyrim Tracker export file or a plain JSON quest array and saves it as a named journal.
- `Export Journal` downloads the currently selected journal as a JSON file, including its journal name.
- `Reset Journal` restores only the active journal back to the built-in default quests and clears active filters.

The exported file is intended as a lightweight backup of your local journal state.

## Current Limitations

- Data is stored per browser, not synced across devices
- The included test page covers shared helper logic, not full UI interactions or DOM rendering
- `Recently Added` sorting uses current in-memory order rather than explicit timestamps

## Suggested Next Steps

- Track `createdAt` and `updatedAt` metadata for stronger sorting behavior
- Add lightweight tests for journal import/export edge cases and quest card rendering behavior

## Credits

This fan-made tracker is inspired by The Elder Scrolls V: Skyrim.

Skyrim, The Elder Scrolls, and related names, world elements, and assets belong to Bethesda Softworks.

## License

This repository includes a [LICENSE](LICENSE) file with the project license terms.