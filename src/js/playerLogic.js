import { state, playListsState } from "./main.js";
import { saveState, getAllTracks, savePlayListsState } from "./localStorage.js"
import { getBlobFromIndexedDB } from "./dbIndex.js";

// Получаем элементы из DOM
const musicPlaying = document.getElementById("musicPlaying");
const playStopButton = document.getElementById("playStopBtn");
const playIcon = document.getElementById("playIcon");
const stopIcon = document.getElementById("stopIcon");
const playerProgress = document.querySelector(".player-progress");
const playerProgressFilled = document.querySelector(".player-progress-filled");
const currentTime = document.querySelector(".player-time-current");
const durationTime = document.querySelector(".player-time-duration");
const volumeInput = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const randomPlay = document.getElementById("randomPlay")
const repeatPlay = document.getElementById("repeatPlay")
const nextBtn = document.getElementById("nextBtn")
const prevBtn = document.getElementById("prevBtn")

//Форма и прилегающие
const playlistsList = document.getElementById("playlistsList")
const playerName = document.getElementById("playerName")
const modal = document.getElementById("modal")
const addPlaylist = document.getElementById("addPlaylist")
const choiceTrack = document.getElementById("choiceTrack")
const newBtn = document.getElementById("newBtn")
const closeBtn = document.getElementById("closeBtn")
const headerCloseBtn = document.getElementById("headerCloseBtn")
const newPlaylistName = document.getElementById("newPlaylistName")
const inputError = document.getElementById("inputError")

// Создаем аудио элемент
const audio = new Audio();

// Создаем аудиоанализатор
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 4096; // Размер FFT для анализа

// Привязываем аудиоанализатор к аудио элементу
const source = audioContext.createMediaElementSource(audio);

// Функция для обновления времени воспроизведения
const updateCurrentTime = () => {
    const currentTimeInSeconds = Math.floor(audio.currentTime);
    const minutes = Math.floor(currentTimeInSeconds / 60);
    const seconds = currentTimeInSeconds % 60;
    currentTime.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Функция для обновления длительности трека
const updateDuration = () => {
    const durationInSeconds = Math.floor(audio.duration);
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    durationTime.textContent = `${minutes}:${
        seconds < 10 ? "0" : ""
    }${seconds}`;
}

// Функция для воспроизведения или остановки трека
const togglePlayStop = () => {
    if (state.isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    state.isPlaying = !state.isPlaying;
    updatePlayStopButton();
}

// Функция для обновления иконки воспроизведения/паузы
const updatePlayStopButton = () => {
    if (state.isPlaying) {
        playIcon.classList.add("hidden");
        stopIcon.classList.remove("hidden");
    } else {
        playIcon.classList.remove("hidden");
        stopIcon.classList.add("hidden");
    }
}

const playNextTrack = () => {
    if(state.repeat == true){
        loadAndPlayTrack(state.currentTrackIndex);
        return
    }

    if(state.random == true){
        let randomIndex = Math.floor(Math.random() * state.playlist.length)
        state.currentTrackIndex = randomIndex
        loadAndPlayTrack(state.currentTrackIndex);
        return
    }

    if (state.currentTrackIndex < state.playlist.length - 1) {
        state.currentTrackIndex++; // Увеличиваем индекс на 1, если есть следующий трек
    } else {
        state.currentTrackIndex = 0; // Вернемся к началу плейлиста, если текущий трек последний
    }
    loadAndPlayTrack(state.currentTrackIndex); // Загружаем и воспроизводим следующий трек
}

const playPrevTrack = () => {
    if(state.repeat == true){
        loadAndPlayTrack(state.currentTrackIndex);
        return
    }

    if(state.random == true){
        let randomIndex = Math.floor(Math.random() * state.playlist.length)
        state.currentTrackIndex = randomIndex
        loadAndPlayTrack(state.currentTrackIndex);
        return
    }

    if (state.currentTrackIndex > 0) {
        state.currentTrackIndex--; // Увеличиваем индекс на 1, если есть следующий трек
    } else {
        state.currentTrackIndex = state.playlist.length - 1; // Вернемся к началу плейлиста, если текущий трек последний
    }

    loadAndPlayTrack(state.currentTrackIndex); // Загружаем и воспроизводим следующий трек
}

// Функция для обновления визуализации и заполнения полосы player-progress-filled
const updateVisualizationAndProgress = () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    playerProgressFilled.style.width = `${progress}%`;
}

// Функция для перемотки трека при клике на полосу player-progress
const seekTrack = (event) => {
    const progressBarRect = playerProgress.getBoundingClientRect();
    const clickX = event.clientX - progressBarRect.left;
    const progressBarWidth = progressBarRect.width;
    const seekPercentage = clickX / progressBarWidth;
    const seekTime = seekPercentage * audio.duration;
    audio.currentTime = seekTime;
    updateVisualizationAndProgress();
}

const onRandomPlay = () => {
    if(state.random == true){
        randomPlay.classList.remove("active")
        state.random = false
        return
    }

    state.random = true
    state.repeat = false

    randomPlay.classList.add("active")
    repeatPlay.classList.remove("active")
}

const onRepeatPlay = () =>{
    if(state.repeat == true){
        repeatPlay.classList.remove("active")
        state.repeat = false
        return
    }

    state.repeat = true
    state.random = false

    repeatPlay.classList.add("active")
    randomPlay.classList.remove("active")
}

const renderPlaylist = (namePlaylist) =>{
    playlist.innerHTML = ""

    let tracksInPlaylist = playListsState.get(namePlaylist)

    tracksInPlaylist.forEach((track, index) => {
        let listItem = document.createElement("li");

        index == state.currentTrackIndex && namePlaylist == state.playlistName ? listItem.classList = "playlist_list-item playing" : listItem.classList = "playlist_list-item"

        if(Array.isArray(track)){
            listItem.textContent = `${index + 1}. ${track[0]}`;
        }
        else{
            listItem.textContent = `${index + 1}. ${track.slice(0, -4)}`;
        }

        listItem.addEventListener("click", () => {
            state.playlistName = namePlaylist
            state.playlist = playListsState.get(namePlaylist)
            console.log(namePlaylist);
            togglePlayStop()
            audioContext.resume()
            loadAndPlayTrack(index);
        });
    
        playlist.appendChild(listItem);
    });
}

// Функция для загрузки и воспроизведения выбранного трека
const loadAndPlayTrack = (index) => {
    let itemArr = playlist.querySelectorAll(".playlist_list-item")
    let playlistName = document.querySelector(".playlist_item.playing")
    let name = playlistName.getAttribute("name")

    if(itemArr){
        for(let i = 0; i <= itemArr.length - 1; i++){
            let item = itemArr[i]
            i == index && name == state.playlistName ? item.classList.add("playing") : item.classList.remove("playing")
        }
    }

    state.currentTrackIndex = index;
    saveState(state)

    if(Array.isArray(state.playlist[index])){
        getBlobFromIndexedDB(state.playlist[index][0], function (blob) {
            if (blob) {
                const blobURL = URL.createObjectURL(blob)
                audio.src = blobURL
                musicPlaying.textContent = state.playlist[index][0]
                audio.load();
                audio.play();

                if (audioContext.state === "suspended") {
                    return;
                }

                state.isPlaying = true;
                updatePlayStopButton();
            } else {
              console.error('Blob not found in IndexedDB');
            }
          });
    }
    else{
        audio.src = `../audio/${state.playlist[index]}`;
        musicPlaying.textContent = state.playlist[index].slice(0, -4);
        audio.load();
        audio.play();
    }
    
    if (audioContext.state === "suspended") {
        return;
    }

    state.isPlaying = true;
    updatePlayStopButton();
}

//==============>Форма и прилегающие
const closeModal = () =>{
    newPlaylistName.value = ""
    modal.classList.toggle("hidden")
}

const openModal = () =>{
    if(modal.classList.contains("hidden")){
        renderChoiceTracks()
    }

    newPlaylistName.value = ""
    inputError.textContent = ""
    modal.classList.toggle("hidden")
}

const newPlaylist = () =>{
    let namePlaylist = newPlaylistName.value.trim()

    if(namePlaylist == ""){
        inputError.textContent = "Заполните поле"
        return
    }
    if(playListsState.has(namePlaylist)){
        inputError.textContent = "Плейлист существует"
        return
    }

    let playlistName = newPlaylistName.value.trim()
    let checkboxTracks = choiceTrack.querySelectorAll('[name*="choiceTrack"]')
    let allTracks = getAllTracks()
    let playlistTracks = []

    for(let i = 0; i <= allTracks.length - 1; i++){
        if(checkboxTracks[i].checked){
            playlistTracks.push(allTracks[i])
        }
    }

    if(playlistTracks.length == 0){
        inputError.textContent = "Выберите треки"
        return
    }

    inputError.textContent = ""
    playListsState.set(playlistName, playlistTracks)
    savePlayListsState(playListsState)

    renderPlaylistList()
    
    closeModal()
}

const renderChoiceTracks = () =>{
    choiceTrack.innerHTML = ""

    getAllTracks().forEach((track, index) => {
        let listItem = document.createElement("label");

        index == state.currentTrackIndex ? listItem.classList = "track_list-item" : listItem.classList = "track_list-item"

        if(track.length == 2){
            listItem.innerHTML = `<input type="checkbox" name="choiceTrack">${track[0]}`;
        }
        else{
            listItem.innerHTML = `<input type="checkbox" name="choiceTrack">${track.slice(0, -4)}`;
        }
    
        choiceTrack.appendChild(listItem);
    });
}

const renderPlaylistList = () =>{
    playlistsList.innerHTML = ""

    for(let [name, value] of playListsState.entries()){

        const playlistClick = () =>{
            let items = playlistsList.querySelectorAll("li")
    
            for(let i = 0; i <= items.length - 1; i++){
                items[i].getAttribute("name") == name ? items[i].classList = "playlist_item playing" : items[i].classList = "playlist_item"
            }
    
            playerName.textContent = name
            renderPlaylist(name)
        }

        let playlistItem = document.createElement("li")

        state.playlistName == name ? playlistItem.classList = "playlist_item playing" : playlistItem.classList = "playlist_item"
        playerName.textContent = state.playlistName
        playlistItem.setAttribute("name", name)

        let playlistNameTxt = document.createElement("span") 
        playlistNameTxt.classList = "playlist_name-txt"
        playlistNameTxt.textContent = name

        let deleteButton = document.createElement("button")
        deleteButton.textContent = "x"
        deleteButton.classList = "delete_button"

        deleteButton.addEventListener("click", (e) =>{
            playlistItem.removeEventListener("click", playlistClick)

            let elem = e.target
            let parent = elem.parentNode
            let namePlaylist = parent.getAttribute("name")
            parent.parentNode.removeChild(parent)

            state.currentTrackIndex = findCorrectIndex(state.playlist[state.currentTrackIndex])
            playListsState.delete(namePlaylist)
            savePlayListsState(playListsState)
            state.playlistName = "All Music"
            state.playlist = playListsState.get("All Music")
            playerName.textContent = "All Music"
            saveState(state)
            renderPlaylist("All Music")
            renderPlaylistList()
        })

        playlistItem.append(playlistNameTxt)

        if(name !== "All Music"){
            playlistItem.append(deleteButton)
        }

        playlistItem.addEventListener('click', playlistClick)

        playlistsList.append(playlistItem)
    }
}

const findCorrectIndex = (trackName) =>{
    let name = trackName
    if(Array.isArray(trackName)){
        name = trackName[0]
    }

    let allMusic = getAllTracks()

    for(let i = 0; i <= allMusic.length - 1; i++){
        if(Array.isArray(allMusic[i])){
            if(allMusic[i][0] == name){
                return i
            }
        }
        if(allMusic[i] == name){
            return i
        }
    }
}

repeatPlay.addEventListener("click", onRepeatPlay)
randomPlay.addEventListener("click", onRandomPlay)
nextBtn.addEventListener("click", playNextTrack)
prevBtn.addEventListener("click", playPrevTrack)

audio.addEventListener("timeupdate", () => {
    updateCurrentTime();
    updateVisualizationAndProgress();
});

audio.addEventListener("durationchange", updateDuration);

audio.addEventListener('ended', () =>{
    if(!state.isSeeking){
        playNextTrack()
    }
    return
})

playStopButton.addEventListener("click", togglePlayStop);

volumeInput.addEventListener("input", () => {
    audio.volume = volumeInput.value;
});

// Обработчик для перемотки трека при клике на полосу player-progress
playerProgress.addEventListener("mousedown", (event) => {
    if (state.isPlaying == true) {
        playIcon.classList.remove("hidden");
        stopIcon.classList.add("hidden");
        audio.pause();
    }

    state.isSeeking = true;
    seekTrack(event);
});

// Обработчик для перемещения ползунка в реальном времени при удерживании кнопки мыши
window.addEventListener("mousemove", (event) => {
    if (state.isSeeking) {
        seekTrack(event);
    }
});

// Обработчик для завершения перемотки трека при отпускании кнопки мыши
window.addEventListener("mouseup", () => {
    if (state.isPlaying == true) {
        updatePlayStopButton()
        state.isSeeking = false;
        audio.play();
    }

    state.isSeeking = false;
});

addPlaylist.addEventListener("click", openModal)
headerCloseBtn.addEventListener("click", closeModal)
closeBtn.addEventListener("click", closeModal)
newBtn.addEventListener("click", newPlaylist)

export { source, audioContext, analyser, renderPlaylist, loadAndPlayTrack, renderPlaylistList }