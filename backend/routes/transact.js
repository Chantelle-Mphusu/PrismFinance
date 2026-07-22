import express from 'express';
import { createTransaction,getTransactions,seedTransactions } from '../controllers/transController.js';
import authMiddleware from '../middleware/authMiddleware.js'
const router = express.Router();

//POST
router.post('/create', authMiddleware, createTransaction);
router.post("/seed", authMiddleware, seedTransactions);
//GET 
router.get('/transactions',authMiddleware,getTransactions)

//UPDATE


export default router;