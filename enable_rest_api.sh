#!/bin/bash
# Enable and expose REST API on all interfaces

CONFIG="/root/.wasmd/config/app.toml"

echo "Updating REST API configuration..."

# Enable API
sed -i '/^\[api\]/,/^enable = / s/enable = false/enable = true/' $CONFIG

# Change address from localhost to 0.0.0.0
sed -i 's/tcp:\/\/localhost:1317/tcp:\/\/0.0.0.0:1317/' $CONFIG

echo "Configuration updated:"
grep -A5 '^\[api\]' $CONFIG

echo ""
echo "Restarting container..."
