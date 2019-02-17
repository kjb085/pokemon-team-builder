/**
 * Global variables and string prototypes
 */
var startingMoney = 100,
    maxBase = 700,
    maxType = 30,
    optionsArr = [];

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.formatMoveName = function() {
    var words = this.split("-").map(function(word) {
        return word.capitalize();
    });

    return words.join(" ");
};
