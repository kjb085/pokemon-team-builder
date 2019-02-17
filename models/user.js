var User = function() {
    this.email = "";
    this.uid = "";
    this.isLoggedIn = false;
    this.existingTeams = [];
    this.authHelper = null;
    this.contentHelper = null;

    this.init = function(authHelper, contentHelper) {
        this.authHelper = authHelper;
        this.contentHelper = contentHelper;
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

        this.authHelper.signIn(this, info, true); // Invokes completeLogIn

        $('#sign-up').modal('hide');
    };

    this.signIn = function(info) {
        this.authHelper.signIn(this, info, false); // Invokes completeLogIn

        $('#sign-in').modal('hide');
    };

    this.completeLogIn = function (user, isNewUser) {
        this.email = user.email;
        this.uid = user.uid;
        this.isLoggedIn = true;

        if (!isNewUser) {
            this.getExistingTeams();
        }
    };

    this.signOut = function() {
        this.authHelper.signOut(this); // Invokes completeLogOut
    };

    this.completeLogOut = function () {
        this.isLoggedIn = false;
        this.email = "";
        this.uid = null;
        this.existingTeams = [];
    };

    this.getExistingTeams = function () {
        var self = this;

        this.contentHelper.getTeams(this, function (teams) {
            self.existingTeams = teams;
        });
    };

    this.saveTeam = function(team) {
        var teamId = team.id ? team.id : this.existingTeams.length,
            teamObj = {
                id: teamId,
                team: team.members,
                name: team.name
            };

        if (!this.uid || !this.isLoggedIn) {
            swal('Not logged in. Please refresh the page and try again.');
            return;
        } else if (!team.isComplete()) {
            swal("Incomplete team! Please make sure your team is made up of 6 pokemon before saving.");
            return;
        }

        if (!team.id) {
            team.setId(teamId);
        }
        this.contentHelper.saveTeam(this, teamId, teamObj);
        this.updateExistingTeams(teamObj);

        swal('Team "' + team.name + '" successfully saved!');
    };

    this.updateExistingTeams = function (team) {
        var existingIndex = null;

        this.existingTeams.forEach(function (existingTeam, index) {
            if (existingTeam.id === team.id) {
                existingIndex = index;
            }
        });

        if (existingIndex) {
            this.existingTeams[existingIndex] = team;
        } else {
            this.existingTeams.push(team);
        }
    };
}
