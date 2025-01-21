(function () {
    // Журнал для отладки
    console.log("Плагин 'Кнопка перехода на КиноПоиск' запущен");

    // Ожидание загрузки интерфейса
    Lampa.Listener.follow('card', function (event) {
        console.log("Открыта карточка фильма:", event);

        // Ищем элемент рейтинга от КиноПоиска
        var kpRating = document.querySelector('.info__rate span[data-type="kp"]');

        if (kpRating) {
            console.log("Рейтинг КиноПоиска найден:", kpRating);

            // Делаем рейтинг визуально отличимым
            kpRating.style.fontWeight = 'bold';
            kpRating.style.color = 'orange';
            kpRating.style.cursor = 'pointer';

            // Добавляем обработчик клика
            kpRating.addEventListener('click', function () {
                var kpId = kpRating.dataset.id; // Проверяем, есть ли ID фильма от КиноПоиска

                if (kpId) {
                    var kpLink = 'https://www.kinopoisk.ru/film/' + kpId;
                    console.log("Переход по ссылке:", kpLink);
                    window.open(kpLink, '_blank');
                } else {
                    console.log("ID фильма не найден");
                }
            });
        } else {
            console.log("Рейтинг КиноПоиска не найден в карточке фильма");
        }
    });
})();
