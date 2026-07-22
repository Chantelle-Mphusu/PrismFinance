import './config/env.js';
import dotenv from 'dotenv'
import express from 'express';
import dns from 'dns'
import mongoose from 'mongoose';
import cors from'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js'
import transactRoutes from './routes/transact.js'
import settingsRoutes from './routes/settings.js'
import { startWeeklyReportJob } from './jobs/weeklyReport.js'; 
import budgetRoutes from './routes/budget.js';
import { startBudgetAlertJob, runBudgetAlerts } from './jobs/budgetAlert.js';
//import route = require('./routes/routes');
//const router = require('express').Router();

const app = express();

const { MONGO_URI, PORT } = process.env;

// Connect to MongoDB

dns.setDefaultResultOrder('ipv4first');
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB is connected successfully');
  } catch (error) {
    console.error(error);
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();
startWeeklyReportJob();
startBudgetAlertJob();


// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);


// Routes

app.use('/api/auth', authRoutes)
app.use('/api/transact',transactRoutes)
app.use('/api/settings',settingsRoutes)
app.use('/api/budgets', budgetRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
