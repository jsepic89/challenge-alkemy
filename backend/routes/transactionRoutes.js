import express from "express";
import { createTransaction, getTransactions, getOneTransaction, editTransaction, deleteTransaction } from "../controllers/transactionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create', authMiddleware, createTransaction);
router.get('/', authMiddleware, getTransactions);
router.get('/:id', authMiddleware, getOneTransaction);
router.put('/:id', authMiddleware, editTransaction);
router.get('/delete/:id', authMiddleware, deleteTransaction);


export default router;