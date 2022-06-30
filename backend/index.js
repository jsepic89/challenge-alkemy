import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";

const app = express();

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
});


connection.connect( (err) => {
    if (err) {
        throw err
    }
    console.log("MySQL database connected successfully");
});

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});