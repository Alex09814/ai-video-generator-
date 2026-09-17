# Real AI Video Generator

This is a Next.js starter that connects the UI to Luma Dream Machine's video-generation API.

## 1. Install
npm install

## 2. Configure
Copy `.env.example` to `.env.local` and put your Luma API key in `LUMA_API_KEY`.

## 3. Run
npm run dev

Open http://localhost:3000

## How it works
Browser -> POST /api/generate -> Luma generation job -> GET /api/status -> video URL -> HTML5 video player.

## Important
Keep the API key only on the server in `.env.local`. Never put it in client-side JavaScript or expose it in GitHub.

The demo uses Ray 2, 720p, 5-second generations and supports 9:16, 16:9 and 1:1 through the Luma API.
