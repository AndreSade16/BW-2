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
    13475611, 75621062, 119606, 111114312, 217794942, 14560832, 103248,
    132971892, 113728, 225204, 154910, 198908,
  ]
  const albumMain = []

  albumIds.forEach((id) => {
    fetch(`${albumUrl}${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Errore fetch")
        return response.json()
      })
      .then((album) => {
        albumMain.push(album)

        if (albumMain.length === albumIds.length) {
          showAlbums(albumMain)
        }
      })
      .catch((err) => console.log("ERRORE:", err))
  })

  const showAlbums = function (albums) {
    const slide1 = document.getElementById("album-slide-1")
    const slide2 = document.getElementById("album-slide-2")

    slide1.innerHTML = ""
    slide2.innerHTML = ""

    albums.forEach((album, index) => {
      const card = `
  <div class="col-6 col-md-3 col-lg-2">
    <div class="card bg-dark text-light border-0 p-2" onclick="loadAlbumPage(${album.id})">
      <img src="${album.cover_medium}" class="img-fluid mb-2">
      <p class="mb-1">${album.title}</p>
      <small class="text-secondary">
        ${album.artist?.name}
      </small>
    </div>
  </div>
`

      if (index < 6) {
        slide1.innerHTML += card
      } else {
        slide2.innerHTML += card
      }
    })
  }

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

  const artistMain = []

  artistIds.forEach((id) => {
    fetch(`${artistUrl}${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Errore fetch")
        return response.json()
      })
      .then((artist) => {
        console.log(artist.id, artist.name)
        artistMain.push(artist)

        if (artistMain.length === artistIds.length) {
          showArtists(artistMain)
        }
      })
      .catch((err) => console.log("ERRORE:", err))
  })

  const showArtists = function (artists) {
    const slide1 = document.getElementById("artist-slide-1")
    const slide2 = document.getElementById("artist-slide-2")

    slide1.innerHTML = ""
    slide2.innerHTML = ""

    artists.forEach((artist, index) => {
      const card = `
      <div class="col-6 col-md-3 col-lg-2">
        <div class="card bg-dark text-light border-0 p-3 text-center"  onclick="loadArtistPage(${artist.id})">
          
          <img 
            src="${artist.picture_medium}" 
            class="rounded-circle mb-3"
            style="width: 100px; height: 100px; object-fit: cover;"
          >

          <p class="mb-1">${artist.name}</p>
          <small class="text-secondary">Artista</small>
        </div>
      </div>
    `

      if (index < 6) {
        slide1.innerHTML += card
      } else {
        slide2.innerHTML += card
      }
    })
  }
})
