// src/middleware/auth.js — เช็ค Token ก่อนเข้า route

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    // ดึง token จาก header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN" → เอาแค่ TOKEN

    if (!token) {
        return res.status(401).json({ message: "ไม่มี Token กรุณา Login ก่อน" });
    }

    // ตรวจสอบ token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // เก็บข้อมูล user ไว้ใน req ให้ route ถัดไปใช้ได้
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
    }
}

module.exports = verifyToken;
