var Pokemon = function() {
    this.isNull = true;
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

    // Custom
    this.value = 0;
    this.note = "";
    this.holderClasses = [];
};

Pokemon.prototype.init = function(apiData) {
    var types = apiData.types.reverse();

    this.name = this.species = apiData.name.capitalize();
    this.imgs = apiData.sprites;
    this.weight = apiData.weight;
    this.height = apiData.height;
    this.stats = apiData.stats;
    this.abilities = apiData.abilities.reverse();
    this.types = types;
    this.moves = apiData.moves;
    this.femaleOption = typeof apiData.sprites.front_female !== "undefined";
    this.multipleForms = apiData.forms.length > 1;
    this.imgSrc = apiData.sprites.front_default;
    this.forms = apiData.forms;

    this.value = this.calculateValue();
    this.holderClasses = this.getHolderClasses(types);
};

Pokemon.prototype.transferIn = function(pkmn, isTeamMember) {
    for (var key in pkmn) {
        if (pkmn.hasOwnProperty(key) && this.hasOwnProperty(key)) {
            this[key] = pkmn[key];
        }
    }

    this.isTeamMember = isTeamMember ? true : false;
    this.isNull = pkmn == new Pokemon();
};

Pokemon.prototype.empty = function() {
    var new_pkmn = new Pokemon();

    this.transferIn(new_pkmn);
};

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
};

Pokemon.prototype.getHolderClasses = function (types) {
    var classes = [];

    types.forEach(function (typeObj, idx) {
        if (idx === 0) {
            classes.push(typeObj.type.name);
        } else {
            classes.push(typeObj.type.name + '-border');
        }
    });

    return classes;
};

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
