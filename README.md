# Quality Center Dashboard

A **Deployment & Quality Dashboard** that provides a single-pane-of-glass view into deployment health across all cluster-regions and services. Currently running as a UX prototype with mock data — designed for production deployment on AWS (see [ARCHITECTURE.md](ARCHITECTURE.md)).

---

## Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| **Web browser** | Any modern browser (Chrome, Firefox, Safari, Edge) | — |
| **Python 3** *(for local server)* | 3.7+ | `python3 --version` |
| **Git** *(optional, for cloning)* | Any | `git --version` |

> **Note**: No Node.js, npm, or build step is required. The app runs directly from source using ES modules and CDN-loaded libraries.

---

## Quick Start

### 1. Clone the repository

```bash
git clone git@github.com:mayankagrawal-hpe/quality-center-dashboard.git
cd quality-center-dashboard
```

### 2. Start a local server

A local HTTP server is required because browsers block ES module imports from `file://` URLs.

**Option A — Python (recommended)**

```bash
python3 -m http.server 5173
```

**Option B — Python (bind to localhost only)**

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

**Option C — Node.js (if you have it)**

```bash
npx serve -l 5173
```

**Option D — PHP**

```bash
php -S localhost:5173
```

### 3. Open in browser

```
http://localhost:5173
```

or

```
http://127.0.0.1:5173
```

---

## Pages & Navigation

The app uses **client-side hash routing**. All pages are accessible via the top navigation bar or direct URL.

| Route | Page | Description |
|-------|------|-------------|
| `#/` | **Overview** | Executive dashboard with cluster-region health, pipeline status, risk summary |
| `#/analytics` | **Analytics & Trends** | Time series charts (build attempts, test pass rates, deployment frequency) with per-service per-cluster filtering |
| `#/scorecard` | **Score Card** | Quality scorecard view |
| `#/clusters/<id>` | **Cluster Detail** | Per-cluster health, service table, expandable build attempts with status filtering |
| `#/services/<id>` | **Service Detail** | All build attempts across cluster-regions for a service |
| `#/builds/<id>` | **Build Detail** | Single build attempt with test run results |
| `#/reliability` | **Reliability** | Reliability view (available but not in top nav) |

### Example URLs

```
http://localhost:5173/#/                           → Overview
http://localhost:5173/#/analytics                   → Analytics & Trends
http://localhost:5173/#/clusters/mira-us-west-2     → Mira US-West-2 cluster
http://localhost:5173/#/clusters/pavo-us-west-2     → Pavo US-West-2 cluster
http://localhost:5173/#/clusters/aquila-us-east-2   → Aquila US-East-2 cluster
http://localhost:5173/#/services/authn              → AuthN service
http://localhost:5173/#/services/authz              → AuthZ service
http://localhost:5173/#/scorecard                   → Score card
```

---

## Project Structure

```
quality-center-dashboard/
├── index.html                  ← Entry point (loads TailwindCSS + Chart.js from CDN)
├── README.md                   ← This file
├── ARCHITECTURE.md             ← Full production architecture document
├── src/
│   ├── app.js                  ← Route registration and bootstrap
│   ├── router.js               ← Hash-based client-side router
│   ├── ui.js                   ← Shared UI components (layout, cards, badges)
│   ├── data.js                 ← Mock data generator (clusters, services, attempts, test runs)
│   └── pages/
│       ├── overview.js         ← Executive overview page
│       ├── analytics.js        ← Time series analytics with Chart.js
│       ├── cluster.js          ← Cluster-region detail page
│       ├── service.js          ← Service detail page
│       ├── build.js            ← Build attempt detail page
│       ├── scorecard.js        ← Quality scorecard page
│       └── reliability.js      ← Reliability page
```

---

## Tech Stack (Frontend Only — No Build Required)

| Technology | Loaded Via | Purpose |
|-----------|-----------|---------|
| **TailwindCSS** | CDN (`cdn.tailwindcss.com`) | Utility-first styling |
| **Chart.js 4.x** | CDN (`cdn.jsdelivr.net`) | Time series visualizations |
| **chartjs-adapter-date-fns** | CDN | Date handling for Chart.js |
| **ES Modules** | Native browser | Module imports, no bundler needed |

---

## Features

- **Cluster-Region Health** — overview of all clusters with healthy/attention status based on latest build per service
- **Build Attempt History** — expandable, filterable (All / Success / Rollback / Failed) build history per cluster
- **Service View** — all builds across cluster-regions for any service, sorted by version
- **Test Results** — functional, sanity, and regression test badges per build
- **Analytics & Trends** — three time series charts with service + cluster-region dropdown filters:
  - Build Attempts Over Time (stacked bar: success/failed/rollback)
  - Test Pass Rates Over Time (line chart: functional/sanity/regression %)
  - Deployment Frequency & Lead Time (bar + line: deploys/day + avg build time)
- **Global Search** — search for services or builds via the nav bar search input

---

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Blank page** | Make sure you're using a local HTTP server, not opening `index.html` directly (`file://` won't work with ES modules) |
| **Port already in use** | Kill the existing process: `lsof -ti:5173 \| xargs kill -9` then restart |
| **Charts not rendering** | Check browser console for errors; ensure CDN scripts loaded (requires internet connection) |
| **Page not found** | Make sure the URL includes `#/` (hash routing), e.g. `http://localhost:5173/#/analytics` |

---

## Production Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full production deployment plan including:
- AWS components (CloudFront, API Gateway, NLB, EKS, DynamoDB, SQS)
- Backend microservice design and API contracts
- DynamoDB table schemas and access patterns
- Data collection pipeline (webhook ingestion)
- Kubernetes manifests and Helm charts
- CI/CD pipeline
- Security, observability, and cost estimates
- Phased rollout plan

---

## License

Internal use only — Platform Engineering
