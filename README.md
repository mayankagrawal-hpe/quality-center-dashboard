# Deployment & Quality Dashboard (UX prototype)

This folder contains a **UX-only** clickable prototype of the dashboard.

- No backend required
- Mock data is in `src/data.js`
- Pages are rendered client-side using a small hash router

## How to run

### Option A (simplest)
Open `index.html` in your browser.

### Option B (recommended)
Run a local static server so ES module imports work reliably.

Example:

```bash
python3 -m http.server 5173
```

Then open:

- http://localhost:5173

## Pages

- `#/` Executive Overview
- `#/clusters/mira` Cluster detail
- `#/clusters/pavo` Cluster detail
- `#/clusters/aquila` Cluster detail
- `#/services/authn` Service detail (example)
- `#/builds/<attemptId>` Build attempt detail
- `#/scorecard` Score card view
- `#/reliability` Reliability view (still available, not in top nav)

## Next steps

- Replace mock data with real APIs (deployments + tests)
- Add RBAC/auth (optional)
- Add charts + trends (optional)
# quality-center-dashboard
