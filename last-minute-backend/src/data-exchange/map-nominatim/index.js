const axios = require('axios');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let lastGeocodePromise = Promise.resolve();

module.exports = {
    geocodeAddress : async (address) => {
        const currentWait = lastGeocodePromise;
        lastGeocodePromise = currentWait.then(() => delay(1000)).catch(() => delay(1000));
        await currentWait;

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=ro&limit=1`;

        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'LastMinute/1.0' } // this header is necessary in order to avoid 403 code responses from Nominatim API
            });
            const results = response.data;

            if (results && results.length > 0) {
                const lat = parseFloat(results[0].lat);
                const lon = parseFloat(results[0].lon);

                return {lat, lon};
            } else {
                const notFoundError = new Error(`Adresa nu a fost găsită: ${address}`);
                notFoundError.status = 404;
                throw notFoundError;
            }
        } catch (error){
            if (!error.status) {
                console.error('Eroare la apelul HTTP către Nominatim pentru:', address, error.message);
                error.status = 502; // Bad Gateway
            }

            throw error;
        }
    }
}


            