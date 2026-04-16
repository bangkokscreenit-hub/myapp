// src/routes/auth.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

// POST /auth/register — สมัครสมาชิก (ไม่ต้องมี token)
router.post("/register", async (req, res) => {
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

// POST /auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
        return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = rows[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token, name: user.name });
});

module.exports = router;
