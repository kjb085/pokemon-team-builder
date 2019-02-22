/**
 * Global variables and string prototypes
 */
var startingMoney = 100,
    maxBase = 700,
    maxType = 30,
    optionsArr = [],
    pokemonIndex = 'pokemon-v2',
    genders = {
        genderless: 0,
        male: 1,
        female: 2,
    };

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.formatMoveName = function() {
    var words = this.split("-").map(function(word) {
        return word.capitalize();
    });

    return words.join(" ");
};
