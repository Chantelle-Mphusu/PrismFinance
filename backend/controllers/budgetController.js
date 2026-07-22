import Budget from "../models/Budget.js";
import Transaction from "../models/Transactions.js";

// ======================================
// CREATE BUDGET
// ======================================
const createBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !limit) {
      return res.status(400).json({ message: "Category and limit are required" });
    }

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const existing = await Budget.findOne({
      user: req.user._id,
      category,
      month,
      year,
    });

    if (existing) {
      return res.status(409).json({
        message: `A budget for ${category} already exists for this month`,
      });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      limit,
      month,
      year,
    });

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// GET ALL BUDGETS — with spending totals
// ======================================
const getBudgets = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    });

    // ── Attach current spending to each budget ──
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await Transaction.find({
          user: req.user._id,
          category: budget.category,
          type: "expense",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const percentage = Math.round((spent / budget.limit) * 100);

        return {
          ...budget.toObject(),
          spent,
          percentage,
          remaining: Math.max(0, budget.limit - spent),
        };
      })
    );

    res.status(200).json(budgetsWithSpending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// UPDATE BUDGET
// ======================================
const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.body;

    if (!limit) {
      return res.status(400).json({ message: "Limit is required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        limit,
        // ── Reset alerts when limit changes ──
        alertSentAt50: false,
        alertSentAt100: false,
      },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// DELETE BUDGET
// ======================================
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createBudget, getBudgets, updateBudget, deleteBudget };