#!/bin/bash
# Fix CORS in wasmd config.toml

CONFIG="/root/.wasmd/config/config.toml"

# Backup
sudo cp $CONFIG ${CONFIG}.backup

# Find line number of CORS comment
LINE=$(sudo grep -n "# Use.*allow any origin" $CONFIG | cut -d: -f1)

# Add CORS line after comment
sudo sed -i "${LINE}a cors_allowed_origins = [\"*\"]" $CONFIG

# Verify
echo "CORS configuration:"
sudo grep -A1 "# Use.*allow any origin" $CONFIG

echo ""
echo "✅ CORS configured!"
