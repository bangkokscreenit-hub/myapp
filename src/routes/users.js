// src/routes/users.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
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

// POST /users — เพิ่มใหม่
router.post("/", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
    try {
        const hashed = bcrypt.hashSync(password, 10);
        const [result] = await pool.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashed]
        );
        res.status(201).json({ id: result.insertId, name, email });
    } catch (err) {
        res.status(400).json({ message: "อีเมลนี้มีอยู่แล้ว" });
    }
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
