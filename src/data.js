export const clusters = [
  {
    id: 'mira',
    name: 'Mira',
    type: 'QA',
    description:
      'Deploy after PR merge. Functional tests gate success. Rollback on failures. Nightly regression runs.',
  },
  {
    id: 'pavo',
    name: 'Pavo',
    type: 'Stage',
    description:
      'Promoted after Mira validation (functional/scale/perf/manual). Used by BU partners. Nightly sanity runs.',
  },
  {
    id: 'aquila',
    name: 'Aquila',
    type: 'Production',
    description: 'Production rollout to customers after confidence is high.',
  },
];

export const clusterRegions = [
  {
    id: 'mira-us-west-2',
    baseId: 'mira',
    region: 'us-west-2',
  },
  {
    id: 'mira-us-east-2',
    baseId: 'mira',
    region: 'us-east-2',
  },
  {
    id: 'pavo-us-west-2',
    baseId: 'pavo',
    region: 'us-west-2',
  },
  {
    id: 'pavo-us-east-2',
    baseId: 'pavo',
    region: 'us-east-2',
  },
  {
    id: 'aquila-us-west-2',
    baseId: 'aquila',
    region: 'us-west-2',
  },
  {
    id: 'aquila-us-east-2',
    baseId: 'aquila',
    region: 'us-east-2',
  },
];

// Primary/Secondary (hot standby) roles per base cluster.
// In production, you can source this from the separate S3 file you mentioned.
export const clusterRegionRoles = {
  mira: {
    primary: 'us-west-2',
    secondary: 'us-east-2',
  },
  pavo: {
    primary: 'us-west-2',
    secondary: 'us-east-2',
  },
  aquila: {
    primary: 'us-west-2',
    secondary: 'us-east-2',
  },
};

export function getBaseCluster(baseId) {
  return clusters.find((c) => c.id === baseId);
}

export function getClusterRegion(clusterRegionId) {
  const cr = clusterRegions.find((x) => x.id === clusterRegionId);
  if (!cr) return null;
  const base = getBaseCluster(cr.baseId);

  const roles = clusterRegionRoles[cr.baseId];
  const role = roles
    ? roles.primary === cr.region
      ? 'Primary'
      : roles.secondary === cr.region
        ? 'Secondary'
        : '—'
    : '—';

  return {
    ...cr,
    name: `${base?.name || cr.baseId}-${cr.region}`,
    type: base?.type || '—',
    description: base?.description || '',
    role,
  };
}

export const services = [
  { id: 'authn', name: 'AuthN', owner: 'Identity Team', tier: 'critical', appId: '00000000-0000-0000-0000-000000000001' },
  { id: 'authz', name: 'AuthZ', owner: 'Identity Team', tier: 'critical', appId: '00000000-0000-0000-0000-000000000002' },
  {
    id: 'account-management',
    name: 'Account-management',
    owner: 'Accounts Team',
    tier: 'high',
    // Example appId from your S3 naming scheme (appid.json)
    appId: 'a8965612-527e-45b4-8ee9-616109cb79e5',
  },
  {
    id: 'activate-device-direct',
    name: 'Activate-Device-Direct',
    owner: 'Activation Team',
    tier: 'high',
    appId: '00000000-0000-0000-0000-000000000003',
  },
  {
    id: 'activate-inventory',
    name: 'Activate-Inventory',
    owner: 'Activation Team',
    tier: 'high',
    appId: '00000000-0000-0000-0000-000000000004',
  },
  { id: 'ugm', name: 'UGM', owner: 'Platform Team', tier: 'medium', appId: '00000000-0000-0000-0000-000000000005' },
  { id: 'pingfed', name: 'Pingfed', owner: 'Identity Team', tier: 'medium', appId: '00000000-0000-0000-0000-000000000006' },
  {
    id: 'session-manager',
    name: 'Session Manager',
    owner: 'Platform Team',
    tier: 'medium',
    appId: '00000000-0000-0000-0000-000000000007',
  },
  { id: 'sso-manager', name: 'SSO Manager', owner: 'Identity Team', tier: 'medium', appId: '00000000-0000-0000-0000-000000000008' },
  { id: 'frontend', name: 'Frontend', owner: 'UI Team', tier: 'high', appId: '00000000-0000-0000-0000-000000000009' },
  { id: 'ui-doorway', name: 'UI-Doorway', owner: 'UI Team', tier: 'high', appId: '00000000-0000-0000-0000-000000000010' },
  { id: 'mfe', name: 'MFE', owner: 'UI Team', tier: 'high', appId: '00000000-0000-0000-0000-000000000011' },
];

// Placeholder mapping (in production, resolve appId -> appName via your API)
export const appIdToServiceId = Object.fromEntries(
  services.filter((s) => s.appId).map((s) => [s.appId, s.id]),
);

export const currentRunning = {
  'mira-us-west-2': {
    authn: '3.4.2',
    authz: '2.9.1',
    'account-management': '1.18.0',
    'activate-device-direct': '5.2.0',
    'activate-inventory': '4.6.1',
    ugm: '2.1.3',
    pingfed: '12.0.8',
    'session-manager': '1.9.7',
    'sso-manager': '2.3.4',
    frontend: '0.42.0',
    'ui-doorway': '0.18.2',
    mfe: '0.27.5',
  },
  'mira-us-east-2': {
    authn: '3.4.1',
    authz: '2.9.1',
    'account-management': '1.17.9',
    'activate-device-direct': '5.1.8',
    'activate-inventory': '4.6.0',
    ugm: '2.1.2',
    pingfed: '12.0.8',
    'session-manager': '1.9.6',
    'sso-manager': '2.3.3',
    frontend: '0.41.3',
    'ui-doorway': '0.18.1',
    mfe: '0.27.3',
  },
  'pavo-us-west-2': {
    authn: '3.4.1',
    authz: '2.9.1',
    'account-management': '1.17.9',
    'activate-device-direct': '5.1.8',
    'activate-inventory': '4.6.0',
    ugm: '2.1.2',
    pingfed: '12.0.8',
    'session-manager': '1.9.6',
    'sso-manager': '2.3.3',
    frontend: '0.41.3',
    'ui-doorway': '0.18.1',
    mfe: '0.27.3',
  },
  'pavo-us-east-2': {
    authn: '3.4.0',
    authz: '2.8.9',
    'account-management': '1.17.7',
    'activate-device-direct': '5.1.2',
    'activate-inventory': '4.5.6',
    ugm: '2.1.0',
    pingfed: '12.0.7',
    'session-manager': '1.9.2',
    'sso-manager': '2.3.0',
    frontend: '0.40.0',
    'ui-doorway': '0.17.4',
    mfe: '0.26.9',
  },
  'aquila-us-west-2': {
    authn: '3.4.0',
    authz: '2.8.9',
    'account-management': '1.17.7',
    'activate-device-direct': '5.1.2',
    'activate-inventory': '4.5.6',
    ugm: '2.1.0',
    pingfed: '12.0.7',
    'session-manager': '1.9.2',
    'sso-manager': '2.3.0',
    frontend: '0.40.0',
    'ui-doorway': '0.17.4',
    mfe: '0.26.9',
  },
  'aquila-us-east-2': {
    authn: '3.4.0',
    authz: '2.8.9',
    'account-management': '1.17.7',
    'activate-device-direct': '5.1.2',
    'activate-inventory': '4.5.6',
    ugm: '2.1.0',
    pingfed: '12.0.7',
    'session-manager': '1.9.2',
    'sso-manager': '2.3.0',
    frontend: '0.40.0',
    'ui-doorway': '0.17.4',
    mfe: '0.26.9',
  },
};

/**
 * attemptId format: {cluster}:{service}:{build}:{n}
 */
const seedDeploymentAttempts = [
  {
    id: 'mira-us-west-2:authn:3.4.2:1284',
    clusterId: 'mira-us-west-2',
    serviceId: 'authn',
    buildVersion: '3.4.2',
    gitSha: 'a1b2c3d',
    startedAt: '2026-02-03T22:14:00Z',
    endedAt: '2026-02-03T22:28:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:authn:3.4.2:1283',
    clusterId: 'mira-us-west-2',
    serviceId: 'authn',
    buildVersion: '3.4.2',
    gitSha: 'a1b2c3d',
    startedAt: '2026-02-03T20:10:00Z',
    endedAt: '2026-02-03T20:19:00Z',
    status: 'ROLLBACK',
    rollbackToBuild: '3.4.1',
    failureReason: 'Functional failures during deployment',
    trigger: 'merge',
  },
  {
    id: 'mira-us-east-2:authn:3.4.1:1282',
    clusterId: 'mira-us-east-2',
    serviceId: 'authn',
    buildVersion: '3.4.1',
    gitSha: '98ff12a',
    startedAt: '2026-02-03T17:02:00Z',
    endedAt: '2026-02-03T17:14:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },

  {
    id: 'pavo-us-west-2:authn:3.4.1:1279',
    clusterId: 'pavo-us-west-2',
    serviceId: 'authn',
    buildVersion: '3.4.1',
    gitSha: '98ff12a',
    startedAt: '2026-02-03T23:10:00Z',
    endedAt: '2026-02-03T23:20:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },

  {
    id: 'aquila-us-west-2:authn:3.4.0:1275',
    clusterId: 'aquila-us-west-2',
    serviceId: 'authn',
    buildVersion: '3.4.0',
    gitSha: '77ac991',
    startedAt: '2026-02-02T18:00:00Z',
    endedAt: '2026-02-02T18:22:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-west-2:authz:2.9.1:2201',
    clusterId: 'mira-us-west-2',
    serviceId: 'authz',
    buildVersion: '2.9.1',
    gitSha: 'b9c0a12',
    startedAt: '2026-02-03T19:42:00Z',
    endedAt: '2026-02-03T19:55:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:activate-device-direct:5.2.0:540',
    clusterId: 'mira-us-west-2',
    serviceId: 'activate-device-direct',
    buildVersion: '5.2.0',
    gitSha: 'c3d4e5f',
    startedAt: '2026-02-03T18:10:00Z',
    endedAt: '2026-02-03T18:37:00Z',
    status: 'FAILED',
    failureReason: 'Health checks did not stabilize within timeout',
    trigger: 'merge',
  },

  {
    id: 'mira-us-east-2:account-management:1.18.0:9101',
    clusterId: 'mira-us-east-2',
    serviceId: 'account-management',
    buildVersion: '1.18.0',
    gitSha: 'd0c0ffee',
    startedAt: '2026-02-05T18:40:02Z',
    endedAt: null,
    status: 'IN_PROGRESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:account-management:1.17.9:9099',
    clusterId: 'mira-us-west-2',
    serviceId: 'account-management',
    buildVersion: '1.17.9',
    gitSha: 'c0ffee0',
    startedAt: '2026-02-05T14:10:00Z',
    endedAt: '2026-02-05T14:22:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:ugm:2.1.3:330',
    clusterId: 'mira-us-west-2',
    serviceId: 'ugm',
    buildVersion: '2.1.3',
    gitSha: 'bead123',
    startedAt: '2026-02-05T11:00:00Z',
    endedAt: '2026-02-05T11:18:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-east-2:ugm:2.1.3:331',
    clusterId: 'mira-us-east-2',
    serviceId: 'ugm',
    buildVersion: '2.1.3',
    gitSha: 'bead123',
    startedAt: '2026-02-05T11:30:00Z',
    endedAt: '2026-02-05T11:50:00Z',
    status: 'FAILED',
    failureReason: 'Functional gate timed out',
    trigger: 'merge',
  },
  {
    id: 'pavo-us-east-2:authz:2.9.1:4120',
    clusterId: 'pavo-us-east-2',
    serviceId: 'authz',
    buildVersion: '2.9.1',
    gitSha: 'b9c0a12',
    startedAt: '2026-02-04T10:00:00Z',
    endedAt: '2026-02-04T10:12:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'pavo-us-west-2:frontend:0.42.0:801',
    clusterId: 'pavo-us-west-2',
    serviceId: 'frontend',
    buildVersion: '0.42.0',
    gitSha: 'f00dbad',
    startedAt: '2026-02-04T06:05:00Z',
    endedAt: '2026-02-04T06:22:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'pavo-us-west-2:frontend:0.42.1:802',
    clusterId: 'pavo-us-west-2',
    serviceId: 'frontend',
    buildVersion: '0.42.1',
    gitSha: 'f00dbb1',
    startedAt: '2026-02-05T03:05:00Z',
    endedAt: '2026-02-05T03:18:00Z',
    status: 'FAILED',
    failureReason: 'Smoke checks failed after rollout',
    trigger: 'promotion',
  },
  {
    id: 'aquila-us-east-2:authz:2.8.9:3990',
    clusterId: 'aquila-us-east-2',
    serviceId: 'authz',
    buildVersion: '2.8.9',
    gitSha: '7a7a7a7',
    startedAt: '2026-02-02T20:00:00Z',
    endedAt: '2026-02-02T20:18:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-east-2:authz:2.9.2:2205',
    clusterId: 'mira-us-east-2',
    serviceId: 'authz',
    buildVersion: '2.9.2',
    gitSha: 'b9c0a13',
    startedAt: '2026-02-05T09:05:00Z',
    endedAt: '2026-02-05T09:18:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:authz:2.9.0:2199',
    clusterId: 'mira-us-west-2',
    serviceId: 'authz',
    buildVersion: '2.9.0',
    gitSha: 'b9c0a11',
    startedAt: '2026-02-02T15:10:00Z',
    endedAt: '2026-02-02T15:22:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },

  {
    id: 'mira-us-east-2:account-management:1.17.8:9096',
    clusterId: 'mira-us-east-2',
    serviceId: 'account-management',
    buildVersion: '1.17.8',
    gitSha: 'c0ffee1',
    startedAt: '2026-02-04T12:05:00Z',
    endedAt: '2026-02-04T12:18:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'pavo-us-west-2:account-management:1.17.8:8801',
    clusterId: 'pavo-us-west-2',
    serviceId: 'account-management',
    buildVersion: '1.17.8',
    gitSha: 'c0ffee1',
    startedAt: '2026-02-04T18:10:00Z',
    endedAt: '2026-02-04T18:25:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'pavo-us-east-2:account-management:1.17.9:8802',
    clusterId: 'pavo-us-east-2',
    serviceId: 'account-management',
    buildVersion: '1.17.9',
    gitSha: 'c0ffee0',
    startedAt: '2026-02-05T02:00:00Z',
    endedAt: '2026-02-05T02:18:00Z',
    status: 'FAILED',
    failureReason: 'Sanity checks failed after promotion',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-east-2:activate-device-direct:5.2.1:545',
    clusterId: 'mira-us-east-2',
    serviceId: 'activate-device-direct',
    buildVersion: '5.2.1',
    gitSha: 'c3d4e60',
    startedAt: '2026-02-05T13:05:00Z',
    endedAt: '2026-02-05T13:28:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:activate-device-direct:5.2.0:541',
    clusterId: 'mira-us-west-2',
    serviceId: 'activate-device-direct',
    buildVersion: '5.2.0',
    gitSha: 'c3d4e5f',
    startedAt: '2026-02-03T16:10:00Z',
    endedAt: '2026-02-03T16:32:00Z',
    status: 'ROLLBACK',
    rollbackToBuild: '5.1.8',
    failureReason: 'Functional failures during deployment',
    trigger: 'merge',
  },
  {
    id: 'pavo-us-west-2:activate-device-direct:5.1.8:510',
    clusterId: 'pavo-us-west-2',
    serviceId: 'activate-device-direct',
    buildVersion: '5.1.8',
    gitSha: 'c3d4e4a',
    startedAt: '2026-02-03T23:40:00Z',
    endedAt: '2026-02-03T23:58:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'aquila-us-west-2:activate-device-direct:5.1.2:470',
    clusterId: 'aquila-us-west-2',
    serviceId: 'activate-device-direct',
    buildVersion: '5.1.2',
    gitSha: 'c3d4e10',
    startedAt: '2026-02-01T18:00:00Z',
    endedAt: '2026-02-01T18:25:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-west-2:activate-inventory:4.6.1:610',
    clusterId: 'mira-us-west-2',
    serviceId: 'activate-inventory',
    buildVersion: '4.6.1',
    gitSha: 'aa11bb2',
    startedAt: '2026-02-05T05:10:00Z',
    endedAt: '2026-02-05T05:28:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-east-2:activate-inventory:4.6.1:611',
    clusterId: 'mira-us-east-2',
    serviceId: 'activate-inventory',
    buildVersion: '4.6.1',
    gitSha: 'aa11bb2',
    startedAt: '2026-02-05T05:40:00Z',
    endedAt: '2026-02-05T05:58:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:activate-inventory:4.6.0:608',
    clusterId: 'mira-us-west-2',
    serviceId: 'activate-inventory',
    buildVersion: '4.6.0',
    gitSha: 'aa11bb1',
    startedAt: '2026-02-04T04:10:00Z',
    endedAt: '2026-02-04T04:25:00Z',
    status: 'FAILED',
    failureReason: 'Health checks failed',
    trigger: 'merge',
  },
  {
    id: 'pavo-us-east-2:activate-inventory:4.6.0:590',
    clusterId: 'pavo-us-east-2',
    serviceId: 'activate-inventory',
    buildVersion: '4.6.0',
    gitSha: 'aa11bb1',
    startedAt: '2026-02-04T21:10:00Z',
    endedAt: '2026-02-04T21:26:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'aquila-us-east-2:activate-inventory:4.5.6:560',
    clusterId: 'aquila-us-east-2',
    serviceId: 'activate-inventory',
    buildVersion: '4.5.6',
    gitSha: 'aa11bb0',
    startedAt: '2026-02-02T12:00:00Z',
    endedAt: '2026-02-02T12:18:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-west-2:ugm:2.1.2:329',
    clusterId: 'mira-us-west-2',
    serviceId: 'ugm',
    buildVersion: '2.1.2',
    gitSha: 'bead122',
    startedAt: '2026-02-04T09:00:00Z',
    endedAt: '2026-02-04T09:15:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'pavo-us-west-2:ugm:2.1.2:300',
    clusterId: 'pavo-us-west-2',
    serviceId: 'ugm',
    buildVersion: '2.1.2',
    gitSha: 'bead122',
    startedAt: '2026-02-04T13:00:00Z',
    endedAt: '2026-02-04T13:12:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'aquila-us-west-2:ugm:2.1.0:260',
    clusterId: 'aquila-us-west-2',
    serviceId: 'ugm',
    buildVersion: '2.1.0',
    gitSha: 'bead120',
    startedAt: '2026-02-01T20:00:00Z',
    endedAt: '2026-02-01T20:15:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-west-2:pingfed:12.0.9:150',
    clusterId: 'mira-us-west-2',
    serviceId: 'pingfed',
    buildVersion: '12.0.9',
    gitSha: '9911aa0',
    startedAt: '2026-02-05T07:00:00Z',
    endedAt: '2026-02-05T07:10:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-east-2:pingfed:12.0.9:151',
    clusterId: 'mira-us-east-2',
    serviceId: 'pingfed',
    buildVersion: '12.0.9',
    gitSha: '9911aa0',
    startedAt: '2026-02-05T07:20:00Z',
    endedAt: '2026-02-05T07:32:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:pingfed:12.0.8:148',
    clusterId: 'mira-us-west-2',
    serviceId: 'pingfed',
    buildVersion: '12.0.8',
    gitSha: '9911a99',
    startedAt: '2026-02-04T07:00:00Z',
    endedAt: '2026-02-04T07:12:00Z',
    status: 'ROLLBACK',
    rollbackToBuild: '12.0.7',
    failureReason: 'Functional failures during deployment',
    trigger: 'merge',
  },
  {
    id: 'pavo-us-west-2:pingfed:12.0.8:140',
    clusterId: 'pavo-us-west-2',
    serviceId: 'pingfed',
    buildVersion: '12.0.8',
    gitSha: '9911a99',
    startedAt: '2026-02-04T22:00:00Z',
    endedAt: '2026-02-04T22:11:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'aquila-us-east-2:pingfed:12.0.7:120',
    clusterId: 'aquila-us-east-2',
    serviceId: 'pingfed',
    buildVersion: '12.0.7',
    gitSha: '9911a70',
    startedAt: '2026-02-02T22:10:00Z',
    endedAt: '2026-02-02T22:22:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-west-2:session-manager:1.9.8:901',
    clusterId: 'mira-us-west-2',
    serviceId: 'session-manager',
    buildVersion: '1.9.8',
    gitSha: '55aa001',
    startedAt: '2026-02-05T10:00:00Z',
    endedAt: '2026-02-05T10:15:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-east-2:session-manager:1.9.8:902',
    clusterId: 'mira-us-east-2',
    serviceId: 'session-manager',
    buildVersion: '1.9.8',
    gitSha: '55aa001',
    startedAt: '2026-02-05T10:20:00Z',
    endedAt: '2026-02-05T10:40:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:session-manager:1.9.7:899',
    clusterId: 'mira-us-west-2',
    serviceId: 'session-manager',
    buildVersion: '1.9.7',
    gitSha: '55aa000',
    startedAt: '2026-02-04T10:00:00Z',
    endedAt: '2026-02-04T10:18:00Z',
    status: 'FAILED',
    failureReason: 'Functional gate timed out',
    trigger: 'merge',
  },
  {
    id: 'pavo-us-west-2:session-manager:1.9.6:870',
    clusterId: 'pavo-us-west-2',
    serviceId: 'session-manager',
    buildVersion: '1.9.6',
    gitSha: '5599ff0',
    startedAt: '2026-02-03T21:10:00Z',
    endedAt: '2026-02-03T21:25:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'aquila-us-west-2:session-manager:1.9.2:820',
    clusterId: 'aquila-us-west-2',
    serviceId: 'session-manager',
    buildVersion: '1.9.2',
    gitSha: '5599aa2',
    startedAt: '2026-02-01T10:10:00Z',
    endedAt: '2026-02-01T10:28:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-west-2:sso-manager:2.3.5:701',
    clusterId: 'mira-us-west-2',
    serviceId: 'sso-manager',
    buildVersion: '2.3.5',
    gitSha: '123ab55',
    startedAt: '2026-02-05T08:00:00Z',
    endedAt: '2026-02-05T08:15:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-east-2:sso-manager:2.3.5:702',
    clusterId: 'mira-us-east-2',
    serviceId: 'sso-manager',
    buildVersion: '2.3.5',
    gitSha: '123ab55',
    startedAt: '2026-02-05T08:20:00Z',
    endedAt: '2026-02-05T08:33:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:sso-manager:2.3.4:699',
    clusterId: 'mira-us-west-2',
    serviceId: 'sso-manager',
    buildVersion: '2.3.4',
    gitSha: '123ab44',
    startedAt: '2026-02-04T08:00:00Z',
    endedAt: '2026-02-04T08:14:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'pavo-us-east-2:sso-manager:2.3.3:670',
    clusterId: 'pavo-us-east-2',
    serviceId: 'sso-manager',
    buildVersion: '2.3.3',
    gitSha: '123ab33',
    startedAt: '2026-02-03T09:00:00Z',
    endedAt: '2026-02-03T09:12:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'aquila-us-east-2:sso-manager:2.3.0:640',
    clusterId: 'aquila-us-east-2',
    serviceId: 'sso-manager',
    buildVersion: '2.3.0',
    gitSha: '123ab00',
    startedAt: '2026-02-01T22:00:00Z',
    endedAt: '2026-02-01T22:18:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-west-2:frontend:0.42.2:820',
    clusterId: 'mira-us-west-2',
    serviceId: 'frontend',
    buildVersion: '0.42.2',
    gitSha: 'f00dbb2',
    startedAt: '2026-02-05T04:00:00Z',
    endedAt: '2026-02-05T04:15:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-east-2:frontend:0.42.2:821',
    clusterId: 'mira-us-east-2',
    serviceId: 'frontend',
    buildVersion: '0.42.2',
    gitSha: 'f00dbb2',
    startedAt: '2026-02-05T04:25:00Z',
    endedAt: '2026-02-05T04:40:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'aquila-us-west-2:frontend:0.40.0:780',
    clusterId: 'aquila-us-west-2',
    serviceId: 'frontend',
    buildVersion: '0.40.0',
    gitSha: 'f00db40',
    startedAt: '2026-02-02T08:00:00Z',
    endedAt: '2026-02-02T08:14:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-west-2:ui-doorway:0.18.3:1001',
    clusterId: 'mira-us-west-2',
    serviceId: 'ui-doorway',
    buildVersion: '0.18.3',
    gitSha: 'dd00aa3',
    startedAt: '2026-02-05T06:00:00Z',
    endedAt: '2026-02-05T06:12:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-east-2:ui-doorway:0.18.3:1002',
    clusterId: 'mira-us-east-2',
    serviceId: 'ui-doorway',
    buildVersion: '0.18.3',
    gitSha: 'dd00aa3',
    startedAt: '2026-02-05T06:20:00Z',
    endedAt: '2026-02-05T06:35:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:ui-doorway:0.18.2:999',
    clusterId: 'mira-us-west-2',
    serviceId: 'ui-doorway',
    buildVersion: '0.18.2',
    gitSha: 'dd00aa2',
    startedAt: '2026-02-04T06:00:00Z',
    endedAt: '2026-02-04T06:14:00Z',
    status: 'FAILED',
    failureReason: 'E2E smoke failed',
    trigger: 'merge',
  },
  {
    id: 'pavo-us-west-2:ui-doorway:0.18.2:960',
    clusterId: 'pavo-us-west-2',
    serviceId: 'ui-doorway',
    buildVersion: '0.18.2',
    gitSha: 'dd00aa2',
    startedAt: '2026-02-04T20:00:00Z',
    endedAt: '2026-02-04T20:12:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'aquila-us-east-2:ui-doorway:0.17.4:920',
    clusterId: 'aquila-us-east-2',
    serviceId: 'ui-doorway',
    buildVersion: '0.17.4',
    gitSha: 'dd00aa0',
    startedAt: '2026-02-02T04:00:00Z',
    endedAt: '2026-02-02T04:14:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },

  {
    id: 'mira-us-west-2:mfe:0.27.6:1101',
    clusterId: 'mira-us-west-2',
    serviceId: 'mfe',
    buildVersion: '0.27.6',
    gitSha: 'ee11aa6',
    startedAt: '2026-02-05T06:50:00Z',
    endedAt: '2026-02-05T07:05:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-east-2:mfe:0.27.6:1102',
    clusterId: 'mira-us-east-2',
    serviceId: 'mfe',
    buildVersion: '0.27.6',
    gitSha: 'ee11aa6',
    startedAt: '2026-02-05T07:15:00Z',
    endedAt: '2026-02-05T07:28:00Z',
    status: 'SUCCESS',
    trigger: 'merge',
  },
  {
    id: 'mira-us-west-2:mfe:0.27.5:1099',
    clusterId: 'mira-us-west-2',
    serviceId: 'mfe',
    buildVersion: '0.27.5',
    gitSha: 'ee11aa5',
    startedAt: '2026-02-04T06:50:00Z',
    endedAt: '2026-02-04T07:05:00Z',
    status: 'FAILED',
    failureReason: 'Bundle validation failed',
    trigger: 'merge',
  },
  {
    id: 'pavo-us-east-2:mfe:0.27.3:1060',
    clusterId: 'pavo-us-east-2',
    serviceId: 'mfe',
    buildVersion: '0.27.3',
    gitSha: 'ee11aa3',
    startedAt: '2026-02-03T17:00:00Z',
    endedAt: '2026-02-03T17:12:00Z',
    status: 'SUCCESS',
    trigger: 'promotion',
  },
  {
    id: 'aquila-us-west-2:mfe:0.26.9:1020',
    clusterId: 'aquila-us-west-2',
    serviceId: 'mfe',
    buildVersion: '0.26.9',
    gitSha: 'ee11aa0',
    startedAt: '2026-02-01T04:00:00Z',
    endedAt: '2026-02-01T04:15:00Z',
    status: 'LIVE',
    trigger: 'promotion',
  },
];

function parseSemver(v) {
  const m = String(v).match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function semverToString([a, b, c]) {
  return `${a}.${b}.${c}`;
}

function prevSemver(v, steps, patchMax = 9) {
  const p = parseSemver(v);
  if (!p) return `${v}-r${steps}`;

  let [maj, min, pat] = p;
  for (let i = 0; i < steps; i++) {
    if (pat > 0) {
      pat -= 1;
      continue;
    }

    if (min > 0) {
      min -= 1;
      pat = patchMax;
      continue;
    }

    if (maj > 0) {
      maj -= 1;
      min = 0;
      pat = patchMax;
      continue;
    }

    // Can't decrement below 0.0.0
    maj = 0;
    min = 0;
    pat = 0;
  }

  return semverToString([maj, min, pat]);
}

function buildDeploymentAttempts(seed) {
  const attempts = [...seed];
  const byKey = new Map();

  for (const a of attempts) {
    const key = `${a.clusterId}::${a.serviceId}`;
    const list = byKey.get(key) || [];
    list.push(a);
    byKey.set(key, list);
  }

  const baseTime = Date.parse('2026-02-05T20:00:00Z');
  const clusterIds = Object.keys(currentRunning);

  for (const clusterId of clusterIds) {
    for (const svc of services) {
      const key = `${clusterId}::${svc.id}`;
      const existing = (byKey.get(key) || []).slice();
      if (existing.length >= 5) continue;

      const current = currentRunning[clusterId]?.[svc.id];
      const currentVer = current || '0.0.0';
      const needed = 5 - existing.length;

      for (let i = 0; i < needed; i++) {
        const version = prevSemver(currentVer, i + 1);
        const n = 9000 + i + existing.length;

        const startedAt = new Date(baseTime - (i + 1) * 60 * 60 * 1000).toISOString();
        const endedAt = new Date(baseTime - (i + 1) * 60 * 60 * 1000 + 12 * 60 * 1000).toISOString();

        let status = 'SUCCESS';
        if (String(clusterId).startsWith('aquila-')) status = 'LIVE';

        const id = `${clusterId}:${svc.id}:${version}:gen${n}`;
        if (attempts.some((x) => x.id === id)) continue;

        attempts.push({
          id,
          clusterId,
          serviceId: svc.id,
          buildVersion: version,
          gitSha: `gen${n}`,
          startedAt,
          endedAt,
          status,
          rollbackToBuild: undefined,
          failureReason: undefined,
          trigger: String(clusterId).startsWith('mira-') ? 'merge' : 'promotion',
        });
      }
    }
  }

  // Force the latest attempt per cluster/service to be healthy.
  // This ensures all clusters read as healthy in the UX while still allowing
  // historical failures/rollbacks to exist.
  const parseSemver = (v) => {
    const m = String(v).match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!m) return null;
    return [Number(m[1]), Number(m[2]), Number(m[3])];
  };

  const cmpSemver = (a, b) => {
    const pa = parseSemver(a);
    const pb = parseSemver(b);
    if (!pa && !pb) return String(a).localeCompare(String(b));
    if (!pa) return -1;
    if (!pb) return 1;
    for (let i = 0; i < 3; i++) {
      if (pa[i] !== pb[i]) return pa[i] - pb[i];
    }
    return 0;
  };

  const latestIndexByKey = new Map();
  for (let i = 0; i < attempts.length; i++) {
    const a = attempts[i];
    const key = `${a.clusterId}::${a.serviceId}`;
    const prevIdx = latestIndexByKey.get(key);
    if (prevIdx === undefined) {
      latestIndexByKey.set(key, i);
      continue;
    }

    const prev = attempts[prevIdx];
    const v = cmpSemver(a.buildVersion, prev.buildVersion);
    if (v > 0) {
      latestIndexByKey.set(key, i);
      continue;
    }
    if (v === 0 && String(a.startedAt) > String(prev.startedAt)) {
      latestIndexByKey.set(key, i);
    }
  }

  for (const [key, idx] of latestIndexByKey.entries()) {
    const a = attempts[idx];
    const desired = String(a.clusterId).startsWith('aquila-') ? 'LIVE' : 'SUCCESS';
    if (a.status === desired) continue;
    attempts[idx] = {
      ...a,
      status: desired,
      endedAt: a.endedAt || a.startedAt,
      rollbackToBuild: undefined,
      failureReason: undefined,
    };
  }

  return attempts.sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
}

export const deploymentAttempts = buildDeploymentAttempts(seedDeploymentAttempts);

const seedTestRuns = [
  // AuthN Mira build 3.4.2
  {
    id: 'tr:1',
    attemptId: 'mira-us-west-2:authn:3.4.2:1284',
    suiteType: 'FUNCTIONAL',
    total: 420,
    passed: 420,
    failed: 0,
    skipped: 0,
    durationSec: 580,
    executedAt: '2026-02-03T22:20:00Z',
    reportUrl: '#',
  },
  {
    id: 'tr:2',
    attemptId: 'mira-us-west-2:authn:3.4.2:1284',
    suiteType: 'REGRESSION',
    total: 1200,
    passed: 1198,
    failed: 2,
    skipped: 0,
    durationSec: 3600,
    executedAt: '2026-02-04T08:10:00Z',
    reportUrl: '#',
  },
  {
    id: 'tr:3',
    attemptId: 'mira-us-west-2:authn:3.4.2:1284',
    suiteType: 'SCALE',
    total: 25,
    passed: 25,
    failed: 0,
    skipped: 0,
    durationSec: 2100,
    executedAt: '2026-02-04T02:30:00Z',
    reportUrl: '#',
  },

  // AuthN Mira rollback attempt
  {
    id: 'tr:4',
    attemptId: 'mira-us-west-2:authn:3.4.2:1283',
    suiteType: 'FUNCTIONAL',
    total: 420,
    passed: 398,
    failed: 22,
    skipped: 0,
    durationSec: 410,
    executedAt: '2026-02-03T20:14:00Z',
    reportUrl: '#',
  },

  // AuthN Pavo sanity
  {
    id: 'tr:5',
    attemptId: 'pavo-us-west-2:authn:3.4.1:1279',
    suiteType: 'SANITY',
    total: 80,
    passed: 80,
    failed: 0,
    skipped: 0,
    durationSec: 420,
    executedAt: '2026-02-04T07:55:00Z',
    reportUrl: '#',
  },

  // Account-management Mira us-east-2 in-progress
  {
    id: 'tr:6',
    attemptId: 'mira-us-east-2:account-management:1.18.0:9101',
    suiteType: 'FUNCTIONAL',
    total: 420,
    passed: 120,
    failed: 0,
    skipped: 0,
    durationSec: 240,
    executedAt: '2026-02-05T18:46:00Z',
    reportUrl: '#',
  },

  // UGM Mira us-east-2 failed gate
  {
    id: 'tr:7',
    attemptId: 'mira-us-east-2:ugm:2.1.3:331',
    suiteType: 'FUNCTIONAL',
    total: 300,
    passed: 260,
    failed: 40,
    skipped: 0,
    durationSec: 520,
    executedAt: '2026-02-05T11:40:00Z',
    reportUrl: '#',
  },

  // Frontend Pavo nightly sanity (after promotion)
  {
    id: 'tr:8',
    attemptId: 'pavo-us-west-2:frontend:0.42.0:801',
    suiteType: 'SANITY',
    total: 120,
    passed: 120,
    failed: 0,
    skipped: 0,
    durationSec: 600,
    executedAt: '2026-02-05T07:30:00Z',
    reportUrl: '#',
  },
  {
    id: 'tr:9',
    attemptId: 'pavo-us-west-2:frontend:0.42.1:802',
    suiteType: 'SANITY',
    total: 120,
    passed: 98,
    failed: 22,
    skipped: 0,
    durationSec: 610,
    executedAt: '2026-02-05T08:30:00Z',
    reportUrl: '#',
  },
];

function buildTestRuns(seed, attempts) {
  const runs = [...seed];
  const existingKey = new Set(runs.map((r) => `${r.attemptId}::${r.suiteType}`));

  for (const a of attempts) {
    const isMira = String(a.clusterId).startsWith('mira-');
    const isPavo = String(a.clusterId).startsWith('pavo-');
    const isAquila = String(a.clusterId).startsWith('aquila-');

    const totalFunctional = 420;
    const functionalFailed = 0;
    const functionalPassed = totalFunctional;

    const base = {
      attemptId: a.id,
      reportUrl: '#',
    };

    const startedMs = Date.parse(a.startedAt);
    const executedAt = Number.isFinite(startedMs)
      ? new Date(startedMs + 6 * 60 * 1000).toISOString()
      : a.startedAt;

    const maybeAdd = (suiteType, obj) => {
      const key = `${a.id}::${suiteType}`;
      if (existingKey.has(key)) return;
      const id = `tr:auto:${a.id}:${suiteType}`;
      runs.push({ id, ...base, suiteType, executedAt, ...obj });
      existingKey.add(key);
    };

    // Always add functional for visibility.
    maybeAdd('FUNCTIONAL', {
      total: totalFunctional,
      passed: functionalPassed,
      failed: functionalFailed,
      skipped: 0,
      durationSec: 600,
    });

    // Add sanity/regression where it makes sense for the pipeline.
    if (isPavo || isAquila) {
      const totalSanity = 120;
      const sanityFailed = 0;
      maybeAdd('SANITY', {
        total: totalSanity,
        passed: Math.max(0, totalSanity - sanityFailed),
        failed: sanityFailed,
        skipped: 0,
        durationSec: 540,
      });
    }

    if (isMira) {
      const totalRegression = 650;
      const regressionFailed = 0;
      maybeAdd('REGRESSION', {
        total: totalRegression,
        passed: Math.max(0, totalRegression - regressionFailed),
        failed: regressionFailed,
        skipped: 0,
        durationSec: 1800,
      });
    }
  }

  return runs;
}

export const testRuns = buildTestRuns(seedTestRuns, deploymentAttempts);

export const promotions = [
  {
    id: 'promo:1',
    serviceId: 'authn',
    buildVersion: '3.4.1',
    fromClusterId: 'mira-us-east-2',
    toClusterId: 'pavo-us-west-2',
    promotedAt: '2026-02-03T23:05:00Z',
  },
  {
    id: 'promo:2',
    serviceId: 'authn',
    buildVersion: '3.4.0',
    fromClusterId: 'pavo-us-west-2',
    toClusterId: 'aquila-us-west-2',
    promotedAt: '2026-02-02T17:40:00Z',
  },
];

export const scorecardWeights = {
  gameday: 25,
  outages: 25,
  tests: 20,
  incidents: 15,
  readiness: 15,
};

// Scores are 0-100 per category; UI computes weighted overall score.
export const scorecards = {
  authn: {
    gameday: 86,
    outages: 92,
    tests: 88,
    incidents: 80,
    readiness: 90,
    notes: 'Strong reliability and test coverage; a few incident learnings pending follow-up.',
  },
  authz: {
    gameday: 84,
    outages: 88,
    tests: 85,
    incidents: 78,
    readiness: 87,
    notes: 'Stable. Improve incident response automation and add more system tests.',
  },
  'account-management': {
    gameday: 75,
    outages: 82,
    tests: 78,
    incidents: 70,
    readiness: 79,
    notes: 'Track recurring incident type and complete remaining production readiness checks.',
  },
  'activate-device-direct': {
    gameday: 80,
    outages: 76,
    tests: 74,
    incidents: 72,
    readiness: 77,
    notes: 'Recent deploy instability; prioritize system tests and hardening from gameday findings.',
  },
  'activate-inventory': {
    gameday: 82,
    outages: 85,
    tests: 79,
    incidents: 74,
    readiness: 83,
    notes: 'Good trend; address top flaky tests and add outage drills.',
  },
  ugm: {
    gameday: 70,
    outages: 80,
    tests: 72,
    incidents: 68,
    readiness: 75,
    notes: 'Needs more production readiness automation and incident playbooks.',
  },
  pingfed: {
    gameday: 78,
    outages: 90,
    tests: 70,
    incidents: 76,
    readiness: 82,
    notes: 'Outage record is strong; improve solution/system test automation coverage.',
  },
  'session-manager': {
    gameday: 74,
    outages: 79,
    tests: 76,
    incidents: 71,
    readiness: 78,
    notes: 'Moderate risk; close readiness gaps and tighten incident response SLAs.',
  },
  'sso-manager': {
    gameday: 76,
    outages: 84,
    tests: 77,
    incidents: 73,
    readiness: 81,
    notes: 'Healthy baseline; improve gameday scenarios and system test depth.',
  },
  frontend: {
    gameday: 72,
    outages: 83,
    tests: 75,
    incidents: 69,
    readiness: 74,
    notes: 'UI regressions observed; add more E2E/system tests and incident runbooks.',
  },
  'ui-doorway': {
    gameday: 71,
    outages: 82,
    tests: 73,
    incidents: 68,
    readiness: 73,
    notes: 'Improve readiness checks and gameday remediation tracking.',
  },
  mfe: {
    gameday: 73,
    outages: 81,
    tests: 74,
    incidents: 70,
    readiness: 76,
    notes: 'Focus on system tests and production readiness score improvements.',
  },
};

export const suiteMeta = {
  FUNCTIONAL: { label: 'Functional (on deploy)', color: 'blue' },
  REGRESSION: { label: 'Nightly Regression', color: 'violet' },
  SANITY: { label: 'Nightly Sanity', color: 'emerald' },
  SCALE: { label: 'Scale', color: 'amber' },
  PERF: { label: 'Performance', color: 'orange' },
};

export const statusMeta = {
  SUCCESS: { label: 'SUCCESS', tone: 'emerald' },
  FAILED: { label: 'FAILED', tone: 'rose' },
  ROLLBACK: { label: 'FAILED → ROLLBACK', tone: 'amber' },
  IN_PROGRESS: { label: 'IN PROGRESS', tone: 'sky' },
  LIVE: { label: 'LIVE', tone: 'emerald' },
};
