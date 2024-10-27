import pkg from 'pg';
import { DB } from './checkENV.js';
const { Pool } = pkg;
const pool = new Pool({
    user: DB.USER_DB,
    password: DB.DB_PASSWORD,
    host: DB.DB_HOST,
    port: +DB.DB_PORT,
    database: DB.DATABASE,
});
export default pool;
