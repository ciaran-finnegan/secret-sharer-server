#!/bin/bash
# Get a secret
# Update /mocks/get-event.json with the id and hash returned by the createsecret.sh script
serverless invoke --function get --path mocks/get-event.json