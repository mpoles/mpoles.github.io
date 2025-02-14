(function() {
    'use strict';

    if(window.kinopoisk_top_ready) return;
    window.kinopoisk_top_ready = true;

    const CACHE_URL = 'https://raw.githubusercontent.com/mpoles/kinopoisk-cache/main/data.json';
    let cacheData = null;

    async function loadData(type) {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            if(!cacheData || cacheData.date !== today) {
                const response = await fetch(`${CACHE_URL}?t=${Date.now()}`);
                cacheData = await response.json();
            }

            return cacheData[type] || [];
        } catch(e) {
            console.error('Cache load error:', e);
            return [];
        }
    }

    function createComponent(type, title) {
        return function(object) {
            const comp = new Lampa.InteractionCategory(object);

            comp.create = async function() {
                const data = await loadData(type);
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
                        url: '',
                        title: item.title,
                        component: 'full',
                        movie: {
                            id: item.tmdb_id,
                            type: item.type
                        }
                    });
                };
            };

            return comp;
        };
    }

    function initPlugin() {
        Lampa.Component.add('kinopoisk_movies', createComponent('movies', 'Фильмы'));
        Lampa.Component.add('kinopoisk_series', createComponent('series', 'Сериалы'));

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
