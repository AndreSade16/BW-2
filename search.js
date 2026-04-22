const searchInput = document.getElementById("search-input");
const searchDropdown = document.getElementById("search-dropdown");

searchInput.addEventListener("focus", () => {
  searchDropdown.classList.remove("d-none");
});

searchInput.addEventListener("input", () => {
  const searchApiLink =
    "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
  const trimmedValue = searchInput.value.trim();
  if (trimmedValue.length > 0) {
    searchDropdown.classList.remove("d-none");
    fetch(searchApiLink + trimmedValue)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Can't search right now...");
        }
      })
      .then((obj) => {
        searchDropdown.innerHTML = "";
        console.log(obj.data);
        obj.data.forEach((result) => {
          const { album, id, title, type, artist } = result;
          const cover = album.cover_small;
          const albumTitle = album.title;
          searchDropdown.innerHTML += `
            <div class="dropdown-item text-light py-2 px-3 d-flex gap-2">
                <img src="${cover}" alt="${albumTitle}-cover" style="max-height: 50px">
                <div class="d-flex flex-column justify-content-center gap-2">
                  <p class="text-capitalize fw-semibold text-light fs-6 m-0" style="height: 1rem">
                  ${title}
                  </p>
                  <div class="d-flex gap-2 text-body-tertiary">
                    <p class="fw-semibold fs-6 text-capitalize m-0">
                        ${type}
                    </p>
                    <p class="fw-semibold fs-6 m-0">•</p>
                    <p class="fw-semibold fs-6 m-0">
                        ${artist.name}
                    </p>
                  </div>
                </div>
            </div>
            `;
        });
      })
      .catch((err) => console.log("Failed to fetch", err));
  } else {
    searchDropdown.classList.add("d-none");
  }
});

document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
    searchDropdown.classList.add("d-none");
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchDropdown.classList.add("d-none");
    searchInput.blur();
  }
});
