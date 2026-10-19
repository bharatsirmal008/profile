# Bharat's portfolio and JoJo AI

Next.js portfolio with a desktop interface, portfolio apps, and the JoJo assistant. The FastAPI assistant backend lives in the separate sibling `personal-ai-assistant/backend` project.

## Run locally

```powershell
npm ci
# Copy .env.example to .env.local and configure the required values.
npm run dev
```

Open `http://localhost:3000`. For local assistant requests, set `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` and start the backend separately. Without this variable the assistant uses its configured hosted API.

For production performance checks, use `npm run build` followed by `npm run start`. Development compilation is slower than the production server.

## Structure

```text
src/app/                    Pages, layouts, global styles and local fonts
src/components/
  assistant/                Chat, attachments, recruiter context and voice
  desktop/                  Desktop shell and animated wallpaper
  portfolio/                About, education, projects, resume and contact
  admin/                    Admin access and content editing forms
  ui/                       Shared wordmark, headers and text effects
src/lib/                    Storage, cloud content, caching and chat utilities
public/                     Public media and fallback resume
tests/                      Node regression tests
scripts/                    Maintenance and development utilities
docs/                       Setup and visual implementation documentation
supabase/                   Database migrations and setup resources
```

Components keep their CSS modules beside their implementation. Shared utilities stay in `src/lib`. Existing public media URLs are preserved because saved content can refer to them.

## Verification

```powershell
npm test
npm run typecheck
npm run build
```

`npm run test:cloud` runs only the storage regression tests. `npm run lint` runs ESLint separately.

## Configuration and behavior

- [Supabase setup](docs/SUPABASE_SETUP.md) explains optional cloud content and admin access. Keep `.env.local` and credentials private.
- [Wallpaper implementation](docs/HALLOWEEN.md) describes the SVG animation.
- Portfolio apps are loaded on demand and warmed before interaction; public content requests share a cache.
- GitHub and LinkedIn icons open their external profiles.
- Chat supports streaming answers, editing/resending messages, attachments and browser voice interaction. Image analysis uses the configured backend provider.
- Generated previews, downloaded module caches, `.next/` and `node_modules/` are not source assets.

Live portfolio: https://bharatsirmal.vercel.app/

Optional real-time voice: see [ElevenLabs setup](docs/ELEVENLABS_SETUP.md). Voice stays disabled until the backend and verified language agents are configured.
