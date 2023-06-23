import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "qwerty123228",
  host: "localhost",
  port: "5432",
  database: "socialnetwork",
});

export default pool;
