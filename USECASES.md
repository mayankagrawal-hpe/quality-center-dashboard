# Quality Center Dashboard — Use Cases & Product Requirements

> **Document type**: Product Requirements Document (PRD)  
> **Status**: Draft  
> **Last updated**: Feb 24, 2026  
> **Owner**: Platform Engineering — Product Management  

---

## Table of Contents

1. [Vision & Problem Statement](#1-vision--problem-statement)
2. [Target Personas](#2-target-personas)
3. [Core Use Cases](#3-core-use-cases)
4. [Use Case Details](#4-use-case-details)
5. [Recommended Additions](#5-recommended-additions)
6. [Priority Matrix](#6-priority-matrix)
7. [Success Metrics (KPIs)](#7-success-metrics-kpis)
8. [Non-Functional Requirements](#8-non-functional-requirements)

---

## 1. Vision & Problem Statement

### Vision

A single, unified dashboard that gives every stakeholder — from developers to VPs — real-time visibility into deployment health, test quality, and release velocity across all cluster-regions and services.

### Problems We Solve

| Problem | Impact Today | Dashboard Solution |
|---------|-------------|-------------------|
| **No single source of truth** for deployment status | Teams check 4-5 different tools (ArgoCD, Jenkins, GitHub, Slack, spreadsheets) to understand what's deployed where | Unified view across all clusters and services |
| **Failures discovered too late** | Failed deployments or test regressions sit unnoticed for hours | Real-time health status with attention badges and alerts |
| **No historical trend visibility** | Can't answer "are we deploying faster or slower than last month?" | Time series analytics for build frequency, pass rates, lead time |
| **Rollback decisions are slow** | Engineers scramble to find which version was last stable | Instant visibility into rollback history and last-known-good version |
| **Cross-cluster blind spots** | Promotions between dev → staging → prod are tracked manually | Pipeline view showing promotion status across cluster-regions |
| **Test quality is opaque** | No easy way to see test pass rates trending over time per service | Test result badges + analytics charts per service per cluster |
| **Release reporting is manual** | Weekly status reports require pulling data from multiple sources | Dashboard replaces manual reporting with live data |

---

## 2. Target Personas

### P1: Platform / DevOps Engineer

**Goal**: Ensure deployments are healthy and troubleshoot failures quickly.

- Needs real-time status of all services across all clusters
- Wants to drill into failed builds and see exact test results
- Needs to identify which services need rollback
- Monitors deployment pipeline flow across environments

### P2: Service / Application Developer

**Goal**: Understand the deployment status of their own service.

- Wants to see if their latest commit deployed successfully
- Needs test results (functional, sanity, regression) for their builds
- Wants to compare deployment health across cluster-regions
- Tracks their service's deployment frequency and lead time

### P3: QA / Test Lead

**Goal**: Monitor test quality and identify regression trends.

- Tracks test pass rates over time per suite type
- Identifies which services have declining test health
- Needs to see which builds failed specific test suites
- Wants historical view of test quality by cluster and service

### P4: Engineering Manager / Director

**Goal**: Understand team velocity and deployment risk at a glance.

- Needs executive overview of cluster health (how many services healthy vs attention)
- Wants trends: are we deploying more frequently? Is quality improving?
- Needs to identify bottleneck services with high failure rates
- Wants to see lead time trends to measure CI/CD efficiency

### P5: VP / Senior Leadership

**Goal**: High-level confidence that deployments are healthy and velocity is improving.

- Needs a "green/red" summary across all environments
- Wants to see week-over-week or month-over-month trends
- Needs risk visibility: how many rollbacks this week? Which services?
- Wants deployment velocity as a proxy for engineering productivity

---

## 3. Core Use Cases

### Category A: Deployment Visibility

| ID | Use Case | Persona | Priority |
|----|----------|---------|----------|
| **A1** | View real-time health of all cluster-regions at a glance | P1, P4, P5 | **P0** |
| **A2** | View all services in a cluster with current deployment status | P1, P2 | **P0** |
| **A3** | View full build attempt history for a service in a cluster | P1, P2 | **P0** |
| **A4** | View build attempt detail (version, SHA, duration, trigger, status) | P1, P2 | **P0** |
| **A5** | Filter build attempts by status (success, failed, rollback) | P1, P2 | **P0** |
| **A6** | View the currently live version of each service per cluster | P1, P2, P4 | **P0** |
| **A7** | View all deployments for a single service across all clusters | P2, P3 | **P1** |
| **A8** | Compare deployment status of a service across cluster-regions | P1, P2 | **P1** |
| **A9** | Identify services with in-progress deployments | P1 | **P1** |
| **A10** | View deployment trigger type (merge, promotion, manual, rollback) | P1, P2 | **P2** |

### Category B: Test Quality & Gate Tracking

| ID | Use Case | Persona | Priority |
|----|----------|---------|----------|
| **B1** | View test results (pass/fail/skip counts) per build attempt | P1, P2, P3 | **P0** |
| **B2** | View test results broken down by suite (functional, sanity, regression) | P2, P3 | **P0** |
| **B3** | Identify builds that failed specific test gates | P1, P3 | **P0** |
| **B4** | Track test pass rates over time per service per cluster | P3, P4 | **P1** |
| **B5** | Identify services with declining test health (regression detection) | P3, P4 | **P1** |
| **B6** | Link from a failed test result to the full test report | P2, P3 | **P1** |
| **B7** | View test execution duration trends (are tests getting slower?) | P3 | **P2** |
| **B8** | View scale/performance test results alongside functional tests | P3 | **P2** |
| **B9** | View manual testing status and sign-off for release candidates | P3, P4 | **P2** |

### Category C: Analytics & Trends

| ID | Use Case | Persona | Priority |
|----|----------|---------|----------|
| **C1** | View build attempts over time (success/failed/rollback) per day | P1, P4 | **P0** |
| **C2** | View deployment frequency per service per cluster | P2, P4 | **P1** |
| **C3** | View average build lead time (deploy duration) trends | P1, P4 | **P1** |
| **C4** | View test pass rate trends per suite type | P3, P4 | **P1** |
| **C5** | Filter all analytics by service and/or cluster-region | P1-P4 | **P0** |
| **C6** | Compare metrics across cluster-regions side by side | P1, P4 | **P2** |
| **C7** | View week-over-week and month-over-month trend comparisons | P4, P5 | **P2** |
| **C8** | Export analytics data (CSV/PDF) for reporting | P4, P5 | **P3** |

### Category D: Pipeline & Promotion Tracking

| ID | Use Case | Persona | Priority |
|----|----------|---------|----------|
| **D1** | View promotion pipeline status (dev → staging → prod) per service | P1, P4 | **P1** |
| **D2** | See which version is live in each environment for a service | P1, P2 | **P0** |
| **D3** | Identify services blocked from promotion (failed gates) | P1, P4 | **P1** |
| **D4** | View promotion history (who promoted what, when) | P1, P4 | **P2** |
| **D5** | Track time-to-promote (how long between dev deploy and prod deploy) | P4, P5 | **P2** |

### Category E: Rollback & Incident Response

| ID | Use Case | Persona | Priority |
|----|----------|---------|----------|
| **E1** | View all rollbacks in a cluster (recent rollback history) | P1 | **P0** |
| **E2** | Identify the last-known-good version for a service | P1 | **P0** |
| **E3** | View rollback reason and which version was rolled back to | P1, P4 | **P1** |
| **E4** | Track rollback frequency over time (is it increasing?) | P4, P5 | **P2** |
| **E5** | Correlate rollbacks with specific test failures | P1, P3 | **P2** |

### Category F: Alerting & Notifications

| ID | Use Case | Persona | Priority |
|----|----------|---------|----------|
| **F1** | Get notified when a deployment fails | P1, P2 | **P1** |
| **F2** | Get notified when test pass rate drops below threshold | P3 | **P1** |
| **F3** | Get notified when a rollback occurs | P1, P4 | **P1** |
| **F4** | Get notified when a cluster-region's health degrades to "Attention" | P1 | **P1** |
| **F5** | Configure notification channels per team (Slack, email, PagerDuty) | P1, P4 | **P2** |
| **F6** | Suppress notifications during maintenance windows | P1 | **P3** |

---

## 4. Use Case Details

### UC-A1: View Real-Time Health of All Cluster-Regions

**Actor**: Platform Engineer, Engineering Manager, VP  
**Precondition**: User is authenticated and has dashboard access  
**Trigger**: User navigates to dashboard home page

**Main Flow**:
1. Dashboard displays all cluster-regions as cards
2. Each card shows: cluster name, type (Dev/Staging/Prod), role (Primary/Secondary)
3. Each card shows health badge: **Healthy** (all services latest build succeeded) or **Attention** (any service has latest build failed/rollback)
4. Each card shows summary counts: total services, successful, failed, rollback
5. User clicks a cluster card to drill into cluster detail

**Acceptance Criteria**:
- Health status reflects only the **latest** build attempt per service (not historical failures)
- Page loads in < 2 seconds
- Auto-refreshes every 60 seconds
- Cluster cards are sorted by severity (Attention clusters first)

---

### UC-A3: View Full Build Attempt History

**Actor**: Platform Engineer, Developer  
**Trigger**: User clicks "Attempts" on a cluster detail page

**Main Flow**:
1. Build attempts section expands (collapsed by default)
2. Shows all build attempts across all services in this cluster
3. Each attempt shows: service name, version, status badge, timestamp, duration
4. Filter pills allow filtering: All / Success / Rollback / Failed
5. Attempts sorted newest-first
6. User can click any attempt to see full detail (test results, SHA, trigger)

**Acceptance Criteria**:
- Collapsed by default, toggle on click
- Filter pills are sticky (remember selection during session)
- Supports pagination for clusters with 100+ attempts

---

### UC-B1: View Test Results Per Build

**Actor**: Developer, QA Lead  
**Trigger**: User views a build attempt

**Main Flow**:
1. Build detail page shows test run badges: Functional, Sanity, Regression
2. Each badge shows: pass/fail/skip counts and color (green = all pass, red = failures)
3. User clicks a test badge to see detailed breakdown
4. Link to full external test report (if available)

**Acceptance Criteria**:
- Test results load within 1 second
- Missing test suites show "Not run" badge
- Failed tests show count prominently in red

---

### UC-C1: View Build Attempts Over Time

**Actor**: Platform Engineer, Manager  
**Trigger**: User navigates to Analytics page

**Main Flow**:
1. Analytics page shows stacked bar chart of daily build attempts
2. Bars split into Success (green), Failed (red), Rollback (amber)
3. User selects a specific service from dropdown to filter
4. User selects a specific cluster-region from dropdown to filter
5. Chart re-renders with filtered data
6. Label shows: "Showing: AuthN · Mira US-West-2 (25 attempts)"

**Acceptance Criteria**:
- Default view shows all services, all clusters
- Dropdowns support "All" option
- Charts animate smoothly on filter change
- Date range covers last 30 days by default

---

## 5. Recommended Additions

These are capabilities **not in the current PoC** that I recommend adding based on common deployment dashboard needs and best practices.

### 5.1 DORA Metrics Dashboard

**What**: Dedicated page showing the four DORA (DevOps Research and Assessment) metrics:

| Metric | Description | Data Source |
|--------|-------------|-------------|
| **Deployment Frequency** | How often each service deploys to production | Deployment attempts (prod cluster) |
| **Lead Time for Changes** | Time from code commit to production deploy | Git SHA timestamp → prod deploy timestamp |
| **Change Failure Rate** | % of deployments that cause failures or rollbacks | Failed + Rollback / Total attempts |
| **Mean Time to Recovery (MTTR)** | How quickly failures are resolved (rollback or fix deployed) | Time between failure and next success |

**Why**: DORA metrics are the industry standard for measuring DevOps performance. They provide leadership with a well-understood framework.

**Priority**: **P1**

---

### 5.2 Service Health Score Card

**What**: A composite health score (0-100) per service based on weighted factors:

| Factor | Weight | Measurement |
|--------|--------|-------------|
| Latest build status | 30% | SUCCESS = 100, ROLLBACK = 40, FAILED = 0 |
| Test pass rate (7-day avg) | 25% | Percentage across all suites |
| Deployment frequency | 15% | Compared to team average |
| Rollback rate (30-day) | 15% | Inverse of rollback % |
| Build lead time | 15% | Compared to team average |

**Why**: Gives a single number that managers can use to identify services that need attention, without deep-diving into charts.

**Priority**: **P2**

---

### 5.3 Change Log / Activity Feed

**What**: A real-time activity feed showing recent events across the platform:

```
10:42 AM  ✅  authn v3.4.3 deployed to mira-us-west-2 (SUCCESS, 14m)
10:38 AM  ❌  authz v2.1.0 failed in pavo-us-west-2 (FUNCTIONAL tests: 3 failures)
10:15 AM  🔄  account-mgmt v5.2.1 rolled back in aquila-us-east-2
09:50 AM  🚀  authn v3.4.3 promoted from mira → pavo
```

**Why**: Gives a chronological view of "what just happened" — essential during incidents or active release windows. Eliminates need to monitor Slack channels.

**Priority**: **P1**

---

### 5.4 Service Dependency Map

**What**: Visual graph showing service-to-service dependencies. When a service fails, highlight downstream services that may be impacted.

**Why**: Deployment failures often cascade. If `authn` fails, every service depending on it is at risk. Visualizing this helps prioritize incident response.

**Priority**: **P3**

---

### 5.5 Deployment Comparison View

**What**: Side-by-side comparison of a service's deployment across cluster-regions:

```
             mira-us-west-2    pavo-us-west-2    aquila-us-east-2
authn        v3.4.3 ✅         v3.4.2 ✅          v3.4.1 ✅
authz        v2.1.0 ❌         v2.0.9 ✅          v2.0.9 ✅
```

**Why**: Instantly see version drift across environments. Identify services that are behind in promotion or have inconsistent state.

**Priority**: **P1**

---

### 5.6 Scheduled Release Windows & Freeze Tracking

**What**: Calendar view showing:
- Upcoming release windows
- Active deployment freezes (no deploys allowed)
- Planned promotions

**Why**: Critical for regulated environments. Prevents unauthorized deployments during freeze periods. Gives leadership visibility into release cadence.

**Priority**: **P3**

---

### 5.7 Team / Ownership Mapping

**What**: Each service is tagged with an owning team. Dashboard supports:
- Filter by team (show only my team's services)
- Team-level health summary
- Team-level DORA metrics

**Why**: In organizations with 50+ services, every engineer cares most about their own team's services. Team filtering reduces noise and enables team-level accountability.

**Priority**: **P2**

---

### 5.8 SLA / SLO Tracking

**What**: Define SLOs for deployment metrics and track compliance:

| SLO | Target | Current |
|-----|--------|---------|
| Deployment success rate | ≥ 95% | 97.2% ✅ |
| Test pass rate (functional) | ≥ 99% | 99.8% ✅ |
| Mean lead time | ≤ 20 min | 14.2 min ✅ |
| Rollback rate | ≤ 5% | 3.1% ✅ |
| MTTR | ≤ 30 min | 22 min ✅ |

**Why**: Turns the dashboard from a monitoring tool into a **governance tool**. Teams can set targets and track progress. Leadership can measure CI/CD maturity.

**Priority**: **P2**

---

### 5.9 Flaky Test Detection

**What**: Automatically detect tests that flip between pass and fail across recent builds:

- Flag tests that failed in build N, passed in build N+1, failed in build N+2
- Surface the top 10 flakiest tests per service
- Track flaky test count over time

**Why**: Flaky tests erode confidence in the CI/CD pipeline. Teams start ignoring failures because "it's probably flaky." Detecting and surfacing flaky tests is essential for maintaining pipeline trust.

**Priority**: **P2**

---

### 5.10 Deployment Approval Workflow

**What**: For production deployments, support:
- Required approvals before promotion
- Approval status visible on dashboard (pending / approved / rejected)
- Audit trail of who approved what

**Why**: Adds governance for production deployments without leaving the dashboard. Reduces reliance on Slack-based approvals.

**Priority**: **P3**

---

### 5.11 Cost-per-Deploy Tracking

**What**: Track the CI/CD infrastructure cost per deployment:
- Build compute cost (GitHub Actions minutes, Jenkins agent time)
- Test execution cost (test infrastructure, cluster usage)
- Trend over time

**Why**: As deployment frequency increases, CI/CD costs can grow silently. Tracking cost-per-deploy helps optimize pipeline efficiency.

**Priority**: **P3**

---

### 5.12 Canary / Progressive Deployment Tracking

**What**: For services using canary or blue-green deployments:
- Show canary percentage (e.g., "10% traffic → v3.4.3")
- Show canary health metrics (error rate, latency)
- Show promotion decision (auto-promote / manual / rollback)

**Why**: Modern deployment strategies go beyond "deploy and done." Tracking canary progress gives visibility into the full rollout lifecycle.

**Priority**: **P3**

---

### 5.13 Integration with Incident Management

**What**: Bi-directional integration with incident tools (PagerDuty, ServiceNow, Jira):
- When a deployment fails, auto-create an incident ticket
- Show active incidents on the dashboard alongside failed deploys
- Link from dashboard to incident timeline

**Why**: Closes the loop between "deployment failed" and "incident resolved." Enables MTTR tracking as a DORA metric.

**Priority**: **P2**

---

### 5.14 Custom Dashboard Views / Saved Filters

**What**: Let users create and save custom views:
- "My Services" — only services my team owns
- "Production Only" — only production cluster-regions
- "Failing Now" — only services with failed latest builds

**Why**: Different personas need different views. Saved filters reduce time-to-insight for daily use.

**Priority**: **P2**

---

### 5.15 API Health Correlation

**What**: Overlay production API health metrics (error rates, latency, availability) alongside deployment events:
- "AuthN deployed v3.4.3 at 10:42 AM → error rate spiked at 10:45 AM"
- Correlate deployment events with production impact

**Why**: The ultimate question after any deployment is "did it break anything?" Correlating deploy events with production metrics answers this instantly.

**Priority**: **P2**

---

## 6. Priority Matrix

### P0 — Must Have (MVP)

| ID | Use Case | Status in PoC |
|----|----------|---------------|
| A1 | Cluster-region health overview | ✅ Done |
| A2 | Services in cluster with status | ✅ Done |
| A3 | Build attempt history (filterable) | ✅ Done |
| A4 | Build attempt detail | ✅ Done |
| A5 | Filter by status | ✅ Done |
| A6 | Currently live version per service | ✅ Done |
| B1 | Test results per build | ✅ Done |
| B2 | Test breakdown by suite | ✅ Done |
| B3 | Identify builds failing test gates | ✅ Done |
| C1 | Build attempts over time chart | ✅ Done |
| C5 | Filter analytics by service + cluster | ✅ Done |
| D2 | Version live in each environment | ✅ Done |
| E1 | View rollbacks in cluster | ✅ Done |
| E2 | Last-known-good version | ✅ Done |

### P1 — Should Have (Phase 2)

| ID | Use Case | New? |
|----|----------|------|
| A7 | Service view across all clusters | ✅ Done in PoC |
| A8 | Compare service across clusters | New (5.5) |
| C2 | Deployment frequency per service | ✅ Done |
| C3 | Build lead time trends | ✅ Done |
| C4 | Test pass rate trends | ✅ Done |
| D1 | Promotion pipeline view | Partial |
| D3 | Blocked promotions | New |
| F1-F4 | Alerting & notifications | New |
| 5.1 | DORA metrics dashboard | New |
| 5.3 | Activity feed | New |
| 5.5 | Deployment comparison view | New |

### P2 — Nice to Have (Phase 3)

| ID | Use Case |
|----|----------|
| A10 | Deployment trigger type |
| B7 | Test duration trends |
| B8 | Scale/performance test results |
| C6 | Cross-cluster comparison charts |
| C7 | Week-over-week trends |
| D4 | Promotion history |
| D5 | Time-to-promote |
| E3-E5 | Rollback details and correlation |
| 5.2 | Service health score card |
| 5.7 | Team / ownership mapping |
| 5.8 | SLA / SLO tracking |
| 5.9 | Flaky test detection |
| 5.13 | Incident management integration |
| 5.14 | Custom dashboard views |
| 5.15 | API health correlation |

### P3 — Future (Phase 4+)

| ID | Use Case |
|----|----------|
| B9 | Manual testing status |
| C8 | Export analytics |
| F5-F6 | Notification configuration |
| 5.4 | Service dependency map |
| 5.6 | Release freeze calendar |
| 5.10 | Deployment approval workflow |
| 5.11 | Cost-per-deploy tracking |
| 5.12 | Canary deployment tracking |

---

## 7. Success Metrics (KPIs)

How we measure whether the dashboard is successful:

### Adoption Metrics

| Metric | Target (3 months) | Target (6 months) |
|--------|-------------------|-------------------|
| Daily Active Users (DAU) | 20+ | 50+ |
| % of engineers using dashboard vs. direct tool access | 40% | 70% |
| Average session duration | > 2 min | > 3 min |
| Pages per session | > 3 | > 5 |

### Outcome Metrics

| Metric | Target |
|--------|--------|
| Reduction in "what's deployed?" Slack questions | -50% |
| Mean Time to Detect deployment failure (MTTD) | < 5 min (from hours) |
| Reduction in manual status report creation time | -80% |
| DORA metrics visibility | 100% of services tracked |
| Rollback decision time | < 10 min (from 30+ min) |

### Technical Metrics

| Metric | Target |
|--------|--------|
| Dashboard page load time (p95) | < 2 seconds |
| Data freshness (time from event to dashboard) | < 30 seconds |
| API availability | 99.9% |
| Data completeness (% of deploys captured) | > 99% |

---

## 8. Non-Functional Requirements

### Performance
- Page load: < 2s (p95)
- API response: < 500ms (p95)
- Chart rendering: < 1s after data load
- Support 100 concurrent users without degradation

### Scalability
- Handle 100+ services across 10+ cluster-regions
- Store 1 year of deployment history (with TTL archival)
- Ingest 1000+ deployment events per day

### Reliability
- 99.9% uptime for dashboard UI
- Event ingestion: at-least-once delivery (SQS + DLQ)
- No data loss for deployment events

### Security
- Authentication required (SSO/SAML via Cognito)
- Role-based access (view-only vs. admin)
- All data encrypted in transit (TLS) and at rest (DynamoDB encryption)
- Audit logging for all access

### Accessibility
- Responsive design (desktop + tablet)
- Color-blind friendly status indicators (not color-only)
- Keyboard navigable

### Data Retention
- Hot data: last 90 days (DynamoDB)
- Warm data: 90 days - 1 year (S3 archive)
- Cold data: 1+ year (S3 Glacier, optional)

---

## Appendix: Feature Comparison with Existing Tools

| Capability | ArgoCD UI | Jenkins | GitHub Actions | **This Dashboard** |
|-----------|-----------|---------|----------------|-------------------|
| Cross-cluster view | ❌ | ❌ | ❌ | ✅ |
| Cross-service view | ❌ | Partial | ❌ | ✅ |
| Test results per build | ❌ | Plugin | ❌ | ✅ |
| Time series analytics | ❌ | ❌ | ❌ | ✅ |
| DORA metrics | ❌ | Plugin | ❌ | ✅ (planned) |
| Promotion pipeline | ✅ (single cluster) | ❌ | ❌ | ✅ (cross-cluster) |
| Rollback tracking | ✅ (single cluster) | ❌ | ❌ | ✅ (cross-cluster) |
| Service health score | ❌ | ❌ | ❌ | ✅ (planned) |
| Team filtering | ❌ | Partial | ❌ | ✅ (planned) |
| Version drift detection | ❌ | ❌ | ❌ | ✅ (planned) |
| Activity feed | ❌ | ❌ | ❌ | ✅ (planned) |
| Executive summary | ❌ | ❌ | ❌ | ✅ |

---

*This document should be reviewed and refined with input from all persona groups before finalizing the production backlog.*
