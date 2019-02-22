var Pokemon = function() {
    this.name = '';
    this.species = '';
    this.imgs = {};
    this.weight = 0;
    this.height = 0;
    this.stats = [];
    this.abilities = [];
    this.types = [];
    this.moves = [];
    this.genderType = '';
    this.hasFemaleImg = false;
    this.forms = [];
    this.multipleForms = false;
    this.defaultImg = '';
    this.price = 0;

    // Front end custom
    this.gender = 0;
    this.imgSrc = '';
    this.holderClasses = [];
    this.isShiny = false;
    this.isTeamMember = false;
};

Pokemon.prototype.init = function(data) {
    // Properties to update if passed in via data - otherwise set as default defined by functions
    let customProperties = {
        gender: function (self) {
            self.gender = self.getDefaultGender(self.genderType);
        },
        imgSrc: function (self) {
            self.imgSrc = typeof self.imgs === "object" ? self.imgs.front_default : '';
        },
        holderClasses: function (self) {
            self.holderClasses = self.getHolderClasses(self.types);
        },
    };

    for (var key in data) {
        if (data.hasOwnProperty(key) && this.hasOwnProperty(key)) {
            this[key] = data[key];
        }
    }

    for (var prop in customProperties) {
        if (customProperties.hasOwnProperty(prop)) {
            if (typeof data[prop] !== "undefined") {
                this[prop] = data[prop];
            } else {
                customProperties[prop](this);
            }
        }
    }
};

Pokemon.prototype.transferIn = function(pkmn, isTeamMember) {
    this.init(pkmn);

    this.isTeamMember = isTeamMember ? true : false;
};

Pokemon.prototype.isNull = function () {
    var emptyPkmn = new Pokemon();

    return this.name === emptyPkmn.name &&
        this.species === emptyPkmn.species &&
        this.height === emptyPkmn.height &&
        this.weight === emptyPkmn.weight;
};

Pokemon.prototype.empty = function() {
    var new_pkmn = new Pokemon();

    this.transferIn(new_pkmn);
};

Pokemon.prototype.updateImg = function() {
    var imgs = this.imgs,
        updatedImg = imgs.front_default;

    if (this.hasFemaleImg) {
        if (this.gender === genders.male && this.isShiny) {
            updatedImg = imgs.front_shiny;
        } else if (this.gender !== genders.male && !this.isShiny) {
            updatedImg = imgs.front_female;
        } else if (this.gender !== genders.male && this.isShiny) {
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

Pokemon.prototype.getDefaultGender = function (genderType) {
    if (genderType.indexOf('Only') > -1) {
        return genders[genderType.replace('Only', '')];
    } else if (genderType === 'genderless') {
        return genders.genderless;
    }

    return genders.male;
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

Pokemon.prototype.displayGenderOption = function (gender) {
    if (gender === this.genderType + 'Only' || this.genderType === 'normal') {
        return true;
    }

    return false;
};
