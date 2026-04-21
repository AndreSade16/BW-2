const albumApiLink = "https://striveschool-api.herokuapp.com/api/deezer/album/";
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
      displayAlbumData(albumData);
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
    if (coverBottom <= 90) {
      topbar.style.backgroundColor = `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 1)`;
    } else {
      topbar.style.backgroundColor = `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 0)`;
    }
  });
  // FINE LOGICA COLORI COVERS E PLACEHOLDERS ONLOAD
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
                  <p class="m-0 text-secondary fw-semibold">${explicit_lyrics ? "<span class='text-black bg-secondary fw-semibold'>E</span> " : ""}${artist.name}</p>
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
};

const pauseAudio = () => {
  const playBtn = document.getElementById("play-btn");
  playBtn.innerHTML = `<i class="fas fa-play text-black"></i>`;
  audio.pause();
  isPlaying = false;
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

fetchAlbumData(75621062);
