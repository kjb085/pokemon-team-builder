function ContentHelper (firebase) {
    this.firebase = firebase;
    this.db = firebase.database();
};

ContentHelper.prototype.getPokemon = function (id, callback) {
    var self = this;

    console.log(id);

    this.db.ref('pokemon/' + id).once('value')
        .then(function(snapshot) {
            var val = snapshot.val();

            if (val) {
                console.log(id, val);
                callback(val);
            } else {
                self.pokeApiRequest(id, callback);
            }
        })
        .catch(function (err) {
            if (err.message) {
                swal(err.message);
            }
            console.log(err);
        });
};

ContentHelper.prototype.pokeApiRequest = function (id, callback) {
    var contentHelper = this;

    // @TODO Get rid of jQuery and repalce with another library for ajax requests
    $.ajax({
        url: "http://pokeapi.co/api/v2/pokemon/" + id + "/",
        type: "get",
        dataType: "json",
        success: function(data) {
            console.log('api call');
            console.log(id, data);

            callback(data);

            contentHelper.setPokemon(id, data);
        },
        error: function() {
            console.log("error");
        }
    });
};

ContentHelper.prototype.setPokemon = function (id, pokemon) {
    this.db.ref('pokemon/' + id).set(pokemon);
};

ContentHelper.prototype.getTeams = function (user, callback) {
    this.db.ref('user/' + user.uid + '/teams').once('value')
        .then(function (snapshot) {
            var val = snapshot.val();

            if (val) {
                callback(val);
            }
        })
        .catch(function () {
            if (err.message) {
                swal(err.message);
            }
            console.log(err);
        });
};

ContentHelper.prototype.saveTeam = function (user, id, team) {
    this.db.ref('user/' + user.uid + '/teams/' + id).set(team);
};
