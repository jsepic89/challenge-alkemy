import User from "../models/User.js";

//note that as the User model already has the method for hashing the password, the password received via 
// body will be hashed before being stored 
const userRegister = async (req, res) => {
    const { name, email, password } = await req.body;
    try {
        const user = await User.create({
        name,
        email,
        password
    })
    console.log(user); 
    } catch (error) {
        console.log(error)
    }
    
};

export { userRegister };