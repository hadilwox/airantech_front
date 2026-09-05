# Production Deployment — Frontend

This is the Vue 3 SPA for the Academy Management System. It talks to the Laravel
API at a separate subdomain via Sanctum cookie-based auth (no tokens, no
localStorage). See `airantech_backend/DEPLOYMENT.md` for the full-system domain
matrix, Sanctum/CORS configuration, and backend deployment steps.

| Environment | This app | API it calls |
| --- | --- | --- |
| Development | `http://localhost:5173` | `http://localhost:8000` |
| Production  | `https://app.airanacademy.ir` | `https://api.airanacademy.ir` |

## Requirements

Node.js 20+ / npm are needed **only to build** this project. The deployed
artifact is static files — nothing Node-related runs on the production server.

## Steps

1. `npm install`
2. Point the build at the production API: create `.env.production` (gitignored, see `.env.example`) containing:
   ```
   VITE_API_URL=https://api.airanacademy.ir
   ```
   or export `VITE_API_URL` in your CI/build environment. The committed `.env` stays pointed at `localhost:8000` for local dev and is not used once `.env.production` (or an env override) is present.
3. `npm run build` → static output in `dist/`.
4. Upload the **contents** of `dist/` to `app.airanacademy.ir`'s document root.
5. Configure SPA fallback (Vue Router history mode requires unknown paths to serve `index.html` instead of 404):
   - **Apache/cPanel**: already handled — `dist/.htaccess` is bundled by the build (source: `public/.htaccess`). Just confirm `mod_rewrite` is enabled.
   - **Nginx**:
     ```
     location / {
         try_files $uri $uri/ /index.html;
     }
     ```
6. Serve over HTTPS — the API's session cookie is `Secure`, so it's never sent back over plain HTTP.
7. Verify: open the site, confirm the Network tab shows no requests to `localhost`, log in, refresh (session should survive), navigate protected routes, log out.

## Verification (this pass)

- `npm run type-check` — PASS
- `npm run build` — PASS, no source maps emitted (`vite.config.ts` sets `build.sourcemap: false`), `.htaccess` correctly present in `dist/`
- Production domain (`app.airanacademy.ir`) not reachable from this environment — not live-verified; everything above is a local build/config check.

## Warnings

- Never hardcode `https://api.airanacademy.ir` (or any URL) directly in source — always go through `VITE_API_URL` so the same build process works for staging/production without code changes.
- Don't commit `.env.production` — it's gitignored specifically so a real production value never lands in the repo.
- The API call layer (`src/api/client.ts`) always sends `credentials: 'include'` — required for the Sanctum cookie to be attached. Don't remove it when touching that file.
