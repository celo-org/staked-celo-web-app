import KeyValueStorage from '@walletconnect/keyvaluestorage';

export async function walletConnectCleanup() {
  try {
    const keychainStorage = new KeyValueStorage({
      database: 'WALLET_CONNECT_V2_INDEXED_DB',
      table: 'keyvaluestorage',
    });
    const entries = await keychainStorage.getEntries();
    const keychainEntries = entries.filter(([key]) => key.indexOf('keychain') > -1);
    if (keychainEntries.length) {
      for (const [key, values] of keychainEntries) {
        if (values['client_ed25519_seed']) {
          await keychainStorage.removeItem(key);
        }
      }
    }
  } catch (e) {
    console.log('Couldnt cleanup walletconnect `client_ed25519_seed`');
  }
}
