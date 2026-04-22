// per API album
const album = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const albumId = 13475611;
const albumURL = album + albumId;

fetch(albumURL)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });

// recupero la barra da index.html
const playerBarLeft = document.getElementById("player-bar-left");
const playerBarCenter = document.getElementById("player-bar-center");
const playerBarRight = document.getElementById("player-bar-right");

// sinistra della barra
playerBarLeft.innerHTML = `
  <div class="d-flex align-items-center gap-3">
    <img 
      src="https://picsum.photos/60" 
      alt="cover" 
      class="player-cover"
    />

    <div class="d-flex flex-column text-start">
      <span class="player-title">Nome brano</span>
      <span class="player-artist">Artista</span>
    </div>

    <i class="bi bi-heart player-icon ms-2"></i>
  </div>
`;

// centro della barra
playerBarCenter.innerHTML = `
  <div class="d-flex flex-column align-items-center justify-content-center w-100">
    <div class="d-flex align-items-center gap-4 mb-2">
      <i class="bi bi-shuffle player-icon"></i>
      <i class="bi bi-skip-start-fill player-icon"></i>

      <button id="player-main-button" class="player-main-btn">
        <i id="player-main-icon" class="bi bi-play-fill"></i>
      </button>

      <i class="bi bi-skip-end-fill player-icon"></i>
      <i class="bi bi-repeat player-icon"></i>
    </div>

    <div class="d-flex align-items-center gap-2 w-100">
      <small id="player-current-time" class="text-secondary">0:00</small>
      <div class="player-progress flex-grow-1">
        <div id="player-progress-fill" class="player-progress-fill"></div>
      </div>
      <small id="player-total-time" class="text-secondary">0:00</small>
    </div>
  </div>
`;

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
