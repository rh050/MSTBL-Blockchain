#!/bin/bash
# Query current minter

docker exec mstbl-blockchain wasmd query wasm contract-state smart \
  wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d \
  '{"minter":{}}' \
  --node http://localhost:26657
