#!/bin/bash
# Disable minting permanently by setting minter to a burn address (no one has the private key)

# Burn address: wasm1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqnrql8a
# This is a well-known "black hole" address - no one can access funds sent here

docker exec mstbl-blockchain wasmd tx wasm execute \
  wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d \
  '{"update_minter":{"new_minter":"wasm1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqnrql8a"}}' \
  --from validator \
  --chain-id mstbl-1 \
  --node http://localhost:26657 \
  --keyring-backend test \
  --home /root/.wasmd \
  --gas 200000 \
  --fees 5000mstbl \
  --yes

echo ""
echo "Transaction sent! Verifying..."
echo ""

# Query to verify minter is now null
docker exec mstbl-blockchain wasmd query wasm contract-state smart \
  wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d \
  '{"minter":{}}' \
  --node http://localhost:26657
