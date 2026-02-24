# Deployment & Quality Dashboard — Architecture Document

> **Status**: Approved PoC → Production Build  
> **Last updated**: Feb 24, 2026  
> **Author**: Platform Engineering  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture Diagram](#3-architecture-diagram)
4. [AWS Components](#4-aws-components)
5. [Microservices](#5-microservices)
6. [Data Model (DynamoDB)](#6-data-model-dynamodb)
7. [API Contract](#7-api-contract)
8. [Data Collection Pipeline](#8-data-collection-pipeline)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Security](#10-security)
11. [Observability](#11-observability)
12. [CI/CD Pipeline](#12-cicd-pipeline)
13. [Deployment (Kubernetes)](#13-deployment-kubernetes)
14. [Cost Estimate](#14-cost-estimate)
15. [Rollout Plan](#15-rollout-plan)

---

## 1. Executive Summary

The Deployment & Quality Dashboard provides a single-pane-of-glass view into deployment health across all cluster-regions (Mira, Pavo, Aquila) and services. It tracks:

- **Build attempts** (success, failed, rollback, in-progress) per service per cluster-region
- **Test results** (functional, sanity, regression) per build attempt
- **Promotion pipeline** status across environments
- **Time series analytics** (build frequency, test pass rates, lead time trends)

The system is composed of two microservices (frontend + backend), backed by DynamoDB for storage, SQS for event ingestion, and leverages existing AWS infrastructure (CloudFront, API Gateway, NLB, EKS).

---

## 2. System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                               │
└──────────┬─────────────────────────────────┬────────────────┘
           │                                 │
     Static assets                      API calls
     (HTML/JS/CSS)                     (/api/*)
           │                                 │
    ┌──────▼──────┐                 ┌────────▼─────────┐
    │ CloudFront  │                 │  API Gateway      │
    │  (CDN)      │                 │  (REST)           │
    └──────┬──────┘                 └────────┬─────────┘
           │                                 │
    ┌──────▼──────┐                  VPC Link (private)
    │  S3 Bucket  │                          │
    │  (frontend) │                 ┌────────▼─────────┐
    └─────────────┘                 │  NLB (internal)   │
                                    └────────┬─────────┘
                                             │
                                 ┌───────────▼────────────┐
                                 │    EKS — Backend Pod   │
                                 │                        │
                                 │  ┌──────────────────┐  │
                                 │  │ API Server       │  │
                                 │  │ (REST endpoints) │  │
                                 │  └───────┬──────────┘  │
                                 │          │              │
                                 │  ┌───────▼──────────┐  │
                                 │  │ SQS Consumer     │  │
                                 │  │ (event ingest)   │  │
                                 │  └──────────────────┘  │
                                 └───────────┬────────────┘
                                             │
                       ┌─────────────────────┼─────────────────────┐
                       │                     │                     │
                ┌──────▼──────┐     ┌────────▼───────┐    ┌───────▼───────┐
                │  DynamoDB   │     │     SQS        │    │  ElastiCache  │
                │  (store)    │     │  (ingest queue) │    │  (cache, opt) │
                └─────────────┘     └────────▲───────┘    └───────────────┘
                                             │
                                  ┌──────────┴───────────┐
                                  │   Webhook Sources     │
                                  │  • GitHub Actions     │
                                  │  • ArgoCD / Spinnaker │
                                  │  • Jenkins            │
                                  │  • K8s Controllers    │
                                  └──────────────────────┘
```

---

## 3. Architecture Diagram

### Request Flow — Dashboard User

```
Browser
  → CloudFront (static assets from S3)
  → React SPA loads
  → SPA calls /api/* endpoints
    → API Gateway (auth, rate-limit, routing)
      → VPC Link
        → NLB (internal, private subnet)
          → K8s Service (backend)
            → Backend Pod (API handler)
              → DynamoDB (read) / ElastiCache (cache hit)
  → Response rendered in charts/tables
```

### Request Flow — Deployment Event Ingestion

```
Source (GitHub Actions / ArgoCD / Jenkins / K8s)
  → HTTP POST webhook
    → API Gateway /api/ingest/webhook (API key auth)
      → VPC Link → NLB → Backend Pod
        → Validates & publishes to SQS
  → SQS Consumer (in backend pod)
    → Normalizes event
    → Writes to DynamoDB
```

### Request Flow — Alternative Ingestion (direct SQS)

```
Source (CI pipeline step)
  → AWS SDK: sqs.sendMessage(...)
    → SQS queue
  → Backend SQS Consumer
    → Normalizes → DynamoDB
```

---

## 4. AWS Components

### 4.1 Existing Infrastructure (reuse)

| Component | Role in Dashboard |
|-----------|-------------------|
| **CloudFront** | CDN for frontend SPA (S3 origin) |
| **API Gateway** | REST API facade for backend; webhook ingestion endpoint; auth & throttling |
| **NLB** | Internal L4 load balancer routing API Gateway traffic to backend pods via VPC Link |
| **EKS** | Runs backend microservice (Deployment + Service) |
| **Route 53** | DNS for `dashboard.yourcompany.com` (CloudFront) and `api.dashboard.yourcompany.com` (API Gateway) |
| **ACM** | TLS certificates for custom domains |

### 4.2 New Resources to Create

| Component | Purpose | Provisioning |
|-----------|---------|-------------|
| **S3 Bucket** (`dashboard-frontend-assets`) | Host built React SPA; CloudFront origin | Terraform |
| **DynamoDB Tables** (3) | `deployment-attempts`, `test-runs`, `promotions` | Terraform |
| **SQS Queue** (`dashboard-ingest`) | Deployment event ingestion buffer | Terraform |
| **SQS Dead-Letter Queue** (`dashboard-ingest-dlq`) | Capture failed messages for retry/debugging | Terraform |
| **ECR Repository** (`deploy-dashboard-backend`) | Docker image registry for backend | Terraform |
| **VPC Link** | Connect API Gateway to NLB privately | Terraform |
| **IAM Role** (`dashboard-backend-role`) | IRSA role for backend pod → DynamoDB + SQS + CloudWatch | Terraform |
| **IAM Policy** | Scoped permissions for DynamoDB read/write, SQS consume, CloudWatch logs | Terraform |
| **Secrets Manager** secret | Webhook signing secrets, API keys | Terraform |
| **CloudWatch Log Group** | `/eks/deploy-dashboard/backend` | Terraform |

### 4.3 Optional (Phase 2)

| Component | Purpose |
|-----------|---------|
| **ElastiCache (Redis)** | Cache overview summaries, hot queries (TTL 30-60s) |
| **Cognito User Pool** | SSO/SAML authentication for dashboard users |
| **EventBridge** | Advanced event routing (fan-out to multiple consumers) |
| **Lambda** | Lightweight webhook transformers for non-standard sources |
| **S3** (data export) | Archive raw events for long-term analytics |

---

## 5. Microservices

### 5.1 Frontend Microservice

| Attribute | Value |
|-----------|-------|
| **Runtime** | Static SPA (React + Vite + TailwindCSS + Chart.js) |
| **Hosting** | S3 + CloudFront (no container needed) |
| **Build** | `npm run build` → upload `dist/` to S3 → CloudFront cache invalidation |
| **Routing** | Client-side hash routing (`#/`, `#/clusters/:id`, `#/analytics`, etc.) |
| **API calls** | `fetch('/api/...')` → API Gateway → backend |

### 5.2 Backend Microservice

| Attribute | Value |
|-----------|-------|
| **Language** | Go (recommended) or Node.js/Python |
| **Runtime** | Container on EKS |
| **Image** | ECR `deploy-dashboard-backend:latest` |
| **Port** | 8080 |
| **Health check** | `GET /healthz` → 200 |
| **Readiness** | `GET /readyz` → 200 |

**Internal components** (single binary, two goroutines/threads):

```
Backend Pod
├── HTTP Server (port 8080)
│   ├── /healthz, /readyz
│   ├── /api/clusters
│   ├── /api/clusters/:id/summary
│   ├── /api/clusters/:id/attempts
│   ├── /api/services/:id/attempts
│   ├── /api/analytics
│   ├── /api/builds/:id
│   └── /api/ingest/webhook
│
└── SQS Consumer (background worker)
    ├── Polls dashboard-ingest queue
    ├── Normalizes events
    └── Writes to DynamoDB
```

---

## 6. Data Model (DynamoDB)

### 6.1 Table: `deployment-attempts`

Primary storage for all build/deployment attempts.

| Attribute | Type | Key | Description |
|-----------|------|-----|-------------|
| `pk` | String | **Partition Key** | `{clusterId}#{serviceId}` |
| `sk` | String | **Sort Key** | `{startedAt}#{attemptId}` (ISO8601 timestamp prefix for time-ordered queries) |
| `attemptId` | String | | Unique ID: `{clusterId}:{serviceId}:{buildVersion}:{n}` |
| `clusterId` | String | | e.g. `mira-us-west-2` |
| `serviceId` | String | | e.g. `authn` |
| `buildVersion` | String | | Semver e.g. `3.4.2` |
| `gitSha` | String | | Short commit SHA |
| `startedAt` | String | | ISO8601 |
| `endedAt` | String | | ISO8601 or null |
| `status` | String | | `IN_PROGRESS`, `SUCCESS`, `FAILED`, `ROLLBACK`, `LIVE` |
| `trigger` | String | | `merge`, `promotion`, `manual`, `rollback` |
| `failureReason` | String | | Optional |
| `rollbackToBuild` | String | | Optional |

**GSI-1: `byService`**

| Attribute | Key | Purpose |
|-----------|-----|---------|
| `serviceId` | Partition Key | Query all attempts for a service across clusters |
| `startedAt` | Sort Key | Time-ordered |

**GSI-2: `byStatus`**

| Attribute | Key | Purpose |
|-----------|-----|---------|
| `status` | Partition Key | Query all FAILED or ROLLBACK attempts globally |
| `startedAt` | Sort Key | Time-ordered |

### 6.2 Table: `test-runs`

| Attribute | Type | Key | Description |
|-----------|------|-----|-------------|
| `pk` | String | **Partition Key** | `{attemptId}` |
| `sk` | String | **Sort Key** | `{suiteType}` (`FUNCTIONAL`, `SANITY`, `REGRESSION`) |
| `testRunId` | String | | Unique ID |
| `total` | Number | | Total test count |
| `passed` | Number | | Passed count |
| `failed` | Number | | Failed count |
| `skipped` | Number | | Skipped count |
| `durationSec` | Number | | Execution duration |
| `executedAt` | String | | ISO8601 |
| `reportUrl` | String | | Link to full test report |

### 6.3 Table: `promotions`

| Attribute | Type | Key | Description |
|-----------|------|-----|-------------|
| `pk` | String | **Partition Key** | `{serviceId}` |
| `sk` | String | **Sort Key** | `{promotedAt}` (ISO8601) |
| `promotionId` | String | | Unique ID |
| `buildVersion` | String | | Version promoted |
| `fromClusterId` | String | | Source cluster-region |
| `toClusterId` | String | | Target cluster-region |
| `promotedBy` | String | | User or system that triggered |

### 6.4 Access Patterns

| Access Pattern | Table | Key Condition |
|----------------|-------|---------------|
| Get attempts for service in cluster (time ordered) | `deployment-attempts` | PK = `{clusterId}#{serviceId}`, SK begins_with or between |
| Get all attempts for a service across clusters | `deployment-attempts` GSI-1 | PK = `{serviceId}` |
| Get recent failures globally | `deployment-attempts` GSI-2 | PK = `FAILED`, SK > `{24h_ago}` |
| Get test results for an attempt | `test-runs` | PK = `{attemptId}` |
| Get promotion history for a service | `promotions` | PK = `{serviceId}` |
| Get latest attempt per service in cluster | `deployment-attempts` | PK = `{clusterId}#{serviceId}`, ScanIndexForward=false, Limit=1 |

---

## 7. API Contract

Base URL: `https://api.dashboard.yourcompany.com`

### 7.1 Cluster Endpoints

#### `GET /api/clusters`

List all cluster-regions with health summary.

**Response:**
```json
{
  "clusters": [
    {
      "id": "mira-us-west-2",
      "name": "Mira US-West-2",
      "type": "Development",
      "role": "Primary",
      "description": "Primary development cluster...",
      "summary": {
        "services": 12,
        "healthy": 12,
        "attention": 0,
        "latestAttemptAt": "2026-02-05T18:40:02Z"
      }
    }
  ]
}
```

#### `GET /api/clusters/:clusterId/summary`

Detailed summary for a single cluster-region.

**Response:**
```json
{
  "cluster": { "id": "mira-us-west-2", "name": "...", "type": "...", "role": "..." },
  "summary": {
    "totalAttempts": 60,
    "success": 53,
    "failed": 4,
    "rollback": 3
  },
  "services": [
    {
      "serviceId": "authn",
      "serviceName": "AuthN",
      "currentVersion": "3.4.2",
      "latestAttempt": { "id": "...", "status": "SUCCESS", "buildVersion": "3.4.2", "startedAt": "..." },
      "gates": {
        "functional": { "passed": 420, "total": 420, "failed": 0 },
        "regression": { "passed": 650, "total": 650, "failed": 0 }
      }
    }
  ]
}
```

#### `GET /api/clusters/:clusterId/attempts`

**Query params:** `?status=SUCCESS|FAILED|ROLLBACK&limit=15&cursor=...`

**Response:**
```json
{
  "attempts": [
    {
      "id": "mira-us-west-2:authn:3.4.2:1284",
      "clusterId": "mira-us-west-2",
      "serviceId": "authn",
      "buildVersion": "3.4.2",
      "gitSha": "a1b2c3d",
      "startedAt": "2026-02-03T22:14:00Z",
      "endedAt": "2026-02-03T22:28:00Z",
      "status": "SUCCESS",
      "trigger": "merge",
      "gates": {
        "functional": { "passed": 420, "total": 420, "failed": 0 },
        "regression": { "passed": 650, "total": 650, "failed": 0 }
      }
    }
  ],
  "nextCursor": "..."
}
```

### 7.2 Service Endpoints

#### `GET /api/services`

List all services.

#### `GET /api/services/:serviceId/attempts`

All attempts for a service across all cluster-regions.

**Query params:** `?clusterId=mira-us-west-2&limit=50&cursor=...`

### 7.3 Build Detail Endpoint

#### `GET /api/builds/:attemptId`

Full detail for a single build attempt including test runs.

**Response:**
```json
{
  "attempt": {
    "id": "mira-us-west-2:authn:3.4.2:1284",
    "clusterId": "mira-us-west-2",
    "serviceId": "authn",
    "buildVersion": "3.4.2",
    "gitSha": "a1b2c3d",
    "startedAt": "2026-02-03T22:14:00Z",
    "endedAt": "2026-02-03T22:28:00Z",
    "status": "SUCCESS",
    "trigger": "merge"
  },
  "testRuns": [
    {
      "suiteType": "FUNCTIONAL",
      "total": 420,
      "passed": 420,
      "failed": 0,
      "skipped": 0,
      "durationSec": 580,
      "executedAt": "2026-02-03T22:20:00Z",
      "reportUrl": "https://..."
    }
  ]
}
```

### 7.4 Analytics Endpoint

#### `GET /api/analytics`

**Query params:** `?serviceId=authn&clusterId=mira-us-west-2&from=2026-01-01&to=2026-02-24`

**Response:**
```json
{
  "filter": { "serviceId": "authn", "clusterId": "mira-us-west-2" },
  "buildAttempts": {
    "labels": ["2026-02-01", "2026-02-02", "2026-02-03"],
    "success": [3, 5, 4],
    "failed": [0, 1, 0],
    "rollback": [0, 0, 1]
  },
  "testPassRates": {
    "labels": ["2026-02-01", "2026-02-02", "2026-02-03"],
    "functional": [100.0, 97.2, 100.0],
    "sanity": [100.0, 100.0, 100.0],
    "regression": [100.0, 96.1, 100.0]
  },
  "deployFrequency": {
    "labels": ["2026-02-01", "2026-02-02", "2026-02-03"],
    "deploys": [3, 6, 5],
    "avgLeadTimeMin": [12.5, 14.2, 11.8]
  }
}
```

### 7.5 Ingestion Endpoint

#### `POST /api/ingest/webhook`

**Headers:** `X-Webhook-Secret: {secret}` or `Authorization: Bearer {api-key}`

**Request body (deployment event):**
```json
{
  "source": "github-actions",
  "eventType": "deployment",
  "payload": {
    "clusterId": "mira-us-west-2",
    "serviceId": "authn",
    "buildVersion": "3.4.3",
    "gitSha": "abc1234",
    "status": "SUCCESS",
    "startedAt": "2026-02-24T10:00:00Z",
    "endedAt": "2026-02-24T10:14:00Z",
    "trigger": "merge"
  }
}
```

**Request body (test result event):**
```json
{
  "source": "github-actions",
  "eventType": "test-result",
  "payload": {
    "attemptId": "mira-us-west-2:authn:3.4.3:1285",
    "suiteType": "FUNCTIONAL",
    "total": 420,
    "passed": 420,
    "failed": 0,
    "skipped": 0,
    "durationSec": 600,
    "reportUrl": "https://..."
  }
}
```

**Response:** `202 Accepted` (event queued to SQS)

---

## 8. Data Collection Pipeline

### 8.1 Event Sources

| Source | Integration Method | Events |
|--------|-------------------|--------|
| **GitHub Actions** | Webhook (workflow_run completed) → API Gateway `/api/ingest/webhook` | Deployment status, test results |
| **ArgoCD** | Notification webhook → API Gateway | Sync success/failure, rollback |
| **Spinnaker** | Webhook stage → API Gateway | Pipeline completion |
| **Jenkins** | Post-build HTTP request → API Gateway | Build result, test report |
| **K8s Controller** | Custom controller watches Deployment/Rollout status → SQS SDK | Rollout success/failure, pod readiness |

### 8.2 Ingestion Flow

```
Webhook Source
  │
  ▼
API Gateway (/api/ingest/webhook)
  │ (validates API key / webhook secret)
  ▼
Backend Pod — ingest handler
  │ (validates payload schema)
  │ (normalizes to internal event format)
  ▼
SQS Queue (dashboard-ingest)
  │
  ▼
Backend Pod — SQS Consumer (background worker)
  │ (deduplication check by attemptId)
  │ (writes to DynamoDB)
  ▼
DynamoDB (deployment-attempts / test-runs / promotions)
```

### 8.3 SQS Configuration

| Setting | Value |
|---------|-------|
| **Queue type** | Standard |
| **Visibility timeout** | 60 seconds |
| **Message retention** | 4 days |
| **Max receive count** | 3 (before DLQ) |
| **DLQ** | `dashboard-ingest-dlq` (14-day retention) |
| **Batch size** | 10 messages |

### 8.4 Event Schema (Internal — SQS Message)

```json
{
  "eventId": "uuid",
  "eventType": "deployment | test-result | promotion",
  "source": "github-actions | argocd | jenkins | k8s-controller",
  "receivedAt": "2026-02-24T10:00:00Z",
  "payload": { ... }
}
```

---

## 9. Frontend Architecture

### 9.1 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + Vite |
| **Styling** | TailwindCSS |
| **Charts** | Chart.js |
| **Icons** | Lucide React |
| **Routing** | React Router (hash or history mode) |
| **State** | React Query (TanStack Query) for API caching + SWR |
| **Build** | `vite build` → static assets |
| **Hosting** | S3 + CloudFront |

### 9.2 Pages (from PoC)

| Route | Page | Data Source |
|-------|------|-------------|
| `/` | Executive Overview | `GET /api/clusters` |
| `/clusters/:id` | Cluster-Region Detail | `GET /api/clusters/:id/summary` + `/attempts` |
| `/services/:id` | Service Detail | `GET /api/services/:id/attempts` |
| `/builds/:id` | Build Attempt Detail | `GET /api/builds/:id` |
| `/analytics` | Analytics & Trends | `GET /api/analytics?serviceId=...&clusterId=...` |
| `/scorecard` | Quality Score Card | `GET /api/analytics` (aggregated) |

### 9.3 API Integration Pattern

```javascript
// Example: React Query hook
function useClusterSummary(clusterId) {
  return useQuery({
    queryKey: ['cluster', clusterId, 'summary'],
    queryFn: () => fetch(`/api/clusters/${clusterId}/summary`).then(r => r.json()),
    staleTime: 30_000,    // 30s cache
    refetchInterval: 60_000, // auto-refresh every 60s
  });
}
```

### 9.4 Deployment

```bash
# CI/CD step
npm run build
aws s3 sync dist/ s3://dashboard-frontend-assets/ --delete
aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"
```

---

## 10. Security

### 10.1 Authentication & Authorization

| Layer | Mechanism |
|-------|-----------|
| **Dashboard users** | Phase 1: Internal network only (VPN/private DNS). Phase 2: Cognito + SAML SSO |
| **API Gateway → Backend** | IAM auth via VPC Link (no public exposure) |
| **Webhook ingestion** | API key (stored in Secrets Manager) + webhook signature verification |
| **Backend → DynamoDB** | IRSA (IAM Roles for Service Accounts) — no static credentials |
| **Backend → SQS** | IRSA |

### 10.2 IAM Policy (Backend Pod)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:BatchWriteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/deployment-attempts",
        "arn:aws:dynamodb:*:*:table/deployment-attempts/index/*",
        "arn:aws:dynamodb:*:*:table/test-runs",
        "arn:aws:dynamodb:*:*:table/promotions"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      "Resource": "arn:aws:sqs:*:*:dashboard-ingest"
    },
    {
      "Effect": "Allow",
      "Action": [
        "sqs:SendMessage"
      ],
      "Resource": "arn:aws:sqs:*:*:dashboard-ingest"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:dashboard/*"
    }
  ]
}
```

### 10.3 Network Security

| Control | Implementation |
|---------|---------------|
| **Backend pods** | Private subnets only; no public IP |
| **NLB** | Internal-only; security group allows API Gateway VPC endpoint |
| **DynamoDB** | VPC endpoint (Gateway type); no internet traversal |
| **SQS** | VPC endpoint (Interface type) |
| **S3** | Private bucket; OAC (Origin Access Control) for CloudFront only |
| **Secrets Manager** | VPC endpoint |

---

## 11. Observability

### 11.1 Logging

| Source | Destination | Format |
|--------|-------------|--------|
| Backend API logs | CloudWatch `/eks/deploy-dashboard/backend` | JSON structured |
| SQS Consumer logs | Same log group | JSON structured |
| API Gateway access logs | CloudWatch `/apigateway/deploy-dashboard` | JSON |
| CloudFront access logs | S3 bucket (optional) | Standard CLF |

### 11.2 Metrics

| Metric | Source | Alarm Threshold |
|--------|--------|----------------|
| API latency (p99) | API Gateway + custom | > 2s |
| API error rate (5xx) | API Gateway | > 1% |
| SQS queue depth | CloudWatch SQS metrics | > 100 messages |
| SQS DLQ message count | CloudWatch | > 0 |
| DynamoDB throttled requests | CloudWatch | > 0 |
| Backend pod restarts | K8s metrics | > 2 in 5 min |

### 11.3 Alerting

| Alert | Channel | Condition |
|-------|---------|-----------|
| DLQ has messages | SNS → Slack/PagerDuty | DLQ ApproximateNumberOfMessagesVisible > 0 |
| API error spike | SNS → Slack | 5xx rate > 5% for 5 min |
| High queue depth | SNS → Slack | Queue depth > 500 for 10 min |

---

## 12. CI/CD Pipeline

### 12.1 Frontend

```
Push to main (frontend/)
  → GitHub Actions
    → npm install && npm run build
    → aws s3 sync dist/ s3://dashboard-frontend-assets/
    → aws cloudfront create-invalidation --paths "/*"
    → Slack notification
```

### 12.2 Backend

```
Push to main (backend/)
  → GitHub Actions
    → Run unit tests
    → Run linter
    → docker build -t $ECR_REPO:$SHA .
    → docker push $ECR_REPO:$SHA
    → Update Helm values (image.tag = $SHA)
    → ArgoCD sync (or helm upgrade)
    → Slack notification
```

---

## 13. Deployment (Kubernetes)

### 13.1 Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: deploy-dashboard
```

### 13.2 Backend Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dashboard-backend
  namespace: deploy-dashboard
spec:
  replicas: 2
  selector:
    matchLabels:
      app: dashboard-backend
  template:
    metadata:
      labels:
        app: dashboard-backend
    spec:
      serviceAccountName: dashboard-backend-sa
      containers:
        - name: backend
          image: <account>.dkr.ecr.<region>.amazonaws.com/deploy-dashboard-backend:latest
          ports:
            - containerPort: 8080
          env:
            - name: DYNAMODB_TABLE_ATTEMPTS
              value: deployment-attempts
            - name: DYNAMODB_TABLE_TEST_RUNS
              value: test-runs
            - name: DYNAMODB_TABLE_PROMOTIONS
              value: promotions
            - name: SQS_QUEUE_URL
              value: https://sqs.<region>.amazonaws.com/<account>/dashboard-ingest
            - name: AWS_REGION
              value: <region>
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: /readyz
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
```

### 13.3 Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: dashboard-backend
  namespace: deploy-dashboard
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-internal: "true"
spec:
  type: LoadBalancer
  selector:
    app: dashboard-backend
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP
```

### 13.4 Service Account (IRSA)

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: dashboard-backend-sa
  namespace: deploy-dashboard
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::<account>:role/dashboard-backend-role
```

### 13.5 HPA (Horizontal Pod Autoscaler)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: dashboard-backend-hpa
  namespace: deploy-dashboard
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: dashboard-backend
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## 14. Cost Estimate

Monthly cost for production deployment (low-medium traffic):

| Resource | Estimated Cost |
|----------|---------------|
| S3 (frontend assets, ~50MB) | $1 |
| CloudFront (existing, incremental) | $1-5 |
| API Gateway (existing, incremental) | $3-10 |
| NLB (existing, incremental) | $0 |
| EKS (existing, 2 small pods) | $0 (existing cluster) |
| ECR (1 image, ~200MB) | $2 |
| DynamoDB on-demand (3 tables, ~100K items) | $5-25 |
| SQS (standard, ~50K messages/month) | $1 |
| CloudWatch (logs + metrics) | $5-10 |
| Secrets Manager (2-3 secrets) | $2 |
| **Total incremental** | **~$20-55/month** |

At scale (1M+ attempts, heavy analytics queries), add:
- ElastiCache: +$15-50/month
- DynamoDB provisioned capacity: adjust based on RCU/WCU

---

## 15. Rollout Plan

### Phase 1 — MVP (Weeks 1-3)

- [ ] Terraform: S3 bucket, DynamoDB tables, SQS queue, ECR repo, IAM role, VPC Link
- [ ] Backend: API server with read endpoints (clusters, services, builds, analytics)
- [ ] Backend: SQS consumer + DynamoDB writes
- [ ] Backend: Webhook ingestion endpoint
- [ ] Frontend: Convert PoC to React + Vite; replace mock data with API calls
- [ ] CI/CD: GitHub Actions for frontend (S3 deploy) and backend (ECR + K8s)
- [ ] Integration: Wire GitHub Actions webhooks for 1-2 pilot services

### Phase 2 — Full Integration (Weeks 4-5)

- [ ] Wire all CI/CD sources (ArgoCD, Jenkins, GitHub Actions) for all services
- [ ] Add K8s controller for Deployment rollout status
- [ ] Add promotion tracking (cross-cluster promotion events)
- [ ] Add ElastiCache for hot query caching
- [ ] CloudWatch alarms and Slack notifications

### Phase 3 — Hardening (Weeks 6-7)

- [ ] Cognito SSO integration
- [ ] WAF rules on API Gateway
- [ ] Load testing (simulate 1000+ concurrent dashboard users)
- [ ] DLQ monitoring and retry automation
- [ ] Data retention policy (TTL on DynamoDB items older than 90 days)
- [ ] Runbook documentation

### Phase 4 — Advanced (Weeks 8+)

- [ ] EventBridge for fan-out (dashboard + alerting + audit)
- [ ] S3 data lake export for long-term analytics
- [ ] Custom Grafana dashboards as alternative view
- [ ] Mobile-responsive optimizations
- [ ] Role-based access control (team-scoped views)

---

## Appendix A: Terraform Module Structure

```
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── modules/
│   ├── s3-frontend/
│   │   ├── main.tf
│   │   └── variables.tf
│   ├── dynamodb/
│   │   ├── main.tf          (3 tables + GSIs)
│   │   └── variables.tf
│   ├── sqs/
│   │   ├── main.tf          (ingest queue + DLQ)
│   │   └── variables.tf
│   ├── ecr/
│   │   ├── main.tf
│   │   └── variables.tf
│   ├── iam/
│   │   ├── main.tf          (IRSA role + policy)
│   │   └── variables.tf
│   ├── vpc-link/
│   │   ├── main.tf
│   │   └── variables.tf
│   └── monitoring/
│       ├── main.tf          (CloudWatch log groups, alarms, SNS)
│       └── variables.tf
```

## Appendix B: Repository Structure

```
deploy-dashboard/
├── ARCHITECTURE.md           ← this document
├── terraform/                ← AWS infrastructure
├── backend/                  ← Backend microservice
│   ├── cmd/server/main.go
│   ├── internal/
│   │   ├── api/              (HTTP handlers)
│   │   ├── consumer/         (SQS consumer)
│   │   ├── store/            (DynamoDB client)
│   │   └── models/           (data types)
│   ├── Dockerfile
│   ├── go.mod
│   └── go.sum
├── frontend/                 ← React SPA
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/            (React Query hooks)
│   │   └── api/              (API client)
│   ├── package.json
│   └── vite.config.js
├── helm/                     ← K8s manifests
│   └── deploy-dashboard/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── serviceaccount.yaml
│           └── hpa.yaml
└── .github/
    └── workflows/
        ├── frontend-deploy.yaml
        └── backend-deploy.yaml
```
