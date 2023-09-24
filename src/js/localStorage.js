const saveState = (state) =>{
    let stateObj = JSON.stringify(state)
    stateObj = JSON.parse(stateObj)
    stateObj.isPlaying = false
    stateObj.isSeeking = false
    stateObj.random = false
    stateObj.repeat = false

    localStorage.setItem("state", JSON.stringify(stateObj))
}

const getState = () =>{
    return JSON.parse(localStorage.getItem("state"))
}

const getAllTracks = () =>{
    let obj = getPlayListsState()
    return obj.get("All Music")
}

const savePlayListsState = (map) =>{
    let obj = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("playListsState", obj)
}

const getPlayListsState = () =>{
    let obj = localStorage.getItem("playListsState")
    return new Map(JSON.parse(obj))
}

export { saveState, getState, getAllTracks, savePlayListsState, getPlayListsState }