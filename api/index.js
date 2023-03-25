import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { client } from "./db.js";

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";

const app = express();

// middleware untuk membaca body berformat JSON
app.use(express.json());
app.use(express.static("public"));
// middleware untuk mengelola cookie
app.use(cookieParser());

// middleware untuk mengalihkan ke halaman login
app.use((req, res, next) => {
  if (req.path.startsWith("/assets") || req.path.startsWith("/api")) {
    next();
  } else {
    if (req.cookies.token) {
      if (req.path.startsWith("/login")) {
        res.redirect("/");
      } else {
        next();
      }
    } else {
      if (req.path.startsWith("/login")) {
        next();
      } else {
        res.redirect("/login");
      }
    }
  }
});

// tambah
app.post("/api/akun", async (req, res) => {
  const result = await client.query("select username from akun");
  console.log(result.rows);
  let ada = false;
  result.rows.forEach(e => (e.username === req.body.username) ? ada = true : "");
  if (ada) {
    res.send("Username Sudah ada");
  } else {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    await client.query(
      `INSERT INTO akun VALUES (default,'${req.body.username}', '${hash}','${req.body.nama_lengkap}')`
    );
    res.send("Akun berhasil ditambahkan.");
  }
});
// edit
app.put("/api/edit-password/akun", async (req, res) => {
  const result = await client.query(`select username from akun where username = '${req.body.username}'`);
  let a = 0; (result.rows.length > 0) && a++;

  if (!a === 0) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    await client.query(
      `update akun set password = '${hash}'where username = '${req.body.username}'`
    );
    res.send("Berhasil Di edit");
  } else {
    res.send("Username Tidak Ada");
  }
});

app.post("/api/login", async (req, res) => {
  const results = await client.query(
    `SELECT * FROM akun WHERE username = '${req.body.username}'`
  );
  if (results.rows.length > 0) {
    if (await bcrypt.compare(req.body.password, results.rows[0].password)) {
      const token = jwt.sign(results.rows[0], "dsssss");
      res.cookie("token", token);
      res.send("Login berhasil.");
    } else {
      res.status(401);
      res.send("Kata sandi salah.");
    }
  } else {
    res.status(401);
    res.send("Username tidak ditemukan.");
  }
});

// middleware untuk mengotentikasi pengguna
app.use((req, res, next) => {
  if (req.cookies.token) {
    try {
      jwt.verify(req.cookies.token, "dsssss");
      next();
    } catch (err) {
      res.status(401);
      res.send("Anda harus login lagi.");
    }
  } else {
    res.status(401);
    res.send("Anda harus login terlebih dahulu.");
  }
});

// dapatkan mahasiswa yang login
app.get("/api/me", (req, res) => {
  const me = jwt.verify(req.cookies.token, "dsssss");
  console.log(me);
  res.json(me);
});


app.listen(3000, () => {
  console.log("Server berhasil berjalan.");
});
