(function () { 
    'use strict';

    if(window.kinopoisk_ready) return;
    window.kinopoisk_ready = true;

    const network = new Lampa.Reguest();
    const backend_url = 'https://kftop.free.nf/get_data.php';

    // MAIN MENU: fetch the data and build two collection items
    function main(params, oncomplite, onerror) {
        network.silent(backend_url, function(json) {
            // Expecting json.movies and json.series arrays from backend
            let movies = json.movies || [];
            let series = json.series || [];

            // Use first item poster as collection image if available, else fallback
            let movies_img = movies.length ? movies[0].poster_path : 'https://example.com/movies.jpg';
            let series_img = series.length ? series[0].poster_path : 'https://example.com/series.jpg';

            const data = {
                results: [
                    {
                        title: "Топ 500 фильмов",
                        img: movies_img,
                        hpu: "movies" // identifier for movies collection
                    },
                    {
                        title: "Топ 500 сериалов",
                        img: series_img,
                        hpu: "series" // identifier for series collection
                    }
                ],
                total_pages: 1,
                collection: true
            };
            oncomplite(data);
        }, function(e) {
            onerror(e);
        });
    }

    // COLLECTION: fetch full list details from backend based on selected collection
    function full(params, oncomplite, onerror) {
        network.silent(backend_url, function(json) {
            let collection = [];
            if(params.url === "movies" || params.url === "top500movies"){
                collection = json.movies || [];
            } else if(params.url === "series" || params.url === "top500series"){
                collection = json.series || [];
            }
            const data = {
                results: collection,
                total_pages: 1
            };
            oncomplite(data);
        }, function(e) {
            onerror(e);
        });
    }

    function clear() {
        network.clear();
    }

    const Api = { main, full, clear };

    // Main menu component for the plugin
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

    // Collection component for movies or series list
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

    // Plugin initialization and menu button registration
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

        // Add the plugin button to the menu
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

    initPlugin();
})();
