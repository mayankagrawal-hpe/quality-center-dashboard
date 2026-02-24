import { addRoute, startRouter } from './router.js';
import { renderOverview } from './pages/overview.js';
import { renderCluster, bindClusterInteractions } from './pages/cluster.js';
import { renderService } from './pages/service.js';
import { renderBuild } from './pages/build.js';
import { renderReliability } from './pages/reliability.js';
import { renderScorecard } from './pages/scorecard.js';
import { renderAnalytics, bindAnalyticsCharts } from './pages/analytics.js';

function mount(html) {
  const root = document.getElementById('app');
  root.innerHTML = html;

  const lastUpdated = document.getElementById('lastUpdated');
  if (lastUpdated) {
    lastUpdated.textContent = new Date().toLocaleString();
  }

  bindGlobalSearch();
}

function bindGlobalSearch() {
  const input = document.getElementById('globalSearch');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const q = String(input.value || '').trim();
    if (!q) return;

    // UX-only: interpret as service route if it matches a likely service id; else do nothing.
    // This will be replaced by API search later.
    if (q.includes(':')) {
      window.location.hash = `#/builds/${encodeURIComponent(q)}`;
      return;
    }

    window.location.hash = `#/services/${encodeURIComponent(q)}`;
  });
}

addRoute(/^#\/$/, () => mount(renderOverview()));
addRoute(/^#\/$/, () => mount(renderOverview()));
addRoute(/^#\/?$/, () => mount(renderOverview()));

addRoute(/^#\/clusters\/([^/]+)\/?$/, ({ match }) => {
  const clusterId = decodeURIComponent(match[1]);
  mount(renderCluster({ clusterId }));
  bindClusterInteractions({ clusterId });
});

addRoute(/^#\/services\/([^/]+)\/?$/, ({ match }) => {
  const serviceId = decodeURIComponent(match[1]);
  mount(renderService({ serviceId }));
});

addRoute(/^#\/builds\/([^/]+)\/?$/, ({ match }) => {
  const attemptId = decodeURIComponent(match[1]);
  mount(renderBuild({ attemptId }));
});

addRoute(/^#\/analytics\/?$/, () => {
  mount(renderAnalytics());
  bindAnalyticsCharts();
});

addRoute(/^#\/reliability\/?$/, () => mount(renderReliability()));

addRoute(/^#\/scorecard\/?$/, () => mount(renderScorecard()));

startRouter();
