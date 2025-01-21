(function () {
	'use strict';

	function rating_kp_imdb(card) {
		var network = new Lampa.Reguest();
		var clean_title = kpCleanTitle(card.title);
		var search_date = card.release_date || card.first_air_date || card.last_air_date || '0000';
		var search_year = parseInt((search_date + '').slice(0, 4));
		var orig = card.original_title || card.original_name;
		var kp_prox = '';
		var params = {
			id: card.id,
			url: kp_prox + 'https://kinopoiskapiunofficial.tech/',
			rating_url: kp_prox + 'https://rating.kinopoisk.ru/',
			headers: {
				'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616'
			},
			cache_time: 60 * 60 * 24 * 1000 //86400000 сек = 1 день Время кэша в секундах
		};
		getRating();

		function getRating() {
			var movieRating = _getCache(params.id);
			if (movieRating) {
				return _showRating(movieRating[params.id]);
			} else {
				searchFilm();
			}
		}

		function searchFilm() {
			var url = params.url;
			var url_by_title = Lampa.Utils.addUrlComponent(url + 'api/v2.1/films/search-by-keyword', 'keyword=' + encodeURIComponent(clean_title));
			if (card.imdb_id) url = Lampa.Utils.addUrlComponent(url + 'api/v2.2/films', 'imdbId=' + encodeURIComponent(card.imdb_id));
			else url = url_by_title;
			network.clear();
			network.timeout(15000);
			network.silent(url, function (json) {
				if (json.items && json.items.length) chooseFilm(json.items);
				else if (json.films && json.films.length) chooseFilm(json.films);
				else if (url !== url_by_title) {
					network.clear();
					network.timeout(15000);
					network.silent(url_by_title, function (json) {
						if (json.items && json.items.length) chooseFilm(json.items);
						else if (json.films && json.films.length) chooseFilm(json.films);
						else chooseFilm([]);
					}, function (a, c) {
						showError(network.errorDecode(a, c));
					}, false, {
						headers: params.headers
					});
				} else chooseFilm([]);
			}, function (a, c) {
				showError(network.errorDecode(a, c));
			}, false, {
				headers: params.headers
			});
		}

		function chooseFilm(items) {
			if (items && items.length) {
				var is_sure = false;
				var is_imdb = false;
				items.forEach(function (c) {
					var year = c.start_date || c.year || '0000';
					c.tmp_year = parseInt((year + '').slice(0, 4));
				});
				if (card.imdb_id) {
					var tmp = items.filter(function (elem) {
						return (elem.imdb_id || elem.imdbId) == card.imdb_id;
					});
					if (tmp.length) {
						items = tmp;
						is_sure = true;
						is_imdb = true;
					}
				}
				var cards = items;
				if (cards.length) {
					if (orig) {
						var _tmp = cards.filter(function (elem) {
							return containsTitle(elem.orig_title || elem.nameOriginal, orig) || containsTitle(elem.en_title || elem.nameEn, orig) || containsTitle(elem.title || elem.ru_title || elem.nameRu, orig);
						});
						if (_tmp.length) {
							cards = _tmp;
							is_sure = true;
						}
					}
					if (card.title) {
						var _tmp2 = cards.filter(function (elem) {
							return containsTitle(elem.title || elem.ru_title || elem.nameRu, card.title) || containsTitle(elem.en_title || elem.nameEn, card.title) || containsTitle(elem.orig_title || elem.nameOriginal, card.title);
						});
						if (_tmp2.length) {
							cards = _tmp2;
							is_sure = true;
						}
					}
					if (cards.length > 1 && search_year) {
						var _tmp3 = cards.filter(function (c) {
							return c.tmp_year == search_year;
						});
						if (!_tmp3.length) _tmp3 = cards.filter(function (c) {
							return c.tmp_year && c.tmp_year > search_year - 2 && c.tmp_year < search_year + 2;
						});
						if (_tmp3.length) cards = _tmp3;
					}
				}
				if (cards.length == 1 && is_sure && !is_imdb) {
					if (search_year && cards[0].tmp_year) {
						is_sure = cards[0].tmp_year > search_year - 2 && cards[0].tmp_year < search_year + 2;
					}
					if (is_sure) {
						is_sure = false;
						if (orig) {
							is_sure |= equalTitle(cards[0].orig_title || cards[0].nameOriginal, orig) || equalTitle(cards[0].en_title || cards[0].nameEn, orig) || equalTitle(cards[0].title || cards[0].ru_title || cards[0].nameRu, orig);
						}
						if (card.title) {
							is_sure |= equalTitle(cards[0].title || cards[0].ru_title || cards[0].nameRu, card.title) || equalTitle(cards[0].en_title || cards[0].nameEn, card.title) || equalTitle(cards[0].orig_title || cards[0].nameOriginal, card.title);
						}
					}
				}
				if (cards.length == 1 && is_sure) {
					var id = cards[0].kp_id || cards[0].kinopoisk_id || cards[0].kinopoiskId || cards[0].filmId;
					var base_search = function base_search() {
						network.clear();
						network.timeout(15000);
						network.silent(params.url + 'api/v2.2/films/' + id, function (data) {
							var movieRating = _setCache(params.id, {
								kp: data.ratingKinopoisk,
								imdb: data.ratingImdb,
								timestamp: new Date().getTime()
							}); // Кешируем данные
							return _showRating(movieRating);
						}, function (a, c) {
							showError(network.errorDecode(a, c));
						}, false, {
							headers: params.headers
						});
					};
					network.clear();
					network.timeout(5000);
					network["native"](params.rating_url + id + '.xml', function (str) {
						if (str.indexOf('<rating>') >= 0) {
							try {
								var ratingKinopoisk = 0;
								var ratingImdb = 0;
								var xml = $($.parseXML(str));
								var kp_rating = xml.find('kp_rating');
								if (kp_rating.length) {
									ratingKinopoisk = parseFloat(kp_rating.text());
								}
								var imdb_rating = xml.find('imdb_rating');
								if (imdb_rating.length) {
									ratingImdb = parseFloat(imdb_rating.text());
								}
								var movieRating = _setCache(params.id, {
									kp: ratingKinopoisk,
									imdb: ratingImdb,
									timestamp: new Date().getTime()
								}); // Кешируем данные
								return _showRating(movieRating);
							} catch (ex) {
							}
						}
						base_search();
					}, function (a, c) {
						base_search();
					}, false, {
						dataType: 'text'
					});
				} else {
					var movieRating = _setCache(params.id, {
						kp: 0,
						imdb: 0,
						timestamp: new Date().getTime()
					}); // Кешируем данные
					return _showRating(movieRating);
				}
			} else {
				var _movieRating = _setCache(params.id, {
					kp: 0,
					imdb: 0,
					timestamp: new Date().getTime()
				}); // Кешируем данные
				return _showRating(_movieRating);
			}
}
        function containsTitle(str, query) {
			return str && query && str.toLowerCase().indexOf(query.toLowerCase()) > -1;
		}

		function equalTitle(str, query) {
			return str && query && str.toLowerCase() === query.toLowerCase();
		}

		function _showRating(rating) {
			if (rating.kp && rating.imdb) {
				$('#movie-rating')
					.append('<div class="ratings"><span class="kp-rating">' + rating.kp.toFixed(1) + '</span>/<span class="imdb-rating">' + rating.imdb.toFixed(1) + '</span></div>');
			} else {
				$('#movie-rating')
					.append('<div class="ratings"><span class="no-rating">No Ratings</span></div>');
			}
		}

		function _getCache(id) {
			var cache = Lampa.Cache.get('ratings') || {};
			return cache[id] || null;
		}

		function _setCache(id, rating) {
			var cache = Lampa.Cache.get('ratings') || {};
			cache[id] = rating;
			Lampa.Cache.set('ratings', cache);
			return rating;
		}

		function showError(message) {
			Lampa.Noty.show(message, 'error');
		}

		function kpCleanTitle(title) {
			return title.trim().replace(/\s+/g, ' ').toLowerCase();
		}
	})();
