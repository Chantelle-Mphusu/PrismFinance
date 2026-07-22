import cron from "node-cron";
import User from "../models/User.js";
import Budget from "../models/Budget.js";
import Transaction from "../models/Transactions.js";
import { sendBudgetAlertEmail } from "../utils/emailService.js";

const runBudgetAlerts = async () => {
  console.log("Running budget alert job...");

  try {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    // ── Get all budgets for current month ──
    const budgets = await Budget.find({ month, year }).populate("user");

    for (const budget of budgets) {
      try {
        const user = budget.user;

        // ── Skip if user has budget alerts disabled ──
        if (!user?.settings?.notifications?.budgetAlerts) continue;

        // ── Calculate spending for this category this month ──
        const transactions = await Transaction.find({
          user: user._id,
          category: budget.category,
          type: "expense",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const percentage = Math.round((spent / budget.limit) * 100);

        // ── 100% alert ──
        if (percentage >= 100 && !budget.alertSentAt100) {
          await sendBudgetAlertEmail(user.email, user.firstName, {
            category: budget.category,
            spent,
            limit: budget.limit,
            percentage,
          });

          await Budget.findByIdAndUpdate(budget._id, {
            alertSentAt100: true,
          });

          console.log(`100% budget alert sent to ${user.email} for ${budget.category}`);
        }

        // ── 50% alert ──
        else if (percentage >= 50 && !budget.alertSentAt50) {
          await sendBudgetAlertEmail(user.email, user.firstName, {
            category: budget.category,
            spent,
            limit: budget.limit,
            percentage,
          });

          await Budget.findByIdAndUpdate(budget._id, {
            alertSentAt50: true,
          });

          console.log(`50% budget alert sent to ${user.email} for ${budget.category}`);
        }

      } catch (err) {
        console.error(`Budget alert error for budget ${budget._id}:`, err.message);
      }
    }

    console.log("Budget alert job completed.");
  } catch (err) {
    console.error("Budget alert job error:", err.message);
  }
};

// ── Runs every 6 hours ──
const startBudgetAlertJob = () => {
  cron.schedule("0 */6 * * *", runBudgetAlerts, {
    timezone: "Africa/Gaborone",
  });

  console.log("Budget alert cron job scheduled.");
};

export { startBudgetAlertJob, runBudgetAlerts };