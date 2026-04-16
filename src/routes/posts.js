// src/routes/posts.js

const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// GET /posts — ดึงทั้งหมดพร้อมชื่อ author
router.get("/", async (_req, res) => {
    const [rows] = await pool.execute(`
        SELECT posts.id, posts.title, posts.content, posts.createdAt,
               users.name as authorName
        FROM posts
        LEFT JOIN users ON posts.userId = users.id
    `);
    res.json(rows);
});

// GET /posts/:id
router.get("/:id", async (req, res) => {
    const [rows] = await pool.execute("SELECT * FROM posts WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "ไม่พบโพสต์" });
    res.json(rows[0]);
});

// POST /posts
router.post("/", async (req, res) => {
    const { title, content, userId } = req.body;
    if (!title || !userId) return res.status(400).json({ message: "กรุณากรอก title และ userId" });
    const [result] = await pool.execute(
        "INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)",
        [title, content, userId]
    );
    res.status(201).json({ id: result.insertId, title, content, userId });
});

// DELETE /posts/:id
router.delete("/:id", async (req, res) => {
    await pool.execute("DELETE FROM posts WHERE id = ?", [req.params.id]);
    res.json({ message: "ลบโพสต์เรียบร้อย" });
});

module.exports = router;
