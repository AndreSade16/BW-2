window.addEventListener("DOMContentLoaded", function () {
  // Logica chiusura sidebar-right al click del bottone "X"
  const closeButton = document.getElementById("closeSidebar")
  const openButton = document.getElementById("openSidebar")
  const sidebar = document.getElementById("sidebarRight")

  // stato iniziale
  openButton.classList.add("d-none")

  // CHIUDI
  closeButton.addEventListener("click", function () {
    sidebar.classList.remove("d-lg-block")
    openButton.classList.remove("d-none")
  })

  // APRI
  openButton.addEventListener("click", function () {
    sidebar.classList.add("d-lg-block")
    openButton.classList.add("d-none")
  })

  // Logica popolamento album carousel

  const albumUrl = "https://striveschool-api.herokuapp.com/api/deezer/album/"
  const albumIds = [
    111114312, 1363567, 217794942, 113728, 103248, 198908, 70928652, 13475611,
    119606, 154910, 302127, 75621062,
  ]

  const fetchAlbums = albumIds.map((id) =>
    fetch(albumUrl + id).then((res) => res.json()),
  )

  Promise.all(fetchAlbums)
    .then((albums) => {
      showAlbums(albums)
    })
    .catch((err) => console.log("ERRORE:", err))

  const showAlbums = function (albums) {
    const container = document.getElementById("album-container")

    let cards = ""

    albums.forEach((album) => {
      if (!album || !album.cover_medium) return

      cards += `
      <div 
        class="card bg-dark text-light border-0 p-2 flex-shrink-0"
        style="width: 150px; cursor: pointer;"
        onclick="fetchAlbumData(${album.id})"
      >
        <img src="${album.cover_medium}" class="img-fluid mb-2">
        <p class="mb-1">${album.title}</p>
        <small class="text-secondary">
          ${album.artist?.name || "Unknown"}
        </small>
      </div>
    `
    })

    container.innerHTML = cards
  }

  // frecce
  const albumContainer = document.getElementById("album-container")

  document.getElementById("albumScrollLeft").addEventListener("click", () => {
    albumContainer.scrollBy({ left: -300, behavior: "smooth" })
  })

  document.getElementById("albumScrollRight").addEventListener("click", () => {
    albumContainer.scrollBy({ left: 300, behavior: "smooth" })
  })

  // Logica popolamento artisti carousel
  const artistUrl = "https://striveschool-api.herokuapp.com/api/deezer/artist/"
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
  ]

  const fetchArtists = artistIds.map((id) =>
    fetch(artistUrl + id).then((res) => res.json()),
  )

  Promise.all(fetchArtists)
    .then((artists) => {
      showArtists(artists)
    })
    .catch((err) => console.log("ERRORE:", err))

  const showArtists = function (artists) {
    const container = document.getElementById("artist-container")

    let cards = ""

    artists.forEach((artist) => {
      cards += `
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
        <p class="mb-1">${artist.name}</p>
        <small class="text-secondary">Artista</small>
      </div>
    `
    })

    container.innerHTML = cards
  }

  // frecce artist
  const artistContainer = document.getElementById("artist-container")

  document.getElementById("scrollLeft").addEventListener("click", () => {
    artistContainer.scrollBy({ left: -300, behavior: "smooth" })
  })

  document.getElementById("scrollRight").addEventListener("click", () => {
    artistContainer.scrollBy({ left: 300, behavior: "smooth" })
  })
})
