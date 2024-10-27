import 'dotenv/config';
import path from 'path';

export const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
export const TOKEN = process.env.TOKEN;
const USER_DB = process.env.USER_DB;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DATABASE = process.env.DATABASE;
const FILESTACK_API_KEY = process.env.FILESTACK_API_KEY;
const FILESTACK_SECRET_FILE = process.env.SECRET_FILE;
export const LOCAL_STORAGE_PATH = path.join(
  process.cwd(),
  process.env.LOCAL_STORAGE_PATH!
);
export const ORIGIN = process.env.ORIGIN;

export const FILESTACK = {
  FILESTACK_API_KEY,
  FILESTACK_SECRET_FILE,
};

export const DB = {
  USER_DB,
  DB_PORT,
  DB_PASSWORD,
  DB_HOST,
  DATABASE,
};
