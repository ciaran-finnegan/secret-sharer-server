#!/bin/bash
# Store a cipher
serverless invoke --function create --path mocks/create-event.json
serverless logs --function create