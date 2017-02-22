var User = function() {
    this.email = "";
    this.uid = "";
    this.isLoggedIn = false;
    this.team = [];
    this.moneyRemaining = 0;
    this.existingTeamCount = 0;

    this.init = function(teamSize, startingMoney) {
        for (var i = 0; i < teamSize; i++) {
            var tempPkmn = new Pokemon();
            this.team.push(tempPkmn);
        }

        this.moneyRemaining = startingMoney;
    };

    this.signUp = function(info) {
        var user = this,
            emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            validEmail = emailTest.test(info.email),
            validPassword = (info.pass !== "" && info.pass === info.passConf);

        if (!validEmail) {
            swal("Invalid email address!");
            return;
        } else if (!validPassword) {
            swal("Passwords didn't match!");
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(info.email, info.pass).catch(function(err) {
            if (err.message) {
                swal(err.message);
                user.isLoggedIn = false;
                user.email = "";
            }
        });

        this.email = info.email;
        this.isLoggedIn = true;

        $('#sign-up').modal('hide');
    };

    this.signIn = function(info) {
        var user = this;

        firebase.auth().signInWithEmailAndPassword(info.email, info.pass).catch(function(err) {
            if (err.message) {
                swal(err.message);
                user.isLoggedIn = false;
                user.email = "";
            }
        });

        this.email = info.email;
        this.isLoggedIn = true;

        $('#sign-in').modal('hide');
    };

    this.signOut = function() {
        var user = this;

        firebase.auth().signOut().then(function() {
            swal('Successfully signed out!');
            user.isLoggedIn = false;
            user.email = "";
            user.uid = null;
        }, function(error) {
            swal("Couldn't log out. Please refresh and try again.");
        });
    };

    this.addToTeam = function(pokemon) {
        var success = false;

        for (var i = 0 ; i < teamSize ; i++) {
            if (this.team[i].species === "") {
                this.team[i].transferIn(pokemon);
                success = true;
                break;
            }
        }

        if (!success) {
            swal('Your team is already full!');
        }
    };

    this.removeFromTeam = function(index) {
        this.team[index].empty();
        $('#pokemon-detail').modal('hide');
    };

    this.updateTeamMember = function(detail) {
        var index = detail.index;

        if (detail.isTeamMember) {
            this.team[index].transferIn(detail);
        }
    };

    this.hasCompleteTeam = function() {
        var emptySlots = 0;

        this.team.forEach(function(pkmn) {
            if (pkmn.species === "") {
                emptySlots++;
            }
        });

        return emptySlots === 0;
    };

    // this.getTeamApiData = function() {
    //     var apiData = [];
    //
    //     this.team.forEach(function() {
    //         var temp = {};
    //
    //         temp.
    //     });
    // };

    this.saveTeam = function(name) {
        if (!this.uid) {
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

    this.loadTeam = function() {

    };
}
