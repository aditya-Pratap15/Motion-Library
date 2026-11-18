# Motion Library 🎬

A modern, minimalist, and responsive creative asset catalog website designed for video editors, graphic designers, and content creators.

Inspired by modern creative platforms, featuring instant live search, category filtering (Graphic Templates, Fonts, Sound Effects, Video Templates), and interactive resource detail previews.

## ✨ Features

- **Pixel-Accurate Theme**: Matches the clean aesthetic with custom lime accents (`#ccff00`), sleek pill buttons, and responsive grid.
- **Dynamic Search & Filtering**: Instant client-side search by title, category, or description.
- **Zero External Runtime Dependencies**: Pure HTML5, modern CSS, and vanilla JavaScript.
- **Ready for GitHub Pages**: Self-contained with relative assets for 100% free forever hosting.
- **Easy Content Customization**: Simply update `app.js` with your own download links, titles, images, or files.

## 🚀 How to Add Your Own Resources

Open `app.js` and edit the `RESOURCES_DATA` list:

```javascript
{
  id: 15,
  title: 'My Custom Pack',
  category: 'graphic-templates', // or 'fonts', 'sound-effects', 'video-templates'
  categoryDisplay: 'Graphic Templates',
  description: 'Pack details here...',
  format: 'ZIP • 50 MB',
  license: 'Free Commercial & Personal'
}
```

## 🌐 Hosting on GitHub Pages (Free Forever)

1. Open your repository on GitHub: [https://github.com/aditya-Pratap15/Motion-Library](https://github.com/aditya-Pratap15/Motion-Library)
2. Go to **Settings** (tab at the top right of the repo).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
5. Under **Branch**, select `main` and folder `/(root)`, then click **Save**.
6. Wait 1-2 minutes! GitHub will give you your free live URL:  
   `https://aditya-pratap15.github.io/Motion-Library/`
