# Western Auto & Marine — website

Static HTML/CSS/JS site for westernautoandmarine.ae

## Structure
- `index.html` — homepage
- `about.html` — about page
- `contact.html` — contact page
- `css/styles.css` — all styling
- `js/main.js` — site JS (minimal for now)

## Push to GitHub

```bash
cd wam-site
git init
git add .
git commit -m "Initial site build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Deploy options

**Option A — your existing hosting (cPanel etc.)**
Upload all files to your domain's public_html (or equivalent) via FTP/File Manager.

**Option B — GitHub Pages / Netlify / Vercel**
Connect the repo and it will auto-deploy on every push. Then update your domain's DNS
(in your domain portal) to point at the host's provided records.

## Still to do
- Real photos (hero image, workshop, team) — currently text-only
- Logo file
- Real business hours
- Marine & offroad service pages once those lines are ready
- Google Search Console + GA4 (same setup used on myfixhive.ae)
