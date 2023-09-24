# Музыкальный плеер с визуализацией

Необходимо разработать музыкальный плеер для воспроизведения аудиофайлов с возможностью визуализации звуковых волн в реальном времени.

Требования:
  1. Аудиофайлы должны быть предварительно загружены в папку «audio» в корне проекта.
  2. Поддерживаемые форматы: MP3 или WAV. Создайте минимум 5 демонстрационных аудиофайлов.
  3. Интерфейс плеера. Необходимы следующие возмножости:
      - воспроизведение / пауза
      - перемотка трека (ползунок перемещения по временной шкале)
      - регулировка громкости
      - отображение текущего времени трека и общей длительности
      - плейлист с возможностью выбора трека для воспроизведения
  4. Визуализация звуковых волн аудиофайла в реальном времени при воспроизведении. Волны должны отображаться под плеером и реагировать на действия пользователя (воспроизведение, пауза, перемотка).
  5. Хранение плейлиста: используйте localStorage.

Дополнительно (не обязательно, но будет плюсом):
  1. Возможность добавления своих аудиофайлов через интерфейс плеера.
  2. Создание и сохранение собственных плейлистов.
  3. Режим случайного воспроизведения и повторения трека.

Технические требования:
  - JavaScript (ES6+)
  - HTML5 и CSS3
  - Библиотеки для визуализации (например, wavesurfer.js)

# Реализация:
  - Загруженные мелодии хранятся в IndexedDB
  - Состояние плеера и плейлисты хранятся в LocalStorage
  - Визуализация Web Audio API

Реализовано всё: <a href="">Посмотреть результат</a>
