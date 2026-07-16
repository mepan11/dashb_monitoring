import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as {
  connPool: mysql.Pool | undefined;
};

const pool =
  globalForDb.connPool ??
  mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "dashb_monitoring",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.connPool = pool;
}

export default pool;
