/* =========================================================================
   libreria.js  —  funzionalità extra per il clone Spotify (Noemi)
   -------------------------------------------------------------------------
   • aggiunge un cuoricino ai risultati del dropdown di ricerca
   • salva/rimuove i brani preferiti su localStorage
   • apre una modale "Brani che ti piacciono" dalla sidebar sx / card home
   • rende dinamica la sezione "Attività amici" (dati presi dalla chart Deezer)
   Nessun framework: solo vanilla JS + Bootstrap già presente.
   ========================================================================= */
(function () {
  "use strict";

  /* ======================= 1. STATO PREFERITI ========================== */
  const STORAGE_KEY = "libreria.preferiti.v1";

  const getLiked = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (_) {
      return [];
    }
  };
  const saveLiked = (arr) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  const isLikedById = (id) => getLiked().some((t) => t.id === Number(id));
  const toggleLiked = (track) => {
    const liked = getLiked();
    const idx = liked.findIndex((t) => t.id === track.id);
    if (idx >= 0) liked.splice(idx, 1);
    else liked.push(track);
    saveLiked(liked);
    return idx < 0; // true se ora è nei preferiti
  };

  /* ======================= 2. CACHE BRANI DA FETCH ===================== */
  // intercettiamo window.fetch per memorizzare le tracce complete (id, cover,
  // preview ecc.) senza dover toccare search.js, index-album.js o artist.js
  const trackCache = new Map(); // id -> track completa
  // cache extra: per le tracce che arrivano dentro un album non hanno
  // sempre il sotto-oggetto "album": ce lo ricostruiamo dall'album padre
  const albumCache = new Map(); // albumId -> album completo
  const _origFetch = window.fetch.bind(window);
  window.fetch = function (url, ...rest) {
    const p = _origFetch(url, ...rest);
    const u = typeof url === "string" ? url : url && url.url;
    if (!u) return p;

    // risultati della ricerca (ogni track ha già .album e .artist)
    if (u.includes("/deezer/search")) {
      p.then((r) => r.clone().json())
        .then((data) => {
          (data.data || []).forEach((t) => trackCache.set(t.id, t));
        })
        .catch(() => {});
    }

    // pagina album: l'oggetto album contiene tracks.data con le tracce
    // (ma senza sotto-oggetto "album" dentro ogni traccia — lo aggiungiamo noi)
    else if (/\/deezer\/album\/\d+$/.test(u)) {
      p.then((r) => r.clone().json())
        .then((album) => {
          if (!album || !album.id) return;
          albumCache.set(album.id, album);
          const albumSummary = {
            id: album.id,
            title: album.title,
            cover_medium: album.cover_medium,
            cover_small: album.cover_small,
          };
          (album.tracks && album.tracks.data ? album.tracks.data : []).forEach(
            (t) => {
              // la traccia dentro album NON ha .album: gliela mettiamo noi
              const enriched = { ...t, album: t.album || albumSummary };
              trackCache.set(t.id, enriched);
            },
          );
        })
        .catch(() => {});
    }

    // pagina artista: /deezer/artist/ID/top (top tracks dell'artista)
    // qui ogni traccia HA già album + artist, come in search
    else if (/\/deezer\/artist\/\d+\/top/.test(u)) {
      p.then((r) => r.clone().json())
        .then((data) => {
          (data.data || []).forEach((t) => trackCache.set(t.id, t));
        })
        .catch(() => {});
    }

    return p;
  };

  /* ======================= 3. STILE INIETTATO ========================== */
  const style = document.createElement("style");
  style.textContent = `
    .lib-heart-btn {
      background: transparent; border: none; color: #b3b3b3;
      font-size: 1.05rem; margin-left: auto;
      padding: 0 .6rem; cursor: pointer;
      transition: transform .15s ease, color .15s ease;
      align-self: center;
    }
    .lib-heart-btn:hover { transform: scale(1.2); color: #fff; }
    .lib-heart-btn.liked { color: #1db954; }
    .lib-heart-btn.liked:hover { color: #1ed760; }

    #search-dropdown .dropdown-item { align-items: center; }

    .lib-friend { transition: opacity .4s ease; }
    .lib-friends-wrapper.fading { opacity: 0; }

    #lib-modal .modal-content { background:#181818; color:#fff; border:1px solid #282828; }
    #lib-modal .modal-header { border-bottom:1px solid #282828; }
    #lib-modal .track-row { cursor: default; }
    #lib-modal .track-row:hover { background:#282828; }
    #lib-modal .lib-empty,
    #lib-library-page .lib-empty { color:#b3b3b3; text-align:center; padding:2.5rem 1rem; }

    /* pagina libreria full-width nel main */
    #lib-library-page { width: 100%; }
    #lib-library-page .lib-library-card {
      background:#181818;
      transition: background .15s ease;
    }
    #lib-library-page .lib-library-card:hover { background:#282828; }
    #lib-library-page .lib-play {
      width:42px; height:42px;
      display:inline-flex; align-items:center; justify-content:center;
    }

    /* cuoricino dentro le track-card della pagina album */
    .track-card { position: relative; }
    .track-card .lib-heart-album {
      position: absolute;
      right: 3.2rem;    /* lascia spazio al menu "..." del collega */
      top: 50%;
      transform: translateY(-50%);
      margin-left: 0;
      z-index: 2;
      width: auto;
    }

    /* cuoricino dentro gli <li class="track-item"> della pagina artista */
    li.track-item .lib-heart-artist {
      margin-left: .5rem;
      padding: 0 .4rem;
    }
  `;
  document.head.appendChild(style);

  /* ======================= 4. INIEZIONE CUORICINO ====================== */
  function injectHeartIfNeeded(item) {
    if (!item || item.querySelector(".lib-heart-btn")) return;
    // id Deezer letto da "result-123456"
    const rawId = (item.id || "").replace("result-", "");
    const id = Number(rawId);
    if (!id) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lib-heart-btn";
    btn.title = "Aggiungi ai preferiti";

    const setIcon = (liked) => {
      btn.classList.toggle("liked", liked);
      btn.innerHTML = liked
        ? '<i class="fas fa-heart"></i>'
        : '<i class="far fa-heart"></i>';
      btn.title = liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti";
    };
    setIcon(isLikedById(id));

    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // non fa partire il play del parent
      e.preventDefault();

      // recuperiamo i dati completi dalla cache o dal DOM come fallback
      const cached = trackCache.get(id);
      const trackData = cached
        ? {
            id: cached.id,
            title: cached.title,
            artist: cached.artist && cached.artist.name,
            albumTitle: cached.album && cached.album.title,
            cover:
              (cached.album &&
                (cached.album.cover_medium || cached.album.cover_small)) ||
              "",
            preview: cached.preview || "",
          }
        : extractFromDom(item, id);

      const nowLiked = toggleLiked(trackData);
      setIcon(nowLiked);
    });

    item.appendChild(btn);
  }

  function extractFromDom(item, id) {
    const img = item.querySelector("img");
    const titleEl = item.querySelector("p.text-capitalize.fw-semibold");
    const paragraphs = item.querySelectorAll("p.fw-semibold.fs-6");
    return {
      id,
      title: titleEl ? titleEl.textContent.trim() : "",
      artist:
        paragraphs.length > 0
          ? paragraphs[paragraphs.length - 1].textContent.trim()
          : "",
      albumTitle: "",
      cover: img ? img.src : "",
      preview: "",
    };
  }

  /* ---------- iniezione cuoricino nelle track-card della pagina ALBUM ---- */
  function injectHeartIntoAlbumTrack(card) {
    if (!card || card.querySelector(".lib-heart-album")) return;
    // nella track-card del collega il div .track-title ha id="${track.id}"
    const titleDiv = card.querySelector(".track-title[id]");
    if (!titleDiv) return;
    const id = Number(titleDiv.id);
    if (!id) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lib-heart-btn lib-heart-album";
    btn.title = "Aggiungi ai preferiti";

    const setIcon = (liked) => {
      btn.classList.toggle("liked", liked);
      btn.innerHTML = liked
        ? '<i class="fas fa-heart"></i>'
        : '<i class="far fa-heart"></i>';
      btn.title = liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti";
    };
    setIcon(isLikedById(id));

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const cached = trackCache.get(id);
      let trackData;
      if (cached) {
        trackData = {
          id: cached.id,
          title: cached.title,
          artist: cached.artist && cached.artist.name,
          albumTitle: cached.album && cached.album.title,
          cover:
            (cached.album &&
              (cached.album.cover_medium || cached.album.cover_small)) ||
            "",
          preview: cached.preview || "",
        };
      } else {
        // fallback DOM: leggiamo i dati visibili nella track-card
        const ps = titleDiv.querySelectorAll("p");
        const albumEl = document.querySelector("#album-title, h1.fw-bold");
        const coverEl = document.querySelector(
          ".album-cover, #album-cover, img.album-img",
        );
        trackData = {
          id,
          title: ps[0] ? ps[0].textContent.trim() : "",
          artist: ps[1] ? ps[1].textContent.trim() : "",
          albumTitle: albumEl ? albumEl.textContent.trim() : "",
          cover: coverEl ? coverEl.src : "",
          preview: "",
        };
      }
      const nowLiked = toggleLiked(trackData);
      setIcon(nowLiked);
    });

    // lo appendiamo alla track-card: è position:relative, il pulsante è assoluto
    card.appendChild(btn);
  }

  /* ---------- iniezione cuoricino negli <li> della pagina ARTISTA ------- */
  function injectHeartIntoArtistTrack(li) {
    if (!li || li.querySelector(".lib-heart-artist")) return;
    const id = Number(li.getAttribute("data-track-id"));
    if (!id) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lib-heart-btn lib-heart-artist end-50";
    btn.title = "Aggiungi ai preferiti";

    const setIcon = (liked) => {
      btn.classList.toggle("liked", liked);
      btn.innerHTML = liked
        ? '<i class="fas fa-heart"></i>'
        : '<i class="far fa-heart"></i>';
      btn.title = liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti";
    };
    setIcon(isLikedById(id));

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const cached = trackCache.get(id);
      let trackData;
      if (cached) {
        trackData = {
          id: cached.id,
          title: cached.title,
          artist: cached.artist && cached.artist.name,
          albumTitle: cached.album && cached.album.title,
          cover:
            (cached.album &&
              (cached.album.cover_medium || cached.album.cover_small)) ||
            "",
          preview: cached.preview || "",
        };
      } else {
        // fallback DOM: nome traccia e immagine album sono nel <li>
        const img = li.querySelector("img");
        const titleEl = li.querySelector("span.text-white");
        const artistName =
          (document.querySelector(".artist-name") || {}).textContent ||
          (document.querySelector("h1") || {}).textContent ||
          "";
        trackData = {
          id,
          title: titleEl ? titleEl.textContent.trim() : "",
          artist: artistName.trim(),
          albumTitle: "",
          cover: img ? img.src : "",
          preview: "",
        };
      }
      const nowLiked = toggleLiked(trackData);
      setIcon(nowLiked);
    });

    li.appendChild(btn);
  }

  // observer globale: il search-dropdown, la pagina album e quella artista
  // vengono (ri)creati dinamicamente, quindi osserviamo tutto il body
  const globalObs = new MutationObserver(() => {
    document
      .querySelectorAll('#search-dropdown .dropdown-item[id^="result-"]')
      .forEach(injectHeartIfNeeded);
    document.querySelectorAll(".track-card").forEach(injectHeartIntoAlbumTrack);
    document
      .querySelectorAll("li.track-item[data-track-id]")
      .forEach(injectHeartIntoArtistTrack);
  });
  globalObs.observe(document.body, { childList: true, subtree: true });

  /* ======================= 5. MODALE PREFERITI ========================= */
  function ensureModal() {
    if (document.getElementById("lib-modal")) return;
    const modal = document.createElement("div");
    modal.id = "lib-modal";
    modal.className = "modal fade";
    modal.tabIndex = -1;
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-heart text-success me-2"></i>
              Brani che ti piacciono
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Chiudi"></button>
          </div>
          <div class="modal-body" id="lib-modal-body"></div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  function renderModalBody() {
    const body = document.getElementById("lib-modal-body");
    if (!body) return;
    const liked = getLiked();
    if (!liked.length) {
      body.innerHTML = `
        <div class="lib-empty">
          <i class="far fa-heart fs-1 d-block mb-3"></i>
          Non hai ancora salvato nessun brano.<br>
          Cercali con la <strong>barra Cerca</strong> e clicca il cuoricino!
        </div>`;
      return;
    }
    body.innerHTML = liked
      .map(
        (t) => `
      <div class="track-row d-flex align-items-center gap-3 py-2 px-2 rounded" data-id="${t.id}">
        <img src="${t.cover || ""}" alt=""
             style="width:50px;height:50px;object-fit:cover;border-radius:4px;background:#282828;">
        <div class="flex-grow-1 overflow-hidden">
          <div class="fw-semibold text-light text-truncate">${escapeHtml(t.title || "")}</div>
          <div class="small text-secondary text-truncate">
            ${escapeHtml(t.artist || "")}${t.albumTitle ? " • " + escapeHtml(t.albumTitle) : ""}
          </div>
        </div>
        ${
          t.preview
            ? `<button class="btn btn-sm btn-outline-success rounded-circle lib-play" title="Anteprima"><i class="fas fa-play"></i></button>`
            : ""
        }
        <button class="lib-heart-btn liked lib-remove" title="Rimuovi dai preferiti">
          <i class="fas fa-heart"></i>
        </button>
      </div>`,
      )
      .join("");

    // rimozione
    body.querySelectorAll(".lib-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest(".track-row");
        const id = Number(row.dataset.id);
        saveLiked(getLiked().filter((t) => t.id !== id));
        renderModalBody();
        // risincronizza l'icona nel dropdown di ricerca, se visibile
        const searchBtn = document.querySelector(
          `#result-${id} .lib-heart-btn`,
        );
        if (searchBtn) {
          searchBtn.classList.remove("liked");
          searchBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
      });
    });

    // preview audio (30 sec di Deezer)
    let currentAudio = null;
    body.querySelectorAll(".lib-play").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest(".track-row");
        const id = Number(row.dataset.id);
        const track = getLiked().find((t) => t.id === id);
        if (!track || !track.preview) return;
        if (currentAudio) {
          currentAudio.pause();
        }
        if (btn.dataset.playing === "1") {
          btn.dataset.playing = "0";
          btn.innerHTML = '<i class="fas fa-play"></i>';
          return;
        }
        currentAudio = new Audio(track.preview);
        currentAudio.play();
        btn.dataset.playing = "1";
        btn.innerHTML = '<i class="fas fa-pause"></i>';
        currentAudio.addEventListener("ended", () => {
          btn.dataset.playing = "0";
          btn.innerHTML = '<i class="fas fa-play"></i>';
        });
      });
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openLibraryModal() {
    ensureModal();
    renderModalBody();
    const modalEl = document.getElementById("lib-modal");
    if (window.bootstrap && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    } else {
      // fallback senza bootstrap JS
      modalEl.classList.add("show");
      modalEl.style.display = "block";
    }
  }

  /* ======================= 5bis. PAGINA LIBRERIA NEL MAIN =============== */
  // Tiene traccia degli elementi che abbiamo nascosto noi, per poterli
  // ripristinare quando l'utente torna alla home
  let hiddenByLibrary = [];

  function showLibraryPage() {
    const main = document.getElementById("main");
    if (!main) return;

    // nascondi tutti i figli correnti del main (tranne la pagina libreria stessa)
    hiddenByLibrary = [];
    Array.from(main.children).forEach((el) => {
      if (el.id === "lib-library-page") return;
      if (!el.classList.contains("d-none")) {
        el.classList.add("d-none");
        hiddenByLibrary.push(el);
      }
    });

    // crea o riusa la sezione libreria
    let libSection = document.getElementById("lib-library-page");
    if (!libSection) {
      libSection = document.createElement("section");
      libSection.id = "lib-library-page";
      libSection.className = "text-light my-4 px-3";
      main.appendChild(libSection);
    }
    libSection.classList.remove("d-none");
    renderLibraryPage(libSection);

    // porto l'utente in cima alla pagina
    main.scrollTo({ top: 0, behavior: "smooth" });
  }

  function hideLibraryPage() {
    const libSection = document.getElementById("lib-library-page");
    if (libSection) libSection.classList.add("d-none");
    hiddenByLibrary.forEach((el) => el.classList.remove("d-none"));
    hiddenByLibrary = [];
  }

  function renderLibraryPage(section) {
    const liked = getLiked();
    section.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold mb-0">
          <i class="fas fa-book me-2"></i> La tua libreria
        </h2>
        <button id="lib-back-home" class="btn btn-outline-light rounded-pill">
          <i class="fas fa-arrow-left me-2"></i> Torna alla home
        </button>
      </div>
      <p class="text-secondary mb-4">
        ${liked.length === 0 ? "Ancora nessun brano salvato." : `${liked.length} ${liked.length === 1 ? "brano" : "brani"} salvati`}
      </p>
      ${
        liked.length === 0
          ? `<div class="lib-empty">
               <i class="far fa-heart fs-1 d-block mb-3"></i>
               <p class="mb-1">La tua libreria è vuota.</p>
               <p class="mb-0">Cerca un brano e clicca il <i class="fas fa-heart text-success"></i> per salvarlo qui.</p>
             </div>`
          : `<ul class="list-unstyled d-flex flex-column gap-3 mb-5">
               ${liked
                 .map(
                   (t) => `
                 <li class="lib-library-card d-flex align-items-center gap-3 rounded-3 p-3" data-id="${t.id}">
                   <img src="${t.cover || ""}" alt=""
                        style="width:72px;height:72px;object-fit:cover;border-radius:4px;background:#282828;">
                   <div class="flex-grow-1 overflow-hidden">
                     <div class="fw-semibold text-light text-truncate fs-5">${escapeHtml(t.title || "")}</div>
                     <div class="small text-secondary text-truncate">
                       ${escapeHtml(t.artist || "")}${t.albumTitle ? " • " + escapeHtml(t.albumTitle) : ""}
                     </div>
                   </div>
                   ${
                     t.preview
                       ? `<button class="btn btn-success rounded-circle lib-play" title="Anteprima"><i class="fas fa-play"></i></button>`
                       : ""
                   }
                   <button class="lib-heart-btn liked lib-remove-lib" title="Rimuovi dalla libreria">
                     <i class="fas fa-heart fs-4"></i>
                   </button>
                 </li>`,
                 )
                 .join("")}
             </ul>`
      }
    `;

    // pulsante "Torna alla home"
    const backBtn = section.querySelector("#lib-back-home");
    if (backBtn) backBtn.addEventListener("click", hideLibraryPage);

    // rimozione brano dalla libreria
    section.querySelectorAll(".lib-remove-lib").forEach((btn) => {
      btn.addEventListener("click", () => {
        const li = btn.closest("li");
        const id = Number(li.dataset.id);
        saveLiked(getLiked().filter((t) => t.id !== id));
        renderLibraryPage(section);
        // aggiorna eventuale cuoricino nel dropdown di ricerca
        const searchBtn = document.querySelector(
          `#result-${id} .lib-heart-btn`,
        );
        if (searchBtn) {
          searchBtn.classList.remove("liked");
          searchBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
      });
    });

    // anteprima audio (30 secondi Deezer)
    let currentAudio = null;
    section.querySelectorAll(".lib-play").forEach((btn) => {
      btn.addEventListener("click", () => {
        const li = btn.closest("li");
        const id = Number(li.dataset.id);
        const track = getLiked().find((t) => t.id === id);
        if (!track || !track.preview) return;
        if (currentAudio) currentAudio.pause();
        if (btn.dataset.playing === "1") {
          btn.dataset.playing = "0";
          btn.innerHTML = '<i class="fas fa-play"></i>';
          return;
        }
        currentAudio = new Audio(track.preview);
        currentAudio.play();
        btn.dataset.playing = "1";
        btn.innerHTML = '<i class="fas fa-pause"></i>';
        currentAudio.addEventListener("ended", () => {
          btn.dataset.playing = "0";
          btn.innerHTML = '<i class="fas fa-play"></i>';
        });
      });
    });
  }

  // click handler unico (event delegation):
  //   - "La tua libreria"        → pagina piena nel main (showLibraryPage)
  //   - "Brani che ti piacciono" → modale rapida (openLibraryModal)
  //   - "Home"                   → chiudi pagina libreria, se aperta
  document.addEventListener("click", (e) => {
    // 1) link sidebar desktop
    const sideLink = e.target.closest("a.sidebar-link");
    if (sideLink) {
      const label = sideLink.querySelector("span.mx-3");
      const text = label ? label.textContent.trim() : "";
      if (text === "La tua libreria") {
        e.preventDefault();
        showLibraryPage();
        return;
      }
      if (text === "Brani che ti piacciono") {
        e.preventDefault();
        openLibraryModal();
        return;
      }
      if (text === "Home") {
        // ripristina la home se siamo nella pagina libreria
        hideLibraryPage();
        // niente preventDefault: se altri script gestiscono Home, fanno pure
        return;
      }
    }
    // 2) card nella home (Buonasera) "Brani che ti piacciono"
    const card = e.target.closest(".buonasera-card");
    if (card) {
      const p = card.querySelector("p.mb-0");
      if (p && p.textContent.trim() === "Brani che ti piacciono") {
        e.preventDefault();
        openLibraryModal();
        return;
      }
    }
    // 3) barra fissa mobile in basso
    const mobileLink = e.target.closest(".sidebar-left a");
    if (mobileLink) {
      const span = mobileLink.querySelector("span");
      const text = span ? span.textContent.trim() : "";
      if (text === "La tua libreria") {
        e.preventDefault();
        showLibraryPage();
        return;
      }
      if (text === "Home") {
        hideLibraryPage();
        return;
      }
    }
  });

  /* ======================= 6. ATTIVITÀ AMICI DINAMICA ================== */
  const FRIENDS = [
    { name: "Charlie Hookhman", pfp: "https://i.pravatar.cc/80?img=12" },
    { name: "lightdark02", pfp: "https://i.pravatar.cc/80?img=5" },
    { name: "Valeria Traverso", pfp: "https://i.pravatar.cc/80?img=47" },
    { name: "martina.dev", pfp: "https://i.pravatar.cc/80?img=32" },
    { name: "andrea_m", pfp: "https://i.pravatar.cc/80?img=14" },
    { name: "riccardo.codes", pfp: "https://i.pravatar.cc/80?img=60" },
    { name: "lizc2004", pfp: "https://i.pravatar.cc/80?img=22" },
    { name: "Emily W.", pfp: "https://i.pravatar.cc/80?img=9" },
    { name: "giacomo.bs", pfp: "https://i.pravatar.cc/80?img=33" },
  ];

  const TIMES = [
    "appena ora",
    "2 min",
    "8 min",
    "22 min",
    "1 ora",
    "3 ore",
    "5 ore",
    "1 giorno",
    "3 giorni",
  ];

  const pickRandom = (arr, n) =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, n);

  async function refreshFriendsActivity() {
    const sidebar = document.getElementById("sidebarRight");
    if (!sidebar) return;
    const container = sidebar.querySelector(".my-4");
    if (!container) return;
    container.classList.add("lib-friends-wrapper");

    // fade out
    container.classList.add("fading");

    try {
      const res = await _origFetch(
        "https://striveschool-api.herokuapp.com/api/deezer/chart",
      );
      if (!res.ok) throw new Error("chart non disponibile");
      const data = await res.json();
      const tracks = (data.tracks && data.tracks.data) || [];
      if (!tracks.length) {
        container.classList.remove("fading");
        return;
      }

      const chosenFriends = pickRandom(FRIENDS, 4);
      const chosenTracks = pickRandom(tracks, chosenFriends.length);

      const html = chosenFriends
        .map((friend, i) => {
          const t = chosenTracks[i];
          const time = TIMES[Math.floor(Math.random() * TIMES.length)];
          return `
          <div class="lib-friend d-flex align-items-center gap-3 my-4">
            <img width="40" height="40" class="rounded-circle img-fluid"
                 src="${friend.pfp}" alt="pfp"
                 onerror="this.src='https://placecats.com/50/50'">
            <div class="d-flex flex-column align-self-start flex-grow-1 overflow-hidden">
              <p class="m-0 fw-bold text-light text-truncate">${escapeHtml(friend.name)}</p>
              <cite class="small text-truncate">${escapeHtml(t.title)} • ${escapeHtml(t.artist.name)}</cite>
              <cite class="small text-truncate">
                <i class="far fa-dot-circle"></i> ${escapeHtml(t.album.title)}
              </cite>
            </div>
            <cite class="small align-self-start text-nowrap">${time}</cite>
          </div>`;
        })
        .join("");

      // aspettiamo il fade out, poi scambiamo il contenuto e fade in
      setTimeout(() => {
        container.innerHTML = html;
        container.classList.remove("fading");
      }, 350);
    } catch (err) {
      console.warn("libreria.js · Attività amici:", err);
      container.classList.remove("fading");
    }
  }

  // ----- piccola utility esposta: accesso in sola lettura alla cache dei
  // brani (usata dal modulo playlist.js per riutilizzare i dati già fetchati)
  window.libGetTrackFromCache = (id) => trackCache.get(Number(id)) || null;

  // primo caricamento quando il DOM è pronto, poi refresh ogni 30 s
  const bootFriends = () => {
    refreshFriendsActivity();
    setInterval(refreshFriendsActivity, 30000);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootFriends);
  } else {
    bootFriends();
  }
})();
