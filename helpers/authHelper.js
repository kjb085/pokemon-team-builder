function AuthHelper (firebase) {
    this.firebase = firebase;
}

/**
 * Allows for user to be auto logged in
 *
 * @return {void}
 */
AuthHelper.prototype.createAuthChangeListener = function () {
    this.firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            app.user.completeLogIn(user);

            // console.log(user);
            //
            // db.ref('user/' + user.uid + '/team/').once('value').then(function(snapshot) {
            //     console.log(snapshot);
            // });
        }
    });
};

AuthHelper.prototype.signIn = function (user, info, isNewUser) {
    var authHandler;

    if (isNewUser) {
        authHandler = this.firebase.auth().createUserWithEmailAndPassword(info.email, info.pass);
    } else {
        authHandler = this.firebase.auth().signInWithEmailAndPassword(info.email, info.pass);
    }

    authHandler
        .then(function (userData) {
            user.completeLogIn(userData);
        })
        .catch(function (err) {
            var message = err.message ? err.message : "An unexpected error occured";

            user.completeLogOut();
            swal(message);
        });
};

AuthHelper.prototype.signOut = function (user) {
    this.firebase.auth().signOut()
        .then(function() {
            user.completeLogOut();
            swal('Successfully signed out!');
        })
        .catch(function(error) {
            swal("Couldn't log out. Please refresh and try again.");
        });
};
