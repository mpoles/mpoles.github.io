Lampa.Plugin.add('my_plugin', {
    init: function() {
        console.log('Мой плагин загружен!');

        // Пример добавления новой кнопки в интерфейс
        Lampa.Listener.follow('app', function(e) {
            if (e.name === 'ready') {
                let myButton = document.createElement('div');
                myButton.innerHTML = 'Моя кнопка';
                myButton.style.position = 'fixed';
                myButton.style.bottom = '20px';
                myButton.style.right = '20px';
                myButton.style.padding = '10px';
                myButton.style.backgroundColor = 'blue';
                myButton.style.color = 'white';
                myButton.style.cursor = 'pointer';
                myButton.style.zIndex = 1000;

                myButton.addEventListener('click', function() {
                    alert('Кнопка нажата!');
                });

                document.body.appendChild(myButton);
            }
        });
    }
});
