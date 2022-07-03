import express from "express";
import { userRegister } from "../controllers/userController.js"

const router = express.Router();

// Register and auth of users
router.post('/register', userRegister);

export default router;