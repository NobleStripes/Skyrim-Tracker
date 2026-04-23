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

        const name = typeof rawJournal.name === 'string' && rawJournal.name.trim()
            ? rawJournal.name.trim()
            : fallbackName;
        const id = typeof rawJournal.id === 'string' && rawJournal.id.trim() ? rawJournal.id.trim() : createId('journal');
        const quests = parseQuestCollection(Array.isArray(rawJournal.quests) ? rawJournal.quests : rawJournal);

        return {
            id,
            name,
            quests
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

        return {
            id: createId('journal'),
            name: nextName || `${journal.name} Copy`,
            quests: journal.quests.map(cloneQuest)
        };
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
        normalizeFilters,
        matchesQuestFilters,
        compareQuests,
        getVisibleQuests,
        duplicateJournal,
        selectJournal,
        deleteJournal,
        createDefaultJournal
    };
}(window));