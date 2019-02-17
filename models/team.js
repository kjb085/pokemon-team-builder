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

// Team.prototype.init = function() {
//     for (var i = 0; i < this.maxSize; i++) {
//         this.members.push(new Pokemon());
//     }
//
//
// };

Team.prototype.getTeamMembers = function () {
    return this.members;
};

Team.prototype.add = function(pokemon) {
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

Team.prototype.remove = function(index) {
    this.members[index].empty();
    $('#pokemon-detail').modal('hide');
};

Team.prototype.updateTeamMember = function(detail) {
    var index = detail.index;

    if (detail.isTeamMember) {
        this.members[index].transferIn(detail);
    }
};

Team.prototype.isComplete = function() {
    var emptySlots = 0;

    this.members.forEach(function(pkmn) {
        if (pkmn.isNull) {
            emptySlots++;
        }
    });

    return emptySlots === 0;
};

Team.prototype.setId = function (id) {
    this.id = id;
};
// Team.prototype.getTeamApiData = function() {
//     var apiData = [];
//
//     this.team.forEach(function() {
//         var temp = {};
//
//         // temp.
//     });
// };

Team.prototype.saveTeam = function(user) {
    if (!user.uid) {
        swal('Not logged in. Please refresh the page and try again.');
        return;
    } else if (!this.hasCompleteTeam()) {
        swal('Incomplete team');
        return;
    }

    var id = this.existingTeamCount + 1,
        name = typeof name !== "undefined" ? name : "Team " + id,
        team = this.team,
        teamObj = {
            team: team,
            name: name
        };

    db.ref('user/' + this.uid + '/teams/' + id).set(teamObj);
};

Team.prototype.loadTeam = function(toLoad) {
    this.id = toLoad.id;
    this.members = toLoad.team;
    this.name = toLoad.name;
};
