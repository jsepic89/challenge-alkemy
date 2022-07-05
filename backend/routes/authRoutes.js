import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware.js";
import bcrypt from "bcryptjs";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Register of users creating a jsonwebtoken at the same time, valid for 30 days
//note that as the User model already has the method for hashing the password, the password received via 
// body will be hashed before being stored 
router.post('/register', async (req, res, next) => {
    
    const { name, email, password } = await req.body;
    const alreadyUser = await User.findOne({ where: {email}});
    
    if (alreadyUser){
        let error = new Error("User already registered");
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
        res.render('transactions', {transactions, user});
        //res.status(200).json({ message: "User registered successfully", token});
    } catch (error) {
        console.log(error);
    }
});

// login will check if the email exists in the database, and if the password is correct via bcrypt.compare
// if credentials are OK, a jsonwebtoken for 30 days is generated. Name, id and token are returned via json
router.post('/login', async (req, res) => {
    const { email, password } = await req.body;
    const isUser = await User.findOne({ where: {email}, raw: true });
    
    if (!isUser){
        let error = new Error("The user doesn't exist");
        return res.json({ message: error.message});
    }

    const correctPassword = await bcrypt.compare(password, isUser.password);

    if (!correctPassword){
        let error = new Error("Invalid password");
        return res.json({ message: error.message});
    }

    const token = jwt.sign({
        name: isUser.name,
        id: isUser.id
    }, process.env.JWT_KEY, { expiresIn: "30d" });

    const transactions = await Transaction.findAll({
        where: { userId: isUser.id }
    });
    const balance = transactions.reduce((accum, elem) => {accum + Number(elem.amount)}, 0);
    
    res.render('transactions', {transactions, isUser, balance});
});

// User profile with a middleware to check if the user is logged in
router.post('/logout', (req, res)=>{

    return res.status(200).json({message: "Logout successful"});
} );

export default router;