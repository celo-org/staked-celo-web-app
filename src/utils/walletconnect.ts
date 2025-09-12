import KeyValueStorage from '@walletconnect/keyvaluestorage';

export async function walletConnectCleanup() {
  try {
    // Sleep because walletconnect is being weird
    // and seems to persist data AFTER disconnect has been ran.
    // from my testing 1 sec was enough all the time
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const db = new KeyValueStorage({
      database: 'WALLET_CONNECT_V2_INDEXED_DB',
      table: 'keyvaluestorage',
    });

    const keys = await db.getEntries();
    const keychainEntries = keys.filter(([key]) => key.includes('keychain'));
    for (const [key, value] of keychainEntries) {
      if ('client_ed25519_seed' in value) {
        console.log('deleting', key);
        await db.removeItem(key);
      }
    }
  } catch (e) {
    console.log('Couldnt cleanup walletconnect `client_ed25519_seed`');
  }
}
