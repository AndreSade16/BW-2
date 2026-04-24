const sidebar = document.getElementById("sidebar");
const btn = document.getElementById("toggleSidebar");

btn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});
