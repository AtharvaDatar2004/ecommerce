const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));

// ✅ MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "atharva1",
    database: "bestbuy"
});

db.connect(err => {
    if (err) {
        console.log("❌ MySQL Connection Failed:", err);
        return;
    }
    console.log("✅ MySQL Connected!");
});

// ✅ Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "account.html"));
});

// ✅ REGISTER API
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.log("❌ Register Error:", err);
            return res.status(400).json({ message: "User already exists!" });
        }
        res.json({ message: "✅ Registration successful!" });
    });
});

// ✅ LOGIN API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username=? AND password=?";
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.log("❌ Login Error:", err);
            return res.status(400).json({ message: "Server error" });
        }

        if (results.length > 0) {
            res.json({ message: "✅ Login successful!" });
        } else {
            res.status(401).json({ message: "❌ Invalid username or password" });
        }
    });
});

// ✅✅✅ PLACE ORDER API (FIXED & WORKING)
app.post("/place-order", (req, res) => {
    console.log("📦 Order Data Received:", req.body);   // ✅ Debug

    const { name, address, mobile, payment, total } = req.body;

    const sql = `
        INSERT INTO orders (name, address, mobile, payment, total)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, address, mobile, payment, parseInt(total)],
        (err, result) => {
            if (err) {
                console.log("❌ MySQL Order Insert Error:", err);
                return res.status(500).json({ message: "Order failed" });
            }

            console.log("✅ Order Saved Successfully!");
            res.json({ message: "Order placed successfully" });
        }
    );
});

// ✅ Server start
app.listen(5000, () => {
    console.log("✅ Server running on http://localhost:5000");
});
