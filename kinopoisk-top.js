(function() {
    'use strict';

    if(window.kinopoisk_top_ready) return;
    window.kinopoisk_top_ready = true;

    const CACHE_KEY = 'kinopoisk_cache';
    const API_TOKEN = '16TN8FF-YN5M1NN-HZNRG1F-HAX3JE2'; // ⚠️ Вынесите в отдельный файл!
    const network = new Lampa.Reguest();

    async function fetchData(url) {
        try {
            return await network.native(url, {
                headers: {
                    'X-API-KEY': API_TOKEN,
                    'Accept': 'application/json'
                }
            });
        } catch(e) {
            console.error('API Error:', e);
            return null;
        }
    }

    async function getTopData(type) {
        const today = new Date().toISOString().split('T')[0];
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');

        if(cache.date === today && cache[type]) {
            return cache[type];
        }

        let data = [];
        const urls = {
            movies: [
                'https://api.kinopoisk.dev/v1.4/movie?page=1&limit=250&sortField=rating.kp&sortType=-1&lists=top500',
                'https://api.kinopoisk.dev/v1.4/movie?page=2&limit=250&sortField=rating.kp&sortType=-1&lists=top500'
            ],
            series: [
                'https://api.kinopoisk.dev/v1.4/movie?page=1&limit=250&sortField=rating.kp&sortType=-1&lists=series-top250'
            ]
        };

        for(const url of urls[type]) {
            const response = await fetchData(url);
            if(response && response.docs) {
                data = data.concat(response.docs.map(item => ({
                    id: item.externalId?.tmdb || item.id,
                    title: item.name,
                    poster: item.poster?.url,
                    year: item.year,
                    rating: item.rating?.kp,
                    type: type === 'movies' ? 'movie' : 'tv'
                }));
            }
        }

        const newCache = {...cache, [type]: data, date: today};
        localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
        
        return data;
    }

    function createComponent(type) {
        return function(object) {
            const comp = new Lampa.InteractionCategory(object);

            comp.create = async function() {
                const data = await getTopData(type);
                this.build({
                    results: data.slice(0, 50),
                    total_pages: Math.ceil(data.length / 50)
                });
            };

            comp.nextPageReuest = function(params, resolve) {
                const offset = (params.page - 1) * 50;
                resolve({
                    results: this.data.results.slice(offset, offset + 50)
                });
            };

            comp.cardRender = function(item, element, card) {
                card.onMenu = false;
                card.onEnter = () => {
                    Lampa.Activity.push({
                        url: element.hpu,
                        title: element.title,
                        component: 'full',
                        movie: {
                            id: item.id,
                            type: item.type
                        }
                    });
                };
            };

            return comp;
        };
    }

    function initPlugin() {
        Lampa.Component.add('kinopoisk_movies', createComponent('movies'));
        Lampa.Component.add('kinopoisk_series', createComponent('series'));

        const menuHTML = `
            <li class="menu__item selector">
                <div class="menu__ico">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zm-6 14.25a.75.75 0 0 1-.75-.75V7.5a.75.75 0 0 1 1.5 0v9a.75.75 0 0 1-.75.75zm3-3a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 1.5 0v6a.75.75 0 0 1-.75.75zm-6 0a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 1.5 0v6a.75.75 0 0 1-.75.75z"/>
                    </svg>
                </div>
                <div class="menu__text">Кинопоиск ТОП</div>
            </li>
        `;

        Lampa.Listener.follow('app', e => {
            if(e.type === 'ready') {
                const $menu = $('.menu .menu__list').eq(0);
                const $button = $(menuHTML).on('hover:enter', () => {
                    Lampa.Activity.push({
                        component: 'kinopoisk_movies',
                        url: '',
                        title: 'Кинопоиск ТОП',
                        page: 1,
                        menu: [
                            {
                                title: 'Топ 500 фильмов',
                                component: 'kinopoisk_movies'
                            },
                            {
                                title: 'Топ 250 сериалов',
                                component: 'kinopoisk_series'
                            }
                        ]
                    });
                });
                $menu.append($button);
            }
        });
    }

    initPlugin();
})();
