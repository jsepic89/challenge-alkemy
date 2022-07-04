import express from "express";
import { createTransaction, getTransactions, getOneTransaction, editTransaction, deleteTransaction } from "../controllers/transactionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/transactions', authMiddleware, createTransaction);
router.get('/transactions', authMiddleware, getTransactions);
router.get('/transactions/:id', authMiddleware, getOneTransaction);
router.put('/transactions/:id', authMiddleware, editTransaction);
router.delete('/transactions/:id', authMiddleware, deleteTransaction);


export default router;