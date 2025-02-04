let currentSong = new Audio();
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs() {
    let response = await fetch("/songs/");
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text; // corrected here.
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}
const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track + ".mp3";
    if (!pause) {
        currentSong.play();
        play.src = "images/pause.svg";
    } else {
        play.src = "images/play.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}
async function main() {
    //Get list of the songs
    let songs = await getsongs();
    console.log(songs[0]);
    playMusic(songs[0].replace(".mp3", ""), true);
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    //Show all the songs in the playlist
    for (const song of songs) {
        let decodedsong = decodeURI(song);
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="images/music.svg" alt="">
                            <div class="info">
                                <div> ${decodedsong.replace(".mp3", "")}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="images/play.svg" alt="">
                            </div> </li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.svg";

        }
        else {
            currentSong.pause();
            play.src = "images/play.svg";
        }
    });
    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100+"%";
        currentSong.currentTime=(e.offsetX/e.target.getBoundingClientRect().width)*currentSong.duration;
    })
    

    document.querySelector(".hamburger").addEventListener("click",e=>{
        document.querySelector(".left").style.left="0";
    })

    document.querySelector(".close").addEventListener("click",e=>{
        document.querySelector(".left").style.left="-120%";
    })

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1].replace(".mp3",""))
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1].replace(".mp3",""))
        }
    })
}
main();
