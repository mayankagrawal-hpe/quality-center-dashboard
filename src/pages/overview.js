import {
  clusterRegions,
  services,
  currentRunning,
  deploymentAttempts,
  testRuns,
  promotions,
  statusMeta,
  suiteMeta,
  getClusterRegion,
} from '../data.js';
import { layout, sectionCard, keyValueGrid, badge, emptyState } from '../ui.js';

function attemptsForCluster(clusterId) {
  return deploymentAttempts.filter((a) => a.clusterId === clusterId);
}

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

function summarizeCluster(clusterId) {
  const attempts = attemptsForCluster(clusterId);

  // Snapshot view: summarize by the *latest* attempt per service for this cluster-region.
  // This prevents old historical failures/rollbacks from flagging the cluster as Attention.
  const latestByService = new Map();

  for (const a of attempts) {
    const prev = latestByService.get(a.serviceId);
    if (!prev) {
      latestByService.set(a.serviceId, a);
      continue;
    }

    const v = cmpSemver(a.buildVersion, prev.buildVersion);
    if (v > 0) {
      latestByService.set(a.serviceId, a);
      continue;
    }

    if (v === 0 && String(a.startedAt) > String(prev.startedAt)) {
      latestByService.set(a.serviceId, a);
    }
  }

  const latestAttempts = Array.from(latestByService.values());
  const total = latestAttempts.length;
  const success = latestAttempts.filter((a) => a.status === 'SUCCESS' || a.status === 'LIVE').length;
  const rollback = latestAttempts.filter((a) => a.status === 'ROLLBACK').length;
  const failed = latestAttempts.filter((a) => a.status === 'FAILED').length;
  return { total, success, rollback, failed };
}

function clusterCard(clusterRegion) {
  const info = getClusterRegion(clusterRegion.id);
  const sum = summarizeCluster(clusterRegion.id);

  const running = currentRunning[clusterRegion.id] || {};
  const runningLines = Object.entries(running)
    .slice(0, 3)
    .map(([svc, ver]) => `<div class="flex items-center justify-between text-sm"><div class="text-slate-200">${svc}</div><div class="font-mono text-slate-300">v${ver}</div></div>`)
    .join('');

  const tone = sum.rollback > 0 || sum.failed > 0 ? 'amber' : 'emerald';
  const needsAttention = sum.rollback > 0 || sum.failed > 0;

  return `
    <a href="#/clusters/${clusterRegion.id}" class="block rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition">
      <div class="p-4">
        <div class="flex items-center gap-2">
          <div class="text-lg font-semibold">${info?.name || clusterRegion.id}</div>
          ${badge({ label: info?.type || '—', tone: 'slate', subtle: true })}
          ${badge({ label: info?.role || '—', tone: info?.role === 'Primary' ? 'emerald' : info?.role === 'Secondary' ? 'amber' : 'slate', subtle: true })}
          <div class="flex-1"></div>
          ${badge({ label: needsAttention ? 'Attention' : 'Healthy', tone, subtle: true })}
        </div>
        <div class="mt-1 text-sm text-slate-300">${info?.description || ''}</div>

        <div class="mt-4 grid grid-cols-4 gap-2">
          ${miniStat('Attempts', sum.total)}
          ${miniStat('Success', sum.success)}
          ${miniStat('Rollback', sum.rollback)}
          ${miniStat('Failed', sum.failed)}
        </div>

        <div class="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-3">
          <div class="text-xs text-slate-400">Current (sample)</div>
          <div class="mt-2 flex flex-col gap-1">${runningLines || '<div class="text-sm text-slate-500">No data</div>'}</div>
        </div>
      </div>
    </a>
  `;
}

function miniStat(label, value) {
  return `
    <div class="rounded-xl border border-slate-800 bg-slate-950/30 p-2">
      <div class="text-[11px] text-slate-400">${label}</div>
      <div class="mt-0.5 text-base font-semibold">${value}</div>
    </div>
  `;
}

function pipelineRow(serviceId) {
  const svc = services.find((s) => s.id === serviceId);
  const miraW = currentRunning['mira-us-west-2']?.[serviceId] || '—';
  const miraE = currentRunning['mira-us-east-2']?.[serviceId] || '—';
  const pavoW = currentRunning['pavo-us-west-2']?.[serviceId] || '—';
  const pavoE = currentRunning['pavo-us-east-2']?.[serviceId] || '—';
  const aquilaW = currentRunning['aquila-us-west-2']?.[serviceId] || '—';
  const aquilaE = currentRunning['aquila-us-east-2']?.[serviceId] || '—';

  const lastPromo = promotions
    .filter((p) => p.serviceId === serviceId)
    .sort((a, b) => (a.promotedAt < b.promotedAt ? 1 : -1))[0];

  return `
    <div class="grid grid-cols-12 gap-3 items-center py-3 border-b border-slate-800 last:border-b-0">
      <div class="col-span-12 md:col-span-3">
        <a href="#/services/${serviceId}" class="font-semibold hover:underline">${svc?.name || serviceId}</a>
        <div class="text-xs text-slate-400">Owner: ${svc?.owner || '—'}</div>
      </div>

      ${pipelineCellTwo('Mira', 'us-west-2', miraW, 'us-east-2', miraE)}
      ${pipelineCellTwo('Pavo', 'us-west-2', pavoW, 'us-east-2', pavoE)}
      ${pipelineCellTwo('Aquila', 'us-west-2', aquilaW, 'us-east-2', aquilaE)}

      <div class="col-span-12 md:col-span-3">
        <div class="text-xs text-slate-400">Last promotion</div>
        <div class="text-sm text-slate-200">${lastPromo ? `${lastPromo.fromClusterId} → ${lastPromo.toClusterId}` : '—'}</div>
      </div>
    </div>
  `;
}

function pipelineCellTwo(label, r1, v1, r2, v2) {
  return `
    <div class="col-span-4 md:col-span-2 rounded-xl border border-slate-800 bg-slate-950/30 p-2">
      <div class="text-[11px] text-slate-400">${label}</div>
      <div class="mt-1 text-[11px] text-slate-400">${r1}</div>
      <div class="font-mono text-sm">v${v1}</div>
      <div class="mt-1 text-[11px] text-slate-400">${r2}</div>
      <div class="font-mono text-sm">v${v2}</div>
    </div>
  `;
}

function riskRows() {
  const rollbacks = deploymentAttempts
    .filter((a) => a.status === 'ROLLBACK')
    .slice(0, 5)
    .map((a) => riskRow(a, 'Rollback'));

  const nightliesFailed = testRuns
    .filter((t) => (t.suiteType === 'REGRESSION' || t.suiteType === 'SANITY') && t.failed > 0)
    .slice(0, 5)
    .map((t) => nightlyRiskRow(t));

  return { rollbacks, nightliesFailed };
}

function riskRow(attempt, label) {
  const svc = services.find((s) => s.id === attempt.serviceId);
  const meta = statusMeta[attempt.status] || { label: attempt.status, tone: 'slate' };
  return `
    <div class="grid grid-cols-12 gap-3 items-center py-2 border-b border-slate-800 last:border-b-0">
      <div class="col-span-12 md:col-span-3">
        <div class="text-sm font-semibold">${label}</div>
        <div class="text-xs text-slate-400">${attempt.clusterId.toUpperCase()}</div>
      </div>
      <div class="col-span-12 md:col-span-4">
        <a class="hover:underline" href="#/builds/${encodeURIComponent(attempt.id)}">${svc?.name || attempt.serviceId} <span class="text-slate-400">v${attempt.buildVersion}</span></a>
        <div class="text-xs text-slate-400">${attempt.failureReason || '—'}</div>
      </div>
      <div class="col-span-12 md:col-span-3">
        ${badge({ label: meta.label, tone: meta.tone, subtle: true })}
      </div>
      <div class="col-span-12 md:col-span-2 text-right">
        <a href="#/clusters/${attempt.clusterId}" class="text-sm text-slate-200 hover:underline">View cluster</a>
      </div>
    </div>
  `;
}

function nightlyRiskRow(t) {
  const attempt = deploymentAttempts.find((a) => a.id === t.attemptId);
  const svc = services.find((s) => s.id === attempt?.serviceId);
  const sm = suiteMeta[t.suiteType] || { label: t.suiteType, color: 'slate' };
  return `
    <div class="grid grid-cols-12 gap-3 items-center py-2 border-b border-slate-800 last:border-b-0">
      <div class="col-span-12 md:col-span-3">
        <div class="text-sm font-semibold">Nightly failure</div>
        <div class="text-xs text-slate-400">${sm.label}</div>
      </div>
      <div class="col-span-12 md:col-span-4">
        <a class="hover:underline" href="#/builds/${encodeURIComponent(t.attemptId)}">${svc?.name || attempt?.serviceId || '—'} <span class="text-slate-400">v${attempt?.buildVersion || '—'}</span></a>
        <div class="text-xs text-slate-400">${attempt?.clusterId?.toUpperCase() || '—'}</div>
      </div>
      <div class="col-span-12 md:col-span-3">
        ${badge({ label: `${t.passed}/${t.total} passed`, tone: 'amber', subtle: true })}
        <span class="ml-2">${badge({ label: `${t.failed} failed`, tone: 'rose', subtle: true })}</span>
      </div>
      <div class="col-span-12 md:col-span-2 text-right">
        <a href="#/scorecard" class="text-sm text-slate-200 hover:underline">Open</a>
      </div>
    </div>
  `;
}

export function renderOverview() {
  const content = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      ${clusterRegions.map((c) => clusterCard(c)).join('')}
    </div>

    <div class="mt-6 grid grid-cols-1 gap-4">
      ${sectionCard({
        title: 'Promotion pipeline (service snapshot)',
        right: `<a class="text-sm text-slate-200 hover:underline" href="#/scorecard">View score card</a>`,
        body: services.map((s) => pipelineRow(s.id)).join(''),
      })}

      ${(() => {
        const { rollbacks, nightliesFailed } = riskRows();
        const left = rollbacks.length
          ? rollbacks.join('')
          : emptyState({ title: 'No recent rollbacks', description: 'This is mock data; once wired to real events this will populate automatically.' });

        const right = nightliesFailed.length
          ? nightliesFailed.join('')
          : emptyState({ title: 'No nightly failures', description: 'Nightly regression/sanity failures will appear here.' });

        return `
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            ${sectionCard({ title: 'Recent rollbacks', body: left })}
            ${sectionCard({ title: 'Nightly failures', body: right })}
          </div>
        `;
      })()}
    </div>
  `;

  return layout({
    title: 'Executive Overview',
    subtitle: 'Clusters → current versions → deployment attempts → test evidence. (UX prototype with mocked data)',
    activeNav: 'overview',
    content,
  });
}
