<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# STBL Million Stable Coin Project Instructions

This is a Cosmos SDK-based blockchain project for the Million Stable Coin (STBL). When working on this project:

## Core Technologies
- **Cosmos SDK**: Use latest best practices for blockchain development
- **Bash Scripting**: All setup scripts are written in bash with proper error handling
- **Docker**: Container setup for validators and explorer
- **Multi-signature**: 2/2 threshold signatures for treasury management

## Key Conventions
- Use `stbld` as the binary name throughout the project
- Chain ID is `stbl-1` and bech32 prefix is `stbl`
- Base denomination is `ustbl` (micro STBL) with 6 decimals
- All scripts should use `set -euo pipefail` for error handling
- Use `${KEYRING_FLAG}` and `${BECH32_FLAG}` variables in scripts

## File Structure Guidelines
- Configuration files go in `chain/config/`
- Scripts are in `chain/scripts/` and should be numbered for execution order
- Docker files are in `chain/docker/`
- Infrastructure (docker-compose) is in `infra/`

## Security Considerations
- Always use test keyring for development
- Multi-signature addresses require 2/2 threshold
- Public keys are stored in hex format and converted to base64 for Cosmos
- Each validator should have unique ports to avoid conflicts

## Script Patterns
- Source `utils.sh` at the beginning of each script
- Use helper functions like `hex2b64()` for key conversions
- Save important outputs (like addresses) to `.env` files for reuse
- Include progress messages with ">> " prefix

When suggesting code or modifications, ensure compatibility with the existing Cosmos SDK patterns and maintain the security model of the multi-signature setup.
