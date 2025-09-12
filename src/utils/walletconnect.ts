function promisifyIDB<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = function () {
      resolve(this.result);
    };
    request.onerror = function () {
      reject(this.error);
    };
  });
}

export async function walletConnectCleanup() {
  try {
    // Sleep because walletconnect is being weird
    // and seems to persist data AFTER disconnect has been ran.
    // from my testing 1 sec was enough all the time
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const request = indexedDB.open('WALLET_CONNECT_V2_INDEXED_DB', 3);
    const WC_TABLE_NAME = 'keyvaluestorage';

    const db = await promisifyIDB(request);
    const tx = db.transaction(WC_TABLE_NAME, 'readwrite');
    const keychainStorage = tx.objectStore(WC_TABLE_NAME);

    const keys = await promisifyIDB(keychainStorage.getAllKeys());
    const keychainKeys = keys.filter((key) => key.toString().includes('keychain'));
    for (const key of keychainKeys) {
      const value: string = await promisifyIDB(keychainStorage.get(key));
      if (value.includes('client_ed25519_seed')) {
        console.log('deleting', key);
        await promisifyIDB(keychainStorage.delete(key));
      }
    }
  } catch (e) {
    console.log('Couldnt cleanup walletconnect `client_ed25519_seed`');
  }
}
