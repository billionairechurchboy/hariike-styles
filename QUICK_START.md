# ⚡ Quick Start Guide - React Version

## 🎯 Get Running in 3 Steps!

### Step 1: Install Dependencies
```bash
npm install
```
⏱️ Takes ~2-3 minutes

### Step 2: Start Development Server
```bash
npm start
```
⏱️ Takes ~30 seconds

### Step 3: Open Your Browser
Automatically opens at: **http://localhost:3000**

**That's it! You're running!** 🎉

---

## ✅ What You Should See

1. **Home Page** - Hero carousel with rotating text
2. **Navigation** - Working links to all pages
3. **Gallery** - 6 gallery images
4. **Collection** - Filter buttons and collection items
5. **Footer** - Contact info and social links

---

## 🖼️ Image Setup Status

✅ **DONE** - Images already copied to `public/images/`

Your images are ready:
- 3 Banner images ✓
- 6 Gallery images ✓
- Logo ✓
- Director photo ✓
- Consultation image ✓
- Collection banner ✓
- Collection items (30 images) ✓

---

## 🔥 Hot Tips

### Making Changes
- Edit files in `src/`
- Changes appear **instantly** (no refresh needed!)
- Check terminal for any errors

### Common Edits

**Change a price:**
```javascript
// src/pages/Collection.js
price: '₦265,000'  // Change this number
```

**Update contact email:**
```javascript
// src/components/Footer.js
<p>Email: Hariikestyles@gmail.com</p>
```

**Change colors:**
```css
/* src/styles/styles.css */
--primary-color: #C77400;  /* Your brand color */
```

---

## 📱 Testing

### Desktop
- Open: `http://localhost:3000`

### Mobile
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac)
2. Open on phone: `http://YOUR_IP:3000`

---

## 🚀 Going Live

### Option 1: Netlify (Easiest)
```bash
npm run build
```
Then drag the `build` folder to [Netlify](https://netlify.com)

### Option 2: Vercel
```bash
npm run build
```
Then drag to [Vercel](https://vercel.com)

### Option 3: Your Own Server
```bash
npm run build
```
Upload the `build` folder contents to your server

---

## 🆘 Troubleshooting

### "Command not found: npm"
**Fix**: Install [Node.js](https://nodejs.org) first

### "Port 3000 already in use"
**Fix**: 
```bash
# Kill the process or use different port
set PORT=3001 && npm start
```

### "Cannot find module"
**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Images not showing
**Fix**: 
- Check `public/images/` folder exists
- Verify file names match (case-sensitive!)

---

## 📖 More Info

- **Full documentation**: See `README.md`
- **Migration details**: See `REACT_MIGRATION_GUIDE.md`
- **Image checklist**: See `images/IMAGE_CHECKLIST.md`

---

## 🎨 Your React App Structure

```
src/
├── components/
│   ├── Navbar.js          ← Edit navigation
│   └── Footer.js          ← Edit footer
├── pages/
│   ├── Home.js            ← Edit homepage
│   ├── About.js           ← Edit about page
│   ├── Services.js        ← Edit services
│   ├── Collection.js      ← Edit collection
│   └── Consultation.js    ← Edit booking page
└── styles/
    ├── styles.css         ← Main styles
    └── pages.css          ← Page styles
```

---

## ⚡ Development Workflow

1. **Start server**: `npm start`
2. **Make changes**: Edit files in `src/`
3. **See changes**: Auto-refresh in browser
4. **Build**: `npm run build` when ready
5. **Deploy**: Upload `build/` folder

---

## 🎉 You're All Set!

Your modern React website is ready to go!

**Need help?** Check the detailed guides or contact support.

**Happy coding!** 💻✨











