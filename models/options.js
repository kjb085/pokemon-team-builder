function Options () {
    this.pokemon = [];
    this.displayCount = 3;
    this.jump = {
        left: 3,
        right: 3,
    },
    this.contentHelper = null;

    // For default iteration through search results
    // @TODO Explore prefetching next expected result similar to filtered searches
    this.nextId = 1;
    this.maxId = 807; // Ideally switch this to use API, but currently the count property is inaccurate via PokeApi

    // Filtered search properties
    this.nextIndex = 0;
    this.filteredResults = [];

    this.defaultFilters = {
        name: '',
        minPrice: 0,
        maxPrice: 100,
        primaryType: '',
        secondaryType: '',
        order: 'id',
    };
    this.filters = {
        name: '',
        minPrice: 0,
        maxPrice: 100,
        primaryType: '',
        secondaryType: '',
        order: 'id',
    };
    this.filterOptions = {
        // Type and value same for all types so we simplify by using strings rather than objects
        types: [
            '',
            'normal',
            'fire',
            'fighting',
            'water',
            'flying',
            'grass',
            'poison',
            'electric',
            'ground',
            'psychic',
            'rock',
            'ice',
            'bug',
            'dragon',
            'ghost',
            'dark',
            'steel',
            'fairy',
        ],
        orders: [
            { text: 'id', value: 'id' },
            { text: 'alphabetical', value:  'species' },
            { text: 'price', value: 'price' },
            { text: 'height', value: 'height' },
            { text: 'weight', value: 'weight' },
        ],
    };
};

Options.prototype.init = function (contentHelper) {
    this.contentHelper = contentHelper;

    this.pokemon = [];

    for (var i = 0; i < this.displayCount; i++) {
        this.pokemon.push(new Pokemon());
    }

    this.populateFromApi(this.nextId);
};

Options.prototype.populateFromApi = function (startId) {
    var options = this;

    for (var id = startId, counter = 0 ; id < startId + this.displayCount ; id++, counter++) {
        // Kind of hacky, but need the index to be preserved for the callback given to getPokemon
        (function (contentHelper, id, index) {
            contentHelper.getPokemon(id, function (pokemon) {
                options.pokemon[index].init(pokemon);
            });
        })(this.contentHelper, id, counter);

        this.nextId++;
    }
};

Options.prototype.cycle = function (isForwardJump) {
    if (this.filteredResults.length) {
        this.cycleFilteredResults(isForwardJump);
    } else {
        this.cycleStandard(isForwardJump);
    }
};

// @TODO - Update so that results cycle from maxId to 1 naturally
Options.prototype.cycleStandard = function (isForwardJump) {
    var nextId = this.getNextNumber(this.nextId, isForwardJump);

    // Normalize to ensure only valid results from API
    if (nextId < 1) {
        this.nextId = 1;
    } else if (nextId > this.maxId - this.displayCount) {
        this.nextId = this.maxId - this.displayCount;
    } else {
        this.nextId = nextId;
    }

    this.populateFromApi(this.nextId);
};

Options.prototype.cycleFilteredResults = function (isForwardJump) {
    var nextIndex = this.getNextNumber(this.nextIndex, isForwardJump),
        index;

    for (var i = 0 ; i < this.displayCount ; i++) {
        index = i + nextIndex;

        if (typeof this.filteredResults[index] === "undefined") {
            index = 0;
            nextIndex = 0 - i;
        }

        console.log(index);

        this.pokemon[i].init(this.filteredResults[index]);
    }

    this.nextIndex = index + 1;
};

Options.prototype.getNextNumber = function (baseNumber, isForwardJump) {
    if (isForwardJump) {
        nextNumber = baseNumber + this.jump.right - this.displayCount;
    } else {
        nextNumber = baseNumber - this.displayCount - this.jump.left;
    }

    return nextNumber;
}

Options.prototype.toggleFilteredSearch = function () {
    this.isFilteredSearch = !this.isFilteredSearch;

    if (this.isFilteredSearch) {
        this.filteredResults = this.pokemon;
    }
};

Options.prototype.filteredSearch = function () {
    var self = this;

    if (this.filtersMatchDefault()) {
        this.filteredResults = [];
        this.nextId = 1;
        this.cycle(true);
        return;
    }

    this.pokemon.forEach(function (pkmn) {
        pkmn.empty();
    });

    this.contentHelper.filteredSearch(this.filters, function (results) {
        if (!results.length) {
            return swal('No results match your search');
        }

        self.nextIndex = 1;

        // Set first 3 results as options
        for (var i = 0 ; i < self.displayCount ; i++) {
            self.pokemon[i].init(results[i]);
            self.nextIndex++;
        }

        self.filteredResults = results;

    });
};

Options.prototype.filtersMatchDefault = function () {
    return this.filters.name === '' &&
        this.filters.minPrice === 0 &&
        this.filters.maxPrice === 100 &&
        this.filters.primaryType === '' &&
        this.filters.secondaryType === '' &&
        this.filters.order === 'id';
};
