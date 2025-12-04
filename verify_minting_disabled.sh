#!/bin/bash
# Query token info

echo "=== Token Info ==="
docker exec mstbl-blockchain wasmd query wasm contract-state smart \
  wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d \
  '{"token_info":{}}' \
  --node http://localhost:26657

echo ""
echo "=== Minter Info ==="
docker exec mstbl-blockchain wasmd query wasm contract-state smart \
  wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d \
  '{"minter":{}}' \
  --node http://localhost:26657
