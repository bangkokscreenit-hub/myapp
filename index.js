// index.js
// รันด้วย: nodemon index.js

require("dotenv").config();

const express = require("express");
const path = require("path");

const { initDB } = require("./src/db");
const usersRouter = require("./src/routes/users");
const postsRouter = require("./src/routes/posts");
const authRouter  = require("./src/routes/auth");
const verifyToken = require("./src/middleware/auth");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/users", verifyToken, usersRouter);
app.use("/posts", verifyToken, postsRouter);

const PORT = process.env.PORT || 3000;

// เชื่อม DB ก่อน แล้วค่อยเปิด server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server เปิดที่ http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("เชื่อมต่อ DB ไม่ได้:", err.message);
});
