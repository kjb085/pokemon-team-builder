const db = require('../firebase.js'),
    getGenderTypeById = require('../helpers/getGenderTypeById.js'),
    typeValuesIndex = 'type-values/aggregate/',
    startingMoney = 100,
    maxBaseStatValue = 700;

/**
 * Cache for type values retrieved from firebase to limit total calls required
 *
 * @type {Object}
 */
let typeValueCache = {};

/**
 * Used to transform poke api data for storage in db
 *
 * @param  {Object} apiData
 * @return {Object}
 */
let formatData = async (apiData) => {
    let types = apiData.types.reverse(),
        name = apiData.name.charAt(0).toUpperCase() + apiData.name.slice(1);

    if (!hasRequiredFields(apiData)) {
        return null;
    }

    return {
        name: name,
        species: apiData.name,
        imgs: apiData.sprites,
        weight: apiData.weight,
        height: apiData.height,
        stats: apiData.stats,
        abilities: apiData.abilities,
        types: types,
        moves: apiData.moves,
        genderType: getGenderTypeById(apiData.id),
        hasFemaleImg: femaleAppearsDifferently(apiData.sprites),
        forms: apiData.forms,
        multipleForms: apiData.forms.length > 1,
        defaultImg: apiData.sprites.front_default,
        price: await calculatePrice(apiData.stats, types),
    };
};

/**
 * Validate the api data
 *
 * @param  {Object} apiData
 * @return {Boolean}
 */
let hasRequiredFields = (apiData) => {
    return apiData.name &&
        apiData.sprites.front_default &&
        typeof apiData.types === "object" &&
        Object.keys(apiData.types).length > 0;
};

/**
 * Ensure valid female image exists
 *
 * @param  {Object}  sprites
 * @return {Boolean}
 */
let femaleAppearsDifferently = (sprites) => {
    return ((typeof sprites.front_female !== "undefined") && sprites.front_female) ? 1 : 0;
};

/**
 * Calculate the price of the given pokemon
 *
 * @param  {Array} stats
 * @param  {Array} types
 * @return {Number}
 */
let calculatePrice = async (stats, types) => {
    let percentBaseStat = getBaseStatValue(stats) / maxBaseStatValue,
        percentType = await getTypesPercent(types);

    return parseFloat(
        (
            (startingMoney * .25) * ((percentBaseStat * 0.6) + (percentType * 0.4))
        ).toFixed(2)
    );
};

/**
 * Get aggregate of all stats for a pokemon
 *
 * @param  {Object} stats
 * @return {Number}
 */
let getBaseStatValue = (stats) => {
    let statValue = 0;

    stats.forEach((stat) => {
        statValue += stat.base_stat;
    });

    return statValue;
};

/**
 * Get value of the given type set
 *
 * @param  {Array} types
 * @return {Number}
 */
let getTypesPercent = async (types) => {
    let typeNames = [],
        fullName;

    types.forEach((typeObj) => {
        typeNames.push(typeObj.type.name);
    });

    fullName = typeNames.join('-');

    if (typeof typeValueCache[fullName] !== "undefined") {
        return typeValueCache[fullName]
    }

    typeValueCache[fullName] = await getTypesPercentFromFirebase(fullName);

    return typeValueCache[fullName];
};

/**
 * Get value of a given type set from firebase
 *
 * @param  {String} typesName
 * @return {Promise}
 */
let getTypesPercentFromFirebase = (typesName) => {
    return db.ref(typeValuesIndex + typesName).once('value')
        .then((snapshot) => {
            let val = snapshot.val();

            if (!isNaN(val)) {
                return val / 100;
            } else {
                throw new Error('Incorrect value found for ' + typesName);
            }
        })
        .catch((err) => {
            console.log(err);
            process.exit();
        });
};

module.exports = formatData;
