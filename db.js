import pkg from "pg";
import "dotenv/config";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "qwerty123228",
  host: "socialnetwork.cued79adgtez.eu-north-1.rds.amazonaws.com",
  port: "5432",
  database: "socialnetwork",
});

export default pool;
