const db = require('../firebase.js'),
    formatApiData = require('./formatApiData.js'),
    axios = require('axios'),
    baseUrl = 'http://pokeapi.co/api/v2/pokemon/',
    firebaseIndex = 'pokemon-v2',
    maxId = 802; // Update to 807 once sprites are added

let error = {
        hasOccurred: false,
        message: '',
        onId: 0,
    },
    id = 1;

(async () => {
    while (!error.hasOccurred && id <= maxId) {
        await axios.get(baseUrl + id)
            .then(async (resp) => {
                if (resp.status !== 200) {
                    throw new Error('API response status ' + resp.status);
                }

                pokemonData = await formatApiData(resp.data);

                if (pokemonData === null) {
                    error.hasOccurred = true;
                    error.message = 'Required fields missing',
                    error.onId = id;
                    return;
                }

                return db.ref(firebaseIndex + '/' + id).set(pokemonData, function (err) {
                    if (err) {
                        error.hasOccurred = true;
                        error.message = err;
                        error.onId = id;
                        return false;
                    }
                });
            })
            .catch((err) => {
                error.hasOccurred = true;
                error.message = err;
                error.onId = id;
                return false;
            });
        id++;
    }

    if (error.hasOccurred) {
        console.log(error.onId);
        console.log(error.message);
    }

    console.log('finished');
    process.exit();
})();
