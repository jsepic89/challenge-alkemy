import User from "../models/User.js";
import bcrypt from "bcryptjs";

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
    console.log("Login successful");
    return res.json("Login successful");
};

export { userRegister, userLogin };