// per API album
const album = "https://striveschool-api.herokuapp.com/api/deezer/album/";

fetch(album);
fetch(albumURL)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });

// recupero la barra da index.html
const playerBarLeft = document.getElementById("player-bar-left");
//aggiungo alla barra elementi HTML
playerBarLeft.innerHTML = `
  <div class="d-flex align-items-center gap-3">
<img 
      src="https://picsum.photos/60" 
      alt="cover" 
      class="player-cover"
    />

    <div class="d-flex flex-column">
      <span class="player-title">Nome brano</span>
      <span class="player-artist">Artista</span>
    </div>

    <i class="bi bi-heart player-icon ms-2"></i>

  </div>
`;

// playing.preview
