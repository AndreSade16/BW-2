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
// FUNZIONE PER BARRA MUSICA
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
};
// centro della barra
playerBarCenter.innerHTML = `
  <div class="d-flex flex-column align-items-center justify-content-center w-100">
    <div class="d-flex align-items-center gap-4 mb-2">
      <i id="shuffle-btn" class="bi bi-shuffle text-secondary player-icon fs-4"></i>
      <i id="prev-btn" class="bi bi-skip-start-fill text-secondary player-icon fs-4"></i>

      <button id="player-main-button" class="player-main-btn d-flex justify-content-center align-items-center rounded-circle bg-white text-black border-0 fs-2" style="width: 45px; height: 45px">
        <i id="player-main-icon" class="bi bi-play-fill"></i>
      </button>

      <i id="next-btn" class="bi bi-skip-end-fill text-secondary player-icon fs-4"></i>
      <i id="repeat-btn" class="bi bi-repeat text-secondary player-icon fs-4"></i>
    </div>

    <div class="d-flex align-items-center gap-2 w-100">
      <small id="player-current-time" class="text-secondary small">0:00</small>

   <div class="progress flex-grow-1 player-progress" id="player-progress" style="height: 6px;">
  <div
    id="player-progress-fill"
    class="progress-bar player-progress-fill"
    role="progressbar"
    style="width: 0%;"
    aria-valuenow="0"
    aria-valuemin="0"
    aria-valuemax="100"
  ></div>
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

  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${progressPercent}%`;
  progressFill.setAttribute("aria-valuenow", Math.floor(progressPercent));

  if (progressPercent < 1) {
    progressFill.classList.add("knob-hidden");
  } else {
    progressFill.classList.remove("knob-hidden");
  }
});

const playerProgress = document.getElementById("player-progress");

playerProgress.addEventListener("click", (e) => {
  if (!audio.duration) return;

  const rect = playerProgress.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;

  const percent = clickX / width;

  audio.currentTime = percent * audio.duration;
});

// destra della barra
playerBarRight.innerHTML = `
  <div class="d-flex align-items-center justify-content-end gap-3 pe-3 w-100">
    <i id="mic-btn" class="bi bi-mic text-secondary player-icon"></i>
    <i id="queue-btn" class="bi bi-list text-secondary player-icon"></i>
    <i id="device-btn" class="bi bi-speaker text-secondary player-icon"></i>
    <i id="volume-btn" class="bi bi-volume-up text-secondary player-icon"></i>

    <div
      id="player-volume"
      class="progress flex-grow-0 player-volume"
      style="width: 90px; height: 6px;"
    >
      <div
        id="player-volume-fill"
        class="progress-bar player-volume-fill"
        role="progressbar"
        style="width: 100%; transition: none"
        aria-valuenow="100"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  </div>
`;

// VOLUME DESTRA DELLA BARRA

const playerVolume = document.getElementById("player-volume");
const playerVolumeFill = document.getElementById("player-volume-fill");
const volumeBtn = document.getElementById("volume-btn");

playerVolume.addEventListener("click", (e) => {
  const rect = playerVolume.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;

  const percent = clickX / width;
  audio.volume = percent;

  const volumePercent = percent * 100;
  playerVolumeFill.style.width = `${volumePercent}%`;
  playerVolumeFill.setAttribute("aria-valuenow", Math.floor(volumePercent));

  if (audio.volume === 0) {
    volumeBtn.className = "bi bi-volume-mute text-secondary player-icon";
  } else if (audio.volume < 0.5) {
    volumeBtn.className = "bi bi-volume-down text-secondary player-icon";
  } else {
    volumeBtn.className = "bi bi-volume-up text-secondary player-icon";
  }
  audio.volume = 1;
});

// MUTO SUL VOLUME

let lastVolume = 1;

volumeBtn.addEventListener("click", () => {
  if (audio.volume > 0) {
    lastVolume = audio.volume;
    audio.volume = 0;
    playerVolumeFill.style.width = "0%";
    playerVolumeFill.setAttribute("aria-valuenow", 0);
    volumeBtn.className = "bi bi-volume-mute text-secondary player-icon";
  } else {
    audio.volume = lastVolume;
    const volumePercent = lastVolume * 100;
    playerVolumeFill.style.width = `${volumePercent}%`;
    playerVolumeFill.setAttribute("aria-valuenow", Math.floor(volumePercent));

    if (audio.volume < 0.5) {
      volumeBtn.className = "bi bi-volume-down text-secondary player-icon";
    } else {
      volumeBtn.className = "bi bi-volume-up text-secondary player-icon";
    }
  }
});

// Funzione per collegare alle canzoni degli album

const updateBottomBar = (song) => {
  const cover = document.querySelector(".player-cover");
  const title = document.querySelector(".player-title");
  const artist = document.querySelector(".player-artist");

  cover.src = song.album.cover_small;
  cover.setAttribute("type", "button");
  artist.setAttribute("type", "button");
  cover.addEventListener("click", () => fetchAlbumData(song.album.id));
  artist.addEventListener("click", () => loadArtistPage(song.artist.id));
  cover.alt = song.title;

  title.textContent = song.title;
  artist.textContent = song.artist.name;

  // per barra musica - deve durare per tutta la canzone

  const totalTime = document.getElementById("player-total-time");
  const currentTime = document.getElementById("player-current-time");
  const progressFill = document.getElementById("player-progress-fill");

  totalTime.textContent = formatTime(song.duration);
  currentTime.textContent = "0:00";
  progressFill.style.width = "0%";
  progressFill.setAttribute("aria-valuenow", 0);
  progressFill.classList.add("knob-hidden");
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

// PLAYER MOBILE

// PER AGGIORNARE IN BASE AL BRANO SCELTO

const updateMobileBottomBar = (song) => {
  const cover = document.getElementById("mobile-player-cover");
  const title = document.getElementById("mobile-player-title");
  const artist = document.getElementById("mobile-player-artist");

  if (!cover || !title || !artist) return;
  cover.crossOrigin = "Anonymous";
  cover.src = song.album.cover_small;
  cover.alt = song.title;
  title.textContent = song.title;
  artist.textContent = song.artist.name;
  cover.setAttribute("type", "button");
  artist.setAttribute("type", "button");
  cover.addEventListener("click", () => fetchAlbumData(song.album.id));
  artist.addEventListener("click", () => loadArtistPage(song.artist.id));

  //CAMBIA COLORE IN BASE AL BRANO

  const mobilePlayerInner = document.querySelector(".mobile-player-inner");
  cover.onload = () => {
    const avgColor = getAverageColor(cover);
    if (mobilePlayerInner) {
      mobilePlayerInner.style.backgroundColor = `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`;
    }
  };
};

// CLICCARE PLAY
const mobilePlayerMainButton = document.getElementById(
  "mobile-player-main-button",
);

if (mobilePlayerMainButton) {
  mobilePlayerMainButton.addEventListener("click", () => {
    console.log("hai schiacciato");
    if (!playing.id && artistTracksData) {
      playAudio(artistTracksData[0]);
      return;
    }

    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio(playing);
    }

    updatePlayerMainIcon();
    updateMobilePlayerIcon();
  });
}

// AGGIORNARE ICONA PLAY/PAUSE

const updateMobilePlayerIcon = () => {
  const icon = document.getElementById("mobile-player-main-icon");
  if (!icon) return;

  icon.className = isPlaying ? "bi bi-pause-fill fs-2" : "bi bi-play-fill fs-2";
};

//BACK
