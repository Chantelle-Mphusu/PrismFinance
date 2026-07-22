import Transaction from '../models/Transactions.js';
import User from '../models/User.js';
import Budget from '../models/Budget.js';
import { sendTransactionEmail, sendBudgetAlertEmail } from '../utils/emailService.js';

// ======================================
// CREATE TRANSACTION
// ======================================
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date,
      notes,
    });

    const user = await User.findById(req.user._id);

    // ── Transaction notification ──
    if (user?.settings?.notifications?.transactionNotifications) {
      await sendTransactionEmail(user.email, user.firstName, transaction);
    }

    // ── Budget alert — only for expenses ──
    if (type === "expense" && user?.settings?.notifications?.budgetAlerts) {
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

      const budget = await Budget.findOne({
        user: req.user._id,
        category,
        month,
        year,
      });

      console.log("Budget found:", budget);

      if (budget) {
        const transactions = await Transaction.find({
          user: req.user._id,
          category,
          type: "expense",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const percentage = Math.round((spent / budget.limit) * 100);

        console.log("Spent:", spent, "Percentage:", percentage);

        // ── 100% alert ──
        if (percentage >= 100 && !budget.alertSentAt100) {
          await sendBudgetAlertEmail(user.email, user.firstName, {
            category,
            spent,
            limit: budget.limit,
            percentage,
          });
          await Budget.findByIdAndUpdate(budget._id, { alertSentAt100: true });
          console.log("100% budget alert sent");
        }

        // ── 50% alert ──
        else if (percentage >= 50 && !budget.alertSentAt50) {
          await sendBudgetAlertEmail(user.email, user.firstName, {
            category,
            spent,
            limit: budget.limit,
            percentage,
          });
          await Budget.findByIdAndUpdate(budget._id, { alertSentAt50: true });
          console.log("50% budget alert sent");
        }
      }
    }

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// GET ALL TRANSACTIONS
// ======================================
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// SEED TRANSACTIONS
// ======================================
const seedTransactions = async (req, res) => {
  try {
    const sampleTransactions = [
      { user: req.user.id, title: "Salary", amount: 12000, type: "income", category: "Salary", date: new Date("2026-05-01") },
      { user: req.user.id, title: "Freelance Project", amount: 3500, type: "income", category: "Business", date: new Date("2026-05-03") },
      { user: req.user.id, title: "Groceries", amount: 850, type: "expense", category: "Food", date: new Date("2026-05-04") },
      { user: req.user.id, title: "Netflix", amount: 120, type: "expense", category: "Entertainment", date: new Date("2026-05-05") },
      { user: req.user.id, title: "Electricity", amount: 600, type: "expense", category: "Utilities", date: new Date("2026-05-06") },
      { user: req.user.id, title: "Fuel", amount: 950, type: "expense", category: "Transport", date: new Date("2026-05-07") },
      { user: req.user.id, title: "Investment Return", amount: 1800, type: "income", category: "Investments", date: new Date("2026-05-08") },
    ];

    await Transaction.insertMany(sampleTransactions);

    res.status(201).json({ success: true, message: "Sample transactions seeded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to seed transactions" });
  }
};

export { createTransaction, getTransactions, seedTransactions };