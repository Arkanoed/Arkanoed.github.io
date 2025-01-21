(function () {
    console.log("Плагин 'Кнопка перехода на КиноПоиск' запущен");

    // Слушатель события открытия карточки фильма
    Lampa.Listener.follow('card', function (event) {
        console.log("Карточка фильма открыта:", event);

        // Проверяем, есть ли информация о рейтингах
        var kpRating = document.querySelector('.info__rate span[data-type="kp"]');
        if (kpRating) {
            console.log("Рейтинг КиноПоиска найден:", kpRating.textContent);

            // Устанавливаем стиль для визуального выделения
            kpRating.style.fontWeight = 'bold';
            kpRating.style.color = 'orange';
            kpRating.style.cursor = 'pointer';

            // Добавляем обработчик клика
            kpRating.addEventListener('click', function () {
                // Попробуем получить ID фильма или ссылку
                var kpId = kpRating.dataset.id || kpRating.parentElement.dataset.id;

                if (kpId) {
                    var kpLink = 'https://www.kinopoisk.ru/film/' + kpId;
                    console.log("Переход по ссылке:", kpLink);
                    window.open(kpLink, '_blank');
                } else {
                    console.warn("ID фильма не найден, ссылка не создана");
                }
            });
        } else {
            console.warn("Рейтинг КиноПоиска не найден в карточке фильма");
        }
    });

    console.log("Слушатель события для карточки установлен");
})();