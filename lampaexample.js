Lampa.Plugin.add('kinopoisk_category', {
    init: function() {
        console.log('Плагин "Кинопоиск" загружен!');

        // Ожидаем, пока приложение полностью загрузится
        Lampa.Listener.follow('app', function(e) {
            if (e.name === 'ready') {
                console.log('Приложение готово, добавляю категорию "Кинопоиск"...');

                // Создаем новую категорию
                Lampa.Sidebar.add({
                    name: 'kinopoisk', // Уникальное имя категории
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>', // Иконка (можно заменить на свою)
                    title: 'Кинопоиск', // Название категории
                    component: {
                        template: `
                            <div style="padding: 20px;">
                                <h1>Кинопоиск</h1>
                                <p>Здесь будет контент для Кинопоиска.</p>
                            </div>
                        `, // Шаблон для отображения контента
                    },
                });

                console.log('Категория "Кинопоиск" добавлена!');
            }
        });
    }
});
