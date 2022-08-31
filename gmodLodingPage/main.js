function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language) {
    for (item of arguments) {
        let div = document.createElement('div')
        div.innerText = item
        document.body.append(div)
    }
}
function SetFilesTotal(total) {
    let div = document.createElement('div')
    div.innerText = total + " total files"
    document.body.append(div)
}
function SetFilesNeeded(needed) {
    let div = document.createElement('div')
    div.innerText = needed + " files need"
    document.body.append(div)
}
function DownloadingFile(fileName) {
    let div = document.createElement('div')
    div.innerText = fileName + " downloading"
    document.body.append(div)
}
function SetStatusChanged(status) {
    let div = document.createElement('div')
    div.innerText = status + " status"
    document.body.append(div)
}
window.onload = function () {
    let div = document.createElement('div')
    div.innerText = navigator.userAgent
    document.body.append(div)

}