(function () {
    console.log("Плагин для кликабельного рейтинга КиноПоиск подключен");

    // Функция, которая добавляет стиль к рейтингу КиноПоиска
    function styleRating() {
        const kpRating = document.querySelector('.info__rate span[data-type="kp"]'); // Ищем элемент с рейтингом КиноПоиска

        if (kpRating) {
            // Убедимся, что элемент существует, и добавим стиль
            kpRating.style.fontWeight = 'bold';
            kpRating.style.color = 'orange';  // Оранжевый цвет
            kpRating.style.cursor = 'pointer';  // Курсор в виде руки, чтобы указать на кликабельность

            // Добавляем обработчик клика
            kpRating.addEventListener('click', function () {
                const kpId = kpRating.dataset.id || kpRating.closest('.card').dataset.id; // Получаем ID фильма из data-id

                if (kpId) {
                    // Формируем ссылку на КиноПоиск
                    const kpLink = `https://www.kinopoisk.ru/film/${kpId}/`;
                    window.open(kpLink, '_blank'); // Открываем ссылку в новой вкладке
                } else {
                    console.warn("ID фильма не найден, ссылка на КиноПоиск не была создана.");
                }
            });
        } else {
            console.warn("Рейтинг КиноПоиска не найден на карточке фильма");
        }
    }

    // Следим за событиями на карточке фильма
    Lampa.Listener.follow('card', function (event) {
        console.log("Карточка фильма открыта:", event);
        styleRating();  // Применяем стили к рейтингу
    });

    console.log("Плагин для рейтинга КиноПоиск работает");
})();
