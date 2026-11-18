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

/**
 * Filter resources by category and active search query
 */
function getFilteredResources() {
  return allResources.filter(item => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
  cube.setAttribute('aria-label', `Play ${item.title}`);

  const isCurrent = currentActiveItem && currentActiveItem.id === item.id;
  const isPlaying = isCurrent && !masterAudio.paused;

  if (isPlaying) {
    cube.classList.add('is-playing');
  }

  cube.innerHTML = `
    <div class="cube-top">
      <span class="cube-badge">${item.badge || 'AUDIO'}</span>
      <a class="cube-download-btn" href="${item.audioUrl || item.downloadUrl}" title="Download Sound" download="${item.title}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </a>
    </div>

    <button class="cube-play-btn" aria-label="Play/Pause">
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
    </button>

    <div class="cube-bottom">
      <div class="cube-title" title="${item.title}">${item.title}</div>
      <div class="cube-size">${item.size || ''}</div>
    </div>

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
  `;

  // Download button click prevents audio play trigger
  const dlBtn = cube.querySelector('.cube-download-btn');
  dlBtn.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Clicking cube plays sound instantly
  cube.addEventListener('click', () => {
    toggleSound(item, cube);
  });

  cube.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSound(item, cube);
    }
  });

  return cube;
}

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
    return;
  }

  // Switch to new sound
  currentActiveItem = item;

  // Un-highlight previous active cube
  document.querySelectorAll('.sound-cube.is-playing').forEach(el => {
    el.classList.remove('is-playing');
    const b = el.querySelector('.cube-play-btn');
    if (b) b.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  });

  // Update Bottom Player Dock Info
  playerTitle.textContent = item.title;
  playerBadge.textContent = item.badge || 'AUDIO';
  playerDownloadBtn.href = item.audioUrl || item.downloadUrl;
  playerDownloadBtn.setAttribute('download', `${item.title}.${(item.badge || 'mp3').toLowerCase()}`);

  // Set audio source: use local sounds file first, fallback to drive download URL
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
}

/**
 * Synchronize Master Audio Events with UI
 */
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
});

masterAudio.addEventListener('ended', () => {
  if (playerCard) playerCard.classList.add('is-paused');
  if (currentActiveItem) {
    const activeCube = document.getElementById(`cube-${currentActiveItem.id}`);
    if (activeCube) {
      activeCube.classList.remove('is-playing');
      const b = activeCube.querySelector('.cube-play-btn');
      if (b) b.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    }
  }
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
  });
  currentActiveItem = null;
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

  paginationCountText.textContent = `Showing ${end} of ${filtered.length} sounds`;

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
  renderList(true);
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

  renderList(true);
});

/**
 * Update Pill Count Badges
 */
function updateCategoryCounts() {
  const countAll = document.getElementById('count-all');
  const countSounds = document.getElementById('count-sound-effects');

  if (countAll) countAll.textContent = `(${allResources.length})`;
  if (countSounds) {
    const sfxCount = allResources.filter(r => r.category === 'sound-effects').length;
    countSounds.textContent = `(${sfxCount})`;
  }
}

// Initial Instant Render
updateCategoryCounts();
renderList(true);
