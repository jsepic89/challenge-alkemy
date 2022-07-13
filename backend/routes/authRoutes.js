import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Transaction from "../models/Transaction.js";
import axios from "axios";

const router = express.Router();

// Register of users creating a jsonwebtoken at the same time, valid for 30 days
//note that as the User model already has the method for hashing the password, the password received via 
// body will be hashed before being stored 
router.post('/register', async (req, res, next) => {
    
    const { name, email, password, confirmPassword } = await req.body;
    const alreadyUser = await User.findOne({ where: {email}});
    
    if (alreadyUser){
        let error = new Error("User already registered");
        return res.json({ message: error.message});
    }

    if (password !== confirmPassword){
        let error = new Error("Please check that the passwords are the same");
        return res.json({ message: error.message});
    }
    
    try {

        const token = jwt.sign({
            name,
            email,
            password
        }, process.env.JWT_KEY, { expiresIn: "30d" });

        const user = await User.create({
            name,
            email,
            password
        });
        const transactions = await Transaction.findAll({
            where: { userId: user.id }
        });
        axios.defaults.headers.common['authorization'] = token;
        res.status(200).render('transactions', {transactions, user, token});
    } catch (error) {
        console.log(error);
    }
});

// login will check if the email exists in the database, and if the password is correct via bcrypt.compare
// if credentials are OK, a jsonwebtoken for 30 days is generated. Name, id and token are returned via json
router.post('/login', async (req, res) => {
    const { email, password } = await req.body;
    const user = await User.findOne({ where: {email}, raw: true });
    
    if (!user){
        let error = new Error("The user doesn't exist");
        return res.json({ message: error.message});
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword){
        let error = new Error("Invalid password");
        return res.json({ message: error.message});
    }

    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, process.env.JWT_KEY, { expiresIn: "30d" });

    const transactions = await Transaction.findAll({
        where: { userId: user.id },
        limit: 10,
        order: [['date', 'DESC']]
    });
    const balance = transactions.reduce((accum, elem) => {
        if (elem.type == "Expense"){
            elem.amount = 0 - Number(elem.amount)
        }
        return accum + Number(elem.amount)
    }, 0);

    res.render('transactions', {transactions, user, balance, token});
});

// logout removes the token from localstorage in the client side, and redirects to the home in the server side
router.post('/logout', (req, res)=>{

    res.redirect('home');
} );

export default router;