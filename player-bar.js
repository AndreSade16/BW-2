// per API album
const album = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const albumId = 13475611;
const albumURL = album + albumId;

// VARIABILI GLOBALI PER LISTA ALBUM ED INDICE CANZONE CORRENTE

let currentPlaylist = [];
let currentIndex = 0;

fetch(albumURL)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    currentPlaylist = data.tracks.data;
  });

// recupero la barra da index.html
const playerBarLeft = document.getElementById("player-bar-left");
const playerBarCenter = document.getElementById("player-bar-center");
const playerBarRight = document.getElementById("player-bar-right");

// sinistra della barra
playerBarLeft.innerHTML = `
  <div class="d-flex align-items-center gap-3 px-3 py-2 ">

    <img 
      src="https://picsum.photos/60" 
      alt="cover" 
      class="player-cover rounded"
    />
    <div class= "d-flex align-items-center gap-2 flex-grow-1"> 


    <div class="d-flex flex-column text-start">
      <span class="player-title fw-semibold small">Nome brano</span>
      <span class="player-artist text-secondary small" >Artista</span>
    </div>
    </div>

    <i id="like-btn" class="bi bi-heart text-secondary player-icon"
    data-bs-toggle="tooltip"
    data-bs-placement="top"
    title="Aggiungi ai tuoi brani"></i>

        <i id="remove-btn" class="bi bi-x-lg text-secondary player-icon opacity-75"></i>

  </div>
`;

// cuoricino che aggiunge ai preferiti e diventa verde

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]',
);

tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));

const likeBtn = document.getElementById("like-btn");
likeBtn.addEventListener("click", () => {
  likeBtn.classList.toggle("liked");

  if (likeBtn.classList.contains("liked")) {
    likeBtn.classList.remove("bi-heart");
    likeBtn.classList.add("bi-heart-fill");
    likeBtn.classList.remove("text-secondary");
    likeBtn.setAttribute("title", "Rimuovi dai tuoi brani");
  } else {
    likeBtn.classList.remove("bi-heart-fill");
    likeBtn.classList.add("bi-heart");
    likeBtn.classList.add("text-secondary");
    likeBtn.setAttribute("title", "Aggiungi ai tuoi brani");
  }
});

// bottone che rimuove canzone in play e parte la successiva

const removeBtn = document.getElementById("remove-btn");

removeBtn.addEventListener("click", () => {
  if (!currentPlaylist.length) return;

  currentIndex++;

  if (currentIndex >= currentPlaylist.length) {
    currentIndex = 0;
  }

  const nextSong = currentPlaylist[currentIndex];

  playAudio(nextSong);
});
// centro della barra
playerBarCenter.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center w-100">
    <div class="d-flex align-items-center gap-4 mb-2">
      <i id="shuffle-btn" class="bi bi-shuffle text-secondary player-icon"></i>
      <i id="prev-btn" class="bi bi-skip-start-fill text-secondary player-icon"></i>

      <button id="player-main-button" class="player-main-btn d-flex justify-content-center align-items-center rounded-circle">
        <i id="player-main-icon" class="bi bi-play-fill"></i>
      </button>

      <i id="next-btn" class="bi bi-skip-end-fill text-secondary player-icon"></i>
      <i id="repeat-btn" class="bi bi-repeat text-secondary player-icon"></i>
    </div>

    <div class="d-flex align-items-center gap-2 w-100">
      <small id="player-current-time" class="text-secondary small">0:00</small>

      <div id="player-progress" class="player-progress flex-grow-1 rounded-pill">
        <div id="player-progress-fill" class="player-progress-fill rounded-pill"></div>
      </div>

      <small id="player-total-time" class="text-secondary small">0:00</small>
    </div>
  </div>
`;
// SUCC E PREC CANZONE

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

prevBtn.addEventListener("click", () => {
  backAudio();
});

nextBtn.addEventListener("click", () => {
  skipAudio();
});

// SHUFFLE

const shuffleBtn = document.getElementById("shuffle-btn");

shuffleBtn.addEventListener("click", () => {
  shuffleBtn.classList.toggle("active");

  if (shuffleBtn.classList.contains("active")) {
    shuffleBtn.classList.remove("text-secondary");
    shuffleBtn.style.color = "#1ed760";
  } else {
    shuffleBtn.style.color = "";
    shuffleBtn.classList.add("text-secondary");
  }
});

// RIPETIZIONE

const repeatBtn = document.getElementById("repeat-btn");

repeatBtn.addEventListener("click", () => {
  repeatBtn.classList.toggle("active");

  if (repeatBtn.classList.contains("active")) {
    repeatBtn.classList.remove("text-secondary");
    repeatBtn.style.color = "#1ed760";
  } else {
    repeatBtn.style.color = "";
    repeatBtn.classList.add("text-secondary");
  }
});

// BARRA MUSICA

audio.addEventListener("timeupdate", () => {
  const currentTime = document.getElementById("player-current-time");
  const progressFill = document.getElementById("player-progress-fill");
  if (!currentTime || !progressFill || !audio.duration) return;
  currentTime.textContent = formatTime(audio.currentTime);
  const progressPercent = ()
});

// destra della barra
playerBarRight.innerHTML = `
  <div class="d-flex align-items-center justify-content-end gap-3">
    <i class="bi bi-mic player-icon"></i>
    <i class="bi bi-list player-icon"></i>
    <i class="bi bi-speaker player-icon"></i>
    <i class="bi bi-volume-up player-icon"></i>

    <div class="player-volume" style="width: 90px;">
      <div class="player-volume-fill"></div>
    </div>
  </div>
`;

// Funzione per collegare alle canzoni degli album

const updateBottomBar = (song) => {
  const cover = document.querySelector(".player-cover");
  const title = document.querySelector(".player-title");
  const artist = document.querySelector(".player-artist");

  cover.src = song.album.cover_small;
  cover.alt = song.title;

  title.textContent = song.title;
  artist.textContent = song.artist.name;
};

// Funzione per cambiare icona

const updatePlayerMainIcon = () => {
  const playerMainIcon = document.getElementById("player-main-icon");

  if (!playerMainIcon) return;
  if (isPlaying) {
    playerMainIcon.className = "bi bi-pause-fill";
  } else {
    playerMainIcon.className = "bi bi-play-fill";
  }
};

// Collego bottone alla barra

const playerMainButton = document.getElementById("player-main-button");

playerMainButton.addEventListener("click", () => {
  if (!playing.id) return;
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio(playing);
  }

  updatePlayerMainIcon();
});
