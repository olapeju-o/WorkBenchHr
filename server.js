"use strict";

var path = require("path");
var fs = require("fs");
var crypto = require("crypto");
var express = require("express");
var Database = require("better-sqlite3");

var PORT = Number(process.env.PORT) || 3847;
var DB_PATH = path.join(__dirname, "data", "workbench.db");

function hashPassword(password) {
  var salt = crypto.randomBytes(16);
  var hash = crypto.scryptSync(password, salt, 64);
  return salt.toString("hex") + ":" + hash.toString("hex");
}

function verifyPassword(password, stored) {
  var parts = String(stored).split(":");
  if (parts.length !== 2) return false;
  var salt = Buffer.from(parts[0], "hex");
  var expected = Buffer.from(parts[1], "hex");
  var actual = crypto.scryptSync(password, salt, 64);
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
var db = new Database(DB_PATH);

db.exec(
  "CREATE TABLE IF NOT EXISTS users (\n" +
    "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
    "  username TEXT NOT NULL COLLATE NOCASE UNIQUE,\n" +
    "  password_hash TEXT NOT NULL,\n" +
    "  display_name TEXT,\n" +
    "  company TEXT,\n" +
    "  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n" +
    ");"
);

var demoRow = db.prepare("SELECT id FROM users WHERE username = ?").get("test");
if (!demoRow) {
  db.prepare(
    "INSERT INTO users (username, password_hash, display_name, company) VALUES (?, ?, ?, ?)"
  ).run("test", hashPassword("test"), "Demo user", "Workbench HR");
}

var app = express();
app.use(express.json({ limit: "32kb" }));

app.use("/api", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.post("/api/register", function (req, res) {
  var username = String((req.body && req.body.username) || "").trim();
  var password = String((req.body && req.body.password) || "");
  var displayName = String((req.body && req.body.name) || "").trim() || null;
  var company = String((req.body && req.body.company) || "").trim() || null;

  if (!username || !password) {
    return res.status(400).json({ ok: false, error: "Username and password are required." });
  }
  if (username.length < 2 || password.length < 2) {
    return res
      .status(400)
      .json({ ok: false, error: "Username and password must be at least 2 characters." });
  }

  try {
    var hash = hashPassword(password);
    db.prepare(
      "INSERT INTO users (username, password_hash, display_name, company) VALUES (?, ?, ?, ?)"
    ).run(username, hash, displayName, company);
    return res.json({ ok: true });
  } catch (e) {
    if (e && (e.code === "SQLITE_CONSTRAINT_UNIQUE" || String(e.message).indexOf("UNIQUE") >= 0)) {
      return res.status(409).json({ ok: false, error: "That username is already taken." });
    }
    console.error(e);
    return res.status(500).json({ ok: false, error: "Could not create account." });
  }
});

app.post("/api/login", function (req, res) {
  var username = String((req.body && req.body.username) || "").trim();
  var password = String((req.body && req.body.password) || "");
  if (!username || !password) {
    return res.status(400).json({ ok: false, error: "Enter your username and password." });
  }
  var user = db
    .prepare("SELECT id, password_hash FROM users WHERE username = ? COLLATE NOCASE")
    .get(username);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ ok: false, error: "Incorrect username or password." });
  }
  return res.json({ ok: true, username: username });
});

app.use(express.static(__dirname));

app.listen(PORT, "127.0.0.1", function () {
  console.log("Workbench HR preview: http://127.0.0.1:" + PORT + "/");
  console.log("Demo sign-in: username test, password test");
});
