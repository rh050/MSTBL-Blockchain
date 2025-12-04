#!/bin/bash
# Enable CORS on MSTBL Blockchain Node

echo "🔧 Enabling CORS on mstbl-blockchain..."

# Stop the container
echo ">> Stopping container..."
docker stop mstbl-blockchain

# Update config.toml to allow CORS from any origin
echo ">> Updating CORS settings..."
docker exec mstbl-blockchain sed -i 's/cors_allowed_origins = \[\]/cors_allowed_origins = ["*"]/' /root/.wasmd/config/config.toml

# Restart container
echo ">> Starting container..."
docker start mstbl-blockchain

# Wait for node to be ready
echo ">> Waiting 10 seconds for node to start..."
sleep 10

# Check status
echo ">> Checking node status..."
docker exec mstbl-blockchain wasmd status 2>&1 | jq '.SyncInfo.catching_up'

echo ""
echo "✅ CORS enabled! Blockchain should now be accessible from browsers."
echo ""
echo "Test with:"
echo "curl http://34.57.32.80:26657/status"
