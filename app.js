/**
 * ============================================================================
 * Motion Library - Application Logic & Resource Catalog
 * ============================================================================
 * You can easily add, edit, or remove resources in the `RESOURCES_DATA` array below.
 */

// Helper to generate stylized SVG thumbnails matching the theme design
function createThumbnailSvg(type, title, subtitle, colorTheme) {
  const gradients = {
    blue: ['#0f172a', '#1e3a8a', '#3b82f6', '#60a5fa'],
    purple: ['#1e1b4b', '#581c87', '#9333ea', '#c084fc'],
    teal: ['#042f2e', '#115e59', '#0d9488', '#2dd4bf'],
    orange: ['#18181b', '#7c2d12', '#ea580c', '#fb923c'],
    green: ['#052e16', '#14532d', '#16a34a', '#4ade80'],
    cyber: ['#09090b', '#27272a', '#3f3f46', '#e4e4e7'],
    amber: ['#1c1917', '#78350f', '#d97706', '#fbbf24']
  };

  const colors = gradients[colorTheme] || gradients.blue;

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
        <!-- Background light streaks -->
        <circle cx="500" cy="180" r="160" fill="#38bdf8" opacity="0.2" filter="blur(40px)"/>
        <path d="M420 80 Q480 180 430 320" stroke="#60a5fa" stroke-width="6" opacity="0.4" fill="none"/>
        <path d="M470 50 Q540 180 490 340" stroke="#38bdf8" stroke-width="4" opacity="0.6" fill="none"/>
        
        <!-- Suit Character Silhouette -->
        <g transform="translate(380, 70)">
          <path d="M80 60 C80 30 110 30 110 60 C110 85 80 85 80 60 Z" fill="#e2e8f0"/>
          <path d="M72 50 L118 50 L112 60 L78 60 Z" fill="#0f172a"/> <!-- Glasses -->
          <path d="M40 95 L150 95 L170 290 L20 290 Z" fill="#1e293b"/> <!-- Suit Coat -->
          <polygon points="95,95 80,180 110,180" fill="#f8fafc"/> <!-- Shirt -->
          <polygon points="95,110 90,200 100,200" fill="#dc2626"/> <!-- Tie -->
          <polygon points="40,95 85,150 75,190 20,290" fill="#334155"/>
          <polygon points="150,95 105,150 115,190 170,290" fill="#0f172a"/>
        </g>

        <!-- Bold Titles -->
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
        <defs>
          <linearGradient id="g-soc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181b"/>
            <stop offset="35%" stop-color="#18181b"/>
            <stop offset="35.5%" stop-color="#6d28d9"/>
            <stop offset="100%" stop-color="#4c1d95"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#g-soc)"/>
        
        <!-- Left Side Text -->
        <g transform="translate(50, 130)">
          <rect x="0" y="0" width="180" height="28" rx="4" fill="#ffffff"/>
          <text x="10" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" fill="#000">MAKE TRENDY</text>
          <text x="0" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="28" fill="#ffffff">ANIMATED</text>
          <text x="0" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="18" fill="#d8b4fe">LOWER THIRDS</text>
          
          <g transform="translate(0, 110)">
            <rect width="36" height="36" rx="10" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
            <path d="M12 18 Q18 10 24 18 T30 18" stroke="#22c55e" stroke-width="3" fill="none"/>
          </g>
        </g>

        <!-- Right Side Social Badges -->
        <g transform="translate(340, 90)">
          <!-- Twitter / X -->
          <g transform="translate(0, 0)">
            <rect width="250" height="48" rx="12" fill="#0284c7"/>
            <circle cx="28" cy="24" r="14" fill="white" opacity="0.2"/>
            <path d="M22 24 L34 24" stroke="white" stroke-width="3"/>
            <text x="56" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#e0f2fe">Follow Me!</text>
            <text x="56" y="36" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="13" fill="#ffffff">@YourName</text>
          </g>
          
          <!-- Instagram -->
          <g transform="translate(0, 64)">
            <defs>
              <linearGradient id="g-insta" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f59e0b"/>
                <stop offset="50%" stop-color="#ec4899"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
            <rect width="250" height="48" rx="12" fill="url(#g-insta)"/>
            <rect x="18" y="14" width="20" height="20" rx="5" fill="none" stroke="white" stroke-width="2.5"/>
            <circle cx="28" cy="24" r="5" fill="none" stroke="white" stroke-width="2.5"/>
            <text x="56" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#fdf2f8">Follow Me!</text>
            <text x="56" y="36" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="13" fill="#ffffff">@YourName</text>
          </g>

          <!-- Facebook -->
          <g transform="translate(0, 128)">
            <rect width="250" height="48" rx="12" fill="#1d4ed8"/>
            <text x="24" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="24" fill="white">f</text>
            <text x="56" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#dbeafe">Follow Me!</text>
            <text x="56" y="36" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="13" fill="#ffffff">@YourName</text>
          </g>
        </g>
      </svg>
    `;
  }

  if (type === 'luts-pack') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-lut-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f2b38"/>
            <stop offset="100%" stop-color="#144d53"/>
          </linearGradient>
          <linearGradient id="g-lut-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
        </defs>
        <!-- Split comparison background -->
        <rect width="320" height="360" fill="url(#g-lut-left)"/>
        <rect x="320" width="320" height="360" fill="url(#g-lut-right)"/>
        <line x1="320" y1="0" x2="320" y2="360" stroke="#facc15" stroke-width="2" stroke-dasharray="8 6"/>

        <!-- VN Icon -->
        <g transform="translate(290, 80)">
          <rect width="60" height="60" rx="16" fill="#ffffff" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.4))"/>
          <text x="14" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="22" fill="#000000">VN</text>
        </g>

        <!-- Big Luts Title -->
        <g transform="translate(320, 195)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="38" fill="#facc15" letter-spacing="1">30+ LUTS PACK</text>
          <rect x="-120" y="16" width="240" height="30" rx="6" fill="#18181b"/>
          <text y="37" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" fill="#ffffff" letter-spacing="1.5">FREE DOWNLOAD</text>
        </g>
      </svg>
    `;
  }

  if (type === 'stream-pack') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="360" fill="#121214"/>
        
        <!-- Header text -->
        <g transform="translate(320, 75)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" fill="#f97316" letter-spacing="2">MAKE COOL ANIMATED</text>
          <text y="32" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="30" fill="#ea580c" letter-spacing="1">STREAM PACKAGE</text>
          <text y="58" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="13" fill="#a1a1aa">ON ANDROID</text>
        </g>

        <!-- Curved pointer arrow -->
        <path d="M520 120 C540 140 545 160 520 175" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        <polygon points="515,168 518,180 528,174" fill="#ffffff"/>

        <!-- Stream Cards -->
        <g transform="translate(60, 195)">
          <!-- Starting Soon -->
          <g transform="translate(0, 0)">
            <rect width="240" height="110" rx="12" fill="#09090b" stroke="#27272a" stroke-width="1.5"/>
            <polygon points="0,30 60,0 20,110 0,110" fill="#ea580c"/>
            <text x="80" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#ea580c" font-weight="700">STREAMING</text>
            <text x="80" y="74" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" fill="#ffffff" font-weight="900">STARTING</text>
          </g>

          <!-- Ending Soon -->
          <g transform="translate(280, 0)">
            <rect width="240" height="110" rx="12" fill="#09090b" stroke="#27272a" stroke-width="1.5"/>
            <polygon points="240,30 180,0 220,110 240,110" fill="#ea580c"/>
            <text x="60" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#ea580c" font-weight="700">STREAMING</text>
            <text x="60" y="74" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" fill="#ffffff" font-weight="900">ENDING</text>
          </g>
        </g>
      </svg>
    `;
  }

  if (type === 'pubg-bg') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-pubg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#020617"/>
            <stop offset="40%" stop-color="#311042"/>
            <stop offset="80%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#090d16"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#g-pubg)"/>
        
        <!-- Neon glows -->
        <circle cx="160" cy="180" r="120" fill="#a855f7" opacity="0.3" filter="blur(50px)"/>
        <circle cx="480" cy="180" r="140" fill="#3b82f6" opacity="0.25" filter="blur(60px)"/>

        <!-- PUBG helmet silhouette -->
        <g transform="translate(100, 70)" opacity="0.8">
          <path d="M40 70 C40 20 120 20 120 70 L130 130 L30 130 Z" fill="#334155"/>
          <rect x="50" y="70" width="60" height="25" rx="4" fill="#020617"/>
          <line x1="80" y1="70" x2="80" y2="95" stroke="#64748b" stroke-width="2"/>
        </g>

        <!-- Centered Badge -->
        <g transform="translate(320, 220)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="36" fill="#facc15" letter-spacing="1">150+ PUBG</text>
          <text y="38" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="2">BACKGROUNDS</text>
          <rect x="-60" y="48" width="120" height="24" rx="4" fill="#6366f1"/>
          <text y="65" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="#ffffff" letter-spacing="3">PACK</text>
        </g>
      </svg>
    `;
  }

  if (type === 'cod-thumb') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-cod" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#042f2e"/>
            <stop offset="60%" stop-color="#0f766e"/>
            <stop offset="100%" stop-color="#083344"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#g-cod)"/>
        
        <circle cx="200" cy="180" r="140" fill="#2dd4bf" opacity="0.25" filter="blur(50px)"/>

        <!-- Text group -->
        <g transform="translate(320, 160)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="44" fill="#e2e8f0" letter-spacing="4">CALL OF</text>
          <text y="48" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="44" fill="#2dd4bf" letter-spacing="4">DUTY</text>
          
          <rect x="-140" y="65" width="280" height="34" rx="6" fill="#000000"/>
          <text y="88" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" fill="#2dd4bf">MAKE COD THUMBNAIL</text>
          <text y="116" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="13" fill="#cbd5e1">ON ANDROID</text>
        </g>
      </svg>
    `;
  }

  if (type === 'lightroom-preset') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-lr" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181b"/>
            <stop offset="50%" stop-color="#27272a"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#g-lr)"/>
        
        <!-- Military moody camera backdrop -->
        <circle cx="320" cy="160" r="130" fill="#38bdf8" opacity="0.15" filter="blur(60px)"/>
        
        <g transform="translate(320, 180)" text-anchor="middle">
          <g transform="translate(-180, -20)">
            <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="120" fill="#e0f2fe">8</text>
          </g>
          
          <g transform="translate(30, -50)" text-anchor="start">
            <rect width="180" height="28" rx="4" fill="#0284c7"/>
            <text x="12" y="19" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="16" fill="#ffffff" letter-spacing="1">LIGHTROOM</text>
            <text x="2" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="34" fill="#ffffff" letter-spacing="2">PRESET</text>
            <text x="2" y="92" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="34" fill="#facc15" letter-spacing="2">PACK</text>
          </g>
        </g>
      </svg>
    `;
  }

  if (type === 'channel-banner') {
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-banner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2e1065"/>
            <stop offset="50%" stop-color="#3b0764"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#g-banner)"/>
        
        <circle cx="320" cy="180" r="150" fill="#a855f7" opacity="0.25" filter="blur(50px)"/>

        <!-- Banner Title -->
        <g transform="translate(320, 130)" text-anchor="middle">
          <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="30" fill="#facc15" letter-spacing="1">HOW TO MAKE</text>
          <text y="42" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="34" fill="#ffffff" letter-spacing="2">CHANNEL BANNER</text>
        </g>

        <!-- Curved pointer arrow -->
        <path d="M480 140 C520 160 510 185 490 200" fill="none" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
        <polygon points="485,190 490,205 498,198" fill="#facc15"/>

        <!-- Creators Tags -->
        <g transform="translate(320, 240)" text-anchor="middle">
          <rect x="-140" y="0" width="130" height="30" rx="6" fill="#18181b"/>
          <text x="-75" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="12" fill="#c084fc">PUBGM_ART</text>
          
          <rect x="10" y="0" width="130" height="30" rx="6" fill="#18181b"/>
          <text x="75" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="12" fill="#c084fc">MR GRAPHIX</text>
        </g>
      </svg>
    `;
  }

  // Generic fallback styled thumbnail for fonts, sounds, videos
  return `
    <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-dyn-${colorTheme}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors[0]}"/>
          <stop offset="50%" stop-color="${colors[1]}"/>
          <stop offset="100%" stop-color="${colors[2]}"/>
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill="url(#g-dyn-${colorTheme})"/>
      <circle cx="320" cy="180" r="140" fill="${colors[3]}" opacity="0.25" filter="blur(60px)"/>
      <g transform="translate(320, 160)" text-anchor="middle">
        <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="34" fill="#ffffff" letter-spacing="1">${title}</text>
        <rect x="-90" y="25" width="180" height="28" rx="6" fill="#ccff00"/>
        <text y="44" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="13" fill="#000000" letter-spacing="1.5">${subtitle.toUpperCase()}</text>
      </g>
    </svg>
  `;
}

// Complete resource catalog
const RESOURCES_DATA = [
  {
    id: 1,
    title: 'Classic Rush Thumbnail Pack',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'classic-rush',
    description: 'High-energy esports and gaming thumbnail composition pack with editable PSDs, dynamic character lighting styles, and custom typography layers.',
    format: 'PSD • 140 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'POPULAR'
  },
  {
    id: 2,
    title: 'Social Media Icons Pack',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'social-media',
    description: 'Modern animated lower-thirds and clean social icon badges for YouTube, Twitter/X, Instagram, and TikTok with customizable handles.',
    format: 'AEP / MOGRT • 85 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'HOT'
  },
  {
    id: 3,
    title: '30+ Color Grading Luts',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'luts-pack',
    description: 'Cinematic color lookup tables (CUBE files) tailored for VN Editor, Premiere Pro, DaVinci Resolve, and mobile video workflows.',
    format: 'CUBE • 24 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'FREE'
  },
  {
    id: 4,
    title: 'Cool Animated Stream Pack',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'stream-pack',
    description: 'Complete overlay package including Starting Soon, Ending, Be Right Back screens, chat boxes, and animated alert borders.',
    format: 'WEBM / PNG • 190 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'NEW'
  },
  {
    id: 5,
    title: '150+ PUBG Backgrounds Pack',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'pubg-bg',
    description: 'Curated 4K battlefield environments, moody skyboxes, combat smoke overlays, and lighting textures for battle royale creators.',
    format: 'PNG / JPG • 420 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'PACK'
  },
  {
    id: 6,
    title: 'Make COD Thumbnail',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'cod-thumb',
    description: 'Action-packed military first-person shooter template toolkit with muzzle flares, particles, and bold tactical text presets.',
    format: 'PSD • 110 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'TRENDING'
  },
  {
    id: 7,
    title: '8 Lightroom Preset Pack',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'lightroom-preset',
    description: 'Moody urban and dark tactical tone presets for Adobe Lightroom desktop and mobile (XMP and DNG formats included).',
    format: 'XMP / DNG • 18 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'PRESET'
  },
  {
    id: 8,
    title: 'How to Make Channel Banner',
    category: 'graphic-templates',
    categoryDisplay: 'Graphic Templates',
    type: 'channel-banner',
    description: 'Pixel-perfect YouTube and Twitch banner templates calibrated for desktop, tablet, and mobile safe zones with sci-fi aesthetics.',
    format: 'PSD • 65 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'GUIDE'
  },

  // Fonts Category Samples
  {
    id: 9,
    title: 'Cyberpunk Display Sans',
    category: 'fonts',
    categoryDisplay: 'Fonts',
    type: 'generic',
    colorTheme: 'cyber',
    description: 'Sharp, futuristic geometric display typeface designed for esports logos, high-impact titles, and sci-fi video editing.',
    format: 'OTF / TTF / WOFF2 • 6 MB',
    license: 'OFL / Free for Commercial',
    badge: 'FONT'
  },
  {
    id: 10,
    title: 'Ultra Bold Kinetic Type',
    category: 'fonts',
    categoryDisplay: 'Fonts',
    type: 'generic',
    colorTheme: 'orange',
    description: 'Heavyweight sans-serif engineered specifically for dynamic TikTok, Reels, and YouTube Shorts motion graphics.',
    format: 'OTF / TTF • 4 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'FONT'
  },

  // Sound Effects Category Samples
  {
    id: 11,
    title: 'Cinematic Whooshes & Risers',
    category: 'sound-effects',
    categoryDisplay: 'Sound Effects',
    type: 'generic',
    colorTheme: 'teal',
    description: 'Over 80 high-fidelity transitional sound effects, sub drops, organic whooshes, and impact hits recorded in 24-bit 96kHz.',
    format: 'WAV 96kHz • 310 MB',
    license: 'Royalty-Free Audio',
    badge: 'AUDIO'
  },
  {
    id: 12,
    title: 'UI Click & Pops Bundle',
    category: 'sound-effects',
    categoryDisplay: 'Sound Effects',
    type: 'generic',
    colorTheme: 'green',
    description: 'Crisp mechanical switch sounds, digital pops, mouse clicks, and tactile feedback SFX for app tutorials and editing.',
    format: 'WAV • 45 MB',
    license: 'Royalty-Free Audio',
    badge: 'AUDIO'
  },

  // Video Templates Category Samples
  {
    id: 13,
    title: '3D Clean Logo Reveal',
    category: 'video-templates',
    categoryDisplay: 'Video Templates',
    type: 'generic',
    colorTheme: 'purple',
    description: 'Minimalist metallic reflection logo intro with smooth camera pan and easily swappable SVG vector placeholder.',
    format: 'After Effects • 75 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'VIDEO'
  },
  {
    id: 14,
    title: 'Dynamic Glitch Transitions',
    category: 'video-templates',
    categoryDisplay: 'Video Templates',
    type: 'generic',
    colorTheme: 'amber',
    description: 'Seamless drag-and-drop digital RGB split glitch transitions compatible with Premiere Pro, FCPX, and DaVinci Resolve.',
    format: 'PRPROJ / DRX • 180 MB',
    license: 'Free for Personal & Commercial use',
    badge: 'VIDEO'
  }
];

// Current State
let currentCategory = 'graphic-templates'; // Matches active pill in reference screenshot
let searchQuery = '';

// DOM Elements
const resourcesGrid = document.getElementById('resourcesGrid');
const searchInput = document.getElementById('searchInput');
const filterContainer = document.getElementById('filterContainer');
const emptyState = document.getElementById('emptyState');
const resetBtn = document.getElementById('resetBtn');

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
 * Render items in the grid based on category and search query
 */
function renderResources() {
  const filtered = RESOURCES_DATA.filter(item => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

      const svgContent = createThumbnailSvg(item.type, item.title, item.categoryDisplay, item.colorTheme || 'blue');

      card.innerHTML = `
        <div class="card-thumb-wrapper">
          ${svgContent}
          <div class="card-overlay-badge">${item.badge || 'VIEW'}</div>
        </div>
        <div class="card-info">
          <h3 class="card-title">${item.title}</h3>
          <span class="card-category">${item.categoryDisplay}</span>
        </div>
      `;

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
  modalDesc.textContent = item.description;
  modalFormat.textContent = item.format || 'ZIP • Asset Bundle';
  modalLicense.textContent = item.license || 'Free Personal & Commercial';
  modalPreview.innerHTML = createThumbnailSvg(item.type, item.title, item.categoryDisplay, item.colorTheme || 'blue');

  modalDownloadBtn.onclick = () => {
    const originalText = modalDownloadBtn.innerHTML;
    modalDownloadBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Starting Download...
    `;
    setTimeout(() => {
      alert(`Download started for "${item.title}"!\nYou can link your actual cloud files, Google Drive, or CDN links in app.js.`);
      modalDownloadBtn.innerHTML = originalText;
    }, 600);
  };

  detailModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  detailModal.classList.remove('active');
  document.body.style.overflow = '';
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

// Initial Render
renderResources();
