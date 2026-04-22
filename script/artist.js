let artistTracksData = []
const getAverageColorArtist = (imgElement) => {
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")
canvas.width = 1
canvas.height = 1
context.drawImage(imgElement, 0, 0, 1, 1)
const data = context.getImageData(0, 0, 1, 1).data
return { r: data[0], g: data[1], b: data[2] }
}

async function loadArtistPage(artistId) {
// Mostra solo questa sezione (nascondi le altre)
showSection("artist-page")

const BASE = "https://striveschool-api.herokuapp.com/api/deezer"

try {
  // Fetch parallele — come fare due richieste contemporaneamente
  const [artistRes, tracksRes] = await Promise.all([
    fetch(`${BASE}/artist/${artistId}`),
    fetch(`${BASE}/artist/${artistId}/top?limit=5`)
  ])

  const artist = await artistRes.json()
  const tracksData = await tracksRes.json()
  
  // --- Header ---
const artistBanner = document.getElementById("artist-banner")
  artistBanner.crossOrigin = "Anonymous"  // PRIMA di src!
  artistBanner.src = artist.picture_xl
  artistBanner.alt = artist.name
  document.getElementById("artist-name").textContent = artist.name
  document.getElementById("artist-fans").textContent = 
`${artist.nb_fan.toLocaleString("it-IT")} ascoltatori mensili`

// --- Box brani che ti piacciono ---
const artistLikedImg = document.getElementById("artist-liked-img")
artistLikedImg.crossOrigin = "Anonymous"
artistLikedImg.src = artist.picture_medium
document.getElementById("artist-liked-name").textContent = `Di ${artist.name}`

// Gradient dinamico
let avgColor = { r: 33, g: 37, b: 41 }
artistBanner.onload = function() {
avgColor = getAverageColorArtist(artistBanner)
const darkColor = `rgb(33, 37, 41)`
document.getElementById("artist-page").style.background = `linear-gradient(to bottom, rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b}) 0%, ${darkColor} 28%)`
}
  
  // --- Top tracks ---
  const tracksList = document.getElementById("artist-tracks")
  tracksList.innerHTML = "" // reset
  artistTracksData = tracksData.data 
  tracksData.data.forEach((track, index) => {
  tracksList.innerHTML += `
    <li class="d-flex align-items-center gap-3 mb-2 track-item"
        data-track-id="${track.id}"
        style="cursor: pointer;"
        onclick="playArtistAudio(artistTracksData[${index}])">
      <span class="text-secondary" style="width: 20px">${index + 1}</span>
      <img src="${track.album.cover_small}" alt="" class="rounded" style="width:40px; height:40px;">
      <span class="text-white">${track.title}</span>
      <span class="text-secondary ms-auto">${formatDuration(track.duration)}</span>
    </li>`
})

  // --- Album dell'artista ---
  const albumsRes = await fetch(`${BASE}/artist/${artistId}/albums`)
  const albumsData = await albumsRes.json()

  const albumsContainer = document.getElementById("artist-albums")
  albumsContainer.innerHTML = ""

  albumsData.data.forEach(album => {
    albumsContainer.innerHTML += `
      <div class="col">
        <div class="album-card" onclick="loadAlbumPage(${album.id})" style="cursor: pointer;">
          <img src="${album.cover_medium}" alt="${album.title}" class="w-100 rounded mb-2">
          <p class="text-white small mb-0">${album.title}</p>
          <p class="text-secondary small">${album.release_date?.slice(0, 4) ?? ""}</p>
        </div>
      </div>`
  })

} catch (err) {
  console.error("Errore nel caricamento artista:", err)
}
}
// Nasconde tutte le sezioni e mostra solo quella richiesta
function showSection(sectionId) {
document.querySelectorAll("section").forEach(s => s.classList.add("d-none"))
document.getElementById(sectionId).classList.remove("d-none")
}

// Converte secondi in m:ss — come in Spotify
function formatDuration(seconds) {
const m = Math.floor(seconds / 60)
const s = String(seconds % 60).padStart(2, "0")
return `${m}:${s}`
}

const playArtistAudio = (track) => {
  const audio = new Audio(track.preview)
  audio.play()
}

// Es. click su un nome artista in homepage o album page
const params = new URLSearchParams(window.location.search)
if (params.get("artistId")) {
loadArtistPage(params.get("artistId"))
}
