# Statefile Transformer Lambda

AWS Lambda function that transforms deployment statefiles into a normalized deployment list format whenever a file is uploaded to S3.

## How It Works

1. **S3 event** triggers the Lambda when a `.json` file is created/updated under the configured prefix
2. Lambda **reads** the statefile from S3
3. **Transforms** each region entry into a standardized deployment record
4. **Writes** the transformed JSON to the destination S3 path

## Transformation

**Input** (statefile):
```json
{
    "appname": "authn",
    "clustername": "mira",
    "us-east-2": {
        "version": "1.52.0",
        "state": "ROLLBACK/FAILURE",
        "deployedAt": "2026-03-07T01:47:56Z",
        "previous_version": "1.51.0"
    },
    "us-west-2": {
        "version": "1.51.0",
        "state": "SUCCESS",
        "deployedAt": "2026-03-03T18:21:48Z",
        "previous_version": ""
    }
}
```

**Output** (deployment list):
```json
[
  { "version": "v1", "type": "deployments" },
  {
    "name": "mira",
    "region": "us-east-2",
    "environment": "QA",
    "service_name": "authn",
    "version": "1.52.0",
    "state": "ROLLBACK",
    "previous_version": "1.51.0",
    "jira_id": "",
    "namespace": "",
    "config_json": "",
    "deployed_at": "2026-03-07T01:47:56Z"
  },
  {
    "name": "mira",
    "region": "us-west-2",
    "environment": "QA",
    "service_name": "authn",
    "version": "1.51.0",
    "state": "SUCCESS",
    "previous_version": "",
    "jira_id": "",
    "namespace": "",
    "config_json": "",
    "deployed_at": "2026-03-03T18:21:48Z"
  }
]
```

### Mapping Rules

| Field | Source |
|-------|--------|
| `name` | `clustername` from statefile |
| `region` | Each region key in the statefile |
| `environment` | mira→QA, pavo→Stage, aquila→Prod |
| `service_name` | `appname` from statefile |
| `state` | First part before `/` (e.g. `ROLLBACK/FAILURE` → `ROLLBACK`) |
| `deployed_at` | `deployedAt` from region entry |

## Deploy with SAM

```bash
sam build
sam deploy --guided \
  --parameter-overrides \
    SourceBucketName=my-statefiles-bucket \
    SourcePrefix=statefile/ \
    DestPrefix=transformed/
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEST_BUCKET` | Output bucket (empty = same as source) | `""` |
| `DEST_PREFIX` | Key prefix for transformed files | `transformed/` |

## Test Locally

```bash
python3 test_lambda.py
```
