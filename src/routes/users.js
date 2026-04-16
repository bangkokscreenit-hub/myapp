// src/routes/users.js

const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// GET /users — ดึงทั้งหมด
router.get("/", async (_req, res) => {
    const [rows] = await pool.execute("SELECT id, name, email, createdAt FROM users");
    res.json(rows);
});

// GET /users/:id — ดึงคนเดียว
router.get("/:id", async (req, res) => {
    const [rows] = await pool.execute("SELECT id, name, email, createdAt FROM users WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "ไม่พบ user" });
    res.json(rows[0]);
});

// PUT /users/:id — แก้ไข
router.put("/:id", async (req, res) => {
    const { name, email } = req.body;
    await pool.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, req.params.id]);
    res.json({ message: "อัปเดตเรียบร้อย" });
});

// DELETE /users/:id — ลบ
router.delete("/:id", async (req, res) => {
    await pool.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "ลบเรียบร้อย" });
});

module.exports = router;
