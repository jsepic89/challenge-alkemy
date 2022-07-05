import express from "express";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactionRoutes.js"
import { connect } from "./database/db.js";
import { engine, create } from "express-handlebars";
import authRoutes from "./routes/authRoutes.js"

const app = express();


dotenv.config();
app.use(express.json()); //body-parser no longer needed, insted this is the alternative
app.use(express.urlencoded({ extended: false}));

// setting public as the static files folder 
app.use(express.static('public'));
// setting handlebars as views engine, and its extension to .hbs
app.engine('.hbs', engine({ extname: ".hbs", runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }}), );
app.set('view engine', '.hbs');

// DB connection test, refer to db.js for function description
connect();


// Routing
app.get('/', (req, res) => {
    res.render('home');
});
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});