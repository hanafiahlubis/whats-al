import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { client } from "./db.js";

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import multer from "multer";
const upload = multer({ dest: "public/photos" });

const type = upload.single('file')
const app = express();

// middleware untuk membaca body berformat JSON
app.use(express.json());
// middleware untuk mengelola cookie

// Untuk mengakses file statis (khusus Vercel)

app.use(express.static("public"));

import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.resolve(__dirname, "public")));

// tambah akun
app.post("/api/akun", type, async (req, res) => {
  const result = await client.query("select username from akun");
  let ada = false;
  result.rows.forEach(e => (e.username === req.body.username) ? ada = true : "");
  if (ada) {
    res.send("Username Sudah ada");
  } else {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    await client.query(
      `INSERT INTO akun VALUES (default,'${req.body.username}', '${hash}','${req.body.name}','${req.file.filename}')`
    );
    res.send("Akun berhasil ditambahkan.");
  }
});
// edit
app.put("/api/edit-password/akun", async (req, res) => {
  const result = await client.query(`select * from akun where username = '${req.body.username}'`);
  if (result.rows.length > 0) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    await client.query(`update akun set password = '${hash}'where username = '${req.body.username}'`);

    res.status(200);
    res.send("Berhasil Di edit");
  } else {

    res.send("Username Tidak Ada");
    res.status(401);
  }
});
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.path.startsWith("/api/login") || req.path.startsWith("/assets")) {
    next();
  } else {
    let authorized = false;
    if (req.cookies.token) {
      try {
        req.me = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
        authorized = true;
      } catch (err) {
        res.setHeader("Cache-Control", "no-store"); // khusus Vercel
        res.clearCookie("token");
      }
    }
    if (authorized) {
      if (req.path.startsWith("/login")) {
        res.redirect("/");
      } else {
        next();
      }
    } else {
      if (req.path.startsWith("/login")) {
        next();
      } else {
        if (req.path.startsWith("/api")) {
          res.status(401);
          res.send("Anda harus login terlebih dahulu.");
        } else {
          res.redirect("/login");
        }
      }
    }
  }
});



// Untuk mengakses file statis
// app.use(express.static("public"));

// Untuk membaca body berformat JSON
app.post("/api/login", async (req, res) => {
  const results = await client.query(
    `SELECT * FROM akun WHERE username = '${req.body.username}'`
  );
  if (results.rows.length > 0) {
    if (await bcrypt.compare(req.body.password, results.rows[0].password)) {
      const token = jwt.sign(results.rows[0], process.env.SECRET_KEY);
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

// dapatkan username yang login
app.get("/api/me", async (req, res) => {
  const result = await client.query(`select * from akun where id = ${req.me.id}`);
  req.me = result.rows[0];
  res.json(req.me);
});
app.get("/api/teman", async (_req, res) => {
  const results = await client.query("select * from akun order by id asc ");
  res.send(results.rows);
});
app.put("/api/bio", async (req, res) => {
  await client.query(`UPDATE akun set nama_lengkap = '${req.body.nama}',username = '${req.body.username}'  where id = ${req.me.id}`);
  res.send("ok");
});
app.get("/api/pesan/:id", async (req, res) => {
  const idPenerima = parseInt(req.params.id);
  const data = await client.query(`select * from pesan where id_pengirim = ${req.me.id} AND id_penerima = ${idPenerima} or id_pengirim = ${idPenerima} AND id_penerima = ${req.me.id} order by tanggal_waktu asc`)
  res.json(data.rows);
});
app.get("/api/pesan-baru/:id", async (req, res) => {
  const idPengirim = parseInt(req.params.id);
  const data = await client.query(`select * from pesan where id_pengirim = ${idPengirim} AND id_penerima = ${req.me.id} and baca = false order by tanggal_waktu asc`)
  res.json(data.rows);
});
app.post("/api/tambah/pesan/:id", async (req, res) => {
  const idPenerima = parseInt(req.params.id);
  await client.query(`insert into pesan values(default,${req.me.id},${idPenerima},now(), '${req.body.pesan}','false')`)
  res.sendStatus(200);
});

app.put("/api/baca/:id", async (req, res) => {
  await client.query(`update pesan set baca = true where id = ${req.params.id}`);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server berhasil berjalan.");
});
