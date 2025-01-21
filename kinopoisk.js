(function () {
    console.log("Плагин перехода на КиноПоиск загружен");

    Lampa.Listener.follow('card', function (event) {
        if (event.type === 'start') {
            setTimeout(() => {
                console.log("Проверяем наличие рейтинга КиноПоиска...");
                let kinopoiskRating = document.querySelector('.info__rate .rate--kp');

                if (kinopoiskRating) {
                    console.log("Элемент рейтинга найден:", kinopoiskRating);

                    // Пробуем извлечь ID фильма
                    let movieId = Lampa.Activity.active().object.id;
                    console.log("ID фильма:", movieId);

                    if (movieId) {
                        let kinopoiskUrl = `https://www.kinopoisk.ru/film/${movieId}/`;
                        console.log("Формируем ссылку:", kinopoiskUrl);

                        // Добавляем действие при клике
                        kinopoiskRating.style.cursor = 'pointer';
                        kinopoiskRating.style.fontWeight = 'bold';
                        kinopoiskRating.style.color = 'orange';
                        kinopoiskRating.title = 'Перейти на КиноПоиск';

                        kinopoiskRating.onclick = () => {
                            console.log("Переходим по ссылке:", kinopoiskUrl);
                            window.open(kinopoiskUrl, '_blank');
                        };

                        console.log("Стили и событие добавлены к рейтингу КиноПоиска");
                    } else {
                        console.warn("ID фильма не найден, ссылка не добавлена");
                    }
                } else {
                    console.warn("Элемент рейтинга КиноПоиска не найден");
                }
            }, 500); // Ждём завершения загрузки карточки
        }
    });
})();