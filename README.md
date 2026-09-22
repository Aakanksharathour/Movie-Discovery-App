# Movie Discovery App

A full-stack movie discovery application built for the Trackzio Full-Stack Intern Assignment.

Users can browse, search, filter, and sort movies from TMDB, view details, and save a persistent wishlist in MongoDB.

---

## Features

- Browse / discover popular movies without searching
- Search movies by title
- Filter by genre, year, and minimum rating
- Sort by popularity, rating, or release date
- Pagination for large result sets
- Movie details page (overview, genres, runtime, rating)
- Persistent wishlist (survives refresh and browser restart)
- Loading, empty, and error states with retry
- Responsive UI for mobile, tablet, and desktop
- Long titles clamped; posters keep a consistent aspect ratio

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, JavaScript, React Router, Axios, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| External API | TMDB (The Movie Database) |

---

## Architecture

```
React (client :5173)
    ↓ HTTP (Axios)
Express API (server :5000)
    ↓ fetch + in-memory cache
TMDB API
    ↕
MongoDB (wishlist only)
```

**Rules:**
- The React frontend **never** calls TMDB directly.
- The TMDB API key lives only in `server/.env`.
- Movie catalog data is fetched live from TMDB (via our backend).
- Wishlist data is stored in MongoDB as a small snapshot per movie.

---

## Project Structure

```
movie-discovery/
  client/                 # React + Vite frontend
    src/
      api/                # Axios helpers for our backend
      components/         # UI building blocks
      pages/              # Route screens
      hooks/              # useDebounce
      utils/              # getGuestId, helpers
  server/                 # Node + Express backend
    src/
      config/             # env, db, ipv4First
      controllers/
      models/
      routes/
      services/           # tmdbService, cacheService
      middleware/
      utils/
  README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)
- A free TMDB API key: https://www.themoviedb.org/settings/api

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env → set TMDB_API_KEY and MONGO_URI
npm install
npm run dev
```

Server: http://localhost:5000  
Health: http://localhost:5000/api/health

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

App: http://localhost:5173

---

## Environment Variables

### Server (`server/.env`)

| Variable | Purpose |
|----------|---------|
| `PORT` | Backend port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `TMDB_API_KEY` | Secret TMDB v3 API key |
| `TMDB_BASE_URL` | `https://api.themoviedb.org/3` |

### Client (`client/.env`)

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Our backend API, e.g. `http://localhost:5000/api` |

Never put the TMDB key in the client env file.

---

## API Endpoints

| Method | Route | Description | Notes |
|--------|-------|-------------|-------|
| GET | `/api/health` | Health check | |
| GET | `/api/movies/discover` | Browse / filter | `page`, `genre`, `year`, `minRating`, `sortBy` (`popularity` \| `rating` \| `release_date`) |
| GET | `/api/movies/search` | Search | `q` (required), `page` |
| GET | `/api/movies/:id` | Movie details | |
| GET | `/api/genres` | Genre list | |
| GET | `/api/wishlist` | List wishlist | Header `X-Guest-Id` or `guestId` query |
| POST | `/api/wishlist` | Add movie | Body: `guestId`, `movieId`, `title`, `posterUrl`, `releaseYear`, `rating` |
| DELETE | `/api/wishlist/:movieId` | Remove movie | `guestId` via header/query |

---

## Database Schema

**Collection:** `wishlistitems`

| Field | Type | Notes |
|-------|------|-------|
| `guestId` | String | Anonymous browser identity |
| `movieId` | Number | TMDB movie id |
| `title` | String | Snapshot for display |
| `posterPath` | String \| null | Full poster URL we store |
| `releaseYear` | String \| null | |
| `rating` | Number \| null | |
| `createdAt` | Date | Auto |

**Indexes:** unique `{ guestId, movieId }`, and `{ guestId }` for fast lists.

We do **not** store full TMDB JSON.

---

## Important Technical Decisions

1. **Backend as TMDB abstraction** — Frontend only talks to Express; we transform TMDB into a stable JSON shape.
2. **No authentication** — Not required by the assignment. Wishlist uses an anonymous `guestId` in `localStorage`.
3. **Wishlist ownership** — Every wishlist request sends `X-Guest-Id`. Tradeoff: simple and persistent per browser; clearing site data loses the wishlist; not a real account.
4. **In-memory cache** — `Map` + TTL reduces repeated TMDB calls (genres 24h, discover 5m, search 3m, details 15m). Fine for one Node process; Redis would be needed for multiple servers.
5. **URL state for filters/search** — Filters and page live in the query string so refresh and back navigation keep context.
6. **Debounce + AbortController** — Search waits ~400ms after typing; in-flight requests are aborted when params change.
7. **IPv4 preference** — Some Windows networks reset IPv6 to TMDB; server prefers IPv4 for reliability.
8. **Native `fetch` on the server** — Used for TMDB calls with an 8s timeout.

---

## Assumptions

- Authentication is out of scope for this internship assignment.
- One anonymous guest id per browser is enough for wishlist demos.
- Storing a small movie snapshot in MongoDB is enough to render the wishlist without extra TMDB calls.
- TMDB rate limits are mitigated enough by caching for development / review usage.

---

## Known Limitations

- Wishlist is tied to one browser (`localStorage`), not a user account.
- In-memory cache is lost on server restart and is not shared across multiple instances.
- Occasional TMDB network blips can still return 503 (UI has retry).
- No automated test suite yet.
- Adult content is filtered via TMDB `include_adult=false`, but filtering is not perfect.

---

## Performance Considerations

**Frontend**
- Debounced search
- Abort/ignore cancelled requests
- Genres loaded once on Discover
- Pagination instead of loading all results

**Backend**
- In-memory cache with TTL
- 8 second TMDB timeout
- Query validation before calling TMDB
- Safe defaults for missing posters / titles / ratings

---

## AI Tools Used

AI (Cursor) was used to:

- Understand the assignment PDF and TMDB API documentation
- Generate initial project boilerplate
- Explore implementation approaches
- Debug network issues (e.g. IPv6 / TMDB connectivity)
- Review and improve code structure

The final architecture, technical decisions, and implementation were reviewed and are understood by me. I can explain, debug, and extend every part of this project.

---

## What I Would Improve With More Time

- Real authentication (JWT / sessions) and per-user wishlists
- Redis (or similar) shared cache
- Automated API and UI tests
- Production deployment (Vercel/Render + Atlas)
- Infinite scroll / Load More option alongside pagination
- Skeleton loaders instead of a simple spinner
- Offline-friendly caching for wishlist reads
