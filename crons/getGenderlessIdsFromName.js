const genderlessNames = [
        'Arceus',
        'Articuno',
        'Azelf',
        'Baltoy',
        'Beldum',
        'Blacephalon',
        'Bronzong',
        'Bronzor',
        'Buzzwole',
        'Carbink',
        'Celebi',
        'Celesteela',
        'Claydol',
        'Cobalion',
        'Cosmoem',
        'Cosmog',
        'Cryogonal',
        'Darkrai',
        'Deoxys',
        'Dhelmise',
        'Dialga',
        'Diancie',
        'Ditto',
        'Electrode',
        'Entei',
        'Genesect',
        'Giratina',
        'Golett',
        'Golurk',
        'Groudon',
        'Guzzlord',
        'Ho-Oh',
        'Hoopa',
        'Jirachi',
        'Kartana',
        'Keldeo',
        'Klang',
        'Klink',
        'Klinklang',
        'Kyogre',
        'Kyurem',
        'Lugia',
        'Lunala',
        'Lunatone',
        'Magearna',
        'Magnemite',
        'Magneton',
        'Magnezone',
        'Manaphy',
        'Marshadow',
        'Melmetal',
        'Meloetta',
        'Meltan',
        'Mesprit',
        'Metagross',
        'Metang',
        'Mew',
        'Mewtwo',
        'Minior',
        'Moltres',
        'Naganadel',
        'Necrozma',
        'Nihilego',
        'Palkia',
        'Pheromosa',
        'Phione',
        'Poipole',
        'Porygon',
        'Porygon-Z',
        'Porygon2',
        'Raikou',
        'Rayquaza',
        'Regice',
        'Regigigas',
        'Regirock',
        'Registeel',
        'Reshiram',
        'Rotom',
        'Shaymin',
        'Shedinja',
        'Silvally',
        'Solgaleo',
        'Solrock',
        'Stakataka',
        'Starmie',
        'Staryu',
        'Suicune',
        'Tapu Bulu',
        'Tapu Fini',
        'Tapu Koko',
        'Tapu Lele',
        'Terrakion',
        'Type: Null',
        'Unown',
        'Uxie',
        'Victini',
        'Virizion',
        'Volcanion',
        'Voltorb',
        'Xerneas',
        'Xurkitree',
        'Yveltal',
        'Zapdos',
        'Zekrom',
        'Zeraora',
        'Zygarde',
    ],
    axios = require('axios'),
    pokeApi = 'http://pokeapi.co/api/v2/pokemon/';

let idsByName = {},
    failedNames = [];

(async () => {
    for (var i = 0; i < genderlessNames.length; i++) {
        let name = genderlessNames[i].toLowerCase().replace(' ', '-').replace(':', '');

        await axios.get(pokeApi + name)
            .then((response) => {
                if (response.status !== 200) {
                    failedNames.push(name);
                    return;
                }

                idsByName[name] = response.data.id;
                return;
            })
            .catch((err) => {
                failedNames.push(name);
                return;
            });
    };

    console.log(idsByName);
    console.log(failedNames);

    process.exit();
})();
