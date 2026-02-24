import {
  getClusterRegion,
  services,
  currentRunning,
  deploymentAttempts,
  testRuns,
  statusMeta,
} from '../data.js';
import { layout, sectionCard, keyValueGrid, badge, pillButton, fmtDate, emptyState } from '../ui.js';

function parseSemver(v) {
  const m = String(v).match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function cmpSemver(a, b) {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa && !pb) return String(a).localeCompare(String(b));
  if (!pa) return -1;
  if (!pb) return 1;
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

function attemptsFor(clusterId, serviceId) {
  return deploymentAttempts
    .filter((a) => a.clusterId === clusterId && a.serviceId === serviceId)
    .sort((a, b) => {
      const v = cmpSemver(a.buildVersion, b.buildVersion);
      if (v !== 0) return v;
      return a.startedAt > b.startedAt ? 1 : -1;
    });
}

function recentAttemptsForCluster(clusterId) {
  return deploymentAttempts
    .filter((a) => a.clusterId === clusterId)
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
}

function recentAttemptsTable(clusterId, statusFilter = 'ALL') {
  const base = recentAttemptsForCluster(clusterId);
  const attempts = base
    .filter((a) => {
      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'SUCCESS') return a.status === 'SUCCESS' || a.status === 'LIVE';
      return a.status === statusFilter;
    })
    .slice(0, 15);
  if (!attempts.length) {
    return `<div class="text-sm text-slate-500">No attempts recorded for this cluster-region (mock).</div>`;
  }

  const rows = attempts.map((a) => {
    const meta = statusMeta[a.status] || { label: a.status, tone: 'slate' };
    const svc = services.find((s) => s.id === a.serviceId);
    return `
      <div class="grid grid-cols-12 gap-3 items-center py-2 border-b border-slate-800 last:border-b-0">
        <div class="col-span-12 md:col-span-4">
          <a class="hover:underline" href="#/builds/${encodeURIComponent(a.id)}">${svc?.name || a.serviceId} <span class="font-mono text-slate-300">v${a.buildVersion}</span></a>
          <div class="text-xs text-slate-400">${a.gitSha ? `SHA: ${a.gitSha}` : ''}</div>
        </div>
        <div class="col-span-12 md:col-span-3">
          ${badge({ label: meta.label, tone: meta.tone, subtle: true })}
          ${a.rollbackToBuild ? `<div class="text-xs text-slate-400">Rollback → v${a.rollbackToBuild}</div>` : ''}
        </div>
        <div class="col-span-12 md:col-span-3">
          <div class="text-xs text-slate-400">Gates</div>
          ${gateBadges(clusterId, a.id)}
        </div>
        <div class="col-span-12 md:col-span-1 text-xs text-slate-400">
          ${fmtDate(a.startedAt)}
        </div>
        <div class="col-span-12 md:col-span-1 text-right">
          <a class="text-sm hover:underline" href="#/builds/${encodeURIComponent(a.id)}">Details</a>
        </div>
      </div>
    `;
  });

  return `<div class="rounded-xl border border-slate-800 bg-slate-900/30 p-2">${rows.join('')}</div>`;
}

function gateBadges(clusterId, attemptId) {
  const runs = testRuns.filter((t) => t.attemptId === attemptId);
  const parts = [];

  const cluster = getClusterRegion(clusterId);
  const baseId = cluster?.baseId;

  if (baseId === 'mira') {
    const func = runs.find((r) => r.suiteType === 'FUNCTIONAL');
    parts.push(
      func
        ? badge({
            label: `Functional ${func.passed}/${func.total}`,
            tone: func.failed > 0 ? 'amber' : 'emerald',
            subtle: true,
          })
        : badge({ label: 'Functional —', tone: 'slate', subtle: true }),
    );

    const reg = runs.find((r) => r.suiteType === 'REGRESSION');
    parts.push(
      reg
        ? badge({
            label: `Regression ${reg.passed}/${reg.total}`,
            tone: reg.failed > 0 ? 'rose' : 'violet',
            subtle: true,
          })
        : badge({ label: 'Regression —', tone: 'slate', subtle: true }),
    );
  }

  if (baseId === 'pavo') {
    const san = runs.find((r) => r.suiteType === 'SANITY');
    parts.push(
      san
        ? badge({
            label: `Sanity ${san.passed}/${san.total}`,
            tone: san.failed > 0 ? 'rose' : 'emerald',
            subtle: true,
          })
        : badge({ label: 'Sanity —', tone: 'slate', subtle: true }),
    );
  }

  return `<div class="flex flex-wrap gap-2">${parts.join('')}</div>`;
}

function servicesTable(clusterId, onlyIssues) {
  const running = currentRunning[clusterId] || {};

  const rows = services
    .map((s) => {
      const ver = running[s.id] || '—';
      const attempts = attemptsFor(clusterId, s.id);
      const latest = attempts.length ? attempts[attempts.length - 1] : null;

      const meta = latest ? statusMeta[latest.status] : null;
      const isIssue = latest && (latest.status === 'FAILED' || latest.status === 'ROLLBACK');
      if (onlyIssues && !isIssue) return '';

      const latestCell = latest
        ? `
          <div class="flex flex-col">
            <a class="hover:underline" href="#/builds/${encodeURIComponent(latest.id)}">${badge({ label: meta.label, tone: meta.tone, subtle: true })}</a>
            <div class="text-xs text-slate-400">${fmtDate(latest.endedAt || latest.startedAt)}</div>
          </div>
        `
        : `<div class="text-sm text-slate-500">—</div>`;

      const expandId = `exp:${clusterId}:${s.id}`;
      const hasAttempts = attempts.length > 0;

      return `
        <div class="rounded-xl border border-slate-800 bg-slate-950/20">
          <div class="grid grid-cols-12 gap-3 p-3 items-center">
            <div class="col-span-12 md:col-span-3">
              <a href="#/services/${s.id}" class="font-semibold hover:underline">${s.name}</a>
              <div class="text-xs text-slate-400">Owner: ${s.owner}</div>
            </div>

            <div class="col-span-6 md:col-span-2">
              <div class="text-xs text-slate-400">Current</div>
              <div class="font-mono text-sm">v${ver}</div>
            </div>

            <div class="col-span-6 md:col-span-3">
              <div class="text-xs text-slate-400">Latest attempt</div>
              ${latestCell}
            </div>

            <div class="col-span-12 md:col-span-3">
              <div class="text-xs text-slate-400">Gates</div>
              ${latest ? gateBadges(clusterId, latest.id) : `<div class="text-sm text-slate-500">—</div>`}
            </div>

            <div class="col-span-12 md:col-span-1 text-right">
              ${hasAttempts ? `<button data-expand="${expandId}" class="px-2 py-1 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 text-sm">Expand</button>` : ''}
            </div>
          </div>

          ${hasAttempts ? `<div id="${cssEscape(expandId)}" class="hidden border-t border-slate-800 p-3">${attemptsList(attempts)}</div>` : ''}
        </div>
      `;
    })
    .filter(Boolean)
    .join('');

  return rows || emptyState({ title: 'No services match filters', description: 'Try clearing filters or selecting another cluster.' });
}

function attemptsList(attempts) {
  const rows = attempts.slice(0, 8).map((a) => {
    const meta = statusMeta[a.status] || { label: a.status, tone: 'slate' };
    return `
      <div class="grid grid-cols-12 gap-3 items-center py-2 border-b border-slate-800 last:border-b-0">
        <div class="col-span-12 md:col-span-4">
          <a class="hover:underline" href="#/builds/${encodeURIComponent(a.id)}">Build <span class="font-mono">v${a.buildVersion}</span> <span class="text-slate-500">(${a.gitSha})</span></a>
          <div class="text-xs text-slate-400">Trigger: ${a.trigger}</div>
        </div>
        <div class="col-span-12 md:col-span-3">
          ${badge({ label: meta.label, tone: meta.tone, subtle: true })}
          ${a.rollbackToBuild ? `<div class="text-xs text-slate-400">Rollback to v${a.rollbackToBuild}</div>` : ''}
        </div>
        <div class="col-span-12 md:col-span-3">
          <div class="text-xs text-slate-400">Gates</div>
          ${gateBadges(a.clusterId, a.id)}
        </div>
        <div class="col-span-12 md:col-span-2 text-xs text-slate-400">
          ${fmtDate(a.startedAt)} → ${fmtDate(a.endedAt || a.startedAt)}
        </div>
      </div>
    `;
  });

  return `
    <div class="text-xs text-slate-400 mb-2">Recent attempts</div>
    <div class="rounded-xl border border-slate-800 bg-slate-900/30 p-2">${rows.join('')}</div>
  `;
}

function cssEscape(id) {
  // Safe for using in HTML id attribute and querySelector; we only use our own IDs.
  return id.replaceAll(':', '_');
}

export function renderCluster({ clusterId }) {
  const cluster = getClusterRegion(clusterId);
  if (!cluster) {
    return layout({
      title: 'Cluster not found',
      subtitle: 'Unknown cluster',
      activeNav: 'overview',
      content: emptyState({ title: 'Cluster not found', description: 'Check the URL and try again.' }),
    });
  }

  const attempts = deploymentAttempts.filter((a) => a.clusterId === clusterId);
  const summary = {
    attempts: attempts.length,
    success: attempts.filter((a) => a.status === 'SUCCESS' || a.status === 'LIVE').length,
    rollback: attempts.filter((a) => a.status === 'ROLLBACK').length,
    failed: attempts.filter((a) => a.status === 'FAILED').length,
  };

  const content = `
    ${sectionCard({
      title: `${cluster.name} summary`,
      right: `<a class="text-sm text-slate-200 hover:underline" href="#/">Back to overview</a>`,
      body: `
        <div class="text-slate-300">${cluster.description}</div>
        <div class="mt-2">${badge({ label: `Role: ${cluster.role || '—'}`, tone: cluster.role === 'Primary' ? 'emerald' : cluster.role === 'Secondary' ? 'amber' : 'slate', subtle: true })}</div>
        <div class="mt-4">${keyValueGrid([
          { label: 'Attempts', value: summary.attempts },
          { label: 'Success', value: summary.success },
          { label: 'Rollback', value: summary.rollback },
          { label: 'Failed', value: summary.failed },
        ])}</div>
      `,
    })}

    <div class="mt-4">
      ${sectionCard({
        title: 'Attempts',
        right: `<button id="toggleAttempts" class="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 text-sm">Show</button>`,
        body: `
          <div id="attemptsPanel" class="hidden">
            <div class="mt-2 flex items-center gap-2">
              ${pillButton({ id: 'attemptsAll', label: 'All', active: true })}
              ${pillButton({ id: 'attemptsSuccess', label: 'Success', active: false })}
              ${pillButton({ id: 'attemptsRollback', label: 'Rollback', active: false })}
              ${pillButton({ id: 'attemptsFailed', label: 'Failed', active: false })}
            </div>
            <div class="mt-3" id="attemptsTableWrap">${recentAttemptsTable(clusterId, 'ALL')}</div>
          </div>
        `,
      })}
    </div>

    <div class="mt-4 flex items-center gap-2">
      ${pillButton({ id: 'filterAll', label: 'All services', active: true })}
      ${pillButton({ id: 'filterIssues', label: 'Only issues', active: false })}
    </div>

    <div class="mt-4 flex flex-col gap-3" id="servicesWrap">
      ${servicesTable(clusterId, false)}
    </div>
  `;

  const html = layout({
    title: `${cluster.name} (${cluster.type})`,
    subtitle: 'Current running versions with expandable deployment attempt history and gates.',
    activeNav: 'overview',
    content,
  });

  return html;
}

export function bindClusterInteractions({ clusterId }) {
  let onlyIssues = false;
  let attemptsOpen = false;
  let attemptsFilter = 'ALL';

  const wrap = document.getElementById('servicesWrap');
  const allBtn = document.getElementById('filterAll');
  const issuesBtn = document.getElementById('filterIssues');

  const toggleAttemptsBtn = document.getElementById('toggleAttempts');
  const attemptsPanel = document.getElementById('attemptsPanel');
  const attemptsTableWrap = document.getElementById('attemptsTableWrap');
  const attemptsAllBtn = document.getElementById('attemptsAll');
  const attemptsSuccessBtn = document.getElementById('attemptsSuccess');
  const attemptsRollbackBtn = document.getElementById('attemptsRollback');
  const attemptsFailedBtn = document.getElementById('attemptsFailed');

  function rerenderAttempts() {
    if (!attemptsTableWrap) return;
    attemptsTableWrap.innerHTML = recentAttemptsTable(clusterId, attemptsFilter);
  }

  function rerender() {
    wrap.innerHTML = servicesTable(clusterId, onlyIssues);
    bindExpands();
  }

  function setActive() {
    allBtn.className = allBtn.className.replaceAll('bg-slate-100 text-slate-950 border-slate-100', '');
    issuesBtn.className = issuesBtn.className.replaceAll('bg-slate-100 text-slate-950 border-slate-100', '');

    // Simple: re-render buttons by toggling attributes would be cleaner; keep minimal here.
  }

  allBtn?.addEventListener('click', () => {
    onlyIssues = false;
    rerender();
  });
  issuesBtn?.addEventListener('click', () => {
    onlyIssues = true;
    rerender();
  });

  toggleAttemptsBtn?.addEventListener('click', () => {
    attemptsOpen = !attemptsOpen;
    attemptsPanel?.classList.toggle('hidden', !attemptsOpen);
    toggleAttemptsBtn.textContent = attemptsOpen ? 'Hide' : 'Show';
    if (attemptsOpen) rerenderAttempts();
  });

  const attemptBtns = [
    { el: attemptsAllBtn, filter: 'ALL' },
    { el: attemptsSuccessBtn, filter: 'SUCCESS' },
    { el: attemptsRollbackBtn, filter: 'ROLLBACK' },
    { el: attemptsFailedBtn, filter: 'FAILED' },
  ];

  attemptBtns.forEach(({ el, filter }) => {
    el?.addEventListener('click', () => {
      attemptsFilter = filter;
      rerenderAttempts();
    });
  });

  function bindExpands() {
    document.querySelectorAll('[data-expand]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-expand');
        if (!id) return;
        const panel = document.getElementById(id.replaceAll(':', '_'));
        if (!panel) return;
        const isHidden = panel.classList.contains('hidden');
        panel.classList.toggle('hidden', !isHidden);
        btn.textContent = isHidden ? 'Collapse' : 'Expand';
      });
    });
  }

  bindExpands();
}
