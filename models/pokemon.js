// Models
var Pokemon = function() {
    this.name = "";
    this.species = "";
    this.isMale = true;
    this.isTeamMember = false;
    this.femaleOption = false;
    this.multipleForms = false;
    this.isShiny = false;
    this.imgSrc = "";
    this.imgs = [];
    this.abilities = [];
    this.stats = [];
    this.types = [];
    this.moves = [];
    this.forms = [];
    this.weight = 0;
    this.height = 0;
    this.value = 0;
    this.note = "";
};

Pokemon.prototype.init = function(apiData) {
    this.name = this.species = apiData.name.capitalize();
    this.imgs = apiData.sprites;
    this.weight = apiData.weight;
    this.height = apiData.height;
    this.stats = apiData.stats;
    this.abilities = apiData.abilities.reverse();
    this.types = apiData.types.reverse();
    this.moves = apiData.moves;
    this.femaleOption = typeof apiData.sprites.front_female !== "undefined";
    this.multipleForms = apiData.forms.length > 1;
    this.imgSrc = apiData.sprites.front_default;
    this.forms = apiData.forms;

    this.value = this.calculateValue();
}

Pokemon.prototype.transferIn = function(pkmn) {
    this.name = pkmn.name;
    this.species = pkmn.species;
    this.imgs = pkmn.imgs;
    this.weight = pkmn.weight;
    this.height = pkmn.height;
    this.stats = pkmn.stats;
    this.abilities = pkmn.abilities;
    this.types = pkmn.types;
    this.moves = pkmn.moves;
    this.femaleOption = pkmn.femaleOption;
    this.multipleForms = pkmn.multipleForms;
    this.imgSrc = pkmn.imgSrc;
    this.isShiny = pkmn.isShiny;
    this.isMale = pkmn.isMale;
    this.forms = pkmn.forms;
    this.value = pkmn.value;
    this.note = this.note;
}

Pokemon.prototype.empty = function() {
    var new_pkmn = new Pokemon();

    this.transferIn(new_pkmn);
}

Pokemon.prototype.updateImg = function() {
    var imgs = this.imgs,
        updatedImg = imgs.front_default;

    if (this.femaleOption) {
        if (this.isMale && this.isShiny) {
            updatedImg = imgs.front_shiny;
        } else if (!this.isMale && !this.isShiny) {
            updatedImg = imgs.front_female;
        } else if (!this.isMale && this.isShiny) {
            updatedImg = imgs.front_shiny_female;
        }
    } else {
        if (this.isShiny) {
            updatedImg = imgs.front_shiny;
        }
    }

    this.imgSrc = updatedImg;

    return updatedImg;
}

Pokemon.prototype.calculateValue = function() {
    var baseValue = 0,
        percentBase = 0,
        typeValue = 0,
        percentType = 0;

    this.stats.forEach(function(stat) {
        baseValue += stat.base_stat;
    });

    percentBase = baseValue / maxBase;

    // @TODO: Build this out
    // this.types.forEach(function(type) {
    //     if (type.value) {
    //         typeValue += type.value;
    //     } else {
    //
    //     }
    // });

    percentType = typeValue / maxType;

    return parseFloat((startingMoney * .25) * ((percentBase * 1) + (percentType * .1))).toFixed(2);
}
