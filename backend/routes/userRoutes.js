import express from "express";
import { userRegister, userLogin, userProfile } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register and auth of users
router.post('/register', userRegister);
router.post('/login', userLogin);

// User profile with a middleware to check if the user is logged in
router.get('/profile', authMiddleware, userProfile );

export default router;