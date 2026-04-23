let artistTracksData = [];
const getAverageColorArtist = (imgElement) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 1;
  canvas.height = 1;
  context.drawImage(imgElement, 0, 0, 1, 1);
  const data = context.getImageData(0, 0, 1, 1).data;
  return { r: data[0], g: data[1], b: data[2] };
};

async function loadArtistPage(artistId) {
  // Mostra solo questa sezione (nascondi le altre)
  const artistHTML = `<section id="artist-page" class="d-none">
            <div id="artist-hero" class="mb-4">
              <img
                id="artist-banner"
                src=""
                alt=""
                class="w-100"
                style="
                  height: 400px;
                  object-fit: cover;
                  object-position: center top;
                "
              />
              <div class="p-4 bg-dark">
                <span class="text-white small">
                  <i class="fas fa-check-circle text-primary me-1"></i>Artista
                  verificato
                </span>
                <h1 id="artist-name" class="text-white fw-bold display-3"></h1>
                <p id="artist-fans" class="text-white"></p>
              </div>
              <!-- Tasto Play + Following -->
              <div class="d-flex align-items-center gap-3 p-4">
                <button
                  id="play-btn" class="btn rounded-circle d-flex align-items-center justify-content-center p-3"
                  style="background-color: #1ed760; width: 56px; height: 56px"
                  onclick="playBtnPlayArtist()"
                >
                  <i class="fas fa-play text-black fs-5"></i>
                </button>
                <button class="btn btn-outline-light rounded-pill px-3">
                  Following
                </button>
                <i class="fas fa-ellipsis-h text-white fs-5"></i>
              </div>
            </div>

            <div class="container-fluid px-4">
              <div class="row">
                <!-- Colonna tracce popolari -->
                <div class="col-12 col-lg-7">
                  <h2 class="text-white mb-3">Popolari</h2>
                  <ul id="artist-tracks" class="list-unstyled"></ul>
                </div>

                <!-- Box brani che ti piacciono -->
                <div class="col-12 col-lg-5">
                  <h2 class="text-white mb-3">Brani che ti piacciono</h2>
                  <div class="d-flex align-items-center gap-3">
                    <div class="position-relative">
                      <img
                        id="artist-liked-img"
                        src=""
                        alt=""
                        class="rounded-circle"
                        style="width: 80px; height: 80px; object-fit: cover"
                      />
                    </div>
                    <div>
                      <p class="text-white fw-bold mb-0">
                        Hai messo Mi piace a brani
                      </p>
                      <p
                        class="text-secondary small mb-0"
                        id="artist-liked-name"
                      ></p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 class="text-white mt-4 mb-3">Discografia</h2>
              <div
                id="artist-albums"
                class="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-3"
              ></div>
            </div>
          </section>`;
  const main = document.getElementById("main");
  main.innerHTML = artistHTML;

  showSection("artist-page");

  const BASE = "https://striveschool-api.herokuapp.com/api/deezer";

  try {
    // Fetch parallele — come fare due richieste contemporaneamente
    const [artistRes, tracksRes] = await Promise.all([
      fetch(`${BASE}/artist/${artistId}`),
      fetch(`${BASE}/artist/${artistId}/top?limit=5`),
    ]);

    const artist = await artistRes.json();
    const tracksData = await tracksRes.json();

    // --- Header ---
    const artistBanner = document.getElementById("artist-banner");
    artistBanner.crossOrigin = "Anonymous"; // PRIMA di src!
    artistBanner.src = artist.picture_xl;
    artistBanner.alt = artist.name;
    document.getElementById("artist-name").textContent = artist.name;
    document.getElementById("artist-fans").textContent =
      `${artist.nb_fan.toLocaleString("it-IT")} ascoltatori mensili`;

    // --- Box brani che ti piacciono ---
    const artistLikedImg = document.getElementById("artist-liked-img");
    artistLikedImg.crossOrigin = "Anonymous";
    if (artist.picture_medium) {
      artistLikedImg.src = artist.picture_medium;
    }
    document.getElementById("artist-liked-name").textContent =
      `Di ${artist.name}`;

    // Gradient dinamico
    let avgColor = { r: 33, g: 37, b: 41 };
    artistBanner.onload = function () {
      console.log("ONLOAD TRIGGERED");
      avgColor = getAverageColorArtist(artistBanner);
      const darkColor = `rgb(33, 37, 41)`;
      document.getElementById("artist-page").style.background =
        `linear-gradient(to bottom, rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b}) 0%, ${darkColor} 28%)`;
    };

    // --- Top tracks ---
    const tracksList = document.getElementById("artist-tracks");
    tracksList.innerHTML = ""; // reset
    artistTracksData = tracksData.data;
    tracksData.data.forEach((track, index) => {
      tracksList.innerHTML += `
    <li class="d-flex align-items-center gap-3 mb-2 track-item"
        data-track-id="${track.id}"
        style="cursor: pointer;"
        onclick="playAudio(artistTracksData[${index}])">
      <span class="text-secondary" style="width: 20px">${index + 1}</span>
      <img src="${track.album.cover_small}" alt="" class="rounded" style="width:40px; height:40px;">
      <span class="text-white">${track.title}</span>
      <span class="text-secondary ms-auto">${formatDuration(track.duration)}</span>
    </li>`;
    });

    // --- Album dell'artista ---
    const albumsRes = await fetch(`${BASE}/artist/${artistId}/albums`);
    const albumsData = await albumsRes.json();

    const albumsContainer = document.getElementById("artist-albums");
    albumsContainer.innerHTML = "";

    albumsData.data.forEach((album) => {
      albumsContainer.innerHTML += `
      <div class="col">
        <div class="album-card" onclick="fetchAlbumData(${album.id})" style="cursor: pointer;">
          <img src="${album.cover_medium}" alt="${album.title}" class="w-100 rounded mb-2">
          <p class="text-white small mb-0">${album.title}</p>
          <p class="text-secondary small">${album.release_date?.slice(0, 4) ?? ""}</p>
        </div>
      </div>`;
    });
  } catch (err) {
    console.error("Errore nel caricamento artista:", err);
  }
}
// Nasconde tutte le sezioni e mostra solo quella richiesta
function showSection(sectionId) {
  document
    .querySelectorAll("#main section")
    .forEach((s) => s.classList.add("d-none"));
  document.getElementById(sectionId).classList.remove("d-none");
}

// Converte secondi in m:ss — come in Spotify
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const playArtistAudio = (track) => {
  const audio = new Audio(track.preview);
  audio.play();
};

// Es. click su un nome artista in homepage o album page
const params = new URLSearchParams(window.location.search);
if (params.get("artistId")) {
  loadArtistPage(params.get("artistId"));
}

const playBtnPlayArtist = () => {
  const randomize = document.getElementById("randomize");
  const songs = artistTracksData;
  let song = {};
  console.log(isPlaying);
  if (!isPlaying) {
    if (isShuffleActive) {
      if (playing.id) {
        playAudio(playing);
      } else {
        let i = Math.floor(Math.random() * 5);
        playAudio(songs[i]);
      }
    } else {
      playing.id ? playAudio(playing) : playAudio(songs[0]);
    }
  } else {
    pauseAudio();
  }
};
