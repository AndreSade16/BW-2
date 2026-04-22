const albumApiLink = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const main = document.getElementById("main");
const albumProva = document.getElementById("album-prova");

albumProva.addEventListener("click", () => {
  main.innerHTML = `

  <div id="album-page-body" class="bg-dark text-light container-fluid p-0">
    <div
      id="topbar"
      class="d-flex justify-content-between align-items-center position-sticky top-0 start-0 end-0 z-1 px-3 pt-2 pb-2 px-lg-5 py-lg-2"
    >
      <div id="forward-backwards-btn-group">
        <span class="fa-stack fs-5 d-none d-lg-inline-block" type="button">
          <i class="fas fa-circle fa-stack-2x text-dark"></i>
          <i class="fas fa-chevron-left fa-stack-1x text-white"></i>
        </span>
        <span class="fa-stack fs-5 d-none d-lg-inline-block" type="button">
          <i class="fas fa-circle fa-stack-2x text-dark"></i>
          <i class="fas fa-chevron-right fa-stack-1x text-white"></i>
        </span>
        <a href="#"
          ><i
            class="fas fa-arrow-left fs-2 text-light d-lg-none"
            type="button"
          ></i
        ></a>
      </div>
      <p
        id="topbar-title"
        class="fw-bold text-center d-none d-lg-none m-0 position-absolute start-50 translate-middle-x"
      ></p>
      <div id="user-dropdown" class="dropdown d-none d-lg-block">
        <a
          class="btn btn-secondary dropdown-toggle bg-black d-flex align-items-center gap-2 p-0 pe-2 border-0 rounded-4"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="./assets/imgs/main/image-1.jpg"
            alt="user-pic"
            style="width: 2rem"
            class="rounded-circle"
          />
          Username...
        </a>

        <ul class="dropdown-menu dropdown-menu-end bg-dark">
          <li><a class="dropdown-item text-light" href="#">Action</a></li>
          <li>
            <a class="dropdown-item text-light" href="#">Another action</a>
          </li>
          <li>
            <a class="dropdown-item text-light" href="#">Something else here</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col mx-lg-4 px-3">
          <div
            id="hero"
            class="position-relative d-flex flex-column flex-lg-row align-items-center justify-content-center"
          >
            <div
              id="spinner"
              class="spinner-border"
              role="status"
              style="width: 320px; height: 320px"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <img
              id="album-cover"
              src=""
              alt="album-cover"
              class="mt-lg-3 me-lg-3 shadow-lg"
              style="width: 75%; max-width: 320px"
            />
            <div
              id="hero-text"
              class="align-self-start align-self-lg-center mt-4 flex-lg-grow-1"
            >
              <h5
                id="hero-record-type"
                class="d-none d-lg-inline-block text-uppercase"
              >
                ALBUM
              </h5>
              <h2 id="album-title" class="h2 mb-lg-5 placeholder-glow">
                <span class="placeholder col-6" style="width: 8rem"></span>
                <span class="placeholder col-6" style="width: 5rem"></span>
                <span class="placeholder col-6" style="width: 6rem"></span>
              </h2>
              <div
                id="infos"
                class="mt-3 d-lg-flex align-items-center gap-3 gap-lg-1"
              >
                <div
                  id="artist-info"
                  class="d-flex align-items-center mb-1 mb-lg-0"
                >
                  <img
                    id="artist-pic"
                    src="./assets/imgs/main/image-19.jpg"
                    alt=""
                    class="rounded-circle me-2"
                    style="width: 2rem"
                  />
                  <h4
                    id="artist-name"
                    class="d-flex align-items-center m-0 ms-1 ms-lg-0 fs-6 placeholder-glow"
                  >
                    <span class="placeholder col-6" style="width: 6rem"></span>
                  </h4>
                </div>
                <div
                  id="album-info"
                  class="d-flex justify-content-start gap-1 text-secondary mt-2 mt-lg-0"
                >
                  <p
                    id="record-type"
                    class="m-lg-0 mb-0 d-lg-none text-capitalize fw-semibold placeholder-glow"
                  >
                    <span class="placeholder col-6" style="width: 4rem"></span>
                  </p>
                  <p class="m-lg-0 mb-0 fw-semibold">•</p>
                  <p
                    id="hero-album-year"
                    class="m-lg-0 mb-0 fw-semibold placeholder-glow"
                  >
                    <span class="placeholder col-6" style="width: 4rem"></span>
                  </p>
                  <p class="m-lg-0 mb-0 d-none d-lg-block fw-semibold">•</p>
                  <p
                    id="hero-tracks-num"
                    class="m-lg-0 mb-0 d-none d-lg-block fw-semibold placeholder-glow"
                  >
                    <span class="placeholder col-6" style="width: 3rem"></span>
                  </p>
                  <p
                    id="hero-length"
                    class="m-lg-0 mb-0 d-none d-lg-block fw-semibold placeholder-glow"
                  >
                    <span class="placeholder col-6"></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- FUNCTIONALITY BAR -->
          <div
            id="functionality-wrapper"
            class="d-flex w-100 justify-content-between justify-content-lg-end mb-3 mt-0 pt-lg-5 pb-lg-3 flex-lg-row-reverse"
          >
            <div
              id="functionality-left"
              class="d-flex justify-content-start gap-4 gap-sm-5"
            >
              <i
                class="far fa-heart d-flex justify-content-center align-items-center fs-2"
                style="width: 2rem"
                type="button"
                onclick="fillHearth(event)"
              ></i>
              <i
                class="fas fa-arrow-circle-down d-flex justify-content-center align-items-center fs-2"
                type="button"
                style="width: 2rem"
                onclick="skipAudio()"
              ></i>
              <i
                class="fas fa-ellipsis-v d-flex justify-content-center align-items-center fs-2"
                style="width: 2rem"
                type="button"
                onclick="backAudio()"
              ></i>
            </div>
            <div
              id="functionality-right"
              class="d-flex justify-content-end gap-4 gap-sm-5"
            >
              <i
                id="randomize"
                class="fas fa-random d-flex justify-content-center align-items-center fs-2 d-lg-none"
                style="width: 2rem; color: white"
                type="button"
                onclick="randomizePlayer(event)"
              ></i>
              <div
                id="play-btn"
                type="button"
                class="p-4 d-flex justify-content-center align-items-center rounded-circle fs-2 me-lg-5"
                style="background-color: #1ed760"
                onclick="playBtnPlay()"
              >
                <i class="fas fa-play text-black"></i>
              </div>
            </div>
          </div>
          <!-- TRACKS SECTION -->
          <section id="tracks-section" class="mt-4">
            <div id="tracks-space" class="container-fluid">
              <div
                class="row d-none d-lg-flex border-bottom border-1 text-secondary justify-content-between"
              >
                <div class="col-1">
                  <p class="text-end fw-semibold">#</p>
                </div>
                <div class="col-5 p-0">
                  <p class="fw-semibold">TITOLO</p>
                </div>
                <div class="col-2">
                  <p class="fw-semibold text-end">RIPRODUZIONI</p>
                </div>
                <div class="col-2 text-end">
                  <i class="far fa-clock fw-semibold"></i>
                </div>
              </div>
              <div id="spinner-tracks" class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </section>
          <div id="lenght-info" class="d-flex gap-1 mt-3 d-lg-none">
            <p id="tracks-qty-mobile" class="placeholder-glow">
              <span class="placeholder col-6" style="width: 5rem"></span>
            </p>
            <p class="dot">•</p>
            <p id="album-length-mins-mobile" class="placeholder-glow">
              <span class="placeholder col-6" style="width: 4rem"></span>
            </p>
          </div>
          <div
            id="publishing-info"
            class="d-flex flex-column flex-lg-row gap-1 gap-lg-3 my-4"
          >
            <p id="copyright" class="m-0 placeholder-glow">
              © <span class="placeholder col-3"></span>
            </p>
            <p id="phonogram" class="m-0 placeholder-glow">
              ℗ <span class="placeholder col-3"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="offcanvas offcanvas-bottom rounded-top-4"
      tabindex="-1"
      id="offcanvasBottom"
      aria-labelledby="offcanvasBottomLabel"
      style="height: auto"
    >
      <div
        id="offcanvas-body"
        class="offcanvas-body bg-dark rounded-top-3 p-0 pb-2"
      >
        <div
          id="offcanvas-header"
          class="d-flex gap-3 align-items-center border-bottom border-1 border-secondary p-3"
        >
          <img
            id="offcanvas-album-cover"
            src=""
            alt="album-cover"
            style="width: 3rem; height: 3rem; object-fit: cover"
            class="rounded"
          />
          <div class="d-flex flex-column justify-content-center">
            <p
              class="text-light m-0 fw-semibold"
              style="font-size: 0.8rem"
              id="offcanvasBottomLabel"
            ></p>
            <div class="d-flex text-secondary gap-1" style="font-size: 0.8rem">
              <p id="offcanvas-artist-name" class="m-0 fw-semibold"></p>
              <p class="m-0 fw-semibold">•</p>
              <p id="offcanvas-album-name" class="m-0 fw-semibold"></p>
            </div>
          </div>
        </div>
        <div
          id="offcanvas-main"
          class="m-0 d-flex flex-column gap-4 align-items-start pt-3 ps-3"
        >
          <div
            class="d-flex justify-content-start gap-3 text-light align-items-center"
          >
            <i class="fas fa-share-alt text-center" style="width: 1.5rem"></i>
            <p class="fs-6 d-flex align-items-center m-0 fw-normal">
              Condividi
            </p>
          </div>
          <div
            class="d-flex justify-content-start gap-3 text-light align-items-center"
          >
            <img
              src="https://misc.scdn.co/liked-songs/liked-songs-640.jpg"
              alt="favorites-img"
              style="width: 1.5rem"
            />
            <p class="fs-6 d-flex align-items-center m-0 fw-normal">
              Aggiungi a brani che ti piacciono
            </p>
          </div>
          <div
            class="d-flex justify-content-start gap-3 text-light align-items-center"
          >
            <i class="fas fa-plus-circle text-center" style="width: 1.5rem"></i>
            <p class="fs-6 d-flex align-items-center m-0 fw-normal">
              Aggiungi alla playlist
            </p>
          </div>
          <div
            class="d-flex justify-content-start gap-3 text-light align-items-center"
          >
            <i class="fas fa-times text-center" style="width: 1.5rem"></i>
            <p class="fs-6 d-flex align-items-center m-0 fw-normal">
              Nascondi questo album
            </p>
          </div>
          <div
            class="d-flex justify-content-start gap-3 text-light align-items-center"
          >
            <i class="far fa-gem text-center" style="width: 1.5rem"></i>
            <p class="fs-6 d-flex align-items-center m-0 fw-normal">
              Ascolta la musica senza pubblicità
            </p>
          </div>
          <div
            class="d-flex justify-content-start gap-3 text-light align-items-center"
          >
            <i class="fas fa-stream text-center" style="width: 1.5rem"></i>
            <p class="fs-6 d-flex align-items-center m-0 fw-normal">
              Aggiungi in coda
            </p>
          </div>
          <div
            class="d-flex justify-content-start gap-3 text-light align-items-center"
          >
            <i class="fas fa-tasks text-center" style="width: 1.5rem"></i>
            <p class="fs-6 d-flex align-items-center m-0 fw-normal">
              Vai alla coda
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

    `;
  displayAlbumData(albumData);
});
const audio = new Audio();
let isPlaying = false;
let playing = {};

let albumData = {};
const fetchAlbumData = (id) => {
  fetch(albumApiLink + id)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Failed to parse data");
      }
    })
    .then((data) => {
      albumData = data;
    })
    .catch((err) => {
      console.log("Failed to fetch data", err);
    });
};

const displayOffcanvasData = (title, artistName, albumTitle, albumCover) => {
  const offCanvasBottomLabel = document.getElementById("offcanvasBottomLabel");
  const offCanvasArtistName = document.getElementById("offcanvas-artist-name");
  const offCanvasAlbumName = document.getElementById("offcanvas-album-name");
  const offCanvasAlbumCover = document.getElementById("offcanvas-album-cover");
  offCanvasBottomLabel.innerText = title;
  offCanvasArtistName.innerText = artistName;
  offCanvasAlbumName.innerText = albumTitle;
  offCanvasAlbumCover.setAttribute("src", albumCover);
};

// FUNCTION TO GET THE AVERAGE COLOR FROM AN IMAGE
const getAverageColor = (imgElement) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 1;
  canvas.height = 1;

  context.drawImage(imgElement, 0, 0, 1, 1);

  const data = context.getImageData(0, 0, 1, 1).data;

  return {
    r: data[0],
    g: data[1],
    b: data[2],
  };
};

const displayAlbumData = (data) => {
  const {
    cover_big,
    title,
    release_date,
    record_type,
    nb_tracks,
    duration,
    label,
  } = data;
  const { name, picture } = data.artist;
  const albumBody = document.getElementById("album-page-body");
  const hero = document.getElementById("hero");
  const topbar = document.getElementById("topbar");
  const albumCover = document.getElementById("album-cover");
  const albumTitle = document.getElementById("album-title");
  const artistPic = document.getElementById("artist-pic");
  const recordType = document.getElementById("record-type");
  const heroRecordType = document.getElementById("hero-record-type");
  const artistName = document.getElementById("artist-name");
  const heroAlbumYear = document.getElementById("hero-album-year");
  const heroTracksNum = document.getElementById("hero-tracks-num");
  const heroLength = document.getElementById("hero-length");
  const tracksQty = document.getElementById("tracks-qty-mobile");
  const albumLengthMobile = document.getElementById("album-length-mins-mobile");
  const copyright = document.getElementById("copyright");
  const phonogram = document.getElementById("phonogram");
  const tracksSpace = document.getElementById("tracks-space");
  const topbarTitle = document.getElementById("topbar-title");
  const tracks = data.tracks.data;
  albumCover.setAttribute("src", cover_big);
  albumCover.crossOrigin = "Anonymous";
  // LOGICA COLORI COVERS E PLACEHOLDERS ONLOAD
  let avgColor = { r: 33, g: 37, b: 41 };
  albumCover.onload = function () {
    const spinner = document.getElementById("spinner");
    const spinnerTracks = document.getElementById("spinner-tracks");
    spinner.classList.add("d-none");
    spinnerTracks.classList.add("d-none");
    avgColor = getAverageColor(albumCover);
    albumBody.style.background = `linear-gradient(
    to bottom,
    rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b}) 0%,
    #212529 28%
  )`;
  };
  window.addEventListener("scroll", () => {
    const coverBottom = albumCover.getBoundingClientRect().bottom;

    if (window.scrollY > 5) {
      topbarTitle.classList.remove("d-none");
    } else {
      topbar.style.top = `-${topbar.offsetHeight}px`;
      topbarTitle.classList.add("d-none");
    }

    if (coverBottom <= 90) {
      topbar.style.backgroundColor = `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 1)`;
      topbarTitle.style.opacity = 1;
    } else {
      topbar.style.backgroundColor = `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 0)`;
      topbarTitle.style.opacity = 0;
    }
  });
  // FINE LOGICA COLORI COVERS E PLACEHOLDERS ONLOAD
  topbarTitle.innerText = title;
  artistPic.setAttribute("src", picture);
  artistName.innerText = name;
  albumTitle.innerText = title;
  recordType.innerText = record_type;
  heroRecordType.innerText = record_type;
  heroAlbumYear.innerText = release_date.slice(0, 4);
  heroTracksNum.innerText = `${nb_tracks} ${nb_tracks > 1 ? "brani," : "brano,"}`;
  heroLength.innerText = `${Math.floor(duration / 60)} min ${duration % 60 !== 0 ? (duration % 60) + "sec." : "."}`;
  tracksQty.innerText = `${nb_tracks} ${nb_tracks > 1 ? "brani" : "brano"}`;
  albumLengthMobile.innerText = `${Math.floor(duration / 60)} min ${duration % 60 !== 0 ? (duration % 60) + "sec" : ""}`;
  copyright.innerText = `© ${label}`;
  phonogram.innerText = `℗ ${label}`;
  tracks.forEach((track, i) => {
    const {
      id,
      title,
      title_short,
      link,
      duration,
      preview,
      rank,
      artist,
      explicit_lyrics,
      album,
    } = track;
    tracksSpace.innerHTML += `
            <div class="row mt-3 justify-content-between">
                <div class="col-1 d-flex align-items-center justify-content-end text-secondary fw-semibold d-none d-lg-inline-block">
                  <p class="m-0 text-end">${i}</p>
                </div>
                <div id="${id}" class="col-11 col-lg-5 p-0" type="button" onclick="playAudio(albumData.tracks.data[${i}])">
                  <p class="m-0 fw-semibold">${title}</p>
                  <p class="m-0 text-secondary fw-semibold">${explicit_lyrics ? "<span style='font-size: 0.8rem' class='text-black bg-secondary fw-semibold px-1 border border-1 border-black rounded-1'>E</span> " : ""}${artist.name}</p>
                </div>
                <div class="col-2 d-none d-lg-inline-block text-end">
                  <p class="m-0 text-secondary fw-semibold">${rank}</p>
                </div>
                <div class="col-2 text-end d-none d-lg-inline-block">
                  <p class="m-0 text-secondary fw-semibold">${Math.floor(duration / 60)}:${duration % 60 > 9 ? duration % 60 : "0" + (duration % 60)}</p>
                </div>
                    <i class="fas fa-ellipsis-v col-1 d-lg-none text-secondary align-self-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" data-title="${title}" data-artist="${artist.name}" 
                    data-album="${album?.title ?? ""}" data-cover="${album?.cover_small ?? ""}"></i>
                </div>
    `;
    document.addEventListener("click", (e) => {
      const icon = e.target.closest("#tracks-space .fa-ellipsis-v");
      if (!icon) return;
      const { title, artist, album, cover } = icon.dataset;
      displayOffcanvasData(title, artist, album, cover);
    });
  });
};

const fillHearth = (e) => {
  const target = e.target;
  if (target.classList.contains("far")) {
    target.classList.remove("far");
    target.classList.add("fas");
  } else {
    target.classList.remove("fas");
    target.classList.add("far");
  }
};

const randomizePlayer = (e) => {
  if (e.target.style.color === "white") {
    e.target.style.color = "#1ed760";
    e.target.classList.toggle("active");
  } else {
    e.target.style.color = "white";
    e.target.classList.toggle("active");
  }
};

const playAudio = (song) => {
  //aggiungo funzione per bottomBAR - MARTINA
  updateBottomBar(song);
  const playBtn = document.getElementById("play-btn");
  playBtn.innerHTML = `<i class="fas fa-pause text-black"></i>`;

  if (playing.id === song.id && audio.currentTime) {
    audio.play();
    isPlaying = true;
    return;
  }

  // resetta il colore della traccia precedente
  if (playing.id) {
    const prevTrack = document.getElementById(playing.id);
    if (prevTrack) {
      prevTrack.style.color = "";
    }
  }

  playing = song;

  // colora la traccia corrente
  const currentTrack = document.getElementById(song.id);
  if (currentTrack) {
    currentTrack.style.color = "#1ed760";
  }

  audio.src = song.preview;
  audio.play();
  isPlaying = true;

  // aggiorno bottone BUTTOM BAR - MARTINA

  updatePlayerMainIcon();
};

const pauseAudio = () => {
  const playBtn = document.getElementById("play-btn");
  playBtn.innerHTML = `<i class="fas fa-play text-black"></i>`;
  audio.pause();
  isPlaying = false;

  // aggiorno bottone BUTTOM BAR - MARTINA

  updatePlayerMainIcon();
};

const skipAudio = () => {
  const songs = albumData.tracks.data;
  const randomize = document.getElementById("randomize");
  const nb_tracks = songs.length;

  if (randomize.classList.contains("active")) {
    let i = Math.floor(Math.random() * nb_tracks);
    playAudio(songs[i]);
  } else {
    const currentIndex = songs.findIndex((s) => s.id === playing.id);
    const nextIndex = currentIndex + 1 < nb_tracks ? currentIndex + 1 : 0;
    playAudio(songs[nextIndex]);
  }
};

const backAudio = () => {
  const songs = albumData.tracks.data;
  const randomize = document.getElementById("randomize");
  audio.pause();
  isPlaying = false;
  const playBtn = document.getElementById("play-btn");
  playBtn.innerHTML = `<i class="fas fa-play text-black"></i>`;
  if (audio.currentTime) {
    audio.currentTime = 0;
  } else {
    const currentIndex = songs.findIndex((s) => s.id === playing.id);
    const lastIndex = currentIndex - 1 > 0 ? currentIndex - 1 : 0;
    playAudio(songs[lastIndex]);
  }
};

const playBtnPlay = () => {
  const randomize = document.getElementById("randomize");
  const { nb_tracks } = albumData;
  const songs = albumData.tracks.data;
  let song = {};
  if (!isPlaying) {
    if (randomize.classList.contains("active")) {
      if (playing.id) {
        playAudio(playing);
      } else {
        let i = Math.floor(Math.random() * nb_tracks);
        playAudio(songs[i]);
      }
    } else {
      playing.id ? playAudio(playing) : playAudio(songs[0]);
    }
  } else {
    pauseAudio();
  }
};

fetchAlbumData(13475611);
