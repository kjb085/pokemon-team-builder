function Team(name) {
    this.id = null;
    this.members = [];
    this.maxSize = 6;
    this.startingBudget = 100;
    this.editName = false;
    this.name = name ? name : "Team Name";

    for (var i = 0; i < this.maxSize; i++) {
        this.members.push(new Pokemon());
    }
};

Team.prototype.add = function (pokemon) {
    var success = false;

    for (var i = 0; i < this.maxSize; i++) {
        if (this.members[i].species === "") {
            this.members[i].transferIn(pokemon, true);
            success = true;
            break;
        }
    }

    if (!success) {
        swal('Your team is already full!');
    }
};

Team.prototype.remove = function (index) {
    this.members[index].empty();
    // $('#pokemon-detail').modal('hide');

    for (var i = index; i < this.maxSize; i++) {
        if (!this.members[i].isNull()) {
            this.moveLeft(i);
        }
    }
};

Team.prototype.updateTeamMember = function (detail) {
    var index = detail.index;

    if (detail.isTeamMember) {
        this.members[index].transferIn(detail);
    }
};

Team.prototype.isComplete = function () {
    var emptySlots = 0;

    this.members.forEach(function (pkmn) {
        if (pkmn.isNull()) {
            emptySlots++;
        }
    });

    return emptySlots === 0;
};

Team.prototype.setId = function (id) {
    this.id = id;
};

Team.prototype.load = function (toLoad) {
    var self = this;

    this.id = toLoad.id;
    this.name = toLoad.name;

    toLoad.team.forEach(function (teamMember, idx) {
        self.members[idx].transferIn(teamMember);
    });

    app.closeModal();
};

Team.prototype.moveLeft = function (index) {
    this.move(index, index - 1);
};

Team.prototype.moveRight = function (index) {
    this.move(index, index + 1);
};

Team.prototype.move = function (index, swapIndex) {
    var swaper = this.members[index];

    // Must use this to change index values and trigger a redraw
    Vue.set(this.members, index, this.members[swapIndex]);
    Vue.set(this.members, swapIndex, swaper);
};
