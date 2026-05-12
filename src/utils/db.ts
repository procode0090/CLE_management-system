import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'TheVaultDB';
const STORE_NAME = 'inventory';

export const initDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // We use 'id' as our unique key
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Function to add a product
export const addProduct = async (product: any) => {
  const db = await initDB();
  return db.add(STORE_NAME, product);
};

// Function to get all products (For your Stock/Inventory page)
export const getAllProducts = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};