#!/bin/bash
# Add CORS configuration to wasmd config.toml

CONFIG="/root/.wasmd/config/config.toml"

echo "Backing up config..."
sudo cp $CONFIG ${CONFIG}.backup

echo "Adding CORS line..."
# Find the line with "Use '["*"]' to allow any origin" and add cors_allowed_origins after it
sudo sed -i '/# Use.*allow any origin/a\cors_allowed_origins = ["*"]' $CONFIG

echo ""
echo "Verifying configuration:"
sudo grep -B1 -A1 "cors_allowed_origins" $CONFIG

echo ""
echo "Starting blockchain container..."
sudo docker start mstbl-blockchain

echo ""
echo "Waiting 15 seconds for blockchain to start..."
sleep 15

echo ""
echo "Checking blockchain status..."
sudo docker exec mstbl-blockchain wasmd status 2>&1 | grep -E "catching_up|latest_block_height" || echo "Container is starting..."

echo ""
echo "✅ Done! Check above for status."
echo "If container is running, CORS is now enabled!"
