import pkg from 'pg';
import 'dotenv/config';
const { Pool } = pkg;
const pool = new Pool({
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    host: process.env.HOST_DB,
    port: +process.env.PORT_DB,
    database: process.env.DATABASE,
});
export default pool;
