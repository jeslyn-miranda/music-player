const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");
const volIcon = document.getElementById("vol-icon");
const playlistEl = document.getElementById("playlist");

const songs = [
  {
    title: "Like Jennie",
    artist: "JENNIE",
    src: "songs/song1.mp3",
    cover: "images/cover1.jpg",
  },
  {
    title: "Starboy",
    artist: "The Weeknd",
    src: "songs/song2.mp3",
    cover: "images/cover2.jpg",
  },
  {
    title: "JUMP",
    artist: "BlackPink",
    src: "songs/song3.mp3",
    cover: "images/cover3.jpg",
  },
];

let songIndex = 0;
let isPlaying = false;

function formatTime(sec) {
  if (isNaN(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function loadSong(index) {
  const s = songs[index];
  title.textContent = s.title;
  artist.textContent = s.artist;
  audio.src = s.src;
  cover.src = s.cover;
  updateActiveInPlaylist();
}

function playSong() {
  audio.play();
  playBtn.innerHTML = "❚❚";
  playBtn.setAttribute("aria-label", "Pause");
  cover.classList.add("spinning");
  isPlaying = true;
}

function pauseSong() {
  audio.pause();
  playBtn.innerHTML = "▶";
  playBtn.setAttribute("aria-label", "Play");
  cover.classList.remove("spinning");
  isPlaying = false;
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songIndex);
  playSong();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songIndex);
  playSong();
}

function buildPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((s, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="track-num">${String(i + 1).padStart(2, "0")}</span>${s.title} - ${s.artist}`;
    li.addEventListener("click", () => {
      songIndex = i;
      loadSong(songIndex);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function updateActiveInPlaylist() {
  [...playlistEl.children].forEach((li, i) => {
    li.classList.toggle("active", i === songIndex);
  });
}

function updateVolIcon(v) {
  if (v == 0) volIcon.textContent = "✕";
  else if (v < 0.5) volIcon.textContent = "♪";
  else volIcon.textContent = "♫";
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentEl.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
  progress.value = 0;
  currentEl.textContent = "0:00";
});

audio.addEventListener("ended", nextSong);

progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
  updateVolIcon(volume.value);
});

document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") {
    e.preventDefault();
    isPlaying ? pauseSong() : playSong();
  } else if (e.code === "ArrowRight") {
    nextSong();
  } else if (e.code === "ArrowLeft") {
    prevSong();
  }
});

buildPlaylist();
loadSong(songIndex);
audio.volume = volume.value;
updateVolIcon(volume.value);
