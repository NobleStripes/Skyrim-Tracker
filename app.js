// Initial mock data
const MOCK_QUESTS = [
    {
        id: '1',
        title: 'Unbound',
        category: 'Main Quest',
        status: 'Completed',
        location: 'Helgen',
        notes: 'Survived the dragon attack and escaped with Hadvar.'
    },
    {
        id: '2',
        title: 'Before the Storm',
        category: 'Main Quest',
        status: 'Completed',
        location: 'Riverwood / Whiterun',
        notes: 'Warned Jarl Balgruuf about the dragon threat after speaking with Alvor and Gerdur.',
        prerequisites: ['Unbound']
    },
    {
        id: '3',
        title: 'Bleak Falls Barrow',
        category: 'Main Quest',
        status: 'Active',
        location: 'Riverwood / Bleak Falls Barrow',
        notes: 'Farengar Secret-Fire wants me to retrieve the Dragonstone from Bleak Falls Barrow. Need to pack health potions.',
        prerequisites: ['Before the Storm']
    },
    {
        id: '4',
        title: 'Dragon Rising',
        category: 'Main Quest',
        status: 'Not Started',
        location: 'Western Watchtower, Whiterun',
        notes: 'Triggered after returning the Dragonstone. Defeat the dragon and confirm the rumors.',
        prerequisites: ['Bleak Falls Barrow']
    },
    {
        id: '5',
        title: 'The Way of the Voice',
        category: 'Main Quest',
        status: 'Not Started',
        location: 'High Hrothgar',
        notes: 'Travel to the Greybeards after learning I am Dragonborn.',
        prerequisites: ['Dragon Rising']
    },
    {
        id: '6',
        title: 'Diplomatic Immunity',
        category: 'Main Quest',
        status: 'Not Started',
        location: 'Solitude / Thalmor Embassy',
        notes: 'Meet Delphine in Solitude and prepare for the embassy infiltration.'
    },
    {
        id: '7',
        title: 'Season Unending',
        category: 'Main Quest',
        status: 'Not Started',
        location: 'High Hrothgar',
        notes: 'Only needed if the civil war remains unresolved. Negotiate a truce between Imperials and Stormcloaks.'
    },
    {
        id: '8',
        title: 'Take Up Arms',
        category: 'Faction',
        status: 'Not Started',
        location: 'Jorrvaskr, Whiterun',
        notes: 'Speak to Kodlak Whitemane about joining the Companions.'
    },
    {
        id: '9',
        title: 'Proving Honor',
        category: 'Faction',
        status: 'Not Started',
        location: 'Dustman\'s Cairn',
        notes: 'Retrieve a fragment of Wuuthrad with Farkas to advance in the Companions.'
    },
    {
        id: '10',
        title: 'Joining the Stormcloaks',
        category: 'Faction',
        status: 'Not Started',
        location: 'Palace of the Kings, Windhelm',
        notes: 'Stormcloak civil war route. This branch leads to Stormcloak-only siege quests.',
        branchGroup: 'Civil War',
        branch: 'Stormcloak'
    },
    {
        id: '11',
        title: 'Joining the Legion',
        category: 'Faction',
        status: 'Not Started',
        location: 'Castle Dour, Solitude',
        notes: 'Imperial civil war route. This branch leads to Legion-only siege quests.',
        branchGroup: 'Civil War',
        branch: 'Imperial'
    },
    {
        id: '12',
        title: 'The Jagged Crown',
        category: 'Faction',
        status: 'Not Started',
        location: 'Korvanjund',
        notes: 'Shared civil war objective. Who receives the crown determines the allegiance lock-in.',
        branchGroup: 'Civil War',
        branch: 'Shared',
        prerequisites: ['Joining the Stormcloaks or Joining the Legion']
    },
    {
        id: '13',
        title: 'Battle for Whiterun',
        category: 'Faction',
        status: 'Not Started',
        location: 'Whiterun',
        notes: 'Stormcloak branch after siding against the Empire. Mutually exclusive with Battle for Whiterun (Imperial).',
        branchGroup: 'Civil War',
        branch: 'Stormcloak',
        prerequisites: ['The Jagged Crown']
    },
    {
        id: '14',
        title: 'Battle for Whiterun (Imperial)',
        category: 'Faction',
        status: 'Not Started',
        location: 'Whiterun',
        notes: 'Imperial defense of Whiterun after choosing the Legion route. Do not complete alongside the Stormcloak version.',
        branchGroup: 'Civil War',
        branch: 'Imperial',
        prerequisites: ['The Jagged Crown']
    },
    {
        id: '15',
        title: 'Innocence Lost',
        category: 'Faction',
        status: 'Not Started',
        location: 'Windhelm / Riften',
        notes: 'Aventus Aretino wants Grelod the Kind dead. Finishing this opens Dark Brotherhood consequences.'
    },
    {
        id: '16',
        title: 'With Friends Like These...',
        category: 'Faction',
        status: 'Not Started',
        location: 'Abandoned Shack, Hjaalmarch',
        notes: 'Dark Brotherhood path. Accept Astrid\'s test to join the Brotherhood.',
        branchGroup: 'Dark Brotherhood',
        branch: 'Join',
        prerequisites: ['Innocence Lost']
    },
    {
        id: '17',
        title: 'Destroy the Dark Brotherhood!',
        category: 'Faction',
        status: 'Not Started',
        location: 'Abandoned Shack / Penitus Oculatus Outpost',
        notes: 'Alternate branch to the Brotherhood line. Kill Astrid instead of joining and report to Commander Maro.',
        branchGroup: 'Dark Brotherhood',
        branch: 'Destroy',
        prerequisites: ['Innocence Lost']
    },
    {
        id: '18',
        title: 'A Daedra\'s Best Friend',
        category: 'Daedric',
        status: 'Active',
        location: 'Falkreath',
        notes: 'Found a talking dog named Barbas. The ending decision determines whether to keep the Rueful Axe or spare Barbas for the masque.'
    },
    {
        id: '19',
        title: 'The Black Star',
        category: 'Daedric',
        status: 'Not Started',
        location: 'Winterhold / Shrine of Azura',
        notes: 'Decision quest: side with Aranea Ienith for Azura\'s Star or Nelacar for the reusable Black Star.',
        branchGroup: 'Azura Artifact Choice',
        branch: 'Choice Driven'
    },
    {
        id: '20',
        title: 'Ill Met by Moonlight',
        category: 'Daedric',
        status: 'Not Started',
        location: 'Falkreath / Bloated Man\'s Grotto',
        notes: 'Choice quest involving Sinding and Hircine. Different outcomes grant the Ring of Hircine or Savior\'s Hide.',
        branchGroup: 'Hircine Reward Choice',
        branch: 'Choice Driven'
    },
    {
        id: '21',
        title: 'Pieces of the Past',
        category: 'Daedric',
        status: 'Not Started',
        location: 'Dawnstar / Shrine of Mehrunes Dagon',
        notes: 'Decision near the finale: spare Silus to honor the deal or kill him to fully appease Mehrunes Dagon.',
        branchGroup: 'Mehrunes Dagon Choice',
        branch: 'Choice Driven'
    },
    {
        id: '22',
        title: 'In My Time of Need',
        category: 'Side Quest',
        status: 'Not Started',
        location: 'Whiterun',
        notes: 'Saadia and Kematu tell different stories. Pick a side carefully because only one outcome can be completed.',
        branchGroup: 'Saadia or Kematu',
        branch: 'Choice Driven'
    },
    {
        id: '23',
        title: 'No One Escapes Cidhna Mine',
        category: 'Side Quest',
        status: 'Not Started',
        location: 'Markarth / Cidhna Mine',
        notes: 'Branching escape from Cidhna Mine. The outcome depends on whether Madanach survives and whether Thonar is confronted.',
        branchGroup: 'Cidhna Mine Outcome',
        branch: 'Choice Driven',
        prerequisites: ['The Forsworn Conspiracy']
    },
    {
        id: '24',
        title: 'The Forsworn Conspiracy',
        category: 'Side Quest',
        status: 'Not Started',
        location: 'Markarth',
        notes: 'Investigate the murders in Markarth. This directly feeds into No One Escapes Cidhna Mine.'
    },
    {
        id: '25',
        title: 'Missing in Action',
        category: 'Side Quest',
        status: 'Not Started',
        location: 'Whiterun / Northwatch Keep',
        notes: 'Choose whether to work openly with Fralia Gray-Mane or use persuasion and stealth to rescue Thorald.'
    },
    {
        id: '26',
        title: 'Blood on the Ice',
        category: 'Side Quest',
        status: 'Not Started',
        location: 'Windhelm',
        notes: 'Investigate the serial murders. Several dialogue choices can falsely accuse the wrong suspect before the real culprit is found.'
    },
    {
        id: '27',
        title: 'A Night to Remember',
        category: 'Side Quest',
        status: 'Not Started',
        location: 'Across Skyrim',
        notes: 'Track the aftermath of Sam Guevenne\'s drinking contest across multiple holds.'
    },
    {
        id: '28',
        title: 'Lights Out!',
        category: 'Side Quest',
        status: 'Not Started',
        location: 'Solitude / Broken Oar Grotto',
        notes: 'Jaree-Ra offers a smuggling job that can end with betrayal. Watch for the ambush after the shipwreck.',
        branchGroup: 'Smuggler Betrayal',
        branch: 'Choice Driven'
    },
    {
        id: '29',
        title: 'Discerning the Transmundane',
        category: 'Miscellaneous',
        status: 'Not Started',
        location: 'Septimus Signus\'s Outpost',
        notes: 'Meet Septimus and begin the Elder Scroll-related objective that later intersects with the main story.'
    },
    {
        id: '30',
        title: 'Visit the College of Winterhold',
        category: 'Miscellaneous',
        status: 'Not Started',
        location: 'Winterhold',
        notes: 'A useful entry point into the College questline and mage-related side content.'
    }
];

const {
    CATEGORY_TITLES,
    VALID_CATEGORIES,
    VALID_STATUSES,
    SORT_OPTIONS,
    STATUS_SORT_ORDER,
    createId,
    normalizeQuest,
    parseQuestCollection,
    normalizeJournal,
    parseJournalStore: parseJournalCollection,
    migrateLegacyQuestStore,
    inferImportedJournalName: inferJournalNameFromPayload,
    createImportedJournal,
    buildJournalExport,
    buildJournalStoreExport,
    BACKUP_FORMAT,
    BACKUP_VERSION,
    parseJournalBackup,
    getVisibleQuests: getVisibleQuestList,
    duplicateJournal,
    selectJournal,
    deleteJournal,
    touchJournal,
    summarizeJournal,
    renderJournalDetailsList,
    renderQuestCard,
    createDefaultJournal
} = window.SkyrimQuestData;

const LEGACY_STORAGE_KEY = 'skyrimQuests';
const JOURNAL_STORAGE_KEY = 'skyrimQuestJournals';
const ACTIVE_JOURNAL_STORAGE_KEY = 'skyrimActiveJournal';
const DEFAULT_JOURNAL_NAME = 'Dragonborn';
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// State
const state = {
    journals: [],
    activeJournalId: '',
    quests: [],
    filters: {
        category: 'All',
        search: '',
        status: 'All',
        sort: 'recent'
    },
    editingQuestId: null,
    lastFocusedElement: null
};

// DOM Elements
const questListEl = document.getElementById('quest-list');
const emptyStateEl = document.getElementById('empty-state');
const currentCategoryTitleEl = document.getElementById('current-category-title');
const journalDetailsListEl = document.getElementById('journal-details-list');

const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const sortFilter = document.getElementById('sort-filter');
const journalSelect = document.getElementById('journal-select');
const btnNewJournal = document.getElementById('btn-new-journal');
const btnRenameJournal = document.getElementById('btn-rename-journal');
const btnDuplicateJournal = document.getElementById('btn-duplicate-journal');
const btnDeleteJournal = document.getElementById('btn-delete-journal');
const categoryNavLinks = document.querySelectorAll('.nav-item');
const questSummaryEl = document.getElementById('quest-summary');

const btnAddQuest = document.getElementById('btn-add-quest');
const btnImportQuests = document.getElementById('btn-import-quests');
const btnImportBackup = document.getElementById('btn-import-backup');
const btnExportQuests = document.getElementById('btn-export-quests');
const btnExportBackup = document.getElementById('btn-export-backup');
const btnResetQuests = document.getElementById('btn-reset-quests');
const importQuestsInput = document.getElementById('import-quests-input');
const importBackupInput = document.getElementById('import-backup-input');
const modal = document.getElementById('quest-modal');
const closeModalBtn = document.getElementById('close-modal');
const questForm = document.getElementById('quest-form');
const modalTitle = document.getElementById('modal-title');
const modalContent = modal.querySelector('.modal-content');
const questTitleInput = document.getElementById('quest-title');
const questCategoryInput = document.getElementById('quest-category');
const questStatusInput = document.getElementById('quest-status');
const questLocationInput = document.getElementById('quest-location');
const questNotesInput = document.getElementById('quest-notes');
const questTitleErrorEl = document.getElementById('quest-title-error');

// Initialize
function init() {
    loadJournalState();
    syncControlsWithState();
    renderJournalOptions();
    setupEventListeners();
    renderQuests();
}

// Data Management
function loadJournalState() {
    const savedJournalStore = localStorage.getItem(JOURNAL_STORAGE_KEY);
    const savedActiveJournalId = localStorage.getItem(ACTIVE_JOURNAL_STORAGE_KEY);

    if (!savedJournalStore) {
        migrateLegacyJournalState();
        return;
    }

    try {
        const parsedJournalStore = JSON.parse(savedJournalStore);
        const parsedJournals = parseJournalCollection(parsedJournalStore);
        state.journals = parsedJournals;
        state.activeJournalId = parsedJournals.some(journal => journal.id === savedActiveJournalId)
            ? savedActiveJournalId
            : parsedJournals[0].id;
        syncActiveJournalQuests();
        saveJournalState();
    } catch (error) {
        console.warn('Failed to load saved journals, restoring defaults.', error);
        restoreDefaultJournalState();
    }
}

function saveJournalState() {
    syncActiveJournalQuests();
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(state.journals));
    localStorage.setItem(ACTIVE_JOURNAL_STORAGE_KEY, state.activeJournalId);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
}

function createDefaultQuests() {
    return MOCK_QUESTS.map(normalizeQuest).filter(Boolean);
}

function createStarterJournal(name = DEFAULT_JOURNAL_NAME) {
    return createDefaultJournal(createDefaultQuests(), name);
}

function migrateLegacyJournalState() {
    const legacyQuests = localStorage.getItem(LEGACY_STORAGE_KEY);

    if (!legacyQuests) {
        restoreDefaultJournalState();
        return;
    }

    try {
        const migratedJournal = migrateLegacyQuestStore(JSON.parse(legacyQuests), DEFAULT_JOURNAL_NAME);

        state.journals = [migratedJournal];
        state.activeJournalId = migratedJournal.id;
        state.quests = migratedJournal.quests;
        saveJournalState();
    } catch (error) {
        console.warn('Failed to migrate legacy quest data, restoring defaults.', error);
        restoreDefaultJournalState();
    }
}

function restoreDefaultJournalState() {
    const starterJournal = createStarterJournal();
    state.journals = [starterJournal];
    state.activeJournalId = starterJournal.id;
    state.quests = starterJournal.quests;
    saveJournalState();
}

function getActiveJournal() {
    return selectJournal(state.journals, state.activeJournalId);
}

function syncActiveJournalQuests() {
    const activeJournal = getActiveJournal();
    if (!activeJournal) {
        return;
    }

    activeJournal.quests = state.quests;
}

function markActiveJournalUpdated() {
    const activeJournal = getActiveJournal();
    if (!activeJournal) {
        return;
    }

    Object.assign(activeJournal, touchJournal(activeJournal));
}

function setActiveJournal(journalId) {
    const nextJournal = selectJournal(state.journals, journalId);
    if (!nextJournal) {
        return;
    }

    syncActiveJournalQuests();
    state.activeJournalId = nextJournal.id;
    state.quests = nextJournal.quests;
}

function renderJournalOptions() {
    journalSelect.innerHTML = '';

    state.journals.forEach(journal => {
        const option = document.createElement('option');
        option.value = journal.id;
        option.textContent = journal.name;
        journalSelect.appendChild(option);
    });

    journalSelect.value = state.activeJournalId;
    updateJournalControls();
}

function updateJournalControls() {
    const hasActiveJournal = Boolean(getActiveJournal());
    journalSelect.disabled = state.journals.length === 0;
    btnRenameJournal.disabled = !hasActiveJournal;
    btnDuplicateJournal.disabled = !hasActiveJournal;
    btnDeleteJournal.disabled = state.journals.length <= 1;
    btnImportBackup.disabled = false;
    btnExportQuests.disabled = !hasActiveJournal;
    btnExportBackup.disabled = state.journals.length === 0;
    btnResetQuests.disabled = !hasActiveJournal;
}

function resetFilters() {
    state.filters.search = '';
    state.filters.status = 'All';
    state.filters.sort = 'recent';
    state.filters.category = 'All';
}

function syncCategoryNavigation() {
    categoryNavLinks.forEach(link => {
        const isActive = link.dataset.category === state.filters.category;
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-pressed', String(isActive));
    });
}

function sanitizeJournalName(name) {
    return typeof name === 'string' ? name.trim() : '';
}

function findJournalByName(name) {
    const normalizedName = sanitizeJournalName(name).toLowerCase();
    return state.journals.find(journal => journal.name.toLowerCase() === normalizedName) || null;
}

function makeUniqueJournalName(baseName) {
    const startingName = sanitizeJournalName(baseName) || 'New Journal';
    if (!findJournalByName(startingName)) {
        return startingName;
    }

    let suffix = 2;
    let candidate = `${startingName} (${suffix})`;
    while (findJournalByName(candidate)) {
        suffix += 1;
        candidate = `${startingName} (${suffix})`;
    }

    return candidate;
}

// Render
function renderQuests() {
    const filteredQuests = getVisibleQuests();

    // Update UI
    currentCategoryTitleEl.textContent = getCurrentCategoryTitle();
    questListEl.innerHTML = '';
    renderJournalDetails();
    updateQuestSummary(filteredQuests.length);

    if (filteredQuests.length === 0) {
        emptyStateEl.classList.remove('hidden');
    } else {
        emptyStateEl.classList.add('hidden');
        filteredQuests.forEach(quest => {
            questListEl.appendChild(renderQuestCard(document, quest));
        });
    }
}

function getCurrentCategoryTitle() {
    return CATEGORY_TITLES[state.filters.category] || 'Quests';
}

function getVisibleQuests() {
    return getVisibleQuestList(state.quests, state.filters);
}

function renderJournalDetails() {
    renderJournalDetailsList(journalDetailsListEl, state.journals, state.activeJournalId, {
        formatTimestamp: formatJournalTimestamp
    });
}

function formatJournalTimestamp(timestamp) {
    const parsed = Date.parse(timestamp);
    if (Number.isNaN(parsed)) {
        return 'Unknown';
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(parsed);
}

function updateQuestSummary(visibleCount) {
    const activeJournal = getActiveJournal();
    const totalCount = state.quests.length;
    const categoryLabel = state.filters.category === 'All' ? 'all categories' : CATEGORY_TITLES[state.filters.category];
    const statusLabel = state.filters.status === 'All' ? 'every status' : state.filters.status.toLowerCase();
    const searchLabel = state.filters.search.trim() ? ` matching "${state.filters.search.trim()}"` : '';
    const journalLabel = activeJournal ? ` in ${activeJournal.name}` : '';
    questSummaryEl.textContent = `Showing ${visibleCount} of ${totalCount} quests${journalLabel} across ${categoryLabel.toLowerCase()} with ${statusLabel}${searchLabel}.`;
}

// Event Listeners
function setupEventListeners() {
    // Category Navigation
    categoryNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const nextCategory = e.currentTarget.dataset.category;

            categoryNavLinks.forEach(navLink => {
                navLink.classList.toggle('active', navLink === e.currentTarget);
                navLink.setAttribute('aria-pressed', String(navLink === e.currentTarget));
            });

            state.filters.category = nextCategory;
            renderQuests();
        });
    });

    // Search & Filter
    searchInput.addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        renderQuests();
    });

    statusFilter.addEventListener('change', (e) => {
        state.filters.status = e.target.value;
        renderQuests();
    });

    sortFilter.addEventListener('change', (e) => {
        state.filters.sort = SORT_OPTIONS.includes(e.target.value) ? e.target.value : 'recent';
        renderQuests();
    });

    journalSelect.addEventListener('change', (e) => {
        setActiveJournal(e.target.value);
        resetFilters();
        syncControlsWithState();
        syncCategoryNavigation();
        renderJournalOptions();
        saveJournalState();
        renderQuests();
    });

    // Modal Operations
    btnAddQuest.addEventListener('click', () => {
        openModal(null, btnAddQuest);
    });

    btnNewJournal.addEventListener('click', createJournalFromPrompt);
    btnRenameJournal.addEventListener('click', renameActiveJournalFromPrompt);
    btnDuplicateJournal.addEventListener('click', duplicateActiveJournalFromPrompt);
    btnDeleteJournal.addEventListener('click', deleteActiveJournal);

    btnImportQuests.addEventListener('click', () => {
        importQuestsInput.click();
    });

    btnImportBackup.addEventListener('click', () => {
        importBackupInput.click();
    });

    importQuestsInput.addEventListener('change', importQuestsFromFile);
    importBackupInput.addEventListener('change', importBackupFromFile);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('keydown', handleModalKeydown);
    btnExportQuests.addEventListener('click', exportQuests);
    btnExportBackup.addEventListener('click', exportBackup);
    btnResetQuests.addEventListener('click', resetQuests);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form Submit
    questForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveQuestFromForm();
    });

    // Dynamic buttons in quest list (Event Delegation)
    questListEl.addEventListener('click', (e) => {
        const actionButton = e.target.closest('button');
        if (!actionButton) {
            return;
        }

        if (actionButton.classList.contains('edit-btn')) {
            const id = actionButton.dataset.id;
            openModal(id, actionButton);
        } else if (actionButton.classList.contains('delete-btn')) {
            const id = actionButton.dataset.id;
            if (confirm('Are you sure you want to abandon this quest?')) {
                deleteQuest(id);
            }
        } else if (actionButton.classList.contains('complete-btn')) {
            const id = actionButton.dataset.id;
            updateQuestStatus(id, 'Completed');
        }
    });
}

// CRUD Operations
function openModal(id = null, triggerElement = document.activeElement) {
    state.editingQuestId = id;
    state.lastFocusedElement = triggerElement instanceof HTMLElement ? triggerElement : document.activeElement;
    clearFormErrors();

    if (id) {
        modalTitle.textContent = 'Edit Quest';
        const quest = state.quests.find(q => q.id === id);
        if (!quest) {
            return;
        }

        questTitleInput.value = quest.title;
        questCategoryInput.value = quest.category;
        questStatusInput.value = quest.status;
        questLocationInput.value = quest.location || '';
        questNotesInput.value = quest.notes || '';
    } else {
        modalTitle.textContent = 'Add New Quest';
        questForm.reset();
        questStatusInput.value = 'Not Started';
    }

    modal.classList.remove('hidden');
    modalContent.focus();
    questTitleInput.focus();
}

function closeModal() {
    modal.classList.add('hidden');
    state.editingQuestId = null;
    questForm.reset();
    clearFormErrors();

    if (state.lastFocusedElement instanceof HTMLElement) {
        state.lastFocusedElement.focus();
    }
}

function saveQuestFromForm() {
    const formValues = {
        id: state.editingQuestId || createId('quest'),
        title: questTitleInput.value.trim(),
        category: questCategoryInput.value,
        status: questStatusInput.value,
        location: questLocationInput.value.trim(),
        notes: questNotesInput.value.trim(),
    };

    const validationError = validateQuest(formValues);
    if (validationError) {
        setFieldError('title', validationError);
        questTitleInput.focus();
        return;
    }

    clearFormErrors();
    const newQuest = normalizeQuest(formValues);
    if (!newQuest) {
        setFieldError('title', 'Quest name is required.');
        questTitleInput.focus();
        return;
    }

    if (state.editingQuestId) {
        const index = state.quests.findIndex(q => q.id === state.editingQuestId);
        if (index === -1) {
            closeModal();
            return;
        }

        state.quests[index] = newQuest;
    } else {
        state.quests.unshift(newQuest);
    }

    markActiveJournalUpdated();
    saveJournalState();
    renderQuests();
    closeModal();
}

function validateQuest(quest) {
    if (!quest.title) {
        return 'Quest name is required.';
    }

    if (!VALID_CATEGORIES.includes(quest.category)) {
        return 'Choose a valid quest category.';
    }

    if (!VALID_STATUSES.includes(quest.status)) {
        return 'Choose a valid quest status.';
    }

    return '';
}

function clearFormErrors() {
    questTitleErrorEl.textContent = '';
    questTitleErrorEl.classList.add('hidden');
    questTitleInput.removeAttribute('aria-invalid');
}

function setFieldError(field, message) {
    if (field !== 'title') {
        return;
    }

    questTitleErrorEl.textContent = message;
    questTitleErrorEl.classList.remove('hidden');
    questTitleInput.setAttribute('aria-invalid', 'true');
}

function handleModalKeydown(event) {
    if (modal.classList.contains('hidden')) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
    }

    if (event.key !== 'Tab') {
        return;
    }

    const focusableElements = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter(element => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden'));

    if (focusableElements.length === 0) {
        event.preventDefault();
        return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
    }
}

function deleteQuest(id) {
    state.quests = state.quests.filter(q => q.id !== id);
    markActiveJournalUpdated();
    saveJournalState();
    renderQuests();
}

function updateQuestStatus(id, newStatus) {
    const quest = state.quests.find(q => q.id === id);
    if (quest) {
        quest.status = newStatus;
        markActiveJournalUpdated();
        saveJournalState();
        renderQuests();
    }
}

function exportQuests() {
    const activeJournal = getActiveJournal();
    const payload = buildJournalExport(activeJournal || createStarterJournal(DEFAULT_JOURNAL_NAME));

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    const nameSegment = sanitizeFileSegment(activeJournal ? activeJournal.name : 'journal');

    link.href = url;
    link.download = `skyrim-quest-journal-${nameSegment}-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function exportBackup() {
    const payload = buildJournalStoreExport(state.journals, state.activeJournalId);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `skyrim-quest-backup-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

async function importQuestsFromFile(event) {
    const file = event.target.files?.[0];
    if (!file) {
        return;
    }

    try {
        const payload = JSON.parse(await file.text());
        const importedJournal = createImportedJournal(payload, 'Imported Journal');
        const importedQuests = importedJournal.quests;

        if (importedQuests.length === 0) {
            throw new Error('No valid quests were found in the selected file.');
        }

        const suggestedName = makeUniqueJournalName(inferJournalNameFromPayload(payload, file.name.replace(/\.json$/i, '').replace(/[-_]+/g, ' ')));
        const requestedName = prompt('Name this imported journal:', suggestedName);
        if (requestedName === null) {
            return;
        }

        const journalName = sanitizeJournalName(requestedName);
        if (!journalName) {
            alert('Journal name is required to import a playthrough.');
            return;
        }

        const existingJournal = findJournalByName(journalName);
        if (existingJournal) {
            const shouldReplace = confirm(`A journal named "${journalName}" already exists. Replace its quests with this import?`);
            if (!shouldReplace) {
                return;
            }

            Object.assign(existingJournal, normalizeJournal({
                ...importedJournal,
                id: existingJournal.id,
                name: journalName,
                quests: importedQuests,
                updatedAt: new Date().toISOString()
            }, journalName));
            state.activeJournalId = existingJournal.id;
            state.quests = existingJournal.quests;
        } else {
            const importedJournalEntry = normalizeJournal({
                ...importedJournal,
                name: journalName,
                updatedAt: new Date().toISOString()
            }, journalName);

            state.journals.unshift(importedJournalEntry);
            state.activeJournalId = importedJournalEntry.id;
            state.quests = importedJournalEntry.quests;
        }

        resetFilters();
        syncControlsWithState();
        syncCategoryNavigation();
        renderJournalOptions();
        saveJournalState();
        renderQuests();
    } catch (error) {
        console.error('Failed to import journal.', error);
        alert('Unable to import that journal. Use a Skyrim Tracker export JSON file or a plain quest array.');
    } finally {
        importQuestsInput.value = '';
    }
}

async function importBackupFromFile(event) {
    const file = event.target.files?.[0];
    if (!file) {
        return;
    }

    try {
        const payload = JSON.parse(await file.text());
        const backup = parseJournalBackup(payload);
        const shouldImport = confirm(`Import ${backup.journals.length} journals from ${file.name}? This will replace all current playthroughs. Backup format ${BACKUP_FORMAT} v${backup.version}.`);
        if (!shouldImport) {
            return;
        }

        state.journals = backup.journals;
        state.activeJournalId = backup.activeJournalId;
        state.quests = selectJournal(backup.journals, backup.activeJournalId)?.quests || [];

        resetFilters();
        syncControlsWithState();
        syncCategoryNavigation();
        renderJournalOptions();
        saveJournalState();
        renderQuests();
    } catch (error) {
        console.error('Failed to import backup.', error);
        alert('Unable to import that backup. Use a Skyrim Tracker backup JSON file with a journals array.');
    } finally {
        importBackupInput.value = '';
    }
}

function resetQuests() {
    const activeJournal = getActiveJournal();
    if (!activeJournal) {
        return;
    }

    const shouldReset = confirm(`Reset "${activeJournal.name}" back to the default quests? This will replace only that journal.`);
    if (!shouldReset) {
        return;
    }

    state.quests = createDefaultQuests();
    resetFilters();

    syncControlsWithState();
    syncCategoryNavigation();

    markActiveJournalUpdated();
    saveJournalState();
    renderQuests();
}

function syncControlsWithState() {
    searchInput.value = state.filters.search;
    statusFilter.value = state.filters.status;
    sortFilter.value = state.filters.sort;
}

function createJournalFromPrompt() {
    const suggestedName = makeUniqueJournalName('New Journal');
    const requestedName = prompt('Name the new journal:', suggestedName);
    if (requestedName === null) {
        return;
    }

    const journalName = sanitizeJournalName(requestedName);
    if (!journalName) {
        alert('Journal name is required.');
        return;
    }

    if (findJournalByName(journalName)) {
        alert('Choose a different name. Another journal already uses that name.');
        return;
    }

    const newJournal = createStarterJournal(journalName);
    state.journals.unshift(newJournal);
    state.activeJournalId = newJournal.id;
    state.quests = newJournal.quests;
    resetFilters();
    syncControlsWithState();
    syncCategoryNavigation();
    renderJournalOptions();
    saveJournalState();
    renderQuests();
}

function renameActiveJournalFromPrompt() {
    const activeJournal = getActiveJournal();
    if (!activeJournal) {
        return;
    }

    const requestedName = prompt('Rename this journal:', activeJournal.name);
    if (requestedName === null) {
        return;
    }

    const journalName = sanitizeJournalName(requestedName);
    if (!journalName) {
        alert('Journal name is required.');
        return;
    }

    const matchingJournal = findJournalByName(journalName);
    if (matchingJournal && matchingJournal.id !== activeJournal.id) {
        alert('Choose a different name. Another journal already uses that name.');
        return;
    }

    activeJournal.name = journalName;
    markActiveJournalUpdated();
    renderJournalOptions();
    saveJournalState();
    renderQuests();
}

function duplicateActiveJournalFromPrompt() {
    const activeJournal = getActiveJournal();
    if (!activeJournal) {
        return;
    }

    const suggestedName = makeUniqueJournalName(`${activeJournal.name} Copy`);
    const requestedName = prompt('Name the duplicated journal:', suggestedName);
    if (requestedName === null) {
        return;
    }

    const journalName = sanitizeJournalName(requestedName);
    if (!journalName) {
        alert('Journal name is required.');
        return;
    }

    if (findJournalByName(journalName)) {
        alert('Choose a different name. Another journal already uses that name.');
        return;
    }

    const duplicatedJournal = duplicateJournal(activeJournal, journalName);
    state.journals.unshift(duplicatedJournal);
    state.activeJournalId = duplicatedJournal.id;
    state.quests = duplicatedJournal.quests;
    resetFilters();
    syncControlsWithState();
    syncCategoryNavigation();
    renderJournalOptions();
    saveJournalState();
    renderQuests();
}

function deleteActiveJournal() {
    const activeJournal = getActiveJournal();
    if (!activeJournal) {
        return;
    }

    if (state.journals.length <= 1) {
        alert('At least one journal must remain.');
        return;
    }

    const shouldDelete = confirm(`Delete "${activeJournal.name}"? This removes only that journal.`);
    if (!shouldDelete) {
        return;
    }

    const remainingJournals = deleteJournal(state.journals, activeJournal.id);
    state.journals = remainingJournals;
    const nextJournal = selectJournal(remainingJournals, remainingJournals[0]?.id);
    state.activeJournalId = nextJournal ? nextJournal.id : '';
    state.quests = nextJournal ? nextJournal.quests : [];
    resetFilters();
    syncControlsWithState();
    syncCategoryNavigation();
    renderJournalOptions();
    saveJournalState();
    renderQuests();
}

function inferImportedJournalName(payload, fileName) {
    return inferJournalNameFromPayload(payload, fileName.replace(/\.json$/i, '').replace(/[-_]+/g, ' '));
}

function sanitizeFileSegment(value) {
    return sanitizeJournalName(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'journal';
}

// Boot up
document.addEventListener('DOMContentLoaded', init);
