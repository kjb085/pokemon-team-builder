// Vue.js
var app = new Vue({
    el: "#app",
    data: {
        currentId: 0,
        options: [
            new Pokemon(),
            new Pokemon(),
            new Pokemon(),
        ],
        detail: new Pokemon(),
        leftJump: 3,
        rightJump: 3,
        teamOptionsToggle: false,
        user: new User(),
        signInUp: {
            email: "",
            pass: "",
            passConf: ""
        },
    },
    mounted: function() {
        var id = this.currentId + 1;

        this.populateOptions(id);

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                app.user.isLoggedIn = true;
                app.user.email = user.email;
                app.user.uid = user.uid;

                // console.log(user);
                //
                // db.ref('user/' + user.uid + '/team/').once('value').then(function(snapshot) {
                //     console.log(snapshot);
                // });
            }
        });

        this.user.init(teamSize, startingMoney);
    },
    methods: {
        populateOptions: function(startId) {
            for (var id = startId, counter = 0 ; id < startId + displayOptions ; id++, counter++) {
                this.firebaseRequest(id, counter);
            }
        },
        firebaseRequest: function(id, index) {
            db.ref('pokemon/' + id).once('value').then(function(snapshot) {
                var val = snapshot.val();

                if (val) {
                    console.log(id, val);
                    app.options[index].init(val);
                } else {
                    app.pokeApiRequest(id, index);
                }

                app.currentId++;
            });
        },
        pokeApiRequest: function(id, index) {
            $.ajax({
                url: "http://pokeapi.co/api/v2/pokemon/" + id + "/",
                type: "get",
                dataType: "json",
                success: function(data) {
                    // console.log('api call');
                    console.log(id, data);

                    app.options[index].init(data);

                    db.ref('pokemon/' + id).set(data);
                },
                error: function() {
                    console.log("error");
                }
            });
        },
        cycleOptions: function(forward, jumpSize) {
            app.currentId += jumpSize - displayOptions;

            var startId = app.currentId;

            if (forward) {
                startId++;
            } else {
                startId -= displayOptions + 2;
                app.currentId -= displayOptions + 3;
            }

            app.populateOptions(startId);
        },
        updateDetailView: function(pokemon, isTeamMember, index) {
            app.detail.isTeamMember = isTeamMember;
            app.detail.index = index;

            app.detail.transferIn(pokemon);
            app.createGraph(pokemon.name, pokemon.stats);

            $('#pokemon-detail').modal('show');
        },
        closeDetailView: function(detail) {
            if (detail.isTeamMember) {
                app.user.updateTeamMember(detail);
            }

            $('#pokemon-detail').modal('hide');
        },
        typeLink: function(type) {
            return "http://bulbapedia.bulbagarden.net/wiki/" + type + "_(type)";
        },
        searchPokemon: function() {

        },
        createGraph: function(name, stats) {
            var statsArr = [];

            stats.forEach(function(statObj) {
                var idx = app.findGraphIdx(statObj);

                statsArr[idx] = statObj.base_stat;
            });

            console.log(statsArr);

            var data = {
                    labels: ["HP", "Attack", "Defense", "Speed", "Sp Def", "Sp Atk"],
                    datasets: [
                        {
                            label: name + " Stat Graph",
                            backgroundColor: "rgba(255,99,132,0.2)",
                            borderColor: "rgba(255,99,132,1)",
                            pointBackgroundColor: "rgba(255,99,132,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(255,99,132,1)",
                            data: statsArr
                        },
                    ]
                },
                myRadarChart = new Chart("stats-chart", {
                    type: 'radar',
                    data: data,
                    options: {
                        scale: {
                            ticks: {
                                beginAtZero: true,
                                max: 260
                            }
                        },
                        responsive: true,
                        defaultFontSize: 1
                    }
                });
        },
        findGraphIdx: function(statObj) {
            switch (statObj.stat.name) {
                case "hp":
                    return 0;
                case "attack":
                    return 1;
                case "defense":
                    return 2;
                case "speed":
                    return 3;
                case "special-defense":
                    return 4;
                case "special-attack":
                    return 5;
                default:
                    return false;
            }
        },
        saveConfirm: function() {

        }
    },
    computed: {
        detailImg: function() {
            return this.detail.updateImg();
        },
        moneyRemaining: function() {
            var remaining = this.user.moneyRemaining;

            this.user.team.forEach(function(teamMember) {
                remaining -= teamMember.value;
            });

            if (remaining < 0) {
                swal('Invalid team. Team value exceeds maximum limit.');
            }

            return parseFloat(remaining).toFixed(2);
        },
        detailInputs: function() {
            // console.log(this.detail);
            return this.detail.isTeamMember;
        }
    },
    watch: {
        // detailImg: function() {
        //     // console.log('watcher');
        //     this.detail.updateImg();
        // }
    }
});
