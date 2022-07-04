import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//note that as the User model already has the method for hashing the password, the password received via 
// body will be hashed before being stored 
const userRegister = async (req, res) => {
    const { name, email, password } = await req.body;
    const alreadyUser = await User.findOne({ where: {email}});

    if (alreadyUser){
        console.log("User already registered");
        return res.json("User already registered");
    }

    try {
        const user = await User.create({
        name,
        email,
        password
        });
        return res.json("User registered successfully"); 
    } catch (error) {
        console.log(error);
    }
    
};

// userLogin will check if the email exists in the database, and if the password is correct via bcrypt.compare
// if credentials are OK, a jsonwebtoken for 30 days is generated. Name, id and token are returned via json
const userLogin = async (req, res) => {
    const { email, password } = await req.body;
    const isUser = await User.findOne({ where: {email}});
    
    if (!isUser){
        return res.json("The user doesn't exist");
    }

    const correctPassword = await bcrypt.compare(password, isUser.password);

    if (!correctPassword){
        return res.json("Invalid password");
    }

    const token = jwt.sign({
        name: isUser.name,
        id: isUser.id
    }, process.env.JWT_KEY, { expiresIn: "30d" });

    return res.json({
        message: "Login successful",
        name: isUser.name,
        id: isUser.id,
        token
    });
};

const userProfile = async (req, res) => {
    console.log("El login funciona");
    res.json({message: "El login funciona"});
};

export { userRegister, userLogin, userProfile };