import { openDB, type IDBPDatabase } from 'idb';
import { supabase } from './supabaseClient';

const DB_NAME = 'TheVaultDB';
const STORE_NAME = 'inventory';
const REPAIR_BUCKET = 'repair-images';
const REPAIR_TABLE = 'repairs';

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

// Supabase-backed repair functions
export const addRepair = async (repair: any) => {
  const { error } = await supabase.from(REPAIR_TABLE).insert([repair]);
  if (error) {
    throw error;
  }
  return repair;
};

export const getAllRepairs = async () => {
  const { data, error } = await supabase
    .from(REPAIR_TABLE)
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const uploadImage = async (file: File, path: string) => {
  const { error } = await supabase.storage.from(REPAIR_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    throw error;
  }
};

export const getImageUrl = (path: string) => {
  const { data } = supabase.storage.from(REPAIR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};