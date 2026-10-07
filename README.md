# Mission Control Dashboard

A real-time system monitoring dashboard. A FastAPI backend reads CPU, RAM and network stats and pushes them over a WebSocket every second. A React frontend shows them as live cards, a rolling chart and an alert log.

**Live demo:** https://mru8.github.io/mission-control-dashboard/

The numbers you see on the live site are the stats of the server it runs on (Render), not your own machine.

## What it does

- Streams CPU, RAM and network usage live, one update per second
- Rolling area chart of the last 25 readings
- Event log that picks up alerts sent from the backend (last 8 are kept)
- Cards flip to a critical state when CPU goes above 85% or RAM above 90%
- Connection indicator in the sidebar, and the frontend reconnects by itself every 3 seconds if the socket drops

## Tech stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, Recharts
- **Backend:** Python, FastAPI, Uvicorn, WebSockets
- **Hosting:** GitHub Pages (frontend), Render (backend)
- **CI/CD:** GitHub Actions builds and deploys the frontend on every push to `main`

## Project structure

```
mission-control-dashboard/
├── .github/workflows/deploy.yml   # builds Frontend and deploys to GitHub Pages
├── Backend/
│   ├── main.py                    # FastAPI app, WebSocket route at /ws/stats
│   └── requirements.txt
└── Frontend/
    ├── src/
    │   ├── App.jsx                # websocket logic and dashboard layout
    │   └── components/MetricCard.jsx
    ├── vite.config.js
    └── package.json
```

## Run it locally

You need Node 20+ and Python 3.13 (3.10+ should be fine).

**1. Backend** (from the project root)

```
cd Backend
pip install -r requirements.txt
uvicorn main:app --port 8000
```

Make sure `uvicorn[standard]` is installed, plain `uvicorn` has no WebSocket support and the dashboard will stay on DISCONNECTED.

**2. Frontend** (in a second terminal)

```
cd Frontend
npm install
npm run dev
```

Open the link Vite prints. The frontend connects to `ws://localhost:8000/ws/stats` by default.

## Deployment

**Backend on Render**

- Root directory: `Backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

The free tier sleeps after a while, so the first visit can take up to a minute to connect.

**Frontend on GitHub Pages**

The workflow in `.github/workflows/deploy.yml` builds `Frontend` and publishes `Frontend/dist`. The backend address is passed in at build time through an environment variable:

```
VITE_WS_URL=wss://<your-render-service>.onrender.com/ws/stats
```

If it isn't set, the app falls back to `ws://localhost:8000/ws/stats`, which is what local development uses.

`vite.config.js` also sets `base: '/mission-control-dashboard/'` so assets load correctly from the Pages subpath.

## Notes

- Pinned to Vite 7 on purpose. Recharts 3 crashes on startup with Vite 8 (`require_isUnsafeProperty is not a function`), so the upgrade has to wait for a fix upstream.
- Browsers block plain `ws://` from an https page, so the deployed version has to use `wss://`.

## Author

Mrunal, [github.com/mru8](https://github.com/mru8)