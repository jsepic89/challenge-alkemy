import express from "express";
import { userRegister, userLogin } from "../controllers/userController.js"

const router = express.Router();

// Register and auth of users
router.post('/register', userRegister);
router.post('/login', userLogin);

export default router;