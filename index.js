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
