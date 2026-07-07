<div align="center">

# 🎓 Student Management Portal

**A Full-Stack MERN Application for College Student, Faculty & Attendance Management**

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com/)
[![2FA](https://img.shields.io/badge/2FA-Google_Authenticator-4285F4?style=flat-square&logo=google&logoColor=white)](#)

### 🌐 [Live Demo → student-management-portal-vsur.onrender.com](https://student-management-portal-vsur.onrender.com)

</div>

---

## ✨ Features

- **3 Role-Based Dashboards** — Admin, Faculty, Student
- **Google Authenticator 2FA** — TOTP-based security for Admin & Faculty
- **Instant QR Code Provisioning** — Auto-generates scannable QR when creating faculty
- **Hour-Wise Attendance** — Granular tracking per subject, per hour (1–8)
- **Department-Wise Bunkers List** — Detects students who skip hours after attending early
- **Dedicated Faculty Attendance Viewer** — Date, class, and hour-level filters
- **Fully Responsive UI** — Works on mobile, tablet and desktop
- **Real-Time Analytics** — Attendance percentage with color-coded status alerts
- **Full CRUD** — Students, Subjects, Faculty Allocations
- **Auto Session Timeout** — 10-minute inactivity logout

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, React Router, Axios, Bootstrap 5 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **Security** | speakeasy (TOTP), bcryptjs, JWT |
| **Hosting** | Render (Frontend + Backend), MongoDB Atlas |

---

## 🌐 Live Deployment

| Service | URL |
|---|---|
| 🖥️ **Frontend** | https://student-management-portal-vsur.onrender.com |
| ⚙️ **Backend API** | https://student-management-server-cmpq.onrender.com |
| 🗄️ **Database** | MongoDB Atlas (Cloud) |

> ⚠️ **Free Tier Note:** The backend may take 30–50 seconds to wake up after inactivity. This is normal for Render's free tier.

---

## 🔐 Default Login Credentials

| Role | Login ID | Password |
|---|---|---|
| **Student** | `235801` | `235801` |
| **Student** | `235802` | `235802` |
| **Student** | `235803` | `235803` |
| **Student** | `235804` | `235804` |
| **Admin** | `admin` | 6-digit Google Authenticator code |
| **Faculty** | `23325` (Prof. Vishnu) | 6-digit Google Authenticator code |
| **Faculty** | `23326` (Prof. Lakshmi) | 6-digit Google Authenticator code |

> 📱 **Admin & Faculty** use Google Authenticator app for login (TOTP). Run `node seed.js` to get the TOTP secrets.

---

## 🚀 Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Shivaramakrishnaganji/Student-Management-Portal.git
cd Student-Management-Portal

# 2. Setup Backend
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your MONGO_URI, JWT_SECRET

# Seed the database (creates default users)
node seed.js

# Start backend
npm run dev      # runs on http://localhost:5000

# 3. Setup Frontend (new terminal)
cd client
npm install
npm run dev      # runs on http://localhost:5173
```

---

## 🗂️ Project Structure

```
Student-Management-Portal/
├── client/                  # React Frontend (Vite)
│   ├── public/
│   │   └── _redirects       # Render SPA routing fix
│   ├── src/
│   │   ├── components/      # Navbar, Table
│   │   ├── pages/           # All page components
│   │   ├── services/        # API calls (axios)
│   │   └── App.jsx
│   └── vite.config.js
│
├── server/                  # Node.js Backend (Express)
│   ├── config/              # MongoDB connection
│   ├── controllers/         # Route logic
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── seed.js              # Database seeder
│   └── server.js            # Entry point
│
└── render.yaml              # Render deployment config
```

---

## ☁️ Deploy on Render (Step by Step)

### Step 1 — MongoDB Atlas
1. Create free account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free **M0 cluster**
3. Create a database user with username & password
4. Under **Network Access** → allow `0.0.0.0/0`
5. Get your connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/student_management
   ```

### Step 2 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3 — Deploy Backend (Web Service)
1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Configure:

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

4. Add Environment Variables:

| Key | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any random secret string |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your frontend URL (add after step 4) |

### Step 4 — Deploy Frontend (Static Site)
1. Go to [render.com](https://render.com) → **New → Static Site**
2. Connect same GitHub repo
3. Configure:

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

4. Add Environment Variable:

| Key | Value |
|---|---|
| `VITE_API_URL` | Your backend URL from Step 3 |

5. Under **Settings → Redirect & Rewrite Rules**, add:

| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | `Rewrite` |

### Step 5 — Seed the Database
Visit this URL in your browser (replace with your backend URL):
```
https://your-backend.onrender.com/api/seed?secret=seed_student_portal
```
This creates all default users and sample data. The response shows all login credentials.

---

## 📖 Documentation

See [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for complete technical documentation including:
- System architecture diagrams
- API documentation (20+ endpoints)
- Database ER diagrams
- Security implementation details

---

## 📄 License

MIT License — feel free to use and modify!
