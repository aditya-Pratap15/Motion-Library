/**
 * ============================================================================
 * Motion Library - 100% Reliable In-Browser Audio Player & Infinite Scroll
 * ============================================================================
 */

// Master resources array - loaded instantly from pre-embedded data
let allResources = (typeof window.PRELOADED_SOUNDS !== 'undefined' && Array.isArray(window.PRELOADED_SOUNDS)) 
  ? window.PRELOADED_SOUNDS 
  : [];

// Pagination Configuration
const PAGE_SIZE = 24; // 4 rows of 6 cubes each
let currentPage = 1;
let currentCategory = 'all';
let searchQuery = '';
let isLoadingMore = false;
let currentActiveItem = null;

// DOM Elements
const resourcesGrid = document.getElementById('resourcesGrid');
const searchInput = document.getElementById('searchInput');
const filterContainer = document.getElementById('filterContainer');
const emptyState = document.getElementById('emptyState');
const resetBtn = document.getElementById('resetBtn');
const scrollLoader = document.getElementById('scrollLoader');
const paginationCountText = document.getElementById('paginationCountText');

// Sticky Floating Bottom Player Elements
const stickyPlayerDock = document.getElementById('stickyPlayerDock');
const playerCard = document.querySelector('.player-card');
const playerTitle = document.getElementById('playerTitle');
const playerBadge = document.getElementById('playerBadge');
const playerDownloadBtn = document.getElementById('playerDownloadBtn');
const masterAudio = document.getElementById('masterAudio');
const playerCloseBtn = document.getElementById('playerCloseBtn');

// Minimalist Info Modal Elements
const infoModal = document.getElementById('infoModal');
const infoModalClose = document.getElementById('infoModalClose');
const infoSoundType = document.getElementById('infoSoundType');
const infoSoundTitle = document.getElementById('infoSoundTitle');
const infoSoundFormat = document.getElementById('infoSoundFormat');
const infoSituation = document.getElementById('infoSituation');
const infoEmotion = document.getElementById('infoEmotion');
const infoEffects = document.getElementById('infoEffects');
const infoTip = document.getElementById('infoTip');
const infoModalPlayBtn = document.getElementById('infoModalPlayBtn');
const infoPlayBtnText = document.getElementById('infoPlayBtnText');
const infoModalDlBtn = document.getElementById('infoModalDlBtn');

let modalActiveItem = null;

/**
 * Filter resources by category and active search query
 */
function getFilteredResources() {
  return allResources.filter(item => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.details && item.details.situation && item.details.situation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.details && item.details.emotion && item.details.emotion.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.format && item.format.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });
}

/**
 * Create a single cube DOM element
 */
function createCubeElement(item) {
  const cube = document.createElement('div');
  cube.className = 'sound-cube';
  cube.id = `cube-${item.id}`;
  cube.setAttribute('role', 'button');
  cube.setAttribute('tabindex', '0');

  const isImage = item.type === 'image' || item.category === 'characters';
  cube.setAttribute('aria-label', isImage ? `View ${item.title}` : `Play ${item.title}`);

  const isCurrent = currentActiveItem && currentActiveItem.id === item.id;
  const isPlaying = !isImage && isCurrent && !masterAudio.paused;

  if (isPlaying) {
    cube.classList.add('is-playing');
  }

  let kindLabel = 'SFX';
  let kindClass = 'kind-sfx';

  if (isImage) {
    kindLabel = 'PNG';
    kindClass = 'kind-png';
  } else if (item.kind === 'BGM' || item.category === 'background-music') {
    kindLabel = 'BGM';
    kindClass = 'kind-bgm';
  }

  cube.innerHTML = `
    <div class="cube-top">
      <div class="cube-badges-group">
        <span class="cube-kind-tag ${kindClass}">${kindLabel}</span>
        <span class="cube-badge">${item.badge || (isImage ? 'PNG' : 'AUDIO')}</span>
        <button class="cube-info-btn" title="${isImage ? 'Character Details & Editing Guide' : 'Sound Details & Editing Guide'}" aria-label="Details">i</button>
      </div>
      <a class="cube-download-btn" href="${item.imageUrl || item.audioUrl || item.downloadUrl}" title="Download ${item.title}" download="${item.title}.${(item.badge || (isImage ? 'png' : 'mp3')).toLowerCase()}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </a>
    </div>

    ${isImage ? `
      <!-- Center Graphic Character Preview -->
      <div class="cube-media-preview">
        <img class="cube-char-img" src="${item.imageUrl}" alt="${item.title}" loading="lazy">
      </div>
    ` : `
      <!-- Center Audio Play Button -->
      <div class="cube-play-btn" aria-label="Play/Pause">
        ${isPlaying ? `
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1"/>
            <rect x="14" y="5" width="4" height="14" rx="1"/>
          </svg>
        ` : `
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        `}
      </div>
    `}

    <div class="cube-bottom">
      <div class="cube-title" title="${item.title}">${item.title}</div>
      <div class="cube-size">${item.size || ''}</div>
    </div>

    ${isImage ? '' : `
      <!-- Active playback progress line at bottom of cube -->
      <div class="cube-progress-line"><span class="cube-progress-fill"></span></div>

      <!-- Ambient soundwave background bars -->
      <div class="cube-waveform-bg">
        <span style="height: 35%;"></span>
        <span style="height: 60%;"></span>
        <span style="height: 90%;"></span>
        <span style="height: 45%;"></span>
        <span style="height: 80%;"></span>
        <span style="height: 55%;"></span>
        <span style="height: 100%;"></span>
        <span style="height: 70%;"></span>
        <span style="height: 40%;"></span>
      </div>
    `}
  `;

  // Info 'i' button click opens details modal without triggering sound
  const infoBtn = cube.querySelector('.cube-info-btn');
  infoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openInfoModal(item);
  });

  // Download button click prevents audio play trigger
  const dlBtn = cube.querySelector('.cube-download-btn');
  dlBtn.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Clicking cube plays sound or opens image preview
  cube.addEventListener('click', () => {
    if (isImage) {
      openInfoModal(item);
    } else {
      toggleSound(item, cube);
    }
  });

  cube.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isImage) {
        openInfoModal(item);
      } else {
        toggleSound(item, cube);
      }
    }
  });

  return cube;
}

/**
 * Open Minimalist Sound Info Modal
 */
function openInfoModal(item) {
  modalActiveItem = item;
  const d = item.details || {};
  const isImage = item.type === 'image' || item.category === 'characters';
  const isBGM = !isImage && (item.kind === 'BGM' || item.category === 'background-music');

  const infoModalImageWrap = document.getElementById('infoModalImageWrap');
  const infoModalImage = document.getElementById('infoModalImage');
  const infoKindTag = document.getElementById('infoKindTag');

  if (isImage) {
    if (infoModalImageWrap && infoModalImage) {
      infoModalImageWrap.style.display = 'flex';
      infoModalImage.src = item.imageUrl || item.downloadUrl;
    }
    if (infoKindTag) {
      infoKindTag.textContent = '🎨 Character Cutout (PNG)';
      infoKindTag.className = 'info-kind-tag kind-png';
    }
    infoModalPlayBtn.style.display = 'none';
  } else {
    if (infoModalImageWrap) {
      infoModalImageWrap.style.display = 'none';
    }
    if (infoKindTag) {
      infoKindTag.textContent = isBGM ? '🎵 Background Music' : '⚡ Sound Effect';
      infoKindTag.className = `info-kind-tag ${isBGM ? 'kind-bgm' : 'kind-sfx'}`;
    }
    infoModalPlayBtn.style.display = 'inline-flex';
    updateModalPlayButton();
  }

  infoSoundType.textContent = d.type || (isImage ? 'Transparent Character Cutout' : (isBGM ? 'Cinematic Score / BGM' : 'Sound Effect'));
  infoSoundTitle.textContent = item.title;
  infoSoundFormat.textContent = item.format || (isImage ? 'PNG Image' : `${item.badge || 'MP3'} Audio`);
  infoSituation.textContent = d.situation || 'General video cuts, kinetic typography, and motion accents.';
  infoEmotion.textContent = d.emotion || 'Dynamic, Engaging';
  infoEffects.textContent = d.effects || 'Balanced audio spectrum, crisp transient.';
  infoTip.textContent = d.editingTip || 'Sync with visual cuts or motion graphics for maximum punch.';

  const fileUrl = item.imageUrl || item.audioUrl || item.downloadUrl;
  infoModalDlBtn.href = fileUrl;
  infoModalDlBtn.setAttribute('download', `${item.title}.${(item.badge || (isImage ? 'png' : 'mp3')).toLowerCase()}`);

  infoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeInfoModal() {
  infoModal.classList.remove('active');
  document.body.style.overflow = '';
  modalActiveItem = null;
}

function updateModalPlayButton() {
  if (!modalActiveItem) return;
  const isPlayingThis = currentActiveItem && currentActiveItem.id === modalActiveItem.id && !masterAudio.paused;

  if (isPlayingThis) {
    infoPlayBtnText.textContent = "Pause Sound";
    infoModalPlayBtn.querySelector('svg').innerHTML = `
      <rect x="6" y="5" width="4" height="14" rx="1"/>
      <rect x="14" y="5" width="4" height="14" rx="1"/>
    `;
  } else {
    infoPlayBtnText.textContent = "Play Preview";
    infoModalPlayBtn.querySelector('svg').innerHTML = `
      <path d="M8 5v14l11-7z"/>
    `;
  }
}

// Modal play preview button
infoModalPlayBtn.addEventListener('click', () => {
  if (modalActiveItem) {
    const cubeEl = document.getElementById(`cube-${modalActiveItem.id}`);
    toggleSound(modalActiveItem, cubeEl);
    updateModalPlayButton();
  }
});

// Modal close triggers
infoModalClose.addEventListener('click', closeInfoModal);
infoModal.addEventListener('click', (e) => {
  if (e.target === infoModal) closeInfoModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && infoModal.classList.contains('active')) {
    closeInfoModal();
  }
});

/**
 * Toggle or Play Sound Instantly
 */
function toggleSound(item, cubeEl) {
  if (!item) return;

  // If clicked on currently active sound: toggle pause / play
  if (currentActiveItem && currentActiveItem.id === item.id) {
    if (masterAudio.paused) {
      masterAudio.play().catch(e => console.warn(e));
    } else {
      masterAudio.pause();
    }
    updateModalPlayButton();
    return;
  }

  // Switch to new sound
  currentActiveItem = item;

  // Un-highlight previous active cube
  document.querySelectorAll('.sound-cube.is-playing').forEach(el => {
    el.classList.remove('is-playing');
    const b = el.querySelector('.cube-play-btn');
    if (b) b.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    const fill = el.querySelector('.cube-progress-fill');
    if (fill) fill.style.width = '0%';
  });

  // Update Bottom Player Dock Info
  playerTitle.textContent = item.title;
  playerBadge.textContent = item.badge || 'AUDIO';

  const playerKindTag = document.getElementById('playerKindTag');
  const isBGM = item.kind === 'BGM' || item.category === 'background-music';
  if (playerKindTag) {
    playerKindTag.textContent = isBGM ? 'BGM' : 'SFX';
    playerKindTag.className = `player-kind-tag ${isBGM ? 'kind-bgm' : 'kind-sfx'}`;
  }

  playerDownloadBtn.href = item.audioUrl || item.downloadUrl;
  playerDownloadBtn.setAttribute('download', `${item.title}.${(item.badge || 'mp3').toLowerCase()}`);

  // Set audio source
  const audioSource = item.audioUrl || `sounds/${item.id}.${(item.badge || 'mp3').toLowerCase()}`;
  masterAudio.src = audioSource;

  // Show bottom dock
  stickyPlayerDock.classList.add('active');

  // Highlight current cube
  if (cubeEl) {
    cubeEl.classList.add('is-playing');
    const playBtn = cubeEl.querySelector('.cube-play-btn');
    if (playBtn) {
      playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1"/>
          <rect x="14" y="5" width="4" height="14" rx="1"/>
        </svg>
      `;
    }
  }

  // Start playback immediately
  masterAudio.play().catch(err => {
    console.warn("Autoplay was blocked or audio error:", err);
  });

  updateModalPlayButton();
}

/**
 * Synchronize Master Audio Events with UI
 */
masterAudio.addEventListener('timeupdate', () => {
  if (currentActiveItem && masterAudio.duration) {
    const activeCube = document.getElementById(`cube-${currentActiveItem.id}`);
    if (activeCube) {
      const fill = activeCube.querySelector('.cube-progress-fill');
      if (fill) {
        const pct = (masterAudio.currentTime / masterAudio.duration) * 100;
        fill.style.width = pct + '%';
      }
    }
  }
});

masterAudio.addEventListener('play', () => {
  if (playerCard) playerCard.classList.remove('is-paused');
  if (currentActiveItem) {
    const activeCube = document.getElementById(`cube-${currentActiveItem.id}`);
    if (activeCube) {
      activeCube.classList.add('is-playing');
      const b = activeCube.querySelector('.cube-play-btn');
      if (b) b.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`;
    }
  }
  updateModalPlayButton();
});

masterAudio.addEventListener('pause', () => {
  if (playerCard) playerCard.classList.add('is-paused');
  if (currentActiveItem) {
    const activeCube = document.getElementById(`cube-${currentActiveItem.id}`);
    if (activeCube) {
      activeCube.classList.remove('is-playing');
      const b = activeCube.querySelector('.cube-play-btn');
      if (b) b.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    }
  }
  updateModalPlayButton();
});

masterAudio.addEventListener('ended', () => {
  if (playerCard) playerCard.classList.add('is-paused');
  if (currentActiveItem) {
    const activeCube = document.getElementById(`cube-${currentActiveItem.id}`);
    if (activeCube) {
      activeCube.classList.remove('is-playing');
      const b = activeCube.querySelector('.cube-play-btn');
      if (b) b.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      const fill = activeCube.querySelector('.cube-progress-fill');
      if (fill) fill.style.width = '0%';
    }
  }
  updateModalPlayButton();
});

// Close player button
playerCloseBtn.addEventListener('click', () => {
  masterAudio.pause();
  masterAudio.src = '';
  stickyPlayerDock.classList.remove('active');
  document.querySelectorAll('.sound-cube.is-playing').forEach(el => {
    el.classList.remove('is-playing');
    const b = el.querySelector('.cube-play-btn');
    if (b) b.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    const fill = el.querySelector('.cube-progress-fill');
    if (fill) fill.style.width = '0%';
  });
  currentActiveItem = null;
  updateModalPlayButton();
});

/**
 * Render paginated slice of items
 */
function renderList(reset = false) {
  const filtered = getFilteredResources();

  if (reset) {
    currentPage = 1;
    resourcesGrid.innerHTML = '';
  }

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    scrollLoader.classList.remove('active');
    paginationCountText.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  paginationCountText.style.display = 'block';

  // Calculate slice range for current page
  const start = 0;
  const end = Math.min(currentPage * PAGE_SIZE, filtered.length);

  if (reset) {
    const fragment = document.createDocumentFragment();
    for (let i = start; i < end; i++) {
      fragment.appendChild(createCubeElement(filtered[i]));
    }
    resourcesGrid.appendChild(fragment);
  } else {
    const appendStart = (currentPage - 1) * PAGE_SIZE;
    const fragment = document.createDocumentFragment();
    for (let i = appendStart; i < end; i++) {
      fragment.appendChild(createCubeElement(filtered[i]));
    }
    resourcesGrid.appendChild(fragment);
  }

  paginationCountText.textContent = `Showing ${end} of ${filtered.length} resources`;

  if (end >= filtered.length) {
    scrollLoader.classList.remove('active');
  }
}

/**
 * Infinite Scroll Handler
 */
function handleInfiniteScroll() {
  if (isLoadingMore) return;

  const filtered = getFilteredResources();
  const maxShown = currentPage * PAGE_SIZE;

  if (maxShown >= filtered.length) {
    scrollLoader.classList.remove('active');
    return;
  }

  const scrollPosition = window.innerHeight + window.scrollY;
  const bottomPosition = document.documentElement.offsetHeight - 300;

  if (scrollPosition >= bottomPosition) {
    isLoadingMore = true;
    scrollLoader.classList.add('active');

    setTimeout(() => {
      currentPage++;
      renderList(false);
      isLoadingMore = false;
    }, 120);
  }
}

window.addEventListener('scroll', handleInfiniteScroll, { passive: true });

/**
 * Filter Pills Click Listener
 */
filterContainer.addEventListener('click', (e) => {
  const targetPill = e.target.closest('.filter-pill');
  if (!targetPill) return;

  document.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
  targetPill.classList.add('active');

  currentCategory = targetPill.dataset.category;

  // Sync navbar links
  document.querySelectorAll('.nav-links .nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.tab === currentCategory);
  });

  renderList(true);
});

/**
 * Navbar Tab Click Listener
 */
document.querySelectorAll('.nav-links .nav-link').forEach(navLink => {
  navLink.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = navLink.dataset.tab;
    currentCategory = tab;

    // Update nav links active state
    document.querySelectorAll('.nav-links .nav-link').forEach(l => l.classList.remove('active'));
    navLink.classList.add('active');

    // Sync filter pills active state
    document.querySelectorAll('.filter-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.category === tab);
    });

    renderList(true);
  });
});

/**
 * Live Search Listener
 */
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderList(true);
});

/**
 * Reset Search Button
 */
resetBtn.addEventListener('click', () => {
  searchQuery = '';
  searchInput.value = '';
  currentCategory = 'all';

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.category === 'all');
  });

  document.querySelectorAll('.nav-links .nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.tab === 'all');
  });

  renderList(true);
});

/**
 * Update Pill Count Badges
 */
function updateCategoryCounts() {
  const countAll = document.getElementById('count-all');
  const countSounds = document.getElementById('count-sound-effects');
  const countMusic = document.getElementById('count-background-music');
  const countCharacters = document.getElementById('count-characters');

  if (countAll) countAll.textContent = `(${allResources.length})`;
  if (countSounds) {
    const sfxCount = allResources.filter(r => r.category === 'sound-effects' || r.kind === 'SFX').length;
    countSounds.textContent = `(${sfxCount})`;
  }
  if (countMusic) {
    const bgmCount = allResources.filter(r => r.category === 'background-music' || r.kind === 'BGM').length;
    countMusic.textContent = `(${bgmCount})`;
  }
  if (countCharacters) {
    const charCount = allResources.filter(r => r.category === 'characters' || r.type === 'image').length;
    countCharacters.textContent = `(${charCount})`;
  }
}

// Initial Instant Render
updateCategoryCounts();
renderList(true);
