// Vue.js
// register modal component
Vue.component('modal', {
    template: '#modal-template'
});

var app = new Vue({
    el: "#app",
    data: {
        isShared: false,
        sharedTeam: {},
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
        activeModal: null, // Options: signIn, signUp, loadTeam, share
    },
    mounted: function() {
        // Assume modern browser support
        var urlParams = new URLSearchParams(window.location.search);
            shareId = urlParams.get('shared'),
            self = this;

        this.isShared = !!shareId;

        if (this.isShared) {
            this.activeModal = 'loading';

            this.getContentHelper().setSharedTeam(shareId, function (sharedTeam) {
                if (sharedTeam) {
                    sharedTeam.id = 0;
                    self.sharedTeam = sharedTeam;
                    self.team.load(sharedTeam);
                } else {
                    this.closeModal();
                    swal('Sorry this team does not exist!');
                }
            });
        } else {
            this.getAuthHelper().createAuthChangeListener();
        }

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
            this.detail.index = index;

            this.detail.transferIn(pokemon, isTeamMember);
            this.getGraphHelper().createGraph(pokemon.name, pokemon.stats);

            this.activeModal = 'detailView';
        },
        closeDetailView: function(detail) {
            if (detail.isTeamMember) {
                this.team.updateTeamMember(detail);
            }

            this.activeModal = null;
        },
        typeLink: function(type) {
            return "http://bulbapedia.bulbagarden.net/wiki/" + type + "_(type)";
        },
        closeModal: function() {
            this.activeModal = null;
        }
    },
    computed: {
        detailImg: function() {
            return this.detail.updateImg();
        },
        moneyRemaining: function() {
            var remaining = this.team.startingBudget;

            this.team.members.forEach(function(teamMember) {
                remaining -= teamMember.price;
            });

            if (remaining < 0) {
                swal('Invalid team. Team value exceeds maximum limit.');
            }

            return parseFloat(remaining).toFixed(2);
        },
    },
    watch: {
        // Kind of hacky, but need to do this to utilize bootstrap
        // modal classes, without using bootstrap js
        activeModal: function () {
            if (this.activeModal) {
                document.body.classList.add('modal-open');
            } else {
                document.body.classList.remove('modal-open');
            }
        }
    }
});
