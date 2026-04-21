// Logica chiusura sidebar-right al click del bottone "X"
const closeButton = document.getElementById("closeSidebar")
const sidebar = document.getElementById("sidebarRight")

closeButton.addEventListener("click", function () {
  sidebar.classList.remove("d-lg-block")
})

sidebar.classList.add("d-lg-block")
