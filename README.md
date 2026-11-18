# Hariike Styles - React Website

A modern, elegant fashion website built with React for Hariike Styles, showcasing custom-tailored pieces and collections.

## 🚀 Features

- **Modern React Architecture**: Built with React 18 and React Router
- **Responsive Design**: Fully responsive across all devices
- **Dynamic Image Carousel**: Smooth transitions on home page hero section
- **Collection Filtering**: Interactive collection browsing with category filters
- **Image Galleries**: Multi-image support for each collection item
- **Smooth Animations**: Elegant transitions and hover effects
- **SEO Friendly**: Proper meta tags and semantic HTML

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

## 🛠️ Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "C:\Users\USER\Desktop\Hariike Web"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up images:**
   - Copy your `images` folder to the `public` directory
   - Or run this command:
   ```bash
   xcopy images public\images /E /I /Y
   ```

## 🎯 Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

The site will open at [http://localhost:3000](http://localhost:3000)

### Production Build

Create an optimized production build:
```bash
npm run build
```

The optimized files will be in the `build` folder.

## 📁 Project Structure

```
Hariike Web/
├── public/
│   ├── images/              # All website images
│   │   ├── banner1.jpg
│   │   ├── banner2.jpg
│   │   ├── banner3.jpg
│   │   ├── gallery1-6.jpg
│   │   ├── logo.png
│   │   ├── director.jpg
│   │   ├── consultation.jpg
│   │   ├── collection-banner.jpg
│   │   └── collection items (summer-rain-1.jpg, etc.)
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js        # Navigation component
│   │   └── Footer.js        # Footer component
│   ├── pages/
│   │   ├── Home.js          # Home page with carousel
│   │   ├── About.js         # About page
│   │   ├── Services.js      # Services page
│   │   ├── Collection.js    # Collection page with filters
│   │   └── Consultation.js  # Booking page
│   ├── styles/
│   │   ├── styles.css       # Main styles
│   │   └── pages.css        # Page-specific styles
│   ├── App.js               # Main app component with routing
│   ├── index.js             # App entry point
│   └── index.css            # Base styles
├── package.json
└── README.md
```

## 🎨 Pages

1. **Home** (`/`) - Hero carousel, gallery showcase, testimonials
2. **About** (`/about`) - Company story and creative director info
3. **Services** (`/services`) - Service offerings
4. **Collection** (`/collection`) - Filterable product gallery
5. **Book a Consultation** (`/consultation`) - Booking page with Tally.so integration

## 🖼️ Required Images (27 total)

### Banner Images (3)
- `banner1.jpg`, `banner2.jpg`, `banner3.jpg`

### Gallery Images (6)
- `gallery1.jpg` through `gallery6.jpg`

### Additional Images (4)
- `logo.png` - Navigation logo
- `director.jpg` - Creative director photo
- `consultation.jpg` - Consultation page image
- `collection-banner.jpg` - Collection page banner

### Collection Items (14 - 2 per dress)
- Summer Rain Dress: `summer-rain-1.jpg`, `summer-rain-2.jpg`
- Nova 001: `nova-001-1.jpg`, `nova-001-2.jpg`
- Nova 002: `nova-002-1.jpg`, `nova-002-2.jpg`
- Tiara Dress: `tiara-1.jpg`, `tiara-2.jpg`
- The Ripple Dress: `ripple-1.jpg`, `ripple-2.jpg`
- Bloom Dress: `bloom-1.jpg`, `bloom-2.jpg`
- Velora Dress: `velora-1.jpg`, `velora-2.jpg`

## 🔧 Customization

### Update Collection Prices
Edit `src/pages/Collection.js` and modify the `collections` array.

### Change Contact Email
Update the email in `src/components/Footer.js`.

### Modify Colors
Edit CSS variables in `src/styles/styles.css`:
```css
:root {
    --primary-color: #C77400;
    --black: #000000;
    --white: #FFFFFF;
}
```

## 🌐 Deployment

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag the `build` folder to Netlify

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to GitHub Pages
1. Install gh-pages: `npm install gh-pages --save-dev`
2. Add to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/hariike-styles",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Deploy: `npm run deploy`

## 🐛 Troubleshooting

### Images not showing
- Ensure all images are in `public/images/`
- Check file names match exactly (case-sensitive)
- Verify image paths start with `/images/`

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Port already in use
- Kill the process using port 3000
- Or start on different port: `PORT=3001 npm start`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🆘 Support

For issues or questions:
- Email: Hariikestyles@gmail.com
- Check the `images/IMAGE_CHECKLIST.md` for image requirements

## 📄 License

© 2025 Hariike Styles. All rights reserved.

---

**Built with ❤️ using React**
