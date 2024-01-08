const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const { enc, verify } = require("./enc.js");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
var conString = process.env.conString;
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
const exp = require("constants");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../Frontend/build")));
app.use(express.json());

const pool = new Pool({
  connectionString: conString,
});
const query = async (sql, values = []) => {
  try {
    const client = await pool.connect();
    const result = await client.query(sql, values);
    client.release();

    return result;
  } catch (err) {
    console.error("Error executing query", err);
    return err;
  }
};
function generateRandomString(length) {
  const characters =
    "@$%&ABCDEFGHIJKLM@$%&NOPQ0123456789RSTUVWXYZabcdefghi@$%&jklmnopqrstuvwx@$%&yz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

app.post("/api/v1/auth/in/", async (req, res) => {
  try {
    const creds = req.body;
    const username = creds.username;
    const password = creds.password;
    const sql = `SELECT * FROM users WHERE username=$1`;
    const result = await query(sql, [username]);
    if (result.rows.length === 0) {
      console.log("User not found!");
      res
        .status(200)
        .json({ message: "Invalid username or password", success: false });
    } else {
      const pass = result.rows[0].password;
      const salt = result.rows[0].salt;
      const verifyResult = await verify(password, salt, pass);
      if (verifyResult.success) {
        const newid = generateRandomString(15);
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
          time: Date(),
          username: username,
          deviceID: newid,
        };

        const token = jwt.sign(data, jwtSecretKey);
        res.cookie("deviceID", newid + username, {
          httpOnly: true,
          maxAge: 10 * 12 * 30 * 24 * 60 * 60 * 1000,
        });
        res
          .status(200)
          .json({ message: "Success", token: token, success: true });
      } else {
        console.log(verifyResult.msg);
        res
          .status(200)
          .json({ message: "Invalid username or password", success: false });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({ message: "Internal Server Error", success: false });
  }
});

app.post("/api/v1/auth/up/", async (req, res) => {
  try {
    const creds = req.body;
    const username = creds.username;
    const password = creds.password;
    const name = creds.name;
    const email = creds.email;
    const encResult = await enc(password);
    const sql = `INSERT INTO users (username, password, salt, name, email) VALUES ($1, $2, $3, $4, $5)`;
    const result = await query(sql, [
      username,
      encResult.hash,
      encResult.salt,
      name,
      email,
    ]);
    if (result.rowCount === 1) {
      const newid = generateRandomString(15);
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      let data = {
        time: Date(),
        username: username,
        deviceID: newid,
      };

      const token = jwt.sign(data, jwtSecretKey);
      res.cookie("deviceID", newid + username, {
        httpOnly: true,
        maxAge: 10 * 12 * 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ message: "Success", token: token, success: true });
    } else {
      res
        .status(200)
        .json({ message: "Username already exists", success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({ message: "Internal Server Error", success: false });
  }
});

app.post("/api/v1/expense/fetch/", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      if (decoded.deviceID + decoded.username === req.cookies.deviceID) {
        const username = decoded.username;
        const sql = `SELECT expenses FROM users WHERE username=$1`;
        const result = await query(sql, [username]);
        const expenses = result.rows[0].expenses;
        res
          .status(200)
          .json({ message: "Success", expenses: expenses, success: true });
      } else {
        res
          .status(200)
          .json({
            message: "Session Expired!",
            success: false,
            errorCode: "fuck",
          });
      }
    } else {
      res
        .status(200)
        .json({
          message: "Session Expired!",
          success: false,
          errorCode: "fuck",
        });
    }
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      res
        .status(200)
        .json({
          message: "Session Expired!",
          success: false,
          errorCode: "fuck",
        });
    } else {
      console.log(err);
      res
        .status(200)
        .json({ message: "Internal Server Error", success: false });
    }
  }
});

app.post("/api/v1/expense/insert/", async (req, res) => {
  try {
    const expense = req.body;
    const id = expense.id;
    const date = new Date(expense.date);
    const amount = expense.amount;
    const title = expense.title;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      if (decoded.deviceID + decoded.username === req.cookies.deviceID) {
        const username = decoded.username;
        // fetch expenses json from users table
        const sql = `SELECT expenses FROM users WHERE username=$1`;
        const result = await query(sql, [username]);
        const expenses = result.rows[0].expenses;
        // add new expense to expenses json
        const newExpense = {
          id: id,
          title: title,
          amount: amount,
          date: date,
        };
        if (expenses[date.getFullYear()]) {
          expenses[date.getFullYear()].push(newExpense);
        } else {
          expenses[date.getFullYear()] = [newExpense];
        }
        // update expenses json in users table
        const sql2 = `UPDATE users SET expenses=$1 WHERE username=$2`;
        const result2 = await query(sql2, [expenses, username]);
        if (result2.rowCount === 1) {
          res.status(200).json({ message: "Success", success: true });
        } else {
          res
            .status(200)
            .json({ message: "Internal Server Error", success: false });
        }
      } else {
        res
          .status(200)
          .json({
            message: "Session Expired!",
            success: false,
            errorCode: "fuck",
          });
      }
    } else {
      res
        .status(200)
        .json({
          message: "Session Expired!",
          success: false,
          errorCode: "fuck",
        });
    }
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      res
        .status(200)
        .json({
          message: "Session Expired!",
          success: false,
          errorCode: "fuck",
        });
    } else {
      console.log(err);
      res
        .status(200)
        .json({ message: "Internal Server Error", success: false });
    }
  }
});

app.post("/api/v1/expense/delete/", async (req, res) => {
  try {
    const id = req.body.id;
    const year = req.body.year;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      if (decoded.deviceID + decoded.username === req.cookies.deviceID) {
        const username = decoded.username;
        // fetch expenses json from users table
        const sql = `SELECT expenses FROM users WHERE username=$1`;
        const result = await query(sql, [username]);
        const expenses = result.rows[0].expenses;
        // delete expense from expenses json
        const newExpenses = expenses[year].filter((expense) => {
          return expense.id !== +id;
        });
        if (newExpenses.length === 0) {
          delete expenses[year];
        } else {
          expenses[year] = newExpenses;
        }
        // update expenses json in users table
        const sql2 = `UPDATE users SET expenses=$1 WHERE username=$2`;
        const result2 = await query(sql2, [expenses, username]);
        if (result2.rowCount === 1) {
          res.status(200).json({ message: "Success", success: true });
        } else {
          res
            .status(200)
            .json({ message: "Internal Server Error", success: false });
        }
      } else {
        res
          .status(200)
          .json({
            message: "Session Expired!",
            success: false,
            errorCode: "fuck",
          });
      }
    } else {
      res
        .status(200)
        .json({
          message: "Session Expired!",
          success: false,
          errorCode: "fuck",
        });
    }
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      res
        .status(200)
        .json({
          message: "Session Expired!",
          success: false,
          errorCode: "fuck",
        });
    } else {
      console.log(err);
      res
        .status(200)
        .json({ message: "Internal Server Error", success: false });
    }
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Fontend/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
