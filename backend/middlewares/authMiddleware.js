import jwt  from "jsonwebtoken";
import User from "../models/User.js";

// token is delivered in req.headers.authorization, starting with the word Bearer and a space
// we first check if there is a token, if true, we decode it to gather the user information and 
// execute the next controller using next()
const authMiddleware = async (req, res, next) => {
    
    const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer") ? 
        req.headers.authorization.split(" ")[1] : null;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        req.user = await User.findOne({ where: { id: decodedToken.id }, attributes: { exclude: "password"}});
    } catch (error) {
        return res.status(404).json({error});
    };

    next();
};

export default authMiddleware;