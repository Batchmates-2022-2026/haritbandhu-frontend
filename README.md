<div align="center">

<img src="src/assets/logo.png" alt="HaritBandhu Logo" width="100" />

# 🌾 HaritBandhu — Smart Farming Assistant

### AI-Powered Agricultural Web Application

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-Backend-6DB33F?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![Firebase](https://img.shields.io/badge/Firebase-FCM-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)

---

**B.Tech Final Year Capstone Project**  
Axis Institute of Technology & Management  
Academic Year 2025–26

**Team Members:**
| Name | Role |
|---|---|
| Simran | Team Lead & Frontend Developer |
| Sneha Gupta | Backend Developer |
| Jatin Yadav | Backend Developer & QA |

</div>

---

## 📌 Project Overview

**HaritBandhu** (meaning "Friend of Greenery" in Hindi) is an AI-powered smart farming assistant web application designed to empower Indian farmers with real-time agricultural intelligence. It bridges the gap between modern technology and rural agriculture by providing pest detection, weather alerts, market prices, crop guidance, and an AI chat assistant — all in one platform with multilingual support for 10+ Indian languages.

> **"Technology ke saath, Kisan aage badhe"** — With technology, the farmer moves forward.

---

## 🎯 Problem Statement

Indian farmers face multiple challenges:
- Lack of access to real-time crop disease and pest information
- No unified platform for mandi/market prices
- Limited awareness of government schemes and subsidies
- Inability to access agri-advisory in their native language
- Poor weather-based farming decisions

HaritBandhu addresses all these through a single, intuitive web application with a Spring Boot backend and React frontend fully integrated via REST APIs.

---

## ✨ Key Features

### 🔬 AI Pest Detection
- Upload or capture crop images
- Backend detects pest/disease using AI model
- Instant treatment recommendations returned from `POST /pest/detect` and `POST /pest/treatment`

### 🌤️ Live Weather & Farm Insights
- Auto-detects farmer's location via GPS
- Fetches real-time weather from `GET /weather/:city`
- Farming tips, irrigation advice, and pest risk based on weather

### 💰 Mandi Market Prices
- Live commodity prices from `GET /market-price/:crop`
- Filter by crop type, state/mandi, price trend
- 10 major crops fetched in parallel (mustard, wheat, rice, maize, etc.)

### 🏛️ Government Schemes
- Category-wise schemes from `GET /schemes?category=FARMER`
- Infinite scrolling carousel with search
- Direct apply links to official government portals

### 🤖 AI Chat Assistant
- Powered by Gemini AI via Spring Boot backend
- Farmers can ask questions in Hindi or English
- `POST /chat` endpoint returns intelligent responses

### 🧪 Soil Health Analysis
- Enter NPK, pH, organic carbon values
- `POST /soil/analyze` returns crop recommendations and deficiency report

### 🌱 Crop Selection Guide
- `GET /crop/filter?season=Kharif` fetches season-wise crops
- Detailed agronomic guidance: sowing time, harvest, water needs, soil type
- Expert tips per crop

### 👥 Kisan Community
- `GET /community/posts` — fetch all community discussions
- `POST /community/post` — create new posts
- `POST /community/like/:id` — like/unlike posts
- `POST /community/comment` — add comments
- Tag-based filtering: Disease, Irrigation, Pesticides, Soil, Market

### 🔔 Push Notifications (Firebase FCM)
- FCM token registered on login via `POST /user/save-fcm-token`
- Weather alerts and farming reminders

### 👤 User Profile & Admin
- Profile update: `POST /user/profile`
- Password change: `POST /user/change-password`
- Admin dashboard: `/admin/users`, `/admin/stats`, `/admin/activity`

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                  │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ AIChat   │  │ Weather  │  │  Market  │  │  Pest    │   │
│  │ .tsx     │  │ Section  │  │  Prices  │  │ Detection│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │              │          │
│  ┌────▼──────────────▼──────────────▼──────────────▼─────┐  │
│  │              src/services/ (Axios Layer)                │  │
│  │  apiClient.ts → JWT interceptor → localhost:8081        │  │
│  └─────────────────────────┬───────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP / REST
┌────────────────────────────▼────────────────────────────────┐
│                  BACKEND (Spring Boot :8081)                  │
│                                                              │
│  /auth  /user  /weather  /market-price  /pest  /chat        │
│  /schemes  /soil  /community  /crop  /admin                  │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ MySQL DB │  │  Gemini  │  │  Weather │  │  APMC    │   │
│  │          │  │   API    │  │   API    │  │  Data    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI Framework |
| Vite 5 | Build Tool & Dev Server |
| Tailwind CSS | Styling |
| shadcn/ui + Radix UI | UI Component Library |
| Axios | HTTP Client with JWT interceptor |
| @tanstack/react-query | Server state management |
| React Router DOM v6 | Client-side routing |
| Firebase (FCM) | Push Notifications |
| Framer Motion / CSS animations | Smooth UI transitions |
| React Hook Form + Zod | Form validation |
| Recharts | Data visualization |
| Sonner | Toast notifications |

### Backend (Spring Boot)
| Technology | Purpose |
|---|---|
| Spring Boot 3 | REST API Framework |
| Spring Security + JWT | Authentication |
| MySQL | Database |
| Gemini AI API | AI Chat Assistant |
| Firebase Admin SDK | Push Notification dispatch |

---

## 📁 Project Structure

```
src/
├── assets/                    # Logo, hero images
├── components/
│   ├── AIChat.tsx             # Gemini AI chat — POST /chat
│   ├── WeatherSection.tsx     # Live weather — GET /weather/:city
│   ├── MarketPrices.tsx       # Mandi rates — GET /market-price/:crop
│   ├── PestDetection.tsx      # AI pest scan — POST /pest/detect
│   ├── Schemes.tsx            # Govt schemes — GET /schemes?category=
│   ├── SoilHealth.tsx         # Soil analysis — POST /soil/analyze
│   ├── Cropselection.tsx      # Crop guide — GET /crop/filter
│   ├── community.tsx          # Community — GET/POST /community/*
│   ├── Navbar.tsx
│   └── ui/                    # shadcn/ui components
├── contexts/
│   ├── AuthContext.tsx         # Login/Register — POST /auth/login
│   └── LanguageContext.tsx     # i18n (10+ Indian languages)
├── services/                   # ← API Integration Layer
│   ├── apiClient.ts            # Axios base instance + JWT interceptor
│   ├── authService.ts          # /auth/login, /auth/register
│   ├── userService.ts          # /user/me, /user/profile, /user/change-password
│   ├── weatherService.ts       # /weather/:city
│   ├── marketPriceService.ts   # /market-price/:crop
│   ├── schemesService.ts       # /schemes?category=
│   ├── pestService.ts          # /pest/detect, /pest/treatment
│   ├── chatService.ts          # /chat
│   ├── communityService.ts     # /community/*
│   ├── cropService.ts          # /crop/filter
│   ├── soilService.ts          # /soil/analyze
│   ├── adminService.ts         # /admin/*
│   └── index.ts
├── types/
│   └── index.ts                # All TypeScript interfaces
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx             # POST /user/profile, /user/change-password
│   ├── AdminDashboard.tsx      # GET /admin/users, /admin/stats
│   └── LandingPage.tsx
├── data/
│   ├── appData.ts              # Local fallback data
│   └── translations.ts         # 10+ language translations
├── hooks/                      # Custom React hooks
├── lib/
│   └── utils.ts
├── firebase.ts                 # Firebase config
├── firebaseMessaging.ts        # FCM token → POST /user/save-fcm-token
├── App.tsx                     # Routes + QueryClientProvider
└── main.tsx
```

---

## 🔌 API Integration — Complete Mapping

All API calls use **Axios** with a **JWT Bearer token interceptor**. Token is stored in `localStorage` as `hb_jwt` and auto-attached to every request.

```
BASE URL: http://localhost:8081   (configured via VITE_API_BASE_URL)
```

| Method | Endpoint | Component | Description |
|---|---|---|---|
| POST | `/auth/login` | AuthContext | User login, saves JWT |
| POST | `/auth/register` | AuthContext | New user registration |
| GET | `/user/me` | AuthContext | Fetch logged-in profile |
| POST | `/user/profile` | Profile.tsx | Update name/phone/city |
| POST | `/user/change-password` | Profile.tsx | Change password |
| POST | `/user/location` | userService | Update city |
| POST | `/user/save-fcm-token` | firebaseMessaging | Register FCM token |
| POST | `/user/weather-preferences` | userService | Set alert prefs |
| POST | `/user/send-email-otp` | userService | Email OTP |
| POST | `/user/verify-email-otp` | userService | Verify OTP |
| POST | `/user/disable-alerts` | userService | Disable alerts |
| GET | `/weather/:city` | WeatherSection | Live weather |
| GET | `/market-price/:crop` | MarketPrices | Mandi prices |
| GET | `/schemes?category=` | Schemes | Govt schemes |
| POST | `/pest/detect` | PestDetection | Upload image, detect pest |
| POST | `/pest/treatment` | PestDetection | Get treatment plan |
| POST | `/chat` | AIChat | Gemini AI response |
| POST | `/soil/analyze` | SoilHealth | Soil recommendations |
| GET | `/crop/filter` | CropSelection | Season/search filter |
| GET | `/community/posts` | Community | All posts |
| POST | `/community/post` | Community | Create post |
| POST | `/community/like/:id` | Community | Like/unlike |
| POST | `/community/comment` | Community | Add comment |
| GET | `/community/comments/:id` | Community | Fetch comments |
| GET | `/admin/users` | AdminDashboard | All users |
| GET | `/admin/stats` | AdminDashboard | Platform stats |
| GET | `/admin/activity` | AdminDashboard | Activity logs |
| DELETE | `/admin/user/:id` | AdminDashboard | Delete user |

---

## 🚀 Getting Started
### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/haritbandhu-frontend.git
cd haritbandhu-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 4. Start the Backend
Make sure the Spring Boot backend is running on `http://localhost:8081`

### 5. Run the Frontend
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Build for Production
```bash
npm run build
```

---

## 🌐 Multilingual Support

HaritBandhu supports **10+ Indian languages**:

| Language | Code | Language | Code |
|---|---|---|---|
| English | `en` | Hindi | `hi` |
| Marathi | `mr` | Tamil | `ta` |
| Telugu | `te` | Kannada | `kn` |
| Bengali | `bn` | Gujarati | `gu` |
| Punjabi | `pa` | Odia | `or` |

---

## 🔐 Authentication Flow

```
User enters email + password
        ↓
POST /auth/login
        ↓
Backend returns JWT token
        ↓
Token stored in localStorage as "hb_jwt"
        ↓
Axios interceptor auto-attaches token to ALL subsequent requests
Authorization: Bearer <token>
        ↓
On 401 → auto redirect to /login
```

---

## 📸 Screenshots

> _Add screenshots of your app here after deployment_

- Landing Page
- Dashboard with all features
- Pest Detection in action
- AI Chat (Hindi + English)
- Mandi Prices with filters
- Soil Analysis results
- Admin Dashboard

---


### My Contribution (Simran — Frontend + API Integration)
- Designed and built the complete React/TypeScript frontend from scratch
- Integrated all 28 REST API endpoints from the Spring Boot backend using Axios
- Built a centralized `src/services/` layer with JWT auto-attachment
- Implemented Firebase Cloud Messaging (FCM) for push notifications
- Achieved multilingual UI supporting 10+ Indian languages
- Designed glassmorphism UI with Tailwind CSS and shadcn/ui components
- Built graceful fallbacks for all API calls so the UI never breaks offline

---

## 📄 License

This project is developed as an academic capstone project at Axis Institute of Technology & Management. All rights reserved © 2026.

---

<div align="center">

**Built with ❤️ for Indian Farmers**

*HaritBandhu — Technology ke saath, Kisan aage badhe*

</div>
