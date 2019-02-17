// Vue.js
// register modal component
Vue.component('modal', {
  template: '#modal-template'
});

var app = new Vue({
    el: "#app",
    data: {
        // teamOptionsToggle: false,
        options: new Options(),
        detail: new Pokemon(),
        user: new User(),
        team: new Team(),
        // Helpers are lazy loaded - use getter methods to access
        helpers: {
            auth: null,
            content: null,
            graph: null,
        },
        signInUp: {
            email: "",
            pass: "",
            passConf: ""
        },
        modal: {
            loadTeam: false,
        }
    },
    mounted: function() {
        this.getAuthHelper().createAuthChangeListener();
        this.user.init(this.getAuthHelper(), this.getContentHelper());
        this.options.init(this.getContentHelper());
    },
    methods: {
        getGraphHelper: function () {
            if (this.helpers.graph === null) {
                this.helpers.graph = new GraphHelper();
            }

            return this.helpers.graph;
        },
        getContentHelper: function () {
            if (this.helpers.content === null) {
                // Get firebase from global scope
                this.helpers.content = new ContentHelper(firebase);
            }

            return this.helpers.content;
        },
        getAuthHelper: function () {
            if (this.helpers.auth === null) {
                // Get firebase from global scope
                this.helpers.auth = new AuthHelper(firebase);
            }

            return this.helpers.auth;
        },
        updateDetailView: function(pokemon, isTeamMember, index) {
            app.detail.index = index;

            app.detail.transferIn(pokemon);
            this.getGraphHelper().createGraph(pokemon.name, pokemon.stats);

            console.log(this.detail);

            $('#pokemon-detail').modal('show');
        },
        closeDetailView: function(detail) {
            if (detail.isTeamMember) {
                app.team.updateTeamMember(detail);
            }

            $('#pokemon-detail').modal('hide');
        },
        typeLink: function(type) {
            return "http://bulbapedia.bulbagarden.net/wiki/" + type + "_(type)";
        },
        searchPokemon: function() {

        },
    },
    computed: {
        detailImg: function() {
            return this.detail.updateImg();
        },
        moneyRemaining: function() {
            var remaining = this.team.startingBudget;

            this.team.members.forEach(function(teamMember) {
                remaining -= teamMember.value;
            });

            if (remaining < 0) {
                swal('Invalid team. Team value exceeds maximum limit.');
            }

            return parseFloat(remaining).toFixed(2);
        },
        // detailInputs: function() {
        //     // console.log(this.detail);
        //     return this.detail.isTeamMember;
        // }
    },
    watch: {
        // detailImg: function() {
        //     // console.log('watcher');
        //     this.detail.updateImg();
        // }
    }
});
