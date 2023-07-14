import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  port: 1234,
  user: "user",
  password: "password",
  database: "gym",
});
