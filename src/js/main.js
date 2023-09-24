import { visualizeWave } from "./visualize.js";
import { getState, saveState, getPlayListsState, savePlayListsState, getAllTracks } from "./localStorage.js";
import { saveBlobToIndexedDB } from "./dbIndex.js";
import { renderPlaylist, loadAndPlayTrack, renderPlaylistList } from "./playerLogic.js";

const fileInput = document.getElementById('fileInput');

let state = {
    currentTrackIndex: 0,
    isPlaying: false,
    isSeeking: false,
    random: false,
    repeat: false,
    playlist: [],
    playlistName: "All Music"
};

//Инициализируем плейлисты
let playListsState = new Map()

playListsState.set("All Music", 
[
    "Xxxtentacion Joey Bada — infinity888.mp3",
    "Linkin Park — Burn It Down.mp3",
    "Rucci — THAT'S NORF, PT. 2 (feat. Foe & Bueno Da Champ).mp3",
    "Madcon — Beggin.mp3",
    "Kiss — I Was Made For Lovin You.mp3",
    "DJ JACOB — Midnight Club.mp3",
    "SAY3AM — JUDAS.mp3",
    "Eddie Murphy — Part All The Time.mp3",
    "Logic feat. Wiz Khalifa — Indica Badu.mp3",
    "Travis Scott feat. Drake — MELTDOWN.mp3",
])

if(localStorage.getItem("state") !== null){
    state = getState()
}

if(localStorage.getItem("playListsState") !== null){
    playListsState = getPlayListsState()
    state.playlist = playListsState.get(state.playlistName)
}
else{
    state.playlist = playListsState.get("All Music")
    savePlayListsState(playListsState)
}

//Обработка загрузки аудио
fileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        const blob = new Blob([selectedFile], { type: selectedFile.type });
        const blobURL = URL.createObjectURL(blob);

        saveBlobToIndexedDB(selectedFile.name.slice(0, -4), blob);

        let arrAllTracks = getAllTracks()
        arrAllTracks.push([selectedFile.name.slice(0, -4), blobURL])
        playListsState.set("All Music", arrAllTracks)

        if(state.playlistName == "All Music"){
            state.playlist = arrAllTracks
        }

        saveState(state)
        savePlayListsState(playListsState)

        renderPlaylist(state.playlistName)
    }
});

renderPlaylist(state.playlistName)
renderPlaylistList()

loadAndPlayTrack(state.currentTrackIndex)

// Начинаем визуализацию
visualizeWave();

export { state, playListsState }