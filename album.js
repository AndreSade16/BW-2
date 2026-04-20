const albumApiLink = "https://striveschool-api.herokuapp.com/api/deezer/album/";
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
    } = track;
    tracksSpace.innerHTML += `
            <div class="row mt-2">
                <div class="col-1 d-flex align-items-center justify-content-end text-secondary d-none d-lg-inline-block">
                  <p class="m-0">${i}</p>
                </div>
                <div class="col-12 col-lg-5 p-0">
                  <p class="m-0">${title}</p>
                  <p class="m-0 text-secondary">${explicit_lyrics ? "<span class='text-black bg-secondary'>E</span> " : ""}${artist.name}</p>
                </div>
                <div class="col-4 d-none d-lg-inline-block">
                  <p class="m-0 text-secondary">${rank}</p>
                </div>
                <div class="col-2 text-end d-none d-lg-inline-block">
                  <p class="m-0 text-secondary">${Math.floor(duration / 60)}:${duration % 60 > 9 ? duration % 60 : "0" + (duration % 60)}</p>
                </div>
            </div>
            
    `;
  });
};

fetchAlbumData(75621062);
