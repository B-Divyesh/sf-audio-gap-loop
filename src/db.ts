import type { Clip, PracticeLog } from './models';

let databaseName = 'audio-gap-loop';
const DB_VERSION = 1;

/** Demo data deliberately lives in a different IndexedDB database. */
export function setDatabaseName(name: string): void {
  databaseName = name;
}

export function deleteDatabase(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Could not clear demo storage.'));
    request.onblocked = () => reject(new Error('Close other demo tabs, then start for real again.'));
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('clips')) {
        const clips = database.createObjectStore('clips', { keyPath: 'id' });
        clips.createIndex('updatedAt', 'updatedAt');
      }
      if (!database.objectStoreNames.contains('logs')) {
        const logs = database.createObjectStore('logs', { keyPath: 'id' });
        logs.createIndex('completedAt', 'completedAt');
        logs.createIndex('clipId', 'clipId');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage.'));
    request.onblocked = () => reject(new Error('Local storage is open in an older tab. Close it and try again.'));
  });
}

async function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Local storage request failed.'));
  });
}

async function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Local storage transaction failed.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Local storage transaction was cancelled.'));
  });
}

export async function getClips(): Promise<Clip[]> {
  const database = await openDatabase();
  const transaction = database.transaction('clips', 'readonly');
  const clips = await requestResult(transaction.objectStore('clips').getAll()) as Clip[];
  database.close();
  return clips.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function putClip(clip: Clip): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction('clips', 'readwrite');
  transaction.objectStore('clips').put(clip);
  await transactionDone(transaction);
  database.close();
}

export async function deleteClipRecord(id: string): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(['clips', 'logs'], 'readwrite');
  transaction.objectStore('clips').delete(id);
  const logStore = transaction.objectStore('logs');
  const index = logStore.index('clipId');
  const cursorRequest = index.openCursor(IDBKeyRange.only(id));
  cursorRequest.onsuccess = () => {
    const cursor = cursorRequest.result;
    if (cursor) {
      cursor.delete();
      cursor.continue();
    }
  };
  await transactionDone(transaction);
  database.close();
}

export async function getLogs(): Promise<PracticeLog[]> {
  const database = await openDatabase();
  const transaction = database.transaction('logs', 'readonly');
  const logs = await requestResult(transaction.objectStore('logs').getAll()) as PracticeLog[];
  database.close();
  return logs.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}

export async function putLog(log: PracticeLog): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction('logs', 'readwrite');
  transaction.objectStore('logs').put(log);
  await transactionDone(transaction);
  database.close();
}

export async function importRecords(clips: Clip[], logs: PracticeLog[]): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(['clips', 'logs'], 'readwrite');
  clips.forEach((clip) => transaction.objectStore('clips').put(clip));
  logs.forEach((log) => transaction.objectStore('logs').put(log));
  await transactionDone(transaction);
  database.close();
}

export async function clearRecords(): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(['clips', 'logs'], 'readwrite');
  transaction.objectStore('clips').clear();
  transaction.objectStore('logs').clear();
  await transactionDone(transaction);
  database.close();
}
