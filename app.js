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

// State
let quests = [];
let currentCategory = 'All';
let currentSearch = '';
let currentStatusFilter = 'All';
let editingQuestId = null;
let lastFocusedElement = null;

// DOM Elements
const questListEl = document.getElementById('quest-list');
const emptyStateEl = document.getElementById('empty-state');
const currentCategoryTitleEl = document.getElementById('current-category-title');

const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const categoryNavLinks = document.querySelectorAll('.nav-item');

const btnAddQuest = document.getElementById('btn-add-quest');
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
    setupEventListeners();
    renderQuests();
}

// Data Management
function loadQuests() {
    const savedQuests = localStorage.getItem(STORAGE_KEY);

    if (!savedQuests) {
        quests = MOCK_QUESTS.map(normalizeQuest).filter(Boolean);
        saveQuests();
        return;
    }

    try {
        const parsedQuests = JSON.parse(savedQuests);
        if (!Array.isArray(parsedQuests)) {
            throw new Error('Saved quest data is not an array.');
        }

        quests = parsedQuests.map(normalizeQuest).filter(Boolean);
        saveQuests();
    } catch (error) {
        console.warn('Failed to load saved quests, restoring defaults.', error);
        quests = MOCK_QUESTS.map(normalizeQuest).filter(Boolean);
        saveQuests();
    }
}

function saveQuests() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quests));
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
    const id = typeof rawQuest.id === 'string' && rawQuest.id.trim() ? rawQuest.id : Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    return {
        id,
        title,
        category,
        status,
        location: typeof rawQuest.location === 'string' ? rawQuest.location.trim() : '',
        notes: typeof rawQuest.notes === 'string' ? rawQuest.notes.trim() : ''
    };
}

// Render
function renderQuests() {
    // Filter logic
    let filteredQuests = quests.filter(q => {
        const matchesCategory = currentCategory === 'All' || q.category === currentCategory;
        const matchesSearch = q.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                              (q.notes && q.notes.toLowerCase().includes(currentSearch.toLowerCase()));
        const matchesStatus = currentStatusFilter === 'All' || q.status === currentStatusFilter;
        return matchesCategory && matchesSearch && matchesStatus;
    });

    // Update UI
    currentCategoryTitleEl.textContent = CATEGORY_TITLES[currentCategory] || 'Quests';
    questListEl.innerHTML = '';

    if (filteredQuests.length === 0) {
        emptyStateEl.classList.remove('hidden');
    } else {
        emptyStateEl.classList.add('hidden');
        filteredQuests.forEach(quest => {
            questListEl.appendChild(createQuestCard(quest));
        });
    }
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

            currentCategory = nextCategory;
            renderQuests();
        });
    });

    // Search & Filter
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderQuests();
    });

    statusFilter.addEventListener('change', (e) => {
        currentStatusFilter = e.target.value;
        renderQuests();
    });

    // Modal Operations
    btnAddQuest.addEventListener('click', () => {
        openModal(null, btnAddQuest);
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('keydown', handleModalKeydown);

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
    editingQuestId = id;
    lastFocusedElement = triggerElement instanceof HTMLElement ? triggerElement : document.activeElement;
    clearFormErrors();

    if (id) {
        modalTitle.textContent = 'Edit Quest';
        const quest = quests.find(q => q.id === id);
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
    editingQuestId = null;
    questForm.reset();
    clearFormErrors();

    if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
    }
}

function saveQuestFromForm() {
    const formValues = {
        id: editingQuestId || Date.now().toString(),
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

    if (editingQuestId) {
        const index = quests.findIndex(q => q.id === editingQuestId);
        if (index === -1) {
            closeModal();
            return;
        }

        quests[index] = newQuest;
    } else {
        quests.unshift(newQuest); // Add to beginning
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
    quests = quests.filter(q => q.id !== id);
    saveQuests();
    renderQuests();
}

function updateQuestStatus(id, newStatus) {
    const quest = quests.find(q => q.id === id);
    if (quest) {
        quest.status = newStatus;
        saveQuests();
        renderQuests();
    }
}

// Boot up
document.addEventListener('DOMContentLoaded', init);
