import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config({ path: ".env" });


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10, // Adjust based on your needs
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to MySQL database!");
        connection.release();
    }
});

// module.exports = pool.promise();

export default pool;

// Using promise-based MySQL for async/await