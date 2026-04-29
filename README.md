# FlixoraGPT — AI-Powered Streaming Discovery Platform

A full-stack movie and TV discovery platform powered by AI (OpenAI), real movie data (TMDB), Firebase authentication, Supabase for persistent storage, and a modern React/Redux frontend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Redux Toolkit, React Router v7, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Auth | Google Firebase (Email/Password + Google Sign-In) |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI API (GPT-4o-mini) |
| Movie Data | TMDB API |
| Testing | Jest, React Testing Library, Supertest |

## Features

- **AI-Powered Search** — Describe what you want to watch in natural language; GPT returns curated matching titles from TMDB
- **Browse** — Now playing, popular, top-rated, upcoming, trending movies & TV shows
- **Detail Pages** — Full movie/TV info, cast, trailers, similar titles
- **Watchlist** — Persist your watchlist to Supabase (synced per user)
- **Google & Email Auth** — Firebase authentication with protected routes
- **Responsive UI** — Dark-themed, Netflix-inspired design with Tailwind CSS

---

## Setup Instructions

### 1. Clone & Install

```bash
cd flixora-gpt
npm install
cd server && npm install && cd ..
```

### 2. Get API Keys

You need **4 services** configured:

#### A. TMDB API Key
1. Go to https://www.themoviedb.org/settings/api
2. Create an account → Request an API key (free)
3. Copy the **API Key (v3 auth)**

#### B. OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Add billing/credits to your account (GPT-4o-mini is very cheap)

#### C. Firebase (Authentication)
1. Go to https://console.firebase.google.com/
2. Create a new project (e.g., "flixora-gpt")
3. Go to **Authentication** → **Sign-in method** → Enable:
   - **Email/Password**
   - **Google** (set support email)
4. Go to **Project Settings** → **General** → scroll to "Your apps" → click **Web App** (</> icon)
5. Register app → copy the Firebase config values

#### D. Supabase (Database)
1. Go to https://supabase.com/dashboard
2. Create a new project (note the password, pick a region)
3. Go to **SQL Editor** → paste & run the contents of `supabase/schema.sql`
4. Go to **Settings** → **API** → copy:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **anon public** key

### 3. Configure Environment Variables

#### Frontend (`.env`):
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

#### Backend (`server/.env`):
```env
OPENAI_API_KEY=sk-your-openai-key
TMDB_API_KEY=your_tmdb_api_key
PORT=5000
ALLOWED_ORIGIN=http://localhost:3000
```

### 4. Run the App

```bash
# Terminal 1 — Backend
cd server
npm start

# Terminal 2 — Frontend  (from project root)
npm start
```

The app opens at http://localhost:3000

### 5. Run Tests

```bash
# Frontend tests (26 tests)
npm test -- --watchAll=false

# Backend tests (6 tests)
cd server && npx jest --forceExit
```

---

## Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy the `build/` folder
3. Set all `REACT_APP_*` environment variables in the platform dashboard
4. Update `REACT_APP_API_BASE_URL` to your deployed backend URL

### Backend (Render/Railway/Fly.io)
1. Deploy the `server/` directory
2. Set `OPENAI_API_KEY`, `TMDB_API_KEY`, and `ALLOWED_ORIGIN` (your frontend URL)
3. Start command: `node index.js`

### Firebase
- Add your deployed frontend domain to Firebase Console → Authentication → Settings → Authorized domains

---

## Project Structure

```
flixora-gpt/
├── public/
├── server/                   # Node.js/Express backend
│   ├── routes/
│   │   ├── gpt.js            # OpenAI-powered search
│   │   └── tmdb.js           # TMDB API proxy
│   ├── __tests__/
│   ├── index.js
│   └── .env
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── HeroBanner/
│   │   ├── MovieCard/
│   │   ├── MovieRow/
│   │   ├── GptSearch/
│   │   ├── Shimmer/
│   │   └── Footer/
│   ├── pages/
│   │   ├── Login/
│   │   ├── Browse/
│   │   ├── Detail/
│   │   ├── Watchlist/
│   │   └── TVShows/
│   ├── store/
│   │   ├── slices/ (userSlice, moviesSlice, gptSlice, watchlistSlice)
│   │   └── store.js
│   ├── config/ (firebase.js, supabase.js, constants.js)
│   ├── hooks/ (useAuthListener.js, useMovieData.js)
│   ├── __tests__/
│   ├── App.js
│   └── index.js
├── supabase/schema.sql
└── .env
```
