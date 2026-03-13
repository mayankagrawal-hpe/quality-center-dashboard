"""Local tests for the statefile transformer Lambda function."""
import sys
import types

# Mock boto3 so we can import lambda_function without it installed
boto3_mock = types.ModuleType("boto3")
boto3_mock.client = lambda *a, **kw: None
sys.modules["boto3"] = boto3_mock

import json
from lambda_function import transform_statefile


def test_basic_transform():
    statefile = {
        "appname": "authn",
        "clustername": "mira",
        "us-east-2": {
            "version": "1.52.0",
            "state": "ROLLBACK/FAILURE",
            "deployedAt": "2026-03-07T01:47:56Z",
            "previous_version": "1.51.0",
        },
        "us-west-2": {
            "version": "1.51.0",
            "state": "SUCCESS",
            "deployedAt": "2026-03-03T18:21:48Z",
            "previous_version": "",
        },
    }

    result = transform_statefile(statefile)
    print(json.dumps(result, indent=2))

    # Header
    assert result[0] == {"version": "v1", "type": "deployments"}

    # Should have 1 header + 2 region entries
    assert len(result) == 3

    # Find the us-east-2 entry
    east = next(e for e in result[1:] if e["region"] == "us-east-2")
    assert east["name"] == "mira"
    assert east["environment"] == "QA"
    assert east["service_name"] == "authn"
    assert east["version"] == "1.52.0"
    assert east["state"] == "ROLLBACK"  # stripped "/FAILURE"
    assert east["previous_version"] == "1.51.0"
    assert east["deployed_at"] == "2026-03-07T01:47:56Z"

    # Find the us-west-2 entry
    west = next(e for e in result[1:] if e["region"] == "us-west-2")
    assert west["state"] == "SUCCESS"
    assert west["version"] == "1.51.0"
    assert west["previous_version"] == ""

    print("All assertions passed!")


def test_pavo_transform():
    statefile = {
        "appname": "authz",
        "clustername": "pavo",
        "us-west-2": {
            "version": "2.0.0",
            "state": "SUCCESS",
            "deployedAt": "2026-03-10T12:00:00Z",
            "previous_version": "1.9.0",
        },
    }
    result = transform_statefile(statefile)
    assert result[1]["environment"] == "Stage"
    assert result[1]["name"] == "pavo"
    print("Pavo test passed!")


def test_aquila_transform():
    statefile = {
        "appname": "gateway",
        "clustername": "aquila",
        "us-east-2": {
            "version": "3.1.0",
            "state": "IN_PROGRESS",
            "deployedAt": "2026-03-12T08:00:00Z",
            "previous_version": "3.0.0",
        },
    }
    result = transform_statefile(statefile)
    assert result[1]["environment"] == "Prod"
    assert result[1]["state"] == "IN_PROGRESS"
    print("Aquila test passed!")


if __name__ == "__main__":
    test_basic_transform()
    test_pavo_transform()
    test_aquila_transform()
    print("\nAll tests passed!")
