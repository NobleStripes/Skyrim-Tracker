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
        title: 'Bleak Falls Barrow',
        category: 'Main Quest',
        status: 'Active',
        location: 'Riverwood / Bleak Falls Barrow',
        notes: 'Farengar Secret-Fire wants me to retrieve the Dragonstone from Bleak Falls Barrow. Need to pack health potions.'
    },
    {
        id: '3',
        title: 'Take Up Arms',
        category: 'Faction',
        status: 'Not Started',
        location: 'Jorrvaskr, Whiterun',
        notes: 'Speak to Kodlak Whitemane about joining the Companions.'
    },
    {
        id: '4',
        title: 'A Daedra\'s Best Friend',
        category: 'Daedric',
        status: 'Active',
        location: 'Falkreath',
        notes: 'Found a talking dog named Barbas. He wants me to help him reunite with Clavicus Vile.'
    }
];

const STORAGE_KEY = 'skyrimQuests';
const CATEGORY_TITLES = {
    All: 'All Quests',
    'Main Quest': 'Main Quest',
    Faction: 'Factions',
    Daedric: 'Daedric',
    'Side Quest': 'Side Quests',
    Miscellaneous: 'Miscellaneous'
};
const VALID_CATEGORIES = Object.keys(CATEGORY_TITLES).filter(category => category !== 'All');
const VALID_STATUSES = ['Not Started', 'Active', 'Completed'];
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const SORT_OPTIONS = ['recent', 'title-asc', 'title-desc', 'status', 'category'];
const STATUS_SORT_ORDER = {
    Active: 0,
    'Not Started': 1,
    Completed: 2
};

// State
const state = {
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

const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const sortFilter = document.getElementById('sort-filter');
const categoryNavLinks = document.querySelectorAll('.nav-item');
const questSummaryEl = document.getElementById('quest-summary');

const btnAddQuest = document.getElementById('btn-add-quest');
const btnExportQuests = document.getElementById('btn-export-quests');
const btnResetQuests = document.getElementById('btn-reset-quests');
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
    loadQuests();
    syncControlsWithState();
    setupEventListeners();
    renderQuests();
}

// Data Management
function loadQuests() {
    const savedQuests = localStorage.getItem(STORAGE_KEY);

    if (!savedQuests) {
        state.quests = createDefaultQuests();
        saveQuests();
        return;
    }

    try {
        const parsedQuests = JSON.parse(savedQuests);
        if (!Array.isArray(parsedQuests)) {
            throw new Error('Saved quest data is not an array.');
        }

        state.quests = parsedQuests.map(normalizeQuest).filter(Boolean);
        saveQuests();
    } catch (error) {
        console.warn('Failed to load saved quests, restoring defaults.', error);
        state.quests = createDefaultQuests();
        saveQuests();
    }
}

function saveQuests() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.quests));
}

function createDefaultQuests() {
    return MOCK_QUESTS.map(normalizeQuest).filter(Boolean);
}

function normalizeQuest(rawQuest) {
    if (!rawQuest || typeof rawQuest !== 'object') {
        return null;
    }

    const title = typeof rawQuest.title === 'string' ? rawQuest.title.trim() : '';
    if (!title) {
        return null;
    }

    const category = VALID_CATEGORIES.includes(rawQuest.category) ? rawQuest.category : 'Miscellaneous';
    const status = VALID_STATUSES.includes(rawQuest.status) ? rawQuest.status : 'Not Started';
    const id = typeof rawQuest.id === 'string' && rawQuest.id.trim() ? rawQuest.id : createQuestId();

    return {
        id,
        title,
        category,
        status,
        location: typeof rawQuest.location === 'string' ? rawQuest.location.trim() : '',
        notes: typeof rawQuest.notes === 'string' ? rawQuest.notes.trim() : ''
    };
}

function createQuestId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Render
function renderQuests() {
    const filteredQuests = getVisibleQuests();

    // Update UI
    currentCategoryTitleEl.textContent = getCurrentCategoryTitle();
    questListEl.innerHTML = '';
    updateQuestSummary(filteredQuests.length);

    if (filteredQuests.length === 0) {
        emptyStateEl.classList.remove('hidden');
    } else {
        emptyStateEl.classList.add('hidden');
        filteredQuests.forEach(quest => {
            questListEl.appendChild(createQuestCard(quest));
        });
    }
}

function getCurrentCategoryTitle() {
    return CATEGORY_TITLES[state.filters.category] || 'Quests';
}

function getVisibleQuests() {
    return state.quests
        .filter(matchesActiveFilters)
        .sort(compareQuests);
}

function matchesActiveFilters(quest) {
    return matchesCategoryFilter(quest) && matchesSearchFilter(quest) && matchesStatusFilter(quest);
}

function matchesCategoryFilter(quest) {
    return state.filters.category === 'All' || quest.category === state.filters.category;
}

function matchesSearchFilter(quest) {
    const searchTerm = state.filters.search.trim().toLowerCase();
    if (!searchTerm) {
        return true;
    }

    return quest.title.toLowerCase().includes(searchTerm)
        || quest.notes.toLowerCase().includes(searchTerm)
        || quest.location.toLowerCase().includes(searchTerm);
}

function matchesStatusFilter(quest) {
    return state.filters.status === 'All' || quest.status === state.filters.status;
}

function compareQuests(left, right) {
    switch (state.filters.sort) {
        case 'title-asc':
            return left.title.localeCompare(right.title);
        case 'title-desc':
            return right.title.localeCompare(left.title);
        case 'status':
            return (STATUS_SORT_ORDER[left.status] ?? 99) - (STATUS_SORT_ORDER[right.status] ?? 99)
                || left.title.localeCompare(right.title);
        case 'category':
            return left.category.localeCompare(right.category) || left.title.localeCompare(right.title);
        case 'recent':
        default:
            return state.quests.indexOf(left) - state.quests.indexOf(right);
    }
}

function updateQuestSummary(visibleCount) {
    const totalCount = state.quests.length;
    const categoryLabel = state.filters.category === 'All' ? 'all categories' : CATEGORY_TITLES[state.filters.category];
    const statusLabel = state.filters.status === 'All' ? 'every status' : state.filters.status.toLowerCase();
    const searchLabel = state.filters.search.trim() ? ` matching "${state.filters.search.trim()}"` : '';
    questSummaryEl.textContent = `Showing ${visibleCount} of ${totalCount} quests in ${categoryLabel.toLowerCase()} with ${statusLabel}${searchLabel}.`;
}

function createQuestCard(quest) {
    const li = document.createElement('li');
    li.className = 'quest-card';

    const header = document.createElement('div');
    header.className = 'quest-header';

    const title = document.createElement('h3');
    title.className = 'quest-title';
    title.textContent = quest.title;

    const status = document.createElement('span');
    status.className = `quest-status status-${quest.status.toLowerCase().replace(/\s+/g, '-')}`;
    status.textContent = quest.status;

    header.append(title, status);

    const meta = document.createElement('div');
    meta.className = 'quest-meta';
    meta.append(
        buildMetaItem('Category:', quest.category),
        buildMetaItem('Location:', quest.location || 'Unknown')
    );

    const notes = document.createElement('div');
    notes.className = 'quest-notes';

    const notesText = document.createElement('p');
    notesText.textContent = quest.notes || 'No journal entries.';
    notes.appendChild(notesText);

    const actions = document.createElement('div');
    actions.className = 'quest-actions';
    actions.append(
        buildActionButton('Edit', 'edit-btn', quest.id),
        ...(quest.status !== 'Completed' ? [buildActionButton('Mark Completed', 'complete-btn', quest.id)] : []),
        buildActionButton('Delete', 'delete-btn', quest.id)
    );

    li.append(header, meta, notes, actions);
    return li;
}

function buildMetaItem(label, value) {
    const wrapper = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = `${label} `;
    wrapper.append(strong, value);
    return wrapper;
}

function buildActionButton(label, className, id) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `action-btn ${className}`;
    button.dataset.id = id;
    button.textContent = label;
    return button;
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

    // Modal Operations
    btnAddQuest.addEventListener('click', () => {
        openModal(null, btnAddQuest);
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('keydown', handleModalKeydown);
    btnExportQuests.addEventListener('click', exportQuests);
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
        id: state.editingQuestId || createQuestId(),
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

    saveQuests();
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
    saveQuests();
    renderQuests();
}

function updateQuestStatus(id, newStatus) {
    const quest = state.quests.find(q => q.id === id);
    if (quest) {
        quest.status = newStatus;
        saveQuests();
        renderQuests();
    }
}

function exportQuests() {
    const payload = {
        exportedAt: new Date().toISOString(),
        questCount: state.quests.length,
        quests: state.quests
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `skyrim-quest-journal-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function resetQuests() {
    const shouldReset = confirm('Reset your journal back to the default quests? This will replace your saved quest list.');
    if (!shouldReset) {
        return;
    }

    state.quests = createDefaultQuests();
    state.filters.search = '';
    state.filters.status = 'All';
    state.filters.sort = 'recent';
    state.filters.category = 'All';

    syncControlsWithState();
    categoryNavLinks.forEach(link => {
        const isActive = link.dataset.category === 'All';
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-pressed', String(isActive));
    });

    saveQuests();
    renderQuests();
}

function syncControlsWithState() {
    searchInput.value = state.filters.search;
    statusFilter.value = state.filters.status;
    sortFilter.value = state.filters.sort;
}

// Boot up
document.addEventListener('DOMContentLoaded', init);
