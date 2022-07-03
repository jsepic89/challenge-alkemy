import mysql from "mysql2";
import dotenv from "dotenv";
import Sequelize from "sequelize";

dotenv.config();

// connection to mysql server, as it will be used for creating the DB if it does not exist
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
});

// creation of database if it does not exist
// note that the first time the code is executed, console will show errors because it will not find the database
// at the same time, the database is being created, so those errors will not affect the program 
connection.query(`CREATE DATABASE IF NOT EXISTS balance`, (error, results) => {
    if (error){
        console.log(error);
    }
});

connection.end();


// Sequelize instanciation for db connection
const db = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: "mysql",
});

// standard Sequelize procedure for connection testing
const connect = async () => {
    try {
        await db.authenticate();
        console.log('Connection to database has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
};

export { db, connect };