function Options () {
    this.nextId = 1;
    this.displayCount = 3;
    this.jump = {
        left: 3,
        right: 3,
    },
    this.pokemon = [];
    this.contentHelper = null;
    this.maxId = 807; // Ideally switch this to use API, but currently the count property is inaccurate
};

Options.prototype.init = function (contentHelper) {
    this.contentHelper = contentHelper;

    for (var i = 0; i < this.displayCount; i++) {
        this.pokemon.push(new Pokemon());
    }

    this.populate(this.nextId);
};

Options.prototype.populate = function (startId) {
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
    var nextId;

    if (isForwardJump) {
        nextId = this.nextId + this.jump.right - this.displayCount;
    } else {
        nextId = this.nextId - this.displayCount - this.jump.left;
    }

    console.log(nextId);

    // Normalize to ensure only valid results from API
    if (nextId < 1) {
        this.nextId = 1;
    } else if (nextId > this.maxId - this.displayCount) {
        this.nextId = this.maxId - this.displayCount;
    } else {
        this.nextId = nextId;
    }

    this.populate(this.nextId);
};
