# CubyBot Site (Vite + Preact)

The static frontend for CubyBot. It’s built with Vite and Preact and is intended to be deployed to GitHub Pages. It calls the CubyBot Server (Fresh on Deno Deploy) over HTTPS.

### Tech stack
 - Vite 7
 - Preact 10
 - JSX (no TypeScript)

### Prerequisites
 - Node.js (LTS recommended)
 - pnpm, npm, or yarn

### Local development
From this `Site/` folder:

```powershell
# Install deps
npm install

# Start dev server (defaults to http://127.0.0.1:5173)
npm run dev
```

Configure your API base URL in your code or env if you fetch from the backend.

### Build

```powershell
npm run build
# Output goes to dist/
```

### Deploy to GitHub Pages
1) Ensure your repository is named `<username>.github.io` (this project’s repo is `CoderAngelPro.github.io`).
2) Commit and push the built `dist/` to the Pages branch used by your setup (often the `main` branch root for user/organization sites, or configure Pages to use `/docs` or a `gh-pages` branch via CI).
3) Set the site URL to `https://CoderAngelPro.github.io/CubyBot` if this is a subpath app.

Tip: For subpath deployments, make sure your router and asset references respect the base path if needed.

### Static assets: `public/` vs `src/assets`
 - Put files you reference directly in HTML (e.g., favicons) into `public/`. They’re copied as-is and served with stable URLs like `/vite.svg`.
 - Put assets you import in code into `src/assets` to get bundler optimizations and cache-busting hashed filenames.

### Backend CORS
Your backend must allow the Pages origin(s). In CubyBot Server, CORS is already configured for:
 - https://CoderAngelPro.github.io
 - https://CoderAngelPro.github.io/CubyBot

### Troubleshooting
 - 404s on refresh for client routing:
	 - Configure Pages to serve `index.html` for unknown routes or use hash-based routing.
 - Mixed content errors:
	 - Ensure backend URL is HTTPS and CORS allows your origin.

### Scripts
```jsonc
{
	// package.json (example)
	"scripts": {
		"dev": "vite",
		"build": "vite build",
		"preview": "vite preview"
	}
}
```
# CubyBot Server (Fresh + Deno)

The backend for CubyBot, built with Fresh Core and served by Deno. It exposes simple routes and is designed to be called by the GitHub Pages frontend.

- Redirects the root path to the GitHub Pages site
- Provides a health-check endpoint
- Serves static assets from `static/`
- Includes permissive CORS for the Pages origin

Live frontend URL this server redirects to: https://CoderAngelPro.github.io/CubyBot

### Tech stack
- Deno runtime (uses npm packages via Deno)
- Fresh Core 2.x (middleware + file-based routes)
- Vite plugin for Fresh during dev/build
- JavaScript entry (`main.js`) with a small TypeScript shim (`main.ts`)

### Endpoints
- GET / → 302 redirect to the GitHub Pages site
- GET /api/health → `{ ok: true }`

### Prerequisites
- Deno installed (v2+ recommended)
	- Install: https://docs.deno.com/runtime/getting_started/installation

### Local development
From this `Server/` folder:

```powershell
# Start dev server (Vite-powered) on http://127.0.0.1:5173
deno task dev
```

Notes:
- Dev logs will show the local URL. Open it in a browser to exercise routes.
- The server’s root will 302 to your Pages URL; test `/api/health` directly to stay local.

### Build and run
Production assets are created under `/_fresh`.

```powershell
# Format, lint, and type-check
deno task check

# Build client and server bundles
deno task build

# Serve the built app locally
deno task start
# Or directly:
# deno serve -A _fresh/server.js
```

### Deployment
This project works well on Deno Deploy:
1) Push this folder to a Git repository.
2) In Deno Deploy, create a new project from the repo or connect GitHub.
3) Deploy using the default entry. Fresh will handle the server entry based on the build output.

Frontend (Pages) calls to this server will succeed due to the included CORS middleware (see `main.js`).

### Configuration notes
- Entry file: the real entry is `main.js`. Fresh/Vite tooling expects a `main.ts` by convention, so a tiny shim exists:
	- `main.ts` re-exports from `./main.js`. Don’t remove it unless you also change Fresh’s internal expectations.
- Static files: place any public assets under `static/` (served from the root at runtime).

### Project structure (excerpt)
```
Server/
	main.js           # Fresh app: middleware, CORS, fsRoutes
	main.ts           # Minimal shim that re-exports from main.js
	routes/
		index.jsx       # 302 redirect to GitHub Pages site
		api/health.jsx  # Health check JSON endpoint
	static/           # Public static files (favicon, logos, etc.)
	utils.js          # Optional Fresh define helper (JSDoc-typed)
	vite.config.ts    # Vite config for Fresh
	deno.json         # Tasks: dev, build, start, check
```

### Troubleshooting
- Dev shows URL but page “doesn’t load”:
	- Root path issues a 302 to your Pages URL. Navigate to `/api/health` locally to verify the server.
- Build error mentioning `main.ts` missing:
	- Ensure `main.ts` exists and contains `export * from "./main.js";`.
- CORS errors from the Pages frontend:
	- Confirm the allowed origins list in `main.js` includes your Pages URL(s).

### Useful scripts
```powershell
# From Server/
# Start dev server
deno task dev

# Build for production
deno task build

# Run checks
deno task check

# Serve built output
deno task start
```