const { fromBech32, toBech32 } = require('@cosmjs/encoding');

const addresses = {
  'val1 (stbl-seed)': 'stbl155k72vhvw6fe9psctqhzdk7ygwnqz46ta32nje',
  'deployer': 'stbl1fmmsmsw70jsrjaes9lyxx5erfeteswtu62fzsr',
  'sale-wallet': 'stbl10yn22389kzz0r5433m46s8qflep4uc7tf6mhxh',
  'validator-temp': 'stbl124kmagjvv47pfjlsedyfnrcenly4zpydkuwasu',
  'validator': 'stbl1gc77ywz9s7zwahhdgru33a7rn8x6tvf9z84ezw'
};

const treasury = 'wasm14ye36mw96z3us3qlfytppkse7m7258egymvsuu';

console.log('Checking which wallet is Treasury...\n');

for (const [name, stblAddr] of Object.entries(addresses)) {
  try {
    const { data } = fromBech32(stblAddr);
    const wasmAddr = toBech32('wasm', data);
    const match = wasmAddr === treasury ? '✅ TREASURY MATCH!' : '';
    console.log(`${name}:`);
    console.log(`  stbl: ${stblAddr}`);
    console.log(`  wasm: ${wasmAddr} ${match}`);
    console.log('');
  } catch (e) {
    console.log(`${name}: ERROR - ${e.message}\n`);
  }
}

console.log(`Target Treasury: ${treasury}`);
