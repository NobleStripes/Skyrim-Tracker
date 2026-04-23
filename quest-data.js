(function attachSkyrimQuestData(global) {
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
    const SORT_OPTIONS = ['recent', 'title-asc', 'title-desc', 'status', 'category'];
    const STATUS_SORT_ORDER = {
        Active: 0,
        'Not Started': 1,
        Completed: 2
    };

    function createTimestamp() {
        return new Date().toISOString();
    }

    function normalizeTimestamp(value, fallbackValue = createTimestamp()) {
        if (typeof value !== 'string') {
            return fallbackValue;
        }

        const trimmedValue = value.trim();
        if (!trimmedValue || Number.isNaN(Date.parse(trimmedValue))) {
            return fallbackValue;
        }

        return trimmedValue;
    }

    function createId(prefix = '') {
        const rawId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        return prefix ? `${prefix}-${rawId}` : rawId;
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
        const id = typeof rawQuest.id === 'string' && rawQuest.id.trim() ? rawQuest.id.trim() : createId('quest');
        const prerequisites = Array.isArray(rawQuest.prerequisites)
            ? rawQuest.prerequisites
                .filter(item => typeof item === 'string')
                .map(item => item.trim())
                .filter(Boolean)
            : [];
        const branchGroup = typeof rawQuest.branchGroup === 'string' ? rawQuest.branchGroup.trim() : '';
        const branch = typeof rawQuest.branch === 'string' ? rawQuest.branch.trim() : '';

        return {
            id,
            title,
            category,
            status,
            location: typeof rawQuest.location === 'string' ? rawQuest.location.trim() : '',
            notes: typeof rawQuest.notes === 'string' ? rawQuest.notes.trim() : '',
            prerequisites,
            branchGroup,
            branch
        };
    }

    function parseQuestCollection(rawPayload) {
        const questList = Array.isArray(rawPayload)
            ? rawPayload
            : Array.isArray(rawPayload?.quests)
                ? rawPayload.quests
                : null;

        if (!questList) {
            throw new Error('Quest data must be an array or an export object with a quests array.');
        }

        return questList.map(normalizeQuest).filter(Boolean);
    }

    function normalizeJournal(rawJournal, fallbackName = 'Journal') {
        if (!rawJournal || typeof rawJournal !== 'object') {
            return null;
        }

        const now = createTimestamp();
        const name = typeof rawJournal.name === 'string' && rawJournal.name.trim()
            ? rawJournal.name.trim()
            : fallbackName;
        const id = typeof rawJournal.id === 'string' && rawJournal.id.trim() ? rawJournal.id.trim() : createId('journal');
        const quests = parseQuestCollection(Array.isArray(rawJournal.quests) ? rawJournal.quests : rawJournal);
        const createdAt = normalizeTimestamp(rawJournal.createdAt, now);
        const updatedAt = normalizeTimestamp(rawJournal.updatedAt, createdAt);

        return {
            id,
            name,
            quests,
            createdAt,
            updatedAt
        };
    }

    function parseJournalStore(rawStore) {
        const rawJournals = Array.isArray(rawStore)
            ? rawStore
            : Array.isArray(rawStore?.journals)
                ? rawStore.journals
                : null;

        if (!rawJournals || rawJournals.length === 0) {
            throw new Error('Journal data must include at least one journal.');
        }

        const normalizedJournals = rawJournals
            .map((journal, index) => normalizeJournal(journal, `Journal ${index + 1}`))
            .filter(Boolean);

        if (normalizedJournals.length === 0) {
            throw new Error('Journal data did not contain any valid journals.');
        }

        return normalizedJournals;
    }

    function migrateLegacyQuestStore(rawLegacyPayload, defaultName = 'Dragonborn') {
        return normalizeJournal({
            name: defaultName,
            quests: parseQuestCollection(rawLegacyPayload)
        }, defaultName);
    }

    function inferImportedJournalName(rawPayload, fallbackName = 'Imported Journal') {
        const explicitName = typeof rawPayload?.journalName === 'string' && rawPayload.journalName.trim()
            ? rawPayload.journalName.trim()
            : typeof rawPayload?.name === 'string' && rawPayload.name.trim()
                ? rawPayload.name.trim()
                : typeof rawPayload?.journal?.name === 'string' && rawPayload.journal.name.trim()
                    ? rawPayload.journal.name.trim()
                    : '';

        return explicitName || fallbackName;
    }

    function createImportedJournal(rawPayload, fallbackName = 'Imported Journal') {
        const quests = parseQuestCollection(rawPayload);
        const inferredName = inferImportedJournalName(rawPayload, fallbackName);

        return normalizeJournal({
            name: inferredName,
            createdAt: rawPayload?.createdAt,
            updatedAt: rawPayload?.updatedAt,
            quests
        }, inferredName);
    }

    function buildJournalExport(rawJournal, exportedAt = createTimestamp()) {
        const journal = normalizeJournal(rawJournal, 'Journal');
        if (!journal) {
            throw new Error('A valid journal is required to export.');
        }

        return {
            exportedAt: normalizeTimestamp(exportedAt),
            journalName: journal.name,
            createdAt: journal.createdAt,
            updatedAt: journal.updatedAt,
            questCount: journal.quests.length,
            quests: journal.quests
        };
    }

    function buildJournalStoreExport(rawJournals, activeJournalId, exportedAt = createTimestamp()) {
        const journals = parseJournalStore(rawJournals);
        const activeJournal = selectJournal(journals, activeJournalId);

        return {
            format: 'skyrim-tracker-backup',
            exportedAt: normalizeTimestamp(exportedAt),
            activeJournalId: activeJournal ? activeJournal.id : journals[0].id,
            journalCount: journals.length,
            journals
        };
    }

    function parseJournalBackup(rawPayload) {
        const journals = parseJournalStore(rawPayload);
        const activeJournal = selectJournal(journals, rawPayload?.activeJournalId);

        return {
            journals,
            activeJournalId: activeJournal ? activeJournal.id : journals[0].id,
            exportedAt: normalizeTimestamp(rawPayload?.exportedAt, createTimestamp())
        };
    }

    function normalizeFilters(rawFilters = {}) {
        const category = typeof rawFilters.category === 'string' ? rawFilters.category : 'All';
        const status = typeof rawFilters.status === 'string' ? rawFilters.status : 'All';
        const sort = SORT_OPTIONS.includes(rawFilters.sort) ? rawFilters.sort : 'recent';
        const search = typeof rawFilters.search === 'string' ? rawFilters.search : '';

        return {
            category,
            status,
            sort,
            search
        };
    }

    function matchesQuestFilters(quest, rawFilters = {}) {
        const filters = normalizeFilters(rawFilters);
        const searchTerm = filters.search.trim().toLowerCase();
        const matchesCategory = filters.category === 'All' || quest.category === filters.category;
        const matchesStatus = filters.status === 'All' || quest.status === filters.status;
        const matchesSearch = !searchTerm
            || quest.title.toLowerCase().includes(searchTerm)
            || quest.notes.toLowerCase().includes(searchTerm)
            || quest.location.toLowerCase().includes(searchTerm)
            || quest.branchGroup.toLowerCase().includes(searchTerm)
            || quest.branch.toLowerCase().includes(searchTerm)
            || quest.prerequisites.some(prerequisite => prerequisite.toLowerCase().includes(searchTerm));

        return matchesCategory && matchesStatus && matchesSearch;
    }

    function compareQuests(left, right, sort = 'recent', sourceQuests = []) {
        switch (sort) {
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
                return sourceQuests.indexOf(left) - sourceQuests.indexOf(right);
        }
    }

    function getVisibleQuests(rawQuests = [], rawFilters = {}) {
        const quests = Array.isArray(rawQuests) ? rawQuests.slice() : [];
        const filters = normalizeFilters(rawFilters);

        return quests
            .filter(quest => matchesQuestFilters(quest, filters))
            .sort((left, right) => compareQuests(left, right, filters.sort, rawQuests));
    }

    function cloneQuest(quest) {
        return normalizeQuest({
            ...quest,
            id: createId('quest'),
            prerequisites: Array.isArray(quest.prerequisites) ? [...quest.prerequisites] : []
        });
    }

    function duplicateJournal(rawJournal, nextName) {
        const journal = normalizeJournal(rawJournal, nextName || 'Journal');
        if (!journal) {
            throw new Error('A valid journal is required to duplicate.');
        }

        const timestamp = createTimestamp();

        return {
            id: createId('journal'),
            name: nextName || `${journal.name} Copy`,
            quests: journal.quests.map(cloneQuest),
            createdAt: timestamp,
            updatedAt: timestamp
        };
    }

    function touchJournal(rawJournal, timestamp = createTimestamp()) {
        const journal = normalizeJournal(rawJournal, 'Journal');
        if (!journal) {
            throw new Error('A valid journal is required to update.');
        }

        return {
            ...journal,
            updatedAt: normalizeTimestamp(timestamp, journal.updatedAt)
        };
    }

    function summarizeJournal(rawJournal) {
        const journal = normalizeJournal(rawJournal, 'Journal');
        if (!journal) {
            return null;
        }

        const completed = journal.quests.filter(quest => quest.status === 'Completed').length;
        const active = journal.quests.filter(quest => quest.status === 'Active').length;
        const notStarted = journal.quests.filter(quest => quest.status === 'Not Started').length;

        return {
            id: journal.id,
            name: journal.name,
            total: journal.quests.length,
            completed,
            active,
            notStarted,
            createdAt: journal.createdAt,
            updatedAt: journal.updatedAt
        };
    }

    function buildJournalDetailsViewModel(rawJournals = [], activeJournalId) {
        return parseJournalStore(rawJournals).map(journal => {
            const summary = summarizeJournal(journal);
            return {
                ...summary,
                isActive: journal.id === activeJournalId,
                statusLabel: journal.id === activeJournalId ? 'Currently selected playthrough' : 'Available playthrough'
            };
        });
    }

    function renderJournalDetailsList(container, rawJournals = [], activeJournalId, options = {}) {
        if (!container) {
            throw new Error('A container element is required to render journal details.');
        }

        const formatTimestamp = typeof options.formatTimestamp === 'function'
            ? options.formatTimestamp
            : (value) => value;
        const viewModel = buildJournalDetailsViewModel(rawJournals, activeJournalId);

        container.innerHTML = '';

        viewModel.forEach(summary => {
            const item = container.ownerDocument.createElement('li');
            item.className = `journal-detail-card${summary.isActive ? ' active' : ''}`;

            const title = container.ownerDocument.createElement('h4');
            title.textContent = summary.name;

            const meta = container.ownerDocument.createElement('p');
            meta.className = 'journal-detail-meta';
            meta.textContent = summary.statusLabel;

            const counts = container.ownerDocument.createElement('div');
            counts.className = 'journal-detail-counts';
            [
                `${summary.total} total`,
                `${summary.active} active`,
                `${summary.completed} completed`,
                `${summary.notStarted} not started`
            ].forEach(label => {
                const chip = container.ownerDocument.createElement('span');
                chip.textContent = label;
                counts.appendChild(chip);
            });

            const updated = container.ownerDocument.createElement('p');
            updated.className = 'journal-detail-updated';
            updated.textContent = `Last updated: ${formatTimestamp(summary.updatedAt)}`;

            item.append(title, meta, counts, updated);
            container.appendChild(item);
        });

        return viewModel;
    }

    function selectJournal(rawJournals = [], journalId) {
        const journals = Array.isArray(rawJournals) ? rawJournals : [];
        return journals.find(journal => journal.id === journalId) || journals[0] || null;
    }

    function deleteJournal(rawJournals = [], journalIdToDelete) {
        const journals = Array.isArray(rawJournals) ? rawJournals.filter(journal => journal.id !== journalIdToDelete) : [];

        if (journals.length === 0) {
            throw new Error('At least one journal must remain.');
        }

        return journals;
    }

    function createDefaultJournal(quests, name = 'Dragonborn') {
        return normalizeJournal({
            id: createId('journal'),
            name,
            quests
        }, name);
    }

    global.SkyrimQuestData = {
        CATEGORY_TITLES,
        VALID_CATEGORIES,
        VALID_STATUSES,
        SORT_OPTIONS,
        STATUS_SORT_ORDER,
        createId,
        normalizeQuest,
        parseQuestCollection,
        normalizeJournal,
        parseJournalStore,
        migrateLegacyQuestStore,
        inferImportedJournalName,
        createImportedJournal,
        buildJournalExport,
        buildJournalStoreExport,
        parseJournalBackup,
        normalizeFilters,
        matchesQuestFilters,
        compareQuests,
        getVisibleQuests,
        duplicateJournal,
        selectJournal,
        deleteJournal,
        touchJournal,
        summarizeJournal,
        buildJournalDetailsViewModel,
        renderJournalDetailsList,
        createDefaultJournal
    };
}(window));