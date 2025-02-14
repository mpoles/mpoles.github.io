(function() {
    'use strict';

    console.log('[Kinopoisk Test] Starting...');

    const API_TOKEN = '16TN8FF-YN5M1NN-HZNRG1F-HAX3JE2'; // Замените на ваш токен
    const API_URL = 'https://api.kinopoisk.dev/v1.4/movie?page=1&limit=10&sortField=rating.kp&sortType=-1&lists=top500';

    const network = new Lampa.Reguest();

    async function fetchData() {
        try {
            console.log('[Kinopoisk Test] Fetching data from:', API_URL);
            
            const response = await network.native(API_URL, {
                headers: {
                    'X-API-KEY': API_TOKEN,
                    'Accept': 'application/json'
                }
            });

            console.log('[Kinopoisk Test] API Response:', response);
        } catch (error) {
            console.error('[Kinopoisk Test] Error:', error);
        }
    }

    fetchData();
})();
