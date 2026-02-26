export const clusters = [
  {
    id: 'mira',
    name: 'Mira',
    type: 'QA',
    description:
      'Deploy after PR is merged. Functional tests gate success. Functional/Scale/Perf/Manual testing cluster. Also runs Nightly Regression.',
  },
  {
    id: 'pavo',
    name: 'Pavo',
    type: 'Stage',
    description:
      'Promote after Mira validation. Used by BU partners and also runs Nightly Regression.',
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

// Active/Hot-standby roles per base cluster.
// In production, you can source this from the separate S3 file you mentioned.
export const clusterRegionRoles = {
  mira: {
    active: 'us-west-2',
    hotStandby: 'us-east-2',
  },
  pavo: {
    active: 'us-west-2',
    hotStandby: 'us-east-2',
  },
  aquila: {
    active: 'us-west-2',
    hotStandby: 'us-east-2',
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
    ? roles.active === cr.region
      ? 'Active'
      : roles.hotStandby === cr.region
        ? 'Hot-standby'
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
  { id: 'notification-service', name: 'Notification Service', owner: 'Platform Team', tier: 'medium', appId: '00000000-0000-0000-0000-000000000012' },
  { id: 'audit-service', name: 'Audit Service', owner: 'Security Team', tier: 'high', appId: '00000000-0000-0000-0000-000000000013' },
  { id: 'config-service', name: 'Config Service', owner: 'Platform Team', tier: 'medium', appId: '00000000-0000-0000-0000-000000000014' },
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
    'notification-service': '1.3.0',
    'audit-service': '2.0.4',
    'config-service': '0.9.1',
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
    'notification-service': '1.2.9',
    'audit-service': '2.0.3',
    'config-service': '0.9.0',
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

  // mira-us-west-2: 2 rollbacks + 1 failure (latest builds for these services)
  {
    id: 'mira-us-west-2:notification-service:1.3.1:5001',
    clusterId: 'mira-us-west-2',
    serviceId: 'notification-service',
    buildVersion: '1.3.1',
    gitSha: 'noti501',
    startedAt: '2026-02-05T16:00:00Z',
    endedAt: '2026-02-05T16:14:00Z',
    status: 'ROLLBACK',
    rollbackToBuild: '1.3.0',
    failureReason: 'Functional gate failures — notification delivery timeout',
    trigger: 'merge',
    _pinned: true,
  },
  {
    id: 'mira-us-west-2:config-service:0.9.2:5002',
    clusterId: 'mira-us-west-2',
    serviceId: 'config-service',
    buildVersion: '0.9.2',
    gitSha: 'cfg5002',
    startedAt: '2026-02-05T15:30:00Z',
    endedAt: '2026-02-05T15:42:00Z',
    status: 'ROLLBACK',
    rollbackToBuild: '0.9.1',
    failureReason: 'Config propagation regression detected',
    trigger: 'merge',
    _pinned: true,
  },
  {
    id: 'mira-us-west-2:audit-service:2.0.5:5003',
    clusterId: 'mira-us-west-2',
    serviceId: 'audit-service',
    buildVersion: '2.0.5',
    gitSha: 'aud5003',
    startedAt: '2026-02-05T14:45:00Z',
    endedAt: '2026-02-05T14:58:00Z',
    status: 'FAILED',
    failureReason: 'Health checks did not stabilize within timeout',
    trigger: 'merge',
    _pinned: true,
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
      if (!current) continue;
      const currentVer = current;
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
    if (a._pinned) continue;
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
    total: 312,
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
    total: 198,
    passed: 158,
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

  // Notification Service rollback — FT had 18 failures
  {
    id: 'tr:10',
    attemptId: 'mira-us-west-2:notification-service:1.3.1:5001',
    suiteType: 'FUNCTIONAL',
    total: 148,
    passed: 130,
    failed: 18,
    skipped: 0,
    durationSec: 580,
    executedAt: '2026-02-05T16:08:00Z',
    reportUrl: '#',
  },

  // Config Service rollback — FT had 12 failures
  {
    id: 'tr:11',
    attemptId: 'mira-us-west-2:config-service:0.9.2:5002',
    suiteType: 'FUNCTIONAL',
    total: 132,
    passed: 120,
    failed: 12,
    skipped: 0,
    durationSec: 560,
    executedAt: '2026-02-05T15:36:00Z',
    reportUrl: '#',
  },

  // Audit Service failed — FT had 35 failures + rollback also failed
  {
    id: 'tr:12',
    attemptId: 'mira-us-west-2:audit-service:2.0.5:5003',
    suiteType: 'FUNCTIONAL',
    total: 210,
    passed: 175,
    failed: 35,
    skipped: 0,
    durationSec: 490,
    executedAt: '2026-02-05T14:52:00Z',
    reportUrl: '#',
  },
];

const ftCountByService = {
  authn: 420,
  authz: 385,
  'account-management': 312,
  'activate-device-direct': 278,
  'activate-inventory': 245,
  ugm: 198,
  pingfed: 156,
  'session-manager': 230,
  'sso-manager': 175,
  frontend: 340,
  'ui-doorway': 265,
  mfe: 290,
  'notification-service': 148,
  'audit-service': 210,
  'config-service': 132,
};

function buildTestRuns(seed, attempts) {
  const runs = [...seed];
  const existingKey = new Set(runs.map((r) => `${r.attemptId}::${r.suiteType}`));

  for (const a of attempts) {
    const isMira = String(a.clusterId).startsWith('mira-');
    const isPavo = String(a.clusterId).startsWith('pavo-');
    const isAquila = String(a.clusterId).startsWith('aquila-');

    const totalFunctional = ftCountByService[a.serviceId] || 200;
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

    // Add sanity where it makes sense for the pipeline.
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
  }

  // ── Nightly regression runs for Mira & Pavo ──
  // Nightly runs all services' FT on whatever build is currently running.
  // Not every build gets a nightly — only the one that happened to be "current"
  // when the nightly kicked off. Use a deterministic hash on the attempt ID
  // to scatter nightly runs across builds realistically (~60% chance).
  function simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  const nightlyFailServices = new Set(['ugm', 'frontend', 'session-manager']);

  const nightlyEligible = attempts
    .filter((a) => String(a.clusterId).startsWith('mira-') || String(a.clusterId).startsWith('pavo-'));

  for (const a of nightlyEligible) {
    const key = `${a.id}::REGRESSION`;
    if (existingKey.has(key)) continue;

    // ~60% of builds get a nightly run (deterministic based on attempt ID)
    const hash = simpleHash(a.id);
    if (hash % 10 >= 6) continue;

    const total = ftCountByService[a.serviceId] || 200;
    const hasFail = nightlyFailServices.has(a.serviceId) && hash % 7 === 0;
    const failed = hasFail ? Math.max(2, Math.floor(total * 0.02)) : 0;

    // Nightly runs at 2 AM the day after the build was deployed
    const deployMs = Date.parse(a.startedAt);
    const nightlyTime = Number.isFinite(deployMs)
      ? new Date(deployMs + 8 * 60 * 60 * 1000).toISOString()
      : a.startedAt;

    runs.push({
      id: `tr:nightly:${a.id}`,
      attemptId: a.id,
      suiteType: 'REGRESSION',
      total,
      passed: total - failed,
      failed,
      skipped: 0,
      durationSec: 2400,
      executedAt: nightlyTime,
      reportUrl: '#',
    });
    existingKey.add(key);
  }

  // ── Canary test runs for Aquila clusters (per service) ──
  // Canary runs a small focused test suite on each service after promotion to production.
  // Every build on Aquila gets a canary run (~100% coverage).
  const canaryEligible = attempts
    .filter((a) => String(a.clusterId).startsWith('aquila-'));

  const canaryCountByService = {
    authn: 45, authz: 38, 'account-management': 32, 'activate-device-direct': 28,
    'activate-inventory': 25, ugm: 22, pingfed: 18, 'session-manager': 20,
    'sso-manager': 24, frontend: 30, 'ui-doorway': 15, mfe: 18,
    'notification-service': 12, 'audit-service': 14, 'config-service': 10,
  };

  const canaryFailServices = new Set(['frontend', 'sso-manager']);

  for (const a of canaryEligible) {
    const key = `${a.id}::CANARY`;
    if (existingKey.has(key)) continue;

    const total = canaryCountByService[a.serviceId] || 20;
    const hash = simpleHash(a.id);
    const hasFail = canaryFailServices.has(a.serviceId) && hash % 8 === 0;
    const failed = hasFail ? Math.max(1, Math.floor(total * 0.04)) : 0;

    const deployMs = Date.parse(a.startedAt);
    const canaryTime = Number.isFinite(deployMs)
      ? new Date(deployMs + 30 * 60 * 1000).toISOString()
      : a.startedAt;

    runs.push({
      id: `tr:canary:${a.id}`,
      attemptId: a.id,
      suiteType: 'CANARY',
      total,
      passed: total - failed,
      failed,
      skipped: 0,
      durationSec: 300 + (hash % 120),
      executedAt: canaryTime,
      reportUrl: '#',
    });
    existingKey.add(key);
  }

  return runs;
}

export const testRuns = buildTestRuns(seedTestRuns, deploymentAttempts);

/* ── Cluster-level test suites: Solution & System ─────────────── */
// These run at the cluster level (not per-service). Only for Mira & Pavo.
function buildClusterTestRuns() {
  const runs = [];
  const baseDate = new Date('2026-02-05T03:00:00Z');
  const clusters = ['mira-us-west-2', 'mira-us-east-2', 'pavo-us-west-2', 'pavo-us-east-2'];

  const solutionCounts = { 'mira-us-west-2': 185, 'mira-us-east-2': 185, 'pavo-us-west-2': 160, 'pavo-us-east-2': 160 };
  const systemCounts   = { 'mira-us-west-2': 92,  'mira-us-east-2': 92,  'pavo-us-west-2': 78,  'pavo-us-east-2': 78 };

  //                        day-0   day-1   day-2   day-3   day-4
  const solFailPcts =      [0.5,    0.0,    2.8,    1.1,    0.0];
  const solSkipPcts =      [0.0,    0.5,    0.5,    0.0,    1.0];
  const sysFailPcts =      [1.1,    3.2,    0.0,    0.0,    1.6];
  const sysSkipPcts =      [0.0,    0.0,    1.3,    0.0,    0.5];

  for (const cid of clusters) {
    for (let i = 0; i < 5; i++) {
      const date = new Date(baseDate.getTime() - i * 86400000);
      const dateStr = date.toISOString();

      // Solution tests
      const solTotal = solutionCounts[cid] + (i % 3) - 1;
      const solFailed = Math.round(solTotal * solFailPcts[i] / 100);
      const solSkipped = Math.round(solTotal * solSkipPcts[i] / 100);
      runs.push({
        id: `ct:sol:${cid}:${i}`,
        clusterId: cid,
        suiteType: 'SOLUTION',
        total: solTotal,
        passed: solTotal - solFailed - solSkipped,
        failed: solFailed,
        skipped: solSkipped,
        durationSec: 1800 + i * 120,
        executedAt: dateStr,
        reportUrl: '#',
      });

      // System tests
      const sysTotal = systemCounts[cid] + (i % 2);
      const sysFailed = Math.round(sysTotal * sysFailPcts[i] / 100);
      const sysSkipped = Math.round(sysTotal * sysSkipPcts[i] / 100);
      runs.push({
        id: `ct:sys:${cid}:${i}`,
        clusterId: cid,
        suiteType: 'SYSTEM',
        total: sysTotal,
        passed: sysTotal - sysFailed - sysSkipped,
        failed: sysFailed,
        skipped: sysSkipped,
        durationSec: 2700 + i * 90,
        executedAt: dateStr,
        reportUrl: '#',
      });
    }
  }
  return runs;
}

export const clusterTestRuns = buildClusterTestRuns();

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

/* ── Mock Jira tickets per service, keyed by version ────────── */
export const jiraTickets = {
  authn: [
    { key: 'AUTHN-1042', summary: 'Fix token refresh race condition', type: 'Bug', priority: 'Critical', version: '3.4.2', status: 'Done' },
    { key: 'AUTHN-1038', summary: 'Add MFA enrollment audit logging', type: 'Story', priority: 'High', version: '3.4.2', status: 'Done' },
    { key: 'AUTHN-1035', summary: 'Upgrade OIDC library to 4.x', type: 'Task', priority: 'Medium', version: '3.4.2', status: 'Done' },
    { key: 'AUTHN-1030', summary: 'Session expiry not honoring grace period', type: 'Bug', priority: 'High', version: '3.4.1', status: 'Done' },
    { key: 'AUTHN-1027', summary: 'Support SAML IdP-initiated SSO', type: 'Story', priority: 'High', version: '3.4.1', status: 'Done' },
    { key: 'AUTHN-1024', summary: 'Rate limit login attempts per IP', type: 'Story', priority: 'Medium', version: '3.4.1', status: 'Done' },
    { key: 'AUTHN-1020', summary: 'Password policy minimum length increase', type: 'Task', priority: 'Low', version: '3.4.0', status: 'Done' },
    { key: 'AUTHN-1018', summary: 'Fix CORS header for /userinfo endpoint', type: 'Bug', priority: 'High', version: '3.4.0', status: 'Done' },
    { key: 'AUTHN-1015', summary: 'Add account lockout notification email', type: 'Story', priority: 'Medium', version: '3.4.0', status: 'Done' },
  ],
  authz: [
    { key: 'AUTHZ-892', summary: 'Policy evaluation timeout on large rule sets', type: 'Bug', priority: 'Critical', version: '2.9.1', status: 'Done' },
    { key: 'AUTHZ-888', summary: 'Add deny-override combining algorithm', type: 'Story', priority: 'High', version: '2.9.1', status: 'Done' },
    { key: 'AUTHZ-885', summary: 'Cache policy decisions for 30s', type: 'Task', priority: 'Medium', version: '2.9.0', status: 'Done' },
    { key: 'AUTHZ-880', summary: 'Fix role hierarchy resolution for nested groups', type: 'Bug', priority: 'High', version: '2.9.0', status: 'Done' },
    { key: 'AUTHZ-876', summary: 'Attribute-based access control MVP', type: 'Story', priority: 'High', version: '2.8.9', status: 'Done' },
    { key: 'AUTHZ-872', summary: 'Audit log for permission changes', type: 'Story', priority: 'Medium', version: '2.8.9', status: 'Done' },
  ],
  'account-management': [
    { key: 'ACCT-540', summary: 'Bulk account import CSV validation fix', type: 'Bug', priority: 'High', version: '1.18.0', status: 'Done' },
    { key: 'ACCT-537', summary: 'Add account suspension workflow', type: 'Story', priority: 'High', version: '1.18.0', status: 'Done' },
    { key: 'ACCT-533', summary: 'Org hierarchy depth limit to 10 levels', type: 'Task', priority: 'Medium', version: '1.17.9', status: 'Done' },
    { key: 'ACCT-530', summary: 'Fix duplicate email validation on update', type: 'Bug', priority: 'Medium', version: '1.17.9', status: 'Done' },
    { key: 'ACCT-526', summary: 'Self-service account deletion', type: 'Story', priority: 'High', version: '1.17.7', status: 'Done' },
  ],
  'activate-device-direct': [
    { key: 'ADD-310', summary: 'Device activation timeout increased to 120s', type: 'Task', priority: 'Medium', version: '5.2.0', status: 'Done' },
    { key: 'ADD-307', summary: 'Support batch device onboarding', type: 'Story', priority: 'High', version: '5.2.0', status: 'Done' },
    { key: 'ADD-304', summary: 'Fix serial number collision handling', type: 'Bug', priority: 'Critical', version: '5.1.8', status: 'Done' },
    { key: 'ADD-300', summary: 'Add device health check endpoint', type: 'Story', priority: 'Medium', version: '5.1.8', status: 'Done' },
    { key: 'ADD-296', summary: 'Certificate rotation for device auth', type: 'Task', priority: 'High', version: '5.1.2', status: 'Done' },
  ],
  'activate-inventory': [
    { key: 'INV-220', summary: 'Inventory sync job memory leak fix', type: 'Bug', priority: 'Critical', version: '4.6.1', status: 'Done' },
    { key: 'INV-217', summary: 'Add inventory export to CSV', type: 'Story', priority: 'Medium', version: '4.6.1', status: 'Done' },
    { key: 'INV-214', summary: 'Pagination fix for large inventory lists', type: 'Bug', priority: 'High', version: '4.6.0', status: 'Done' },
    { key: 'INV-210', summary: 'Inventory reconciliation cron job', type: 'Story', priority: 'High', version: '4.6.0', status: 'Done' },
    { key: 'INV-206', summary: 'Add inventory tagging support', type: 'Story', priority: 'Medium', version: '4.5.6', status: 'Done' },
  ],
  ugm: [
    { key: 'UGM-180', summary: 'Group membership cache invalidation fix', type: 'Bug', priority: 'High', version: '2.1.3', status: 'Done' },
    { key: 'UGM-177', summary: 'Nested group resolution performance', type: 'Task', priority: 'Medium', version: '2.1.3', status: 'Done' },
    { key: 'UGM-174', summary: 'Add bulk user import via SCIM', type: 'Story', priority: 'High', version: '2.1.2', status: 'Done' },
    { key: 'UGM-170', summary: 'Fix user search by display name', type: 'Bug', priority: 'Medium', version: '2.1.2', status: 'Done' },
    { key: 'UGM-166', summary: 'Dynamic group rules engine', type: 'Story', priority: 'High', version: '2.1.0', status: 'Done' },
  ],
  pingfed: [
    { key: 'PF-450', summary: 'Upgrade PingFederate runtime to 12.0.8', type: 'Task', priority: 'High', version: '12.0.8', status: 'Done' },
    { key: 'PF-447', summary: 'Fix SAML assertion signing algorithm', type: 'Bug', priority: 'Critical', version: '12.0.8', status: 'Done' },
    { key: 'PF-443', summary: 'Add OAuth2 DPoP support', type: 'Story', priority: 'Medium', version: '12.0.7', status: 'Done' },
  ],
  'session-manager': [
    { key: 'SM-330', summary: 'Redis session store connection pooling', type: 'Task', priority: 'High', version: '1.9.7', status: 'Done' },
    { key: 'SM-327', summary: 'Fix session hijack detection false positives', type: 'Bug', priority: 'Critical', version: '1.9.7', status: 'Done' },
    { key: 'SM-324', summary: 'Sliding window session expiry', type: 'Story', priority: 'Medium', version: '1.9.6', status: 'Done' },
    { key: 'SM-320', summary: 'Add session activity log', type: 'Story', priority: 'Low', version: '1.9.2', status: 'Done' },
  ],
  'sso-manager': [
    { key: 'SSO-270', summary: 'Fix cross-domain cookie SameSite issue', type: 'Bug', priority: 'Critical', version: '2.3.4', status: 'Done' },
    { key: 'SSO-267', summary: 'SP-initiated logout flow', type: 'Story', priority: 'High', version: '2.3.4', status: 'Done' },
    { key: 'SSO-264', summary: 'Add SSO connection test endpoint', type: 'Story', priority: 'Medium', version: '2.3.3', status: 'Done' },
    { key: 'SSO-260', summary: 'OIDC back-channel logout support', type: 'Story', priority: 'High', version: '2.3.0', status: 'Done' },
  ],
  frontend: [
    { key: 'FE-890', summary: 'Fix dashboard rendering on Safari 17', type: 'Bug', priority: 'High', version: '0.42.0', status: 'Done' },
    { key: 'FE-887', summary: 'Dark mode color contrast accessibility', type: 'Story', priority: 'Medium', version: '0.42.0', status: 'Done' },
    { key: 'FE-884', summary: 'Add keyboard navigation to data tables', type: 'Story', priority: 'Medium', version: '0.41.3', status: 'Done' },
    { key: 'FE-880', summary: 'Bundle size optimization -15%', type: 'Task', priority: 'High', version: '0.41.3', status: 'Done' },
    { key: 'FE-876', summary: 'Fix date picker timezone issue', type: 'Bug', priority: 'High', version: '0.40.0', status: 'Done' },
  ],
  'ui-doorway': [
    { key: 'UID-190', summary: 'Portal landing page redesign', type: 'Story', priority: 'High', version: '0.18.2', status: 'Done' },
    { key: 'UID-187', summary: 'Fix redirect loop on expired sessions', type: 'Bug', priority: 'Critical', version: '0.18.2', status: 'Done' },
    { key: 'UID-184', summary: 'Add multi-tenant branding support', type: 'Story', priority: 'Medium', version: '0.18.1', status: 'Done' },
    { key: 'UID-180', summary: 'Lazy load portal micro-frontends', type: 'Task', priority: 'High', version: '0.17.4', status: 'Done' },
  ],
  mfe: [
    { key: 'MFE-150', summary: 'Module federation shared scope fix', type: 'Bug', priority: 'High', version: '0.27.5', status: 'Done' },
    { key: 'MFE-147', summary: 'Add health check for remote modules', type: 'Story', priority: 'Medium', version: '0.27.5', status: 'Done' },
    { key: 'MFE-144', summary: 'Upgrade Webpack to 5.90', type: 'Task', priority: 'Medium', version: '0.27.3', status: 'Done' },
    { key: 'MFE-140', summary: 'Fix CSS isolation between micro-frontends', type: 'Bug', priority: 'High', version: '0.26.9', status: 'Done' },
  ],
  'notification-service': [
    { key: 'NS-110', summary: 'Email template rendering fix for Outlook', type: 'Bug', priority: 'High', version: '1.3.0', status: 'Done' },
    { key: 'NS-107', summary: 'Add webhook delivery retry with backoff', type: 'Story', priority: 'High', version: '1.3.0', status: 'Done' },
    { key: 'NS-104', summary: 'SMS notification support', type: 'Story', priority: 'Medium', version: '1.2.9', status: 'Done' },
  ],
  'audit-service': [
    { key: 'AUD-88', summary: 'Fix audit log search by date range', type: 'Bug', priority: 'High', version: '2.0.4', status: 'Done' },
    { key: 'AUD-85', summary: 'Add audit event streaming to SIEM', type: 'Story', priority: 'High', version: '2.0.4', status: 'Done' },
    { key: 'AUD-82', summary: 'Retention policy auto-purge', type: 'Task', priority: 'Medium', version: '2.0.3', status: 'Done' },
  ],
  'config-service': [
    { key: 'CFG-66', summary: 'Fix config reload race condition', type: 'Bug', priority: 'Critical', version: '0.9.1', status: 'Done' },
    { key: 'CFG-63', summary: 'Add config diff between versions', type: 'Story', priority: 'Medium', version: '0.9.1', status: 'Done' },
    { key: 'CFG-60', summary: 'Environment variable override support', type: 'Story', priority: 'High', version: '0.9.0', status: 'Done' },
  ],
};

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
  'notification-service': {
    gameday: 68,
    outages: 77,
    tests: 71,
    incidents: 65,
    readiness: 70,
    notes: 'New service ramping up; needs gameday participation and broader test coverage.',
  },
  'audit-service': {
    gameday: 80,
    outages: 86,
    tests: 82,
    incidents: 75,
    readiness: 84,
    notes: 'Solid reliability; improve incident response playbooks.',
  },
  'config-service': {
    gameday: 66,
    outages: 74,
    tests: 69,
    incidents: 63,
    readiness: 68,
    notes: 'Early stage; prioritize production readiness checklist and system tests.',
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
