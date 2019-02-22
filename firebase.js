const firebase = require('firebase'),
    fb = firebase.initializeApp({
        apiKey: "AIzaSyBrQS9-yyF1qyC_z3cYu9RyfGktj-tjqOY",
        authDomain: "team-builder-c1d50.firebaseapp.com",
        databaseURL: "https://team-builder-c1d50.firebaseio.com",
        storageBucket: "team-builder-c1d50.appspot.com",
        messagingSenderId: "346227244211"
    }),
    db = fb.database();

module.exports = db;
