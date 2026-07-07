<div align="center">

# 🎓 Student Management Portal

**A Full-Stack MERN Application for College Student, Faculty & Attendance Management**

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![2FA](https://img.shields.io/badge/2FA-Google_Authenticator-4285F4?style=flat-square&logo=google&logoColor=white)](#)

</div>

---

## ✨ Features

- **3 Role-Based Dashboards** — Admin, Faculty, Student
- **Google Authenticator 2FA** — TOTP-based security for Admin & Faculty
- **Instant QR Code Provisioning** — Auto-generates scannable QR when creating faculty
- **Hour-Wise Attendance** — Granular tracking per subject, per hour (1–8)
- **Department-Wise Bunkers List** — Detects and lists students who attend early hours but skip subsequent hours. Features all-time stats and "High Risk" indicators.
- **Dedicated Faculty Attendance Viewer** — Separate viewing page with date, class, and hour-level filters.
- **Premium Light Theme Redesign** — Beautiful visual theme with frosted glass menus, custom inputs, clean tables, and soft pastel badges.
- **Real-Time Analytics** — Attendance percentage with color-coded status alerts
- **Full CRUD** — Students, Subjects, Faculty Allocations
- **Auto Session Timeout** — 10-minute inactivity logout
- **Filtered Queries** — View students by class, faculty by branch

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router 7, Axios, Bootstrap 5 |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB |
| Security | speakeasy (TOTP), qrcode, bcryptjs |

## 🚀 Quick Start

```bash
# Clone
git clone <repository-url>
cd Major-Project

# Backend
cd server && npm install
npm run seed          # Seeds DB + prints TOTP secrets
npm run dev           # http://localhost:5000

# Frontend (new terminal)
cd client && npm install
npm run dev           # http://localhost:5173
```

## 🔐 Default Credentials

| Role | Login ID | Password |
|------|----------|----------|
| Admin | `admin` | Google Authenticator 6-digit code* |
| Faculty | `23325` | Google Authenticator 6-digit code* |
| Student | `235801` | `235801` |

> *TOTP secrets are printed to the console when you run `npm run seed`. Add them to Google Authenticator manually.

## 📖 Documentation

See [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for complete technical documentation including:
- System architecture diagrams
- API documentation (20 endpoints)
- Database ER diagrams
- Feature documentation
- Security implementation details

## 📄 License

MIT License

