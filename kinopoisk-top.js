(function () {
    'use strict';

    if(window.kinopoisk_ready) return;
    window.kinopoisk_ready = true;

    const network = new Lampa.Reguest();
    const api_url = 'https://your-kinopoisk-api.com/';

    function main(params, oncomplite, onerror) {
        const fakeData = {
            results: [
                {
                    title: "Топ 500 фильмов",
                    img: "https://example.com/movies.jpg",
                    hpu: "top500movies"
                },
                {
                    title: "Топ 500 сериалов",
                    img: "https://example.com/series.jpg",
                    hpu: "top500series"
                }
            ],
            total_pages: 1
        };

        fakeData.collection = true;
        oncomplite(fakeData);
    }

    function full(params, oncomplite, onerror) {
        const fakeCollection = {
            results: [
                {
                    title: "Интерстеллар",
                    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", // Постер
                    overview: "Фильм о путешествиях через червоточину в поисках нового дома для человечества.",
                    id: 157336, // ID фильма в TMDB
                    year: 2014,
                    genres: ["Фантастика", "Драма", "Приключения"],
                    rating: 8.6
                },
                ...Array(19).fill().map((_,i) => ({
                    title: `Элемент ${i + 1}`,
                    poster_path: `https://placehold.co/200x300?text=${params.url}+${i}`,
                    overview: "Пример описания",
                    id: i + 1,
                    year: 2000 + i,
                    genres: ["Жанр"],
                    rating: 7.0
                }))
            ],
            total_pages: 5
        };

        oncomplite(fakeCollection);
    }

    function clear() {
        network.clear();
    }

    const Api = { main, full, clear };

    // Компонент для главного меню
    function kinopoiskMainComponent(object) {
        const comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            Api.main(object, this.build.bind(this), this.empty.bind(this));
        };

        comp.nextPageReuest = function (object, resolve, reject) {
            Api.main(object, resolve.bind(comp), reject.bind(comp));
        };

        comp.cardRender = function (object, element, card) {
            card.onMenu = false;

            card.onEnter = function () {
                Lampa.Activity.push({
                    url: element.hpu,
                    title: element.title,
                    component: 'kinopoisk_collection',
                    page: 1
                });
            };
        };

        return comp;
    }

    // Компонент для коллекций
    function kinopoiskCollectionComponent(object) {
        const comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            Api.full(object, this.build.bind(this), this.empty.bind(this));
        };

        comp.nextPageReuest = function (object, resolve, reject) {
            Api.full(object, resolve.bind(comp), reject.bind(comp));
        };

        return comp;
    }

    // Инициализация плагина
    function initPlugin() {
        const manifest = {
            type: 'video',
            version: '1.0.0',
            name: 'Кинопоиск',
            description: 'Топ 500 фильмов и сериалов с Кинопоиска',
            component: 'kinopoisk_main'
        };

        Lampa.Component.add('kinopoisk_main', kinopoiskMainComponent);
        Lampa.Component.add('kinopoisk_collection', kinopoiskCollectionComponent);

        // Добавляем кнопку в меню
        function addMenuButton() {
            const button = $(`
                <li class="menu__item selector">
                    <div class="menu__ico">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 22h20L12 2z"/>
                        </svg>
                    </div>
                    <div class="menu__text">${manifest.name}</div>
                </li>
            `);

            button.on('hover:enter', () => {
                Lampa.Activity.push({
                    url: '',
                    title: manifest.name,
                    component: 'kinopoisk_main',
                    page: 1
                });
            });

            $('.menu .menu__list').eq(0).append(button);
        }

        if (window.appready) addMenuButton();
        else {
            Lampa.Listener.follow('app', (e) => {
                if (e.type === 'ready') addMenuButton();
            });
        }
    }

    // Запускаем плагин
    initPlugin();
})();
