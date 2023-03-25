import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";

const { Client } = pkg;

export const client = new Client({
    host: "localhost",
    // port: 5432,
    user: "postgres",
    password: "123456789",
    database: "whats_upp",
});

await client.connect();
console.log("Terhubung ke basis data.");
git push -u origin main
