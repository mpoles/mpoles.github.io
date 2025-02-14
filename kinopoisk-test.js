(function() {
    'use strict';

    console.log('[Kinopoisk Test] Starting...');

    const API_TOKEN = '16TN8FF-YN5M1NN-HZNRG1F-HAX3JE2'; // Замените на ваш токен
    const API_URL = 'https://api.kinopoisk.dev/v1.4/movie?page=1&limit=10&sortField=rating.kp&sortType=-1&lists=top500';

    const network = new Lampa.Reguest();

fetch(API_URL, {
    method: 'GET',
    headers: {
        'X-API-KEY': API_TOKEN,
        'Content-Type': 'application/json',
    },
})
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
})();
