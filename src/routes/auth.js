// src/routes/auth.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

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
