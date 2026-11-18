/**
 * ============================================================================
 * Motion Library - Application Logic & Live Google Drive Integration
 * ============================================================================
 */

// Your Live Google Apps Script API Endpoint connected to "SOUNDS BY GUNEET"
const DRIVE_API_URL = "https://script.google.com/macros/s/AKfycbx9G-08mK6aRhUfiSBDL8jB--8K6jUd_wlfcRD38k2HsTVSjbJWkj_vZqPAN9M7H4PlvQ/exec";

// Default/Curated graphic packs matching reference screenshot
const BASE_RESOURCES = [
  {
    id: 'base-1',
    title: 'Classic Rush Thumbnail Pack',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'classic-rush',
    description: 'High-energy esports and gaming thumbnail composition pack with editable PSDs, dynamic character lighting styles, and custom typography layers.',
    format: 'PSD • 140 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'POPULAR',
    downloadUrl: '#'
  },
  {
    id: 'base-2',
    title: 'Social Media Icons Pack',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'social-media',
    description: 'Modern animated lower-thirds and clean social icon badges for YouTube, Twitter/X, Instagram, and TikTok with customizable handles.',
    format: 'AEP / MOGRT • 85 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'HOT',
    downloadUrl: '#'
  },
  {
    id: 'base-3',
    title: '30+ Color Grading Luts',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'luts-pack',
    description: 'Cinematic color lookup tables (CUBE files) tailored for VN Editor, Premiere Pro, DaVinci Resolve, and mobile video workflows.',
    format: 'CUBE • 24 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'FREE',
    downloadUrl: '#'
  },
  {
    id: 'base-4',
    title: 'Cool Animated Stream Pack',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'stream-pack',
    description: 'Complete overlay package including Starting Soon, Ending, Be Right Back screens, chat boxes, and animated alert borders.',
    format: 'WEBM / PNG • 190 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'NEW',
    downloadUrl: '#'
  },
  {
    id: 'base-5',
    title: '150+ PUBG Backgrounds Pack',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'pubg-bg',
    description: 'Curated 4K battlefield environments, moody skyboxes, combat smoke overlays, and lighting textures for battle royale creators.',
    format: 'PNG / JPG • 420 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'PACK',
    downloadUrl: '#'
  },
  {
    id: 'base-6',
    title: 'Make COD Thumbnail',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'cod-thumb',
    description: 'Action-packed military first-person shooter template toolkit with muzzle flares, particles, and bold tactical text presets.',
    format: 'PSD • 110 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'TRENDING',
    downloadUrl: '#'
  },
  {
    id: 'base-7',
    title: '8 Lightroom Preset Pack',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'lightroom-preset',
    description: 'Moody urban and dark tactical tone presets for Adobe Lightroom desktop and mobile (XMP and DNG formats included).',
    format: 'XMP / DNG • 18 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'PRESET',
    downloadUrl: '#'
  },
  {
    id: 'base-8',
    title: 'How to Make Channel Banner',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'channel-banner',
    description: 'Pixel-perfect YouTube and Twitch banner templates calibrated for desktop, tablet, and mobile safe zones with sci-fi aesthetics.',
    format: 'PSD • 65 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'GUIDE',
    downloadUrl: '#'
  },
  {
    id: 'base-9',
    title: 'Cyberpunk Display Sans',
    category: 'fonts',
    categoryDisplay: 'Fonts',
    type: 'generic',
    colorTheme: 'cyber',
    description: 'Sharp, futuristic geometric display typeface designed for esports logos, high-impact titles, and sci-fi video editing.',
    format: 'OTF / TTF • 6 MB',
    license: 'OFL / Free for Commercial',
    badge: 'FONT',
    downloadUrl: '#'
  },
  {
    id: 'base-10',
    title: 'Dynamic Glitch Transitions',
    category: 'video-templates',
    categoryDisplay: 'Video Templates',
    type: 'generic',
    colorTheme: 'amber',
    description: 'Seamless drag-and-drop digital RGB split glitch transitions compatible with Premiere Pro, FCPX, and DaVinci Resolve.',
    format: 'PRPROJ / DRX • 180 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'VIDEO',
    downloadUrl: '#'
  }
];

// Active combined resources
let allResources = [...BASE_RESOURCES];
let currentCategory = 'graphic-templates';
let searchQuery = '';

// Audio Player State
let currentAudio = null;
let currentPlayingId = null;

// DOM Elements
const resourcesGrid = document.getElementById('resourcesGrid');
const searchInput = document.getElementById('searchInput');
const filterContainer = document.getElementById('filterContainer');
const emptyState = document.getElementById('emptyState');
const resetBtn = document.getElementById('resetBtn');
const syncText = document.getElementById('syncText');

// Modal Elements
const detailModal = document.getElementById('detailModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalPreview = document.getElementById('modalPreview');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalFormat = document.getElementById('modalFormat');
const modalLicense = document.getElementById('modalLicense');
const modalDownloadBtn = document.getElementById('modalDownloadBtn');

/**
 * Thumbnail SVG Generator
 */
function createThumbnailSvg(item) {
  const type = item.type;
  const title = item.title;

  if (type === 'classic-rush') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-rush" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#050814"/>
            <stop offset="50%" stop-color="#1e3a8a"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
          <linearGradient id="txt-gold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="100%" stop-color="#eab308"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#g-rush)"/>
        <circle cx="500" cy="180" r="160" fill="#38bdf8" opacity="0.2" filter="blur(40px)"/>
        <g transform="translate(60, 160)">
          <rect x="-10" y="-30" width="160" height="38" rx="6" fill="#facc15" transform="rotate(-4)"/>
          <text x="0" y="-4" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="28" fill="#000" transform="rotate(-4)">CLASSIC</text>
          <text x="0" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="64" fill="url(#txt-gold)" letter-spacing="2">RUSH</text>
          <text x="5" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="20" fill="#ffffff" letter-spacing="4">Gameplay</text>
        </g>
      </svg>
    `;
  }

  if (type === 'social-media') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="360" fill="#18181b"/>
        <g transform="translate(50, 130)">
          <rect x="0" y="0" width="180" height="28" rx="4" fill="#ffffff"/>
          <text x="10" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" fill="#000">MAKE TRENDY</text>
          <text x="0" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="28" fill="#ffffff">ANIMATED</text>
          <text x="0" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="18" fill="#d8b4fe">LOWER THIRDS</text>
        </g>
        <g transform="translate(340, 100)">
          <rect width="250" height="44" rx="10" fill="#0284c7"/>
          <text x="20" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="13" fill="#ffffff">@YourName (Twitter)</text>
          <rect y="56" width="250" height="44" rx="10" fill="#ec4899"/>
          <text x="20" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="13" fill="#ffffff">@YourName (Instagram)</text>
        </g>
      </svg>
    `;
  }

  if (type === 'luts-pack') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="360" fill="#0f2b38"/>
        <rect x="320" width="320" height="360" fill="#3b0764"/>
        <g transform="translate(320, 195)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="38" fill="#facc15">30+ LUTS PACK</text>
          <rect x="-120" y="16" width="240" height="30" rx="6" fill="#18181b"/>
          <text y="37" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" fill="#ffffff">FREE DOWNLOAD</text>
        </g>
      </svg>
    `;
  }

  if (type === 'stream-pack') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="360" fill="#121214"/>
        <g transform="translate(320, 130)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" fill="#f97316">ANIMATED STREAM PACK</text>
          <text y="42" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="34" fill="#ea580c">STREAMING STARTING</text>
        </g>
      </svg>
    `;
  }

  if (type === 'pubg-bg') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="360" fill="#0b0f19"/>
        <g transform="translate(320, 200)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="36" fill="#facc15">150+ PUBG</text>
          <text y="38" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="28" fill="#ffffff">BACKGROUNDS PACK</text>
        </g>
      </svg>
    `;
  }

  if (type === 'cod-thumb') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="360" fill="#042f2e"/>
        <g transform="translate(320, 190)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="40" fill="#2dd4bf">CALL OF DUTY</text>
          <text y="34" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="16" fill="#ffffff">MAKE COD THUMBNAIL</text>
        </g>
      </svg>
    `;
  }

  if (type === 'lightroom-preset') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="360" fill="#18181b"/>
        <g transform="translate(320, 190)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="44" fill="#38bdf8">8 LIGHTROOM</text>
          <text y="40" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="32" fill="#facc15">PRESET PACK</text>
        </g>
      </svg>
    `;
  }

  if (type === 'channel-banner') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="360" fill="#2e1065"/>
        <g transform="translate(320, 190)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="34" fill="#facc15">HOW TO MAKE</text>
          <text y="38" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="30" fill="#ffffff">CHANNEL BANNER</text>
        </g>
      </svg>
    `;
  }

  // Audio / Sound Effect card representation
  if (item.category === 'sound-effects') {
    // Generate vibrant soundwave bars
    const bars = [14, 28, 42, 65, 85, 45, 95, 75, 55, 80, 100, 70, 40, 60, 30, 18];
    const barsSvg = bars.map((h, i) => {
      const x = 160 + i * 20;
      const y = 180 - h / 2;
      return `<rect x="${x}" y="${y}" width="8" height="${h}" rx="4" fill="#ccff00" opacity="0.9"/>`;
    }).join('');

    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-sound-${item.id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#09090b"/>
            <stop offset="60%" stop-color="#18181b"/>
            <stop offset="100%" stop-color="#27272a"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#g-sound-${item.id})"/>
        <circle cx="320" cy="180" r="140" fill="#ccff00" opacity="0.08" filter="blur(60px)"/>
        <g>${barsSvg}</g>
        <g transform="translate(320, 290)" text-anchor="middle">
          <rect x="-100" y="-22" width="200" height="28" rx="6" fill="rgba(0,0,0,0.6)"/>
          <text y="-3" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="#ccff00" letter-spacing="2">AUDIO FX • ${item.badge || 'MP3'}</text>
        </g>
      </svg>
    `;
  }

  // Generic fallback
  return `
    <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="360" fill="#18181b"/>
      <g transform="translate(320, 190)" text-anchor="middle">
        <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="28" fill="#ffffff">${title}</text>
      </g>
    </svg>
  `;
}

/**
 * Update Pill Counts
 */
function updateCategoryCounts() {
  const counts = {
    all: allResources.length,
    'fonts': allResources.filter(r => r.category === 'fonts').length,
    'graphic-templates': allResources.filter(r => r.category === 'graphic-templates').length,
    'sound-effects': allResources.filter(r => r.category === 'sound-effects').length,
    'video-templates': allResources.filter(r => r.category === 'video-templates').length
  };

  for (let cat in counts) {
    const el = document.getElementById(`count-${cat}`);
    if (el) el.textContent = `(${counts[cat]})`;
  }
}

/**
 * Play/Pause Audio Helper
 */
function toggleAudio(item, cardWrapper, playBtn) {
  if (!item.streamUrl) return;

  if (currentPlayingId === item.id && currentAudio) {
    if (currentAudio.paused) {
      currentAudio.play();
      cardWrapper.classList.add('is-playing');
    } else {
      currentAudio.pause();
      cardWrapper.classList.remove('is-playing');
    }
    return;
  }

  // Stop existing audio
  if (currentAudio) {
    currentAudio.pause();
    document.querySelectorAll('.card-thumb-wrapper.is-playing').forEach(el => el.classList.remove('is-playing'));
  }

  currentAudio = new Audio(item.streamUrl);
  currentPlayingId = item.id;
  cardWrapper.classList.add('is-playing');

  currentAudio.play().catch(e => console.warn('Audio play prevented:', e));

  currentAudio.onended = () => {
    cardWrapper.classList.remove('is-playing');
    currentPlayingId = null;
  };
}

/**
 * Render items in the grid
 */
function renderResources() {
  const filtered = allResources.filter(item => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.format && item.format.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  resourcesGrid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'resource-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${item.title} - ${item.categoryDisplay}`);

      const isAudio = item.category === 'sound-effects';
      const svgContent = createThumbnailSvg(item);

      card.innerHTML = `
        <div class="card-thumb-wrapper" id="thumb-${item.id}">
          ${svgContent}
          <div class="card-overlay-badge">${item.badge || 'VIEW'}</div>
          ${isAudio ? `
            <div class="card-play-btn" title="Quick Preview Audio">
              <div class="play-circle">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          ` : ''}
        </div>
        <div class="card-info">
          <h3 class="card-title">${item.title}</h3>
          <span class="card-category">${item.categoryDisplay}</span>
        </div>
      `;

      // Quick play on audio card play button
      const thumbWrapper = card.querySelector('.card-thumb-wrapper');
      const playBtn = card.querySelector('.card-play-btn');
      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleAudio(item, thumbWrapper, playBtn);
        });
      }

      // Open Modal on card click
      card.addEventListener('click', () => openModal(item));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(item);
        }
      });

      resourcesGrid.appendChild(card);
    });
  }
}

/**
 * Filter pills click listener
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
 * Live search listener
 */
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderResources();
});

/**
 * Reset filters button
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
 * Modal Handling
 */
function openModal(item) {
  modalTitle.textContent = item.title;
  modalCategory.textContent = item.categoryDisplay;
  modalDesc.textContent = item.description || `High-quality ${item.format} asset ready for your creative projects.`;
  modalFormat.textContent = item.format || 'ZIP • 25 MB';
  modalLicense.textContent = item.license || 'Free Personal & Commercial';
  modalPreview.innerHTML = createThumbnailSvg(item);

  // If audio, add in-modal audio player
  if (item.category === 'sound-effects' && item.streamUrl) {
    const audioPlayer = document.createElement('div');
    audioPlayer.className = 'modal-audio-controls';
    audioPlayer.innerHTML = `
      <audio controls autoplay style="width: 100%;">
        <source src="${item.streamUrl}" type="audio/mpeg">
        <source src="${item.streamUrl}" type="audio/wav">
        Your browser does not support the audio element.
      </audio>
    `;
    modalPreview.appendChild(audioPlayer);
  }

  // Set direct download button href
  if (item.downloadUrl && item.downloadUrl !== '#') {
    modalDownloadBtn.href = item.downloadUrl;
    modalDownloadBtn.setAttribute('download', item.title);
  } else {
    modalDownloadBtn.href = '#';
  }

  detailModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  detailModal.classList.remove('active');
  document.body.style.overflow = '';
  const modalAudio = modalPreview.querySelector('audio');
  if (modalAudio) {
    modalAudio.pause();
  }
}

modalCloseBtn.addEventListener('click', closeModal);
detailModal.addEventListener('click', (e) => {
  if (e.target === detailModal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && detailModal.classList.contains('active')) {
    closeModal();
  }
});

/**
 * Fetch Live Data from Google Apps Script
 */
async function loadDriveData() {
  // Check local cache first for instant 0ms render
  const cached = localStorage.getItem('motion_library_drive_cache');
  if (cached) {
    try {
      const cachedData = JSON.parse(cached);
      if (Array.isArray(cachedData) && cachedData.length > 0) {
        allResources = [...BASE_RESOURCES, ...cachedData];
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
      // Save cache
      localStorage.setItem('motion_library_drive_cache', JSON.stringify(json.data));

      // Merge Drive data with Graphic Templates
      allResources = [...BASE_RESOURCES, ...json.data];
      syncText.textContent = `Google Drive Live (${json.count} Sound FX Loaded)`;
      updateCategoryCounts();
      renderResources();
    }
  } catch (err) {
    console.warn("Could not sync with Google Drive live endpoint:", err);
    syncText.textContent = `Google Drive Offline / Cached (${allResources.length} Items)`;
  }
}

// Initialize
updateCategoryCounts();
renderResources();
loadDriveData();
