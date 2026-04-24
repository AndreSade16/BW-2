/* =========================================================================
   playlist.js  —  feature EXTRA: playlist multiple salvate in localStorage
   -------------------------------------------------------------------------
   Stessa filosofia di libreria.js:
     • IIFE isolata, zero dipendenze esterne
     • nessun file dei colleghi viene modificato
     • MutationObserver per iniettare i bottoni nei punti dinamici
     • tutte le classi CSS hanno prefisso .pl- per non collidere

   Cosa fa:
     1. tasto "Crea playlist" nella sidebar sx → prompt e crea playlist
     2. tasto "+" accanto al cuoricino in: ricerca, album, artista, libreria
     3. click su "+" → menu "Aggiungi a playlist…" con elenco + nuova
     4. sidebar sx: elenco delle playlist cliccabili (sostituisce quelle finte)
     5. click su playlist → pagina dedicata nel main con i brani
   ========================================================================= */
(function () {
  "use strict";

  /* ======================= 1. STORAGE =================================== */
  const STORAGE_KEY = "libreria.playlists.v1";

  const getPlaylists = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (_) {
      return [];
    }
  };
  const savePlaylists = (arr) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

  const createPlaylist = (name) => {
    const arr = getPlaylists();
    const pl = {
      id: "pl_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: name || "Nuova playlist",
      tracks: [],
      createdAt: new Date().toISOString(),
    };
    arr.push(pl);
    savePlaylists(arr);
    return pl;
  };
  const deletePlaylist = (id) => {
    savePlaylists(getPlaylists().filter((p) => p.id !== id));
  };
  const renamePlaylist = (id, newName) => {
    const arr = getPlaylists();
    const p = arr.find((p) => p.id === id);
    if (p) {
      p.name = newName;
      savePlaylists(arr);
    }
  };
  const addTrackToPlaylist = (playlistId, track) => {
    const arr = getPlaylists();
    const p = arr.find((p) => p.id === playlistId);
    if (!p) return false;
    if (p.tracks.some((t) => t.id === track.id)) return false; // già dentro
    p.tracks.push(track);
    savePlaylists(arr);
    return true;
  };
  const removeTrackFromPlaylist = (playlistId, trackId) => {
    const arr = getPlaylists();
    const p = arr.find((p) => p.id === playlistId);
    if (!p) return;
    p.tracks = p.tracks.filter((t) => t.id !== Number(trackId));
    savePlaylists(arr);
  };

  /* ======================= 2. CSS INIETTATO ============================= */
  const style = document.createElement("style");
  style.textContent = `
    /* bottone "+" con stessa estetica del cuoricino di libreria.js */
    .pl-plus-btn {
      background: transparent; border: none; color: #b3b3b3;
      font-size: 1.05rem; padding: 0 .4rem; cursor: pointer;
      transition: transform .15s ease, color .15s ease;
      align-self: center;
    }
    .pl-plus-btn:hover { transform: scale(1.2); color: #fff; }

    /* posizionamento per le 3 collocazioni speciali (album è absolute) */
    .track-card .pl-plus-album {
      position: absolute; right: 5.2rem; top: 50%;
      transform: translateY(-50%); z-index: 2;
    }
    li.track-item .pl-plus-artist { margin-left: .25rem; padding: 0 .3rem; }

    /* menu popover "aggiungi a playlist" */
    #pl-menu {
      position: fixed;
      min-width: 220px; max-width: 280px;
      background: #282828; color: #fff;
      border: 1px solid #3a3a3a; border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0,0,0,.5);
      z-index: 2000;
      padding: .4rem 0;
      font-size: .9rem;
    }
    #pl-menu .pl-menu-title {
      padding: .3rem .9rem .5rem; color:#b3b3b3;
      font-size:.75rem; text-transform:uppercase; letter-spacing:.05em;
    }
    #pl-menu .pl-menu-item {
      display:flex; align-items:center; gap:.6rem;
      padding: .45rem .9rem; cursor:pointer;
    }
    #pl-menu .pl-menu-item:hover { background:#3a3a3a; }
    #pl-menu .pl-menu-item i { width: 1.1rem; text-align:center; }
    #pl-menu hr { margin:.3rem 0; border-color:#3a3a3a; }
    #pl-menu .pl-menu-new input {
      width: 100%; background:#181818; border:1px solid #3a3a3a;
      color:#fff; padding:.3rem .5rem; border-radius:4px;
      margin-top:.3rem;
    }
    #pl-menu .pl-menu-new button {
      width:100%; margin-top:.4rem; background:#1db954;
      color:#000; font-weight:600; border:none;
      padding:.35rem; border-radius:4px; cursor:pointer;
    }
    #pl-menu .pl-menu-new button:hover { background:#1ed760; }

    /* voci playlist nella sidebar sx */
    .pl-sidebar-item {
      display:block; padding:.15rem 0; color:#b3b3b3;
      text-decoration:none; cursor:pointer;
    }
    .pl-sidebar-item:hover { color:#fff; }

    /* pagina playlist full-width (stesso stile di #lib-library-page) */
    #pl-playlist-page .pl-card {
      background:#181818; transition: background .15s ease;
    }
    #pl-playlist-page .pl-card:hover { background:#282828; }

    /* piccolo toast di conferma */
    .pl-toast {
      position: fixed; bottom: 90px; left: 50%;
      transform: translateX(-50%);
      background: #1db954; color: #000;
      padding: .6rem 1.2rem; border-radius: 999px;
      font-weight: 600; z-index: 3000;
      animation: pl-fade 2s forwards;
      pointer-events: none;
    }
    @keyframes pl-fade {
      0%   { opacity: 0; transform: translate(-50%, 10px); }
      10%  { opacity: 1; transform: translate(-50%, 0); }
      80%  { opacity: 1; transform: translate(-50%, 0); }
      100% { opacity: 0; transform: translate(-50%, -10px); }
    }
  `;
  document.head.appendChild(style);

  /* ======================= 3. ESTRAZIONE DATI TRACCIA =================== */
  // strategia: proviamo prima la cache esposta da libreria.js (dati completi),
  // se non c'è facciamo fallback sul DOM visibile. In entrambi i casi
  // normalizziamo il formato {id, title, artist, albumTitle, cover, preview}
  const normalizeFromCache = (cached) => ({
    id: cached.id,
    title: cached.title,
    artist: cached.artist && cached.artist.name,
    albumTitle: cached.album && cached.album.title,
    cover:
      (cached.album &&
        (cached.album.cover_medium || cached.album.cover_small)) ||
      "",
    preview: cached.preview || "",
  });

  const readTrack = (id, domFallback) => {
    id = Number(id);
    const fromCache =
      typeof window.libGetTrackFromCache === "function"
        ? window.libGetTrackFromCache(id)
        : null;
    if (fromCache) return normalizeFromCache(fromCache);
    return domFallback(id);
  };

  const searchDomFallback = (item) => (id) => {
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
  };

  const albumDomFallback = (card, titleDiv) => (id) => {
    const ps = titleDiv.querySelectorAll("p");
    const albumEl = document.querySelector("#album-title, h1.fw-bold");
    const coverEl = document.querySelector(
      ".album-cover, #album-cover, img.album-img",
    );
    return {
      id,
      title: ps[0] ? ps[0].textContent.trim() : "",
      artist: ps[1] ? ps[1].textContent.trim() : "",
      albumTitle: albumEl ? albumEl.textContent.trim() : "",
      cover: coverEl ? coverEl.src : "",
      preview: "",
    };
  };

  const artistDomFallback = (li) => (id) => {
    const img = li.querySelector("img");
    const titleEl = li.querySelector("span.text-white");
    const artistName =
      (document.querySelector(".artist-name") || {}).textContent ||
      (document.querySelector("h1") || {}).textContent ||
      "";
    return {
      id,
      title: titleEl ? titleEl.textContent.trim() : "",
      artist: artistName.trim(),
      albumTitle: "",
      cover: img ? img.src : "",
      preview: "",
    };
  };

  const libraryCardFallback = (li) => (id) => {
    const img = li.querySelector("img");
    const titleEl = li.querySelector(".fw-semibold");
    const subEl = li.querySelector(".small.text-secondary");
    return {
      id,
      title: titleEl ? titleEl.textContent.trim() : "",
      artist: subEl ? subEl.textContent.trim().split("•")[0].trim() : "",
      albumTitle: "",
      cover: img ? img.src : "",
      preview: "",
    };
  };

  /* ======================= 4. TOAST =================================== */
  const showToast = (msg) => {
    const t = document.createElement("div");
    t.className = "pl-toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2100);
  };

  /* ======================= 5. MENU "+" =================================== */
  // il menu è uno solo, viene distrutto/ricreato ad ogni apertura
  function closeMenu() {
    const m = document.getElementById("pl-menu");
    if (m) m.remove();
  }

  function openMenu(anchorEl, track) {
    closeMenu();
    const menu = document.createElement("div");
    menu.id = "pl-menu";

    const playlists = getPlaylists();
    const listHtml = playlists.length
      ? playlists
          .map(
            (p) => `
          <div class="pl-menu-item" data-playlist-id="${p.id}">
            <i class="fas fa-list"></i>
            <span class="flex-grow-1 text-truncate">${escapeHtml(p.name)}</span>
            <small class="text-secondary ms-auto">${p.tracks.length}</small>
          </div>`,
          )
          .join("")
      : `<div class="pl-menu-title">Nessuna playlist ancora</div>`;

    menu.innerHTML = `
      <div class="pl-menu-title">Aggiungi a playlist</div>
      ${listHtml}
      <hr>
      <div class="pl-menu-new p-2">
        <input type="text" placeholder="Nome nuova playlist..." maxlength="60">
        <button type="button"><i class="fas fa-plus me-2"></i>Crea e aggiungi</button>
      </div>
    `;
    document.body.appendChild(menu);

    // posiziona il menu vicino all'anchor, stando nel viewport
    const rect = anchorEl.getBoundingClientRect();
    let top = rect.bottom + 4;
    let left = rect.right - 220; // allineato a destra
    if (left < 8) left = 8;
    const maxTop = window.innerHeight - menu.offsetHeight - 8;
    if (top > maxTop) top = rect.top - menu.offsetHeight - 4;
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;

    // click su playlist esistente
    menu.querySelectorAll(".pl-menu-item[data-playlist-id]").forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const pid = el.getAttribute("data-playlist-id");
        const added = addTrackToPlaylist(pid, track);
        const pl = getPlaylists().find((x) => x.id === pid);
        showToast(
          added
            ? `Aggiunto a "${pl.name}"`
            : `"${track.title}" è già in "${pl.name}"`,
        );
        closeMenu();
        refreshSidebarPlaylists();
      });
    });

    // crea nuova
    const input = menu.querySelector(".pl-menu-new input");
    const btn = menu.querySelector(".pl-menu-new button");
    const handleCreate = () => {
      const name = input.value.trim();
      if (!name) {
        input.focus();
        return;
      }
      const pl = createPlaylist(name);
      addTrackToPlaylist(pl.id, track);
      showToast(`Creata "${pl.name}" con 1 brano`);
      closeMenu();
      refreshSidebarPlaylists();
    };
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      handleCreate();
    });
    input.addEventListener("click", (ev) => ev.stopPropagation());
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") handleCreate();
    });
    setTimeout(() => input.focus(), 0);
  }

  // chiusura menu al click fuori
  document.addEventListener("click", (e) => {
    const menu = document.getElementById("pl-menu");
    if (menu && !menu.contains(e.target)) closeMenu();
  });

  /* ======================= 6. INIEZIONE "+" ============================ */
  const makePlusButton = (className) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `pl-plus-btn ${className}`;
    b.innerHTML = '<i class="fas fa-plus-circle"></i>';
    b.title = "Aggiungi a playlist";
    return b;
  };

  // ricerca dropdown
  function injectPlusSearch(item) {
    if (!item || item.querySelector(".pl-plus-search")) return;
    const id = Number((item.id || "").replace("result-", ""));
    if (!id) return;
    const btn = makePlusButton("pl-plus-search");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const track = readTrack(id, searchDomFallback(item));
      openMenu(btn, track);
    });
    // lo vogliamo PRIMA del cuoricino: insertBefore
    const heart = item.querySelector(".lib-heart-btn");
    if (heart) item.insertBefore(btn, heart);
    else item.appendChild(btn);
  }

  // album track-card
  function injectPlusAlbum(card) {
    if (!card || card.querySelector(".pl-plus-album")) return;
    const titleDiv = card.querySelector(".track-title[id]");
    if (!titleDiv) return;
    const id = Number(titleDiv.id);
    if (!id) return;
    const btn = makePlusButton("pl-plus-album");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const track = readTrack(id, albumDomFallback(card, titleDiv));
      openMenu(btn, track);
    });
    card.appendChild(btn);
  }

  // artista <li>
  function injectPlusArtist(li) {
    if (!li || li.querySelector(".pl-plus-artist")) return;
    const id = Number(li.getAttribute("data-track-id"));
    if (!id) return;
    const btn = makePlusButton("pl-plus-artist");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const track = readTrack(id, artistDomFallback(li));
      openMenu(btn, track);
    });
    // lo inseriamo prima del cuoricino (ultimo figlio)
    const heart = li.querySelector(".lib-heart-btn");
    if (heart) li.insertBefore(btn, heart);
    else li.appendChild(btn);
  }

  // card nella pagina libreria
  function injectPlusLibrary(libLi) {
    if (!libLi || libLi.querySelector(".pl-plus-library")) return;
    const id = Number(libLi.getAttribute("data-id"));
    if (!id) return;
    const btn = makePlusButton("pl-plus-library");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const track = readTrack(id, libraryCardFallback(libLi));
      openMenu(btn, track);
    });
    // inserito prima del "lib-remove-lib" (cuoricino rosso di rimozione)
    const heart = libLi.querySelector(".lib-remove-lib");
    if (heart) libLi.insertBefore(btn, heart);
    else libLi.appendChild(btn);
  }

  const obs = new MutationObserver(() => {
    document
      .querySelectorAll('#search-dropdown .dropdown-item[id^="result-"]')
      .forEach(injectPlusSearch);
    document.querySelectorAll(".track-card").forEach(injectPlusAlbum);
    document
      .querySelectorAll("li.track-item[data-track-id]")
      .forEach(injectPlusArtist);
    document
      .querySelectorAll("#lib-library-page li.lib-library-card")
      .forEach(injectPlusLibrary);
  });
  obs.observe(document.body, { childList: true, subtree: true });

  /* ======================= 7. SIDEBAR SX: ELENCO PLAYLIST ============== */
  // il <div class="small container text-secondary"> contiene le <p> finte.
  // aggiungiamo in cima le playlist reali, mantenendo le altre come mock
  function refreshSidebarPlaylists() {
    const holder = document.querySelector(
      "nav .small.container.text-secondary, aside .small.container.text-secondary, .small.container.text-secondary",
    );
    if (!holder) return;

    // rimuovi contenitore nostro precedente se esiste
    const prev = holder.querySelector(".pl-user-list");
    if (prev) prev.remove();

    const playlists = getPlaylists();
    if (!playlists.length) return;

    const wrapper = document.createElement("div");
    wrapper.className = "pl-user-list mb-2";
    wrapper.innerHTML = `
      <hr class="text-secondary border-2 border-secondary mt-0">
      <p class="text-light mb-1 fw-bold">Le tue playlist</p>
      ${playlists
        .map(
          (p) => `
        <a class="pl-sidebar-item text-truncate d-block"
           data-playlist-id="${p.id}" href="#">
          <i class="fas fa-music me-2"></i>${escapeHtml(p.name)}
          <small class="text-secondary">(${p.tracks.length})</small>
        </a>`,
        )
        .join("")}
    `;
    holder.insertBefore(wrapper, holder.firstChild);
  }

  /* ======================= 8. PAGINA PLAYLIST NEL MAIN ================= */
  let hiddenByPlaylist = [];

  function showPlaylistPage(playlistId) {
    const main = document.getElementById("main");
    if (!main) return;
    const pl = getPlaylists().find((p) => p.id === playlistId);
    if (!pl) return;

    // nascondi tutto il resto (incluso eventuale lib-library-page)
    hiddenByPlaylist = [];
    Array.from(main.children).forEach((el) => {
      if (el.id === "pl-playlist-page") return;
      if (!el.classList.contains("d-none")) {
        el.classList.add("d-none");
        hiddenByPlaylist.push(el);
      }
    });

    let section = document.getElementById("pl-playlist-page");
    if (!section) {
      section = document.createElement("section");
      section.id = "pl-playlist-page";
      section.className = "text-light my-4 px-3";
      main.appendChild(section);
    }
    section.classList.remove("d-none");
    renderPlaylistPage(section, pl);
    main.scrollTo({ top: 0, behavior: "smooth" });
  }

  function hidePlaylistPage() {
    const section = document.getElementById("pl-playlist-page");
    if (section) section.classList.add("d-none");
    hiddenByPlaylist.forEach((el) => el.classList.remove("d-none"));
    hiddenByPlaylist = [];
  }

  function renderPlaylistPage(section, pl) {
    section.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4 gap-2 flex-wrap">
        <div class="d-flex align-items-center gap-3">
          <div class="bg-success d-flex align-items-center justify-content-center"
               style="width:96px;height:96px;border-radius:6px;">
            <i class="fas fa-music fs-1 text-dark"></i>
          </div>
          <div>
            <small class="text-secondary text-uppercase">Playlist</small>
            <h2 class="fw-bold mb-1" id="pl-name-h">${escapeHtml(pl.name)}</h2>
            <small class="text-secondary">
              ${pl.tracks.length} ${pl.tracks.length === 1 ? "brano" : "brani"}
            </small>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button id="pl-rename-btn" class="btn btn-outline-light rounded-pill btn-sm">
            <i class="fas fa-pen me-1"></i> Rinomina
          </button>
          <button id="pl-delete-btn" class="btn btn-outline-danger rounded-pill btn-sm">
            <i class="fas fa-trash me-1"></i> Elimina playlist
          </button>
          <button id="pl-back-btn" class="btn btn-outline-light rounded-pill btn-sm">
            <i class="fas fa-arrow-left me-1"></i> Indietro
          </button>
        </div>
      </div>

      ${
        pl.tracks.length === 0
          ? `<div style="color:#b3b3b3;text-align:center;padding:2.5rem 1rem;">
               <i class="far fa-list-alt fs-1 d-block mb-3"></i>
               <p class="mb-1">Questa playlist è vuota.</p>
               <p class="mb-0">Clicca il <i class="fas fa-plus-circle"></i> accanto a un brano per aggiungerlo qui.</p>
             </div>`
          : `<ul class="list-unstyled d-flex flex-column gap-3 mb-5">
               ${pl.tracks
                 .map(
                   (t) => `
                 <li class="pl-card d-flex align-items-center gap-3 rounded-3 p-3" data-id="${t.id}">
                   <img src="${t.cover || ""}" alt=""
                        style="width:64px;height:64px;object-fit:cover;border-radius:4px;background:#282828;">
                   <div class="flex-grow-1 overflow-hidden">
                     <div class="fw-semibold text-light text-truncate">${escapeHtml(t.title || "")}</div>
                     <div class="small text-secondary text-truncate">
                       ${escapeHtml(t.artist || "")}${t.albumTitle ? " • " + escapeHtml(t.albumTitle) : ""}
                     </div>
                   </div>
                   ${
                     t.preview
                       ? `<button class="btn btn-success rounded-circle pl-play" title="Anteprima"><i class="fas fa-play"></i></button>`
                       : ""
                   }
                   <button class="pl-plus-btn pl-remove-track" title="Rimuovi da questa playlist"
                           style="color:#f66;">
                     <i class="fas fa-times-circle fs-5"></i>
                   </button>
                 </li>`,
                 )
                 .join("")}
             </ul>`
      }
    `;

    // indietro
    section
      .querySelector("#pl-back-btn")
      .addEventListener("click", hidePlaylistPage);

    // rinomina
    section.querySelector("#pl-rename-btn").addEventListener("click", () => {
      const nuovo = prompt("Nuovo nome per la playlist:", pl.name);
      if (nuovo && nuovo.trim()) {
        renamePlaylist(pl.id, nuovo.trim());
        const refreshed = getPlaylists().find((x) => x.id === pl.id);
        renderPlaylistPage(section, refreshed);
        refreshSidebarPlaylists();
      }
    });

    // elimina
    section.querySelector("#pl-delete-btn").addEventListener("click", () => {
      if (
        confirm(
          `Eliminare la playlist "${pl.name}"? I brani resteranno nella tua libreria se li hai col cuoricino.`,
        )
      ) {
        deletePlaylist(pl.id);
        refreshSidebarPlaylists();
        hidePlaylistPage();
      }
    });

    // rimuovi brano
    section.querySelectorAll(".pl-remove-track").forEach((btn) => {
      btn.addEventListener("click", () => {
        const li = btn.closest("li");
        const tid = Number(li.dataset.id);
        removeTrackFromPlaylist(pl.id, tid);
        const refreshed = getPlaylists().find((x) => x.id === pl.id);
        renderPlaylistPage(section, refreshed);
        refreshSidebarPlaylists();
      });
    });

    // preview audio (stesso pattern di libreria.js)
    let currentAudio = null;
    section.querySelectorAll(".pl-play").forEach((btn) => {
      btn.addEventListener("click", () => {
        const li = btn.closest("li");
        const id = Number(li.dataset.id);
        const track = pl.tracks.find((t) => t.id === id);
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

  /* ======================= 9. CLICK HANDLER GLOBALI ==================== */
  document.addEventListener("click", (e) => {
    // click sul link "Le tue playlist" nella sidebar
    const plPageLink = e.target.closest("#pl-sidebar-link");
    if (plPageLink) {
      e.preventDefault();
      showPlaylistsIndex(); // mostra lista di tutte le playlist
      return;
    }
    // "Crea playlist" nella sidebar sx
    const sideLink = e.target.closest("a.sidebar-link");
    if (sideLink) {
      const label = sideLink.querySelector("span.mx-3");
      if (label && label.textContent.trim() === "Crea playlist") {
        e.preventDefault();
        const name = prompt("Nome della nuova playlist:");
        if (name && name.trim()) {
          createPlaylist(name.trim());
          refreshSidebarPlaylists();
          showToast(`Playlist "${name.trim()}" creata`);
        }
        return;
      }
    }

    // click su una voce playlist della sidebar
    const plLink = e.target.closest(".pl-sidebar-item[data-playlist-id]");
    if (plLink) {
      e.preventDefault();
      const pid = plLink.getAttribute("data-playlist-id");
      showPlaylistPage(pid);
      return;
    }

    // click su "Home" → chiude anche la pagina playlist
    if (sideLink) {
      const label = sideLink.querySelector("span.mx-3");
      if (label && label.textContent.trim() === "Home") {
        hidePlaylistPage();
      }
    }
  });

  /* ======================= 10. UTILITY & BOOT ========================== */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const boot = () => {
    refreshSidebarPlaylists();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // display di playlist come pagina cliccabile

  function showPlaylistsIndex() {
    const main = document.getElementById("main");
    if (!main) return;

    hiddenByPlaylist = [];
    Array.from(main.children).forEach((el) => {
      if (el.id === "pl-playlist-page") return;
      if (!el.classList.contains("d-none")) {
        el.classList.add("d-none");
        hiddenByPlaylist.push(el);
      }
    });

    let section = document.getElementById("pl-playlist-page");
    if (!section) {
      section = document.createElement("section");
      section.id = "pl-playlist-page";
      section.className = "text-light my-4 px-3";
      main.appendChild(section);
    }
    section.classList.remove("d-none");

    const playlists = getPlaylists();
    section.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold me-3">Le tue playlist</h2>
      <button id="pl-new-from-index" class="btn btn-success rounded-pill px-3">
        <i class="fas fa-plus me-2"></i>Nuova playlist
      </button>
    </div>
    ${
      playlists.length === 0
        ? `<div style="color:#b3b3b3;text-align:center;padding:3rem 1rem;">
           <i class="fas fa-list fs-1 d-block mb-3"></i>
           <p>Non hai ancora creato nessuna playlist.</p>
         </div>`
        : `<ul class="list-unstyled d-flex flex-column gap-3">
           ${playlists
             .map(
               (p) => `
             <li class="pl-card d-flex align-items-center gap-3 rounded-3 p-3"
                 style="cursor:pointer;" data-open-playlist="${p.id}">
               <div class="bg-success d-flex align-items-center justify-content-center flex-shrink-0"
                    style="width:56px;height:56px;border-radius:6px;">
                 <i class="fas fa-music text-dark fs-4"></i>
               </div>
               <div class="flex-grow-1 overflow-hidden">
                 <div class="fw-semibold text-light text-truncate">${escapeHtml(p.name)}</div>
                 <div class="small text-secondary">${p.tracks.length} ${p.tracks.length === 1 ? "brano" : "brani"}</div>
               </div>
               <i class="fas fa-chevron-right text-secondary"></i>
             </li>`,
             )
             .join("")}
         </ul>`
    }
  `;

    section
      .querySelector("#pl-new-from-index")
      ?.addEventListener("click", () => {
        const name = prompt("Nome della nuova playlist:");
        if (name && name.trim()) {
          createPlaylist(name.trim());
          refreshSidebarPlaylists();
          showPlaylistsIndex(); // aggiorna la vista
        }
      });

    section.querySelectorAll("[data-open-playlist]").forEach((li) => {
      li.addEventListener("click", () => {
        showPlaylistPage(li.getAttribute("data-open-playlist"));
      });
    });

    main.scrollTo({ top: 0, behavior: "smooth" });
  }
})();

// Mostra playlists come lista cliccabile
