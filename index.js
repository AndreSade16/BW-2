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

  // Logica popolamento artist carousel e album carousel

  const albumIds = [
    7714217, 7714220, 7714218, 313357207, 302127, 75621062, 119606, 92759,
    144076, 1327607,
  ]

  const albumMain = []

  const albumMain = []

  albumIds.forEach((id) => {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${id}`)
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

    if (!slide1 || !slide2) {
      console.log("SLIDE NON TROVATE")
      return
    }

    slide1.innerHTML = ""
    slide2.innerHTML = ""

    albums.forEach((album, index) => {
      const card = `
  <div class="col-6 col-md-4 col-lg-2">
    <div class="card bg-dark text-light border-0 p-2">
      <img src="${album.cover_medium}" class="img-fluid mb-2">
      <p class="mb-1">${album.title}</p>
      <small class="text-secondary">
        ${album.artist?.name || "Unknown"}
      </small>
    </div>
  </div>
`

      if (index < 5) {
        slide1.innerHTML += card
      } else {
        slide2.innerHTML += card
      }
    })
  }
})
