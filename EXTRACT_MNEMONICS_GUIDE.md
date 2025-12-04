# Quick Guide: Extract Treasury & Validator Mnemonics

## Step 1: SSH into Server

Open PowerShell and run:

```powershell
gcloud compute ssh mstbl-node1 --zone=us-central1-c
```

## Step 2: Export Validator Mnemonic

Run this command to export the validator private key:

```bash
sudo docker exec -it mstbl-blockchain wasmd keys export validator \
  --keyring-backend test \
  --unsafe \
  --unarmored-hex
```

Press Enter when asked for passphrase (test keyring has no password).

**Save the output securely!**

## Step 3: Export Treasury Mnemonic

```bash
sudo docker exec -it mstbl-blockchain wasmd keys export treasury \
  --keyring-backend test \
  --unsafe \
  --unarmored-hex
```

Press Enter for passphrase.

**Save the output securely!**

## Step 4: Convert Private Key to Mnemonic (If Needed)

The export gives you a hex private key. To get the original 24-word mnemonic, you would need to use the `--recover` option when the key was originally created. However, the hex private key is sufficient for all operations.

## Alternative: Show Address Info

```bash
# List all keys
sudo docker exec mstbl-blockchain wasmd keys list --keyring-backend test

# Show specific key details
sudo docker exec mstbl-blockchain wasmd keys show treasury --keyring-backend test

# Show validator details
sudo docker exec mstbl-blockchain wasmd keys show validator --keyring-backend test
```

## To Use the Private Keys Later

If you need to import the private keys elsewhere:

```bash
# Import from hex (on another machine with wasmd)
echo "YOUR_PRIVATE_KEY_HEX" | wasmd keys import my-key-name --keyring-backend test
```

## 🔒 IMPORTANT: Keep These Secure!

- **Validator key**: Controls contract admin + unlimited minting
- **Treasury key**: Controls 849,999 MSTBL (77% of supply)

Store in:

- Password manager (encrypted vault)
- Hardware security module
- Offline encrypted storage
- Multiple secure backups

## After Backing Up

To prevent unauthorized use:

```bash
# Option 1: Just document you won't use validator minting
# (Easiest - keep key but never mint)

# Option 2: Remove from server after backup
sudo docker exec -it mstbl-blockchain wasmd keys delete validator --keyring-backend test
sudo docker exec -it mstbl-blockchain wasmd keys delete treasury --keyring-backend test
```

---

**Need help? The keys are in Docker container, test keyring, no password.**
