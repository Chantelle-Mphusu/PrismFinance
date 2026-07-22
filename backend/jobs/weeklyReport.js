import cron from "node-cron";
import User from "../models/User.js";
import Transaction from "../models/Transactions.js";
import { sendWeeklyReportEmail } from "../utils/emailService.js";

const runWeeklyReport = async () => {
  console.log("Running weekly report job...");

  try {
    // ── Get all users with weeklyReports enabled ──
    const users = await User.find({
      "settings.notifications.weeklyReports": true,
      isVerified: true,
    });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    for (const user of users) {
      try {
        // ── Get transactions from the past 7 days ──
        const transactions = await Transaction.find({
          user: user._id,
          date: { $gte: oneWeekAgo },
        });

        // ── Skip if no transactions this week ──
        if (transactions.length === 0) continue;

        // ── Calculate report data ──
        const totalIncome = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);

        const netBalance = totalIncome - totalExpenses;

        // ── Find top spending category ──
        const categoryTotals = {};
        transactions
          .filter((t) => t.type === "expense")
          .forEach((t) => {
            const cat = t.category || "Uncategorized";
            categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
          });

        const topCategory = Object.entries(categoryTotals).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] || null;

        await sendWeeklyReportEmail(user.email, user.firstName, {
          totalIncome,
          totalExpenses,
          netBalance,
          topCategory,
          transactionCount: transactions.length,
        });

        console.log(`Weekly report sent to ${user.email}`);
      } catch (err) {
        console.error(`Failed to send report to ${user.email}:`, err.message);
      }
    }

    console.log("Weekly report job completed.");
  } catch (err) {
    console.error("Weekly report job error:", err.message);
  }
};

// ── Runs every Monday at 8:00 AM ──
const startWeeklyReportJob = () => {
  cron.schedule("0 8 * * 1", runWeeklyReport, {
    timezone: "Africa/Gaborone",
  });

  console.log("Weekly report cron job scheduled.");
};

// ── Export for manual testing ──
export { startWeeklyReportJob, runWeeklyReport };