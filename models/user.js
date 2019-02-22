var User = function() {
    this.email = "";
    this.uid = "";
    this.isLoggedIn = false;
    this.existingTeams = null;
    this.authHelper = null;
    this.contentHelper = null;
    this.loadingElipsesInterval = null;

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
    };

    this.signIn = function(info) {
        this.authHelper.signIn(this, info, false); // Invokes completeLogIn
    };

    this.completeLogIn = function (user, isNewUser) {
        this.email = user.email;
        this.uid = user.uid;
        this.isLoggedIn = true;

        app.closeModal();

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

        this.loadingElipsesInterval = setInterval(function () {
            var elipsesEl = document.querySelector('#loading-elipses'),
                elipses;

            if (elipsesEl) {
                elipses = elipsesEl.innerHTML.split('');

                if (elipses.length > 2) {
                    elipses = [];
                } else {
                    elipses.push('.');
                }

                elipsesEl.innerHTML = elipses.join('');
            }
        }, 500);

        this.contentHelper.getTeams(this, function (teams) {
            self.existingTeams = teams;
            clearInterval(self.loadingElipsesInterval);
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

    this.shareTeam = function (team) {
        var sharedUrl = null;

        if (team.members.length < team.maxSize) {
            swal('Must have ' + team.maxSize + ' team members to save!');
        }

         sharedUrl = this.contentHelper.shareTeam(this.email, team);

         app.closeModal();

         if (sharedUrl) {
             swal("Here's the URL you can use to share your team: " + sharedUrl);
         } else {
             swal('An unexpected error has occurred - please check your internet connection and try again');
         }
    };
}
