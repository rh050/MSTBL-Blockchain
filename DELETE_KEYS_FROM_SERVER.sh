#!/bin/bash

# מחיקת מפתחות מהשרת - ביצוע מיידי נדרש
# Delete keys from server - immediate execution required

set -euo pipefail

echo "🔐 מוחק מפתחות מהשרת / Deleting keys from server..."
echo "================================================"
echo ""

# Connect to server and delete keys
gcloud compute ssh mstbl-node1 --zone=us-central1-c --command='
  echo ">> Deleting treasury key..."
  docker exec mstbl-blockchain rm -f /opt/mstbl-blockchain/keyring-test/treasury.info || true
  docker exec mstbl-blockchain rm -f /tmp/treasury.info || true

  echo ">> Deleting validator key..."
  docker exec mstbl-blockchain rm -f /opt/mstbl-blockchain/keyring-test/validator.info || true
  docker exec mstbl-blockchain rm -f /tmp/validator.info || true

  echo ""
  echo ">> Verifying deletion..."
  echo "Remaining keys in keyring:"
  docker exec mstbl-blockchain ls -la /opt/mstbl-blockchain/keyring-test/ || true

  echo ""
  echo "✅ Keys deleted successfully!"
  echo "⚠️  Make sure you have secured the private keys offline!"
'

echo ""
echo "================================================"
echo "✅ הושלם / Completed!"
echo ""
echo "הצעדים הבאים:"
echo "1. ודא שהמפתחות שמורים במקום מאובטח (מנהל סיסמאות/ארנק חומרה)"
echo "2. עדכן את backend/.env עם המפתחות החדשים"
echo "3. תכנן העברה לארנק multi-signature"
echo ""
echo "Next steps:"
echo "1. Ensure keys are saved in secure location (password manager/hardware wallet)"
echo "2. Update backend/.env with the new keys"
echo "3. Plan migration to multi-signature wallet"
