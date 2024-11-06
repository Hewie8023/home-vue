import http from './http.js';
export const baseUrl = 'http://localhost:8080'
// export const baseUrl = 'http://192.168.3.234:8080'

export const SUCCESS_CODE = 20000



export const startTask = () => {
    return http.requestGet(baseUrl + '/start/task')
}

export const stopTask = () => {
    return http.requestGet(baseUrl + '/stop/task')
}

export const addMusic = (music) => {
    return http.requestPost(baseUrl + '/music', music)
}

export const modifyMusic = (music) => {
    return http.requestPut(baseUrl + '/music', music)
}

export const getMusicList = (page, size, name) => {
    return http.requestGet(baseUrl + '/musics/' + page + '/' + size + '?name=' + name)
}

export const getMusicCover = (id) => {
    return http.requestGet(baseUrl + '/music/' + id + '/cover')
}

export const getPhotos = (page, size) => {
    console.log(baseUrl + '/photos/' + page + '/' + size)
    return http.requestGet(baseUrl + '/photos/' + page + '/' + size)
}

export const deleteMusic = (id) => {
    return http.requestDelete(baseUrl + '/music/' + id)
}

export const addPhoto = (photo) => {
    return http.requestPost(baseUrl + '/photo', photo)
}

export const getPhotoList = (page, size) => {
    return http.requestGet(baseUrl + '/photolist/' + page + '/' + size)
}

export const deletePhoto = (id) => {
    return http.requestDelete(baseUrl + '/photo/' + id)
}

export const getRandomMusic = () => {
    return http.requestGet(baseUrl + '/music/random')
}

export const getLocalMusic = (id) => {
    return http.requestGet(baseUrl + '/music/local?id=' + id)
}


