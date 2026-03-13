import json
import boto3
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client("s3")

# Cluster name to environment mapping
CLUSTER_ENV_MAP = {
    "mira": "QA",
    "pavo": "Stage",
    "aquila": "Prod",
}

# Keys in the statefile that are metadata, not regions
METADATA_KEYS = {"appname", "clustername"}

# Destination bucket/prefix for transformed files (configurable via env vars)
DEST_BUCKET = os.environ.get("DEST_BUCKET", "")
DEST_PREFIX = os.environ.get("DEST_PREFIX", "transformed/")


def transform_statefile(statefile: dict) -> list:
    """Transform a statefile JSON into the deployment list format."""
    appname = statefile.get("appname", "")
    clustername = statefile.get("clustername", "")
    environment = CLUSTER_ENV_MAP.get(clustername, "Unknown")

    # Header entry
    result = [
        {
            "version": "v1",
            "type": "deployments",
        }
    ]

    # Extract region entries (any key that isn't metadata)
    for key, value in statefile.items():
        if key in METADATA_KEYS:
            continue
        if not isinstance(value, dict):
            continue

        state = value.get("state", "")
        # Take only the first part before "/" (e.g. "ROLLBACK/FAILURE" -> "ROLLBACK")
        state = state.split("/")[0] if "/" in state else state

        entry = {
            "name": clustername,
            "region": key,
            "environment": environment,
            "service_name": appname,
            "version": value.get("version", ""),
            "state": state,
            "previous_version": value.get("previous_version", ""),
            "jira_id": "",
            "namespace": "",
            "config_json": "",
            "deployed_at": value.get("deployedAt", ""),
        }
        result.append(entry)

    return result


def lambda_handler(event, context):
    """Handle S3 event notification, read statefile, transform, and write output."""
    logger.info("Received event: %s", json.dumps(event))

    for record in event.get("Records", []):
        # Extract S3 bucket and key from the event
        source_bucket = record["s3"]["bucket"]["name"]
        source_key = record["s3"]["object"]["key"]
        logger.info("Processing s3://%s/%s", source_bucket, source_key)

        try:
            # Read the statefile from S3
            response = s3_client.get_object(Bucket=source_bucket, Key=source_key)
            statefile = json.loads(response["Body"].read().decode("utf-8"))
            logger.info("Read statefile: appname=%s, clustername=%s",
                        statefile.get("appname"), statefile.get("clustername"))

            # Transform
            transformed = transform_statefile(statefile)
            transformed_json = json.dumps(transformed, indent=2)
            logger.info("Transformed into %d entries", len(transformed) - 1)

            # Determine destination
            dest_bucket = DEST_BUCKET if DEST_BUCKET else source_bucket
            # Build output key: <DEST_PREFIX>/<original_filename>
            source_filename = source_key.rsplit("/", 1)[-1]
            dest_key = f"{DEST_PREFIX}{source_filename}"

            # Write transformed file to S3
            s3_client.put_object(
                Bucket=dest_bucket,
                Key=dest_key,
                Body=transformed_json,
                ContentType="application/json",
            )
            logger.info("Wrote transformed file to s3://%s/%s", dest_bucket, dest_key)

        except Exception as e:
            logger.error("Error processing s3://%s/%s: %s", source_bucket, source_key, str(e))
            raise

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Transformation complete"}),
    }
