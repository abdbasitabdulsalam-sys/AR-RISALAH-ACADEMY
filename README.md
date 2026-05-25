# 🕌 AR-Risalah Academy — School Management System

**Nursery & Basic School, Saki, Oyo State, Nigeria**

> *"Knowledge Is Insight"* — Mr. Ashiru Ismail Adekunle, Proprietor

---

## 📁 Project Structure

```
ar-risalah-academy/
├── public/                  ← Frontend (HTML, CSS, JS)
│   ├── index.html           ← Home page
│   ├── about.html           ← About page
│   ├── admission.html       ← Admission & registration
│   ├── results.html         ← Result generator & portal
│   ├── admin.html           ← Admin dashboard (ERP)
│   ├── portals.html         ← Login portals
│   ├── media.html           ← Gallery & School TV
│   ├── style.css            ← Master stylesheet
│   └── app.js               ← Shared JavaScript
├── backend/
│   └── server.js            ← Express.js API server
├── database/
│   └── schema.sql           ← PostgreSQL database setup
├── package.json             ← Node.js dependencies
├── railway.toml             ← Railway deployment config
├── Procfile                 ← Process config
├── .env.example             ← Environment variables template
├── .gitignore               ← Git ignore rules
└── README.md                ← This file
```

---

## 🚀 STEP-BY-STEP: Deploy to GitHub + Railway

### STEP 1 — Install Required Tools

Download and install:
- **Git**: https://git-scm.com/downloads
- **Node.js** (v18+): https://nodejs.org
- **VS Code** (optional): https://code.visualstudio.com

---

### STEP 2 — Create GitHub Account & Repository

1. Go to **https://github.com** → Sign up (free)
2. Click **"New"** (green button) or go to https://github.com/new
3. Repository name: `ar-risalah-academy`
4. Set to **Public** (required for free Railway)
5. Click **"Create repository"**

---

### STEP 3 — Upload Files to GitHub

**Option A — Using GitHub Website (Easiest for beginners):**

1. Open your repository on GitHub
2. Click **"uploading an existing file"** link
3. Drag ALL files from your `ar-risalah-academy` folder into the browser
4. Make sure to keep the folder structure:
   - `public/` folder with all `.html`, `.css`, `.js` files
   - `backend/server.js`
   - `database/schema.sql`
   - `package.json`, `railway.toml`, `Procfile`, `.env.example`, `.gitignore`
5. Click **"Commit changes"**

**Option B — Using Git Command Line:**

```bash
# Open terminal/command prompt in the ar-risalah-academy folder
cd ar-risalah-academy

# Initialize git
git init

# Add all files
git add .

# Save with message
git commit -m "Initial commit - AR-Risalah Academy School System"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ar-risalah-academy.git

# Upload to GitHub
git branch -M main
git push -u origin main
```

---

### STEP 4 — Create Railway Account

1. Go to **https://railway.app**
2. Click **"Login"** → Sign in with GitHub
3. Authorize Railway to access your GitHub

---

### STEP 5 — Add PostgreSQL Database on Railway

1. On Railway dashboard, click **"New Project"**
2. Click **"Add a Service"** → **"Database"** → **"PostgreSQL"**
3. Wait for database to be created (takes ~30 seconds)
4. Click the PostgreSQL service → **"Variables"** tab
5. Copy the `DATABASE_URL` value (you'll need it)

---

### STEP 6 — Deploy the Website on Railway

1. On the same project, click **"Add a Service"** → **"GitHub Repo"**
2. Select your `ar-risalah-academy` repository
3. Railway will auto-detect it's a Node.js app
4. It will start deploying automatically

---

### STEP 7 — Set Environment Variables on Railway

1. Click your web service on Railway
2. Go to **"Variables"** tab
3. Click **"Add Variable"** and add these one by one:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | (auto-linked from your PostgreSQL service) |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `JWT_SECRET` | `ar_risalah_change_this_secret_2025` |
| `SCHOOL_EMAIL` | `adekunleismail51@gmail.com` |
| `SCHOOL_PHONE` | `08022943827` |
| `SCHOOL_WHATSAPP` | `2348022943827` |

4. Click **"Deploy"** to restart with new variables

---

### STEP 8 — Set Up the Database

1. On Railway, click your **PostgreSQL** service
2. Go to **"Data"** tab → **"Query"**
3. Copy the entire contents of `database/schema.sql`
4. Paste into the query box and click **"Run Query"**
5. You should see: `"AR-Risalah Academy database setup complete!"`

---

### STEP 9 — Get Your Live URL

1. Click your web service on Railway
2. Go to **"Settings"** tab → **"Domains"**
3. Click **"Generate Domain"**
4. Your website will be live at something like:
   `https://ar-risalah-academy-production.up.railway.app`

---

## 🔐 Default Login Credentials

After deployment, log in with these credentials:

| Portal | Username | Password |
|--------|----------|----------|
| Admin | `admin` | `admin123` |
| Teacher | `teacher` | `teacher123` |
| Student | `student` | `student123` |
| Parent | `parent` | `parent123` |

> ⚠️ **IMPORTANT:** Change these passwords immediately after first login!

---

## 📱 Portal Access URLs

After deployment, access your portals at:

| Page | URL |
|------|-----|
| Home | `https://your-app.railway.app/` |
| Admin | `https://your-app.railway.app/admin.html` |
| Results | `https://your-app.railway.app/results.html` |
| Admission | `https://your-app.railway.app/admission.html` |
| Portals | `https://your-app.railway.app/portals.html` |

---

## 🌐 Connect to School Contact Info

The website is already linked to:
- **Email:** adekunleismail51@gmail.com
- **Phone:** 08022943827 / 08079265878
- **WhatsApp:** https://wa.me/2348022943827
- **Address:** Alh. Zakariyah Salaam Street, Saki, Oyo State

---

## 🔧 Updating the Website

When you want to make changes:

1. Edit files in the `public/` folder
2. If using GitHub website: Upload the changed file
3. If using Git: Run `git add . && git commit -m "Update" && git push`
4. Railway automatically re-deploys in ~2 minutes

---

## 📞 School Contact

**AR-Risalah Academy Nursery & Basic School**
- Address: Alh. Zakariyah Salaam Street, Behind Suurulere Kaomi Central Mosque, Off Kaomi Road, Saki, Oyo State, Nigeria
- Tel: 08022943827 / 08079265878
- Email: adekunleismail51@gmail.com
- WhatsApp: 08022943827

**Proprietor:** Mr. Ashiru Ismail Adekunle

---

*"Knowledge Is Insight" — AR-Risalah Academy, Saki*
