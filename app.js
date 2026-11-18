/**
 * ============================================================================
 * Motion Library - Instant Audio Cube Engine & Google Drive Sync
 * ============================================================================
 */

// Your Live Google Apps Script API Endpoint connected to "SOUNDS BY GUNEET"
const DRIVE_API_URL = "https://script.google.com/macros/s/AKfycbx9G-08mK6aRhUfiSBDL8jB--8K6jUd_wlfcRD38k2HsTVSjbJWkj_vZqPAN9M7H4PlvQ/exec";

// All Real resources loaded from Google Drive (Zero dummy/fake data)
let allResources = [];
let currentCategory = 'all';
let searchQuery = '';

// Audio Player Engine
let currentAudio = null;
let currentPlayingId = null;

// DOM Elements
const resourcesGrid = document.getElementById('resourcesGrid');
const searchInput = document.getElementById('searchInput');
const filterContainer = document.getElementById('filterContainer');
const emptyState = document.getElementById('emptyState');
const resetBtn = document.getElementById('resetBtn');
const syncText = document.getElementById('syncText');

// Now Playing Bar Elements
const nowPlayingBar = document.getElementById('nowPlayingBar');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingToggle = document.getElementById('nowPlayingToggle');
const nowPlayingDl = document.getElementById('nowPlayingDl');

/**
 * Play or Pause Sound Instantly
 */
function playSound(item) {
  if (!item || !item.streamUrl) return;

  const cubeElement = document.getElementById(`cube-${item.id}`);

  // If clicked on currently playing audio: toggle pause/play
  if (currentPlayingId === item.id && currentAudio) {
    if (currentAudio.paused) {
      currentAudio.play();
      if (cubeElement) updateCubePlayState(cubeElement, true);
      updateNowPlayingBar(item, true);
    } else {
      currentAudio.pause();
      if (cubeElement) updateCubePlayState(cubeElement, false);
      updateNowPlayingBar(item, false);
    }
    return;
  }

  // Stop previous audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    document.querySelectorAll('.sound-cube.is-playing').forEach(el => updateCubePlayState(el, false));
  }

  // Create & play new audio stream
  currentAudio = new Audio(item.streamUrl);
  currentPlayingId = item.id;
  currentAudio.preload = "auto";

  if (cubeElement) updateCubePlayState(cubeElement, true);
  updateNowPlayingBar(item, true);

  currentAudio.play().catch(err => {
    console.warn("Autoplay was prevented or network error:", err);
  });

  currentAudio.onended = () => {
    if (cubeElement) updateCubePlayState(cubeElement, false);
    updateNowPlayingBar(item, false);
    currentPlayingId = null;
  };
}

/**
 * Update UI for play/pause toggle
 */
function updateCubePlayState(cubeEl, isPlaying) {
  if (!cubeEl) return;
  const playBtn = cubeEl.querySelector('.cube-play-btn');

  if (isPlaying) {
    cubeEl.classList.add('is-playing');
    if (playBtn) {
      playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1"/>
          <rect x="14" y="5" width="4" height="14" rx="1"/>
        </svg>
      `;
    }
  } else {
    cubeEl.classList.remove('is-playing');
    if (playBtn) {
      playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
    }
  }
}

/**
 * Update Floating Now Playing Bar
 */
function updateNowPlayingBar(item, isPlaying) {
  if (!nowPlayingBar) return;

  if (isPlaying) {
    nowPlayingBar.style.display = 'flex';
    nowPlayingTitle.textContent = item.title;
    nowPlayingDl.href = item.downloadUrl;
    nowPlayingDl.setAttribute('download', `${item.title}.${(item.badge || 'mp3').toLowerCase()}`);
    nowPlayingToggle.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1"/>
        <rect x="14" y="4" width="4" height="16" rx="1"/>
      </svg>
    `;
  } else {
    nowPlayingToggle.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    `;
  }
}

// Toggle now playing button
if (nowPlayingToggle) {
  nowPlayingToggle.addEventListener('click', () => {
    if (currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play();
        const activeCube = document.getElementById(`cube-${currentPlayingId}`);
        if (activeCube) updateCubePlayState(activeCube, true);
        nowPlayingToggle.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
      } else {
        currentAudio.pause();
        const activeCube = document.getElementById(`cube-${currentPlayingId}`);
        if (activeCube) updateCubePlayState(activeCube, false);
        nowPlayingToggle.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      }
    }
  });
}

/**
 * Render 6-in-a-row Cube Grid
 */
function renderResources() {
  const filtered = allResources.filter(item => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.format && item.format.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  resourcesGrid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';

    filtered.forEach(item => {
      const cube = document.createElement('div');
      cube.className = 'sound-cube';
      cube.id = `cube-${item.id}`;
      cube.setAttribute('role', 'button');
      cube.setAttribute('tabindex', '0');
      cube.setAttribute('aria-label', `Play ${item.title}`);

      const isThisPlaying = currentPlayingId === item.id && currentAudio && !currentAudio.paused;
      if (isThisPlaying) cube.classList.add('is-playing');

      cube.innerHTML = `
        <div class="cube-top">
          <span class="cube-badge">${item.badge || 'AUDIO'}</span>
          <a class="cube-download-btn" href="${item.downloadUrl}" title="Download Sound" download="${item.title}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        </div>

        <button class="cube-play-btn" aria-label="Play/Pause">
          ${isThisPlaying ? `
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

        <!-- Ambient soundwave graphics in background -->
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

      // Prevent download click from triggering sound playback
      const dlBtn = cube.querySelector('.cube-download-btn');
      dlBtn.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Clicking cube plays/pauses immediately
      cube.addEventListener('click', () => {
        playSound(item);
      });

      cube.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playSound(item);
        }
      });

      resourcesGrid.appendChild(cube);
    });
  }
}

/**
 * Filter Pills Click Listener
 */
filterContainer.addEventListener('click', (e) => {
  const targetPill = e.target.closest('.filter-pill');
  if (!targetPill) return;

  document.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
  targetPill.classList.add('active');

  currentCategory = targetPill.dataset.category;
  renderResources();
});

/**
 * Live Search Listener
 */
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderResources();
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

  renderResources();
});

/**
 * Update Category Count Badges
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

/**
 * Fetch Live Data from Google Apps Script
 */
async function loadDriveData() {
  // Check local cache for instant 0ms load
  const cached = localStorage.getItem('motion_library_drive_cache');
  if (cached) {
    try {
      const cachedData = JSON.parse(cached);
      if (Array.isArray(cachedData) && cachedData.length > 0) {
        allResources = cachedData;
        updateCategoryCounts();
        renderResources();
      }
    } catch (e) {}
  }

  try {
    syncText.textContent = "Connecting to Google Drive...";
    const res = await fetch(DRIVE_API_URL);
    const json = await res.json();

    if (json.status === "success" && Array.isArray(json.data)) {
      localStorage.setItem('motion_library_drive_cache', JSON.stringify(json.data));
      allResources = json.data;
      syncText.textContent = `Google Drive Live (${json.count} Sound FX Loaded)`;
      updateCategoryCounts();
      renderResources();
    }
  } catch (err) {
    console.warn("Could not sync with Google Drive live endpoint:", err);
    syncText.textContent = `Google Drive Offline (${allResources.length} Items)`;
  }
}

// Initial load
loadDriveData();
