#!/bin/bash
# Get a secret
# Update /mocks/get-event.json with the id and token returned by the createsecret.sh script
serverless logs --function get --path mocks/create-event.json