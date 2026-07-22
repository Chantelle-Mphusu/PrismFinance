// =========================
// TOTALS
// =========================
export const calculateTotals = (transactions = []) => {
  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  return {
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses,
  };
};

// =========================
// MONTHLY DATA
// =========================
export const generateMonthlyData = (transactions = []) => {
  const monthlyMap = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.date);

    const month = date.toLocaleString("default", {
      month: "short",
    });

    if (!monthlyMap[month]) {
      monthlyMap[month] = {
        month,
        income: 0,
        expense: 0,
      };
    }

    if (tx.type === "income") {
      monthlyMap[month].income += Number(tx.amount);
    }

    if (tx.type === "expense") {
      monthlyMap[month].expense += Number(tx.amount);
    }
  });

  return Object.values(monthlyMap);
};

// =========================
// CATEGORY DATA
// =========================
export const generateCategoryData = (transactions = []) => {
  const categoryMap = {};

  transactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      const category = tx.category || "General";

      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }

      categoryMap[category] += Number(tx.amount);
    });

  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));
};