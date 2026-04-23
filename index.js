// GLOBALE PER AVANTI E DIETRO - MARTINA

const homePage = document.getElementById("main");
const homeMarkup = homePage.innerHTML;

const loadHomePage = () => {
  main.innerHTML = homeMarkup;

  if (typeof loadArtistCarousel === "function") {
    loadArtistCarousel();
  }

  if (typeof loadAlbumCarousel === "function") {
    loadAlbumCarousel();
  }
};
// salvo la home come stato iniziale - MARTINA

window.addEventListener("DOMContentLoaded", () => {
  history.replaceState({ page: "home" }, "", window.location.pathname);
});

// avanti e indietro

window.onpopstate = (event) => {
  if (!event.state || event.state.page === "home") {
    loadHomePage();
    return;
  }

  if (event.state.page === "artist") {
    loadArtistPage(event.state.artistId, false);
    return;
  }

  if (event.state.page === "album") {
    loadAlbumPage(event.state.albumId, false);
  }
};

// recupero i bottoni

const backBtn = document.getElementById("btn-back");
const forwardBtn = document.getElementById("btn-forward");

backBtn.addEventListener("click", () => {
  history.back();
  location.reload();
});

forwardBtn.addEventListener("click", () => {
  history.forward();
  location.reload();
});

window.addEventListener("DOMContentLoaded", function () {
  // Logica chiusura sidebar-right al click del bottone "X"
  const closeButton = document.getElementById("closeSidebar");
  const openButton = document.getElementById("openSidebar");
  const sidebar = document.getElementById("sidebarRight");

  // stato iniziale
  if (openButton) {
    openButton.classList.add("d-none");
  }

  // logo spotify riporta alla home

  document.getElementById("spotify-logo").addEventListener("click", () => {
    loadHomePage();
    history.pushState({ page: "home" }, "", "/");
  });

  // VALERIA
  // stato iniziale
  if (openButton) {
    openButton.classList.add("d-none");
  }

  // CHIUDI
  closeButton.addEventListener("click", function () {
    sidebar.classList.remove("d-lg-block");
    openButton.classList.remove("d-none");
  });

  // APRI

  openButton?.addEventListener("click", function () {
    sidebar.classList.add("d-lg-block");
    openButton.classList.add("d-none");
  });
  // funzione che ritenta al fallimento della fetch
  const fetchWithRetry = (url, retries = 2) => {
    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Errore fetch");
        return res.json();
      })
      .catch((err) => {
        if (retries > 0) {
          return fetchWithRetry(url, retries - 1);
        }
        throw err;
      });
  };
  // Logica popolamento album carousel

  const albumUrl = "https://striveschool-api.herokuapp.com/api/deezer/album/";
  const albumIds = [
    111114312, 1363567, 217794942, 113728, 103248, 198908, 70928652, 13475611,
    119606, 154910, 302127, 75621062,
  ];

  const container = document.getElementById("album-container");

  let albumCards = "";
  let loaded = 0;

  albumIds.forEach((id) => {
    fetchWithRetry(albumUrl + id)
      .then((album) => {
        if (album && album.id) {
          albumCards += `
        <div 
          class="card bg-dark text-light border-0 p-2 flex-shrink-0"
          style="width: 150px; height: 230px; cursor: pointer;"
          onclick="fetchAlbumData(${album.id})"
        >
          <img src="${album.cover_medium}" class="img-fluid mb-2">
          <p class="mb-1 text-truncate">${album.title}</p>
          <small class="text-secondary text-truncate d-block">
            ${album.artist?.name || "Unknown"}
          </small>
        </div>
        `;
        }
      })
      .catch((err) => console.log("Errore album:", err))
      .finally(() => {
        loaded++;

        if (loaded === albumIds.length) {
          container.innerHTML = albumCards;
        }
      });
  });

  // frecce
  document.getElementById("albumScrollLeft").addEventListener("click", () => {
    container.scrollBy({ left: -300, behavior: "smooth" });
  });

  document.getElementById("albumScrollRight").addEventListener("click", () => {
    container.scrollBy({ left: 300, behavior: "smooth" });
  });

  // Logica popolamento artisti carousel
  const artistUrl = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
  const artistIds = [
    27, // Daft Punk
    412, // Queen
    384236, // Dua Lipa
    13, // Eminem
    246791, // Drake
    4050205, // Billie Eilish
    75798, // Imagine Dragons
    755, // Bruno Mars
    111114, // Travis Scott
    1562681, // Olivia Rodrigo
    757, // David Guetta
    12178, // Arctic Monkeys
  ];

  const artistContainer = document.getElementById("artist-container");

  let artistCards = "";
  let loadedArtists = 0;

  artistIds.forEach((id) => {
    fetchWithRetry(artistUrl + id)
      .then((artist) => {
        if (artist && artist.id) {
          artistCards += `
        <div 
          class="card bg-dark text-light border-0 p-3 text-center flex-shrink-0"
          style="width: 150px; cursor: pointer;"
          onclick="loadArtistPage(${artist.id})"
        >
          <img 
            src="${artist.picture_medium}" 
            class="rounded-circle mb-3 mx-auto"
            style="width: 100px; height: 100px; object-fit: cover;"
          >
          <p class="mb-1 text-truncate">${artist.name}</p>
          <small class="text-secondary">Artista</small>
        </div>
        `;
        }
      })
      .catch((err) => console.log("Errore artist:", err))
      .finally(() => {
        loadedArtists++;

        if (loadedArtists === artistIds.length) {
          artistContainer.innerHTML = artistCards;
        }
      });
  });

  // frecce

  document.getElementById("scrollLeft").addEventListener("click", () => {
    artistContainer.scrollBy({ left: -300, behavior: "smooth" });
  });

  document.getElementById("scrollRight").addEventListener("click", () => {
    artistContainer.scrollBy({ left: 300, behavior: "smooth" });
  });
});
