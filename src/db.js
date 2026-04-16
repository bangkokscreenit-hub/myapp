// src/db.js — เชื่อมต่อ MySQL

const mysql = require("mysql2/promise");

// สร้าง connection pool
// pool = เตรียม connection ไว้หลายอัน รองรับหลาย request พร้อมกัน
const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

// สร้างตารางถ้ายังไม่มี
async function initDB() {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id        INT AUTO_INCREMENT PRIMARY KEY,
            name      VARCHAR(100) NOT NULL,
            email     VARCHAR(100) UNIQUE NOT NULL,
            password  VARCHAR(255) NOT NULL,
            createdAt DATETIME DEFAULT NOW()
        )
    `);

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS posts (
            id        INT AUTO_INCREMENT PRIMARY KEY,
            title     VARCHAR(255) NOT NULL,
            content   TEXT,
            userId    INT,
            createdAt DATETIME DEFAULT NOW(),
            FOREIGN KEY (userId) REFERENCES users(id)
        )
    `);

    console.log("เชื่อมต่อ MySQL และสร้างตารางเรียบร้อย");
}

module.exports = { pool, initDB };
