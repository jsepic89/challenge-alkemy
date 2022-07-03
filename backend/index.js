import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import { connect } from "./database/db.js";
import userAuth from "./routes/authRoute.js";

const app = express();

dotenv.config();
app.use(express.json()); //body-parser no longer needed, insted this is the alternative
app.use(express.urlencoded({ extended: false}));

// DB connection test, see db.js for function description
connect();


// Routing
app.use('/', userRoutes);

//app.use('/', userAuth);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});