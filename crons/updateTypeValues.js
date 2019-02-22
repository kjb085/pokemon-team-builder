const request = require('request-promise'),
    cheerio = require('cheerio'),
    firebase = require('../firebase.js'),
    firebaseIndex = 'type-values',
    getScaledScore = (score, min, max) => {
        return 100 * (score - min) / (max - min);
    },
    setInFirebase = (metaType, type, score) => {
        return firebase.ref(`${firebaseIndex}/${metaType}/${type}`).set(score, function (err) {
            if (err) {
                console.log(err);
            }
        });
    },
    parseBody = (body) => {
        return cheerio.load(body);
    },
    attackOptions = {
        uri: 'https://pokemondb.net/type',
        transform: parseBody,
    },
    defenseOptions = {
        uri: 'https://pokemondb.net/type/dual',
        transform: parseBody,
    };

(async () => {
    let attackTotals = {},
        defenseTotals = {},
        aggregateTotals = {},
        attackSuccess = null,
        defenseSuccess = null;

    attackSuccess = request(attackOptions)
        .then(($) => {
            let rows = $('.type-table tbody tr'),
                totals = [],
                min = 0,
                max = 0;

            for (let i = 0; i < rows.length; i++) {
                let row = rows[i],
                    name = row.children[1].children[0].children[0].data.toLowerCase(),
                    totalEffectiveness = 0,
                    unimpairedCount = 0,
                    fullScore = 0;

                row.children.forEach((child) => {
                    if (child.name === 'td') {
                        if (child.children.length) {
                            let typeVal = child.children[0].data;

                            if (typeVal === "½") {
                                totalEffectiveness += 0.5;
                            } else {
                                typeVal = parseInt(typeVal);

                                totalEffectiveness += typeVal;

                                if (typeVal >= 1) {
                                    unimpairedCount++;
                                }
                            }
                        } else {
                            unimpairedCount++;
                            totalEffectiveness += 1;
                        }
                    }
                });

                fullScore = totalEffectiveness + (unimpairedCount * 0.5);

                totals.push(fullScore);
                attackTotals[name] = fullScore;
            }

            // Normalize data - favor higher values
            totals.sort((a, b) => {return a - b});
            min = totals[0];
            max = totals[totals.length - 1];

            for (let key in attackTotals) {
                if (attackTotals.hasOwnProperty(key)) {
                    attackTotals[key] = getScaledScore(attackTotals[key], min, max);
                    setInFirebase('attack', key, attackTotals[key]);
                }
            }

            return true;
        })
        .catch((err) => {
            console.log(err);

            return false;
        });

    defenseSuccess = await request(defenseOptions)
        .then(($) => {
            let rows = $('.type-table tbody .has-pkmn'),
                totals = [],
                min = 0,
                max = 0;

            for (let i = 0; i < rows.length; i++) {
                let row = rows[i],
                    names = [],
                    name = '',
                    total = 0;

                row.children.forEach((child) => {
                    if (child.name === 'th' && child.children.length) {
                        child.children[1].children.forEach((grandChild) => {
                            if (grandChild.name === 'a' && grandChild.children[0].data !== '—') {
                                names.push(grandChild.children[0].data.toLowerCase());
                            }
                        });
                    } else if (child.name === 'td' && child.attribs.class !== "cell-total") {
                        if (child.children.length) {
                            let typeVal = child.children[0].data;

                            if (typeVal === "½") {
                                total += 0.5;
                            } else if (typeVal === "¼") {
                                total += 0.25;
                            } else {
                                total += parseInt(typeVal);
                            }
                        } else {
                            total += 1;
                        }
                    }
                });

                totals.push(total);
                name = names.join('-');
                defenseTotals[name] = total;
            }

            // Normalize data - favor lower values
            totals.sort((a, b) => {return b - a});
            min = totals[0];
            max = totals[totals.length - 1];

            for (let key in defenseTotals) {
                if (defenseTotals.hasOwnProperty(key)) {
                    defenseTotals[key] = getScaledScore(defenseTotals[key], min, max);
                    setInFirebase('attack', key, defenseTotals[key]);
                }
            }

            return true;
        })
        .catch((err) => {
            console.log(err);

            return false;
        });

    if (attackSuccess && defenseSuccess) {
        for (let key in defenseTotals) {
            if (defenseTotals.hasOwnProperty(key)) {
                let attackTotal = 0,
                    aggregateTotal = 0,
                    types = key.split('-');

                types.forEach(function (type) {
                    if (typeof attackTotals[type] === 'undefined') {
                        console.log('Undefined type: ' + type);
                        process.exit();
                    }
                    attackTotal += attackTotals[type];
                });

                attackTotal = attackTotal / types.length;
                aggregateTotal = (defenseTotals[key] * 0.6) + (attackTotal * 0.4);

                await setInFirebase('aggregate', key, aggregateTotal);
            }
        }

        console.log('Success');
    } else {
        console.log('Error - aggregate values not set');
    }

    process.exit();
})();
