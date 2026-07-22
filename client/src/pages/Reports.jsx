import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  WalletIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { SidebarData } from "../DBfunctions/SideBar.jsx";

import useUIStore from "../store/uiStore";
import useTransactions from "../hooks/useTransactions.jsx";

import {
  calculateTotals,
  generateMonthlyData,
  generateCategoryData,
} from "../utils/transactionAnalytics";

const COLORS = [
  "#06B6D4",
  "#22C55E",
  "#F43F5E",
  "#EAB308",
  "#8B5CF6",
  "#F97316",
];

const Reports = () => {
  // =========================
  // AUTH
  // =========================
  const { user } = useAuth();

  // =========================
  // SERVER DATA
  // =========================
  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useTransactions();

  // =========================
  // ANALYTICS
  // =========================
  const analytics = calculateTotals(transactions);

  const totalIncome =
    analytics?.totalIncome || 0;

  const totalExpenses =
    analytics?.totalExpenses || 0;

  const totalBalance =
    analytics?.totalBalance || 0;

  const monthlyData =
    generateMonthlyData(transactions);

  const categoryData =
    generateCategoryData(transactions);

  // =========================
  // INSIGHTS
  // =========================
  const savingsRate =
    totalIncome > 0
      ? (
          (totalBalance / totalIncome) *
          100
        ).toFixed(1)
      : 0;

  const topExpenseCategory =
    categoryData.length > 0
      ? categoryData.reduce((prev, current) =>
          prev.value > current.value
            ? prev
            : current
        )
      : null;

  const totalTransactions =
    transactions.length;

  const incomeTransactions =
    transactions.filter(
      (tx) => tx.type === "income"
    ).length;

  const expenseTransactions =
    transactions.filter(
      (tx) => tx.type === "expense"
    ).length;

  // =========================
  // EXPORT CSV
  // =========================
  const exportCSV = () => {
    if (!transactions.length) return;

    const headers = [
      "Title",
      "Amount",
      "Type",
      "Category",
      "Date",
      "Notes",
    ];

    const rows = transactions.map((tx) => [
      tx.title,
      tx.amount,
      tx.type,
      tx.category,
      new Date(
        tx.date
      ).toLocaleDateString(),
      tx.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "prism-finance-report.csv"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =========================
  // GLOBAL UI STATE
  // =========================
  const sidebarOpen = useUIStore(
    (state) => state.sidebarOpen
  );

  const darkMode = useUIStore(
    (state) => state.darkMode
  );

  const toggleSidebar = useUIStore(
    (state) => state.toggleSidebar
  );

  const toggleDarkMode = useUIStore(
    (state) => state.toggleDarkMode
  );

  // =========================
  // THEME
  // =========================
  const bgClass = darkMode
    ? "bg-gradient-to-br from-black via-slate-900 to-cyan-950 text-white"
    : "bg-gray-100 text-gray-900";

  const sidebarClass = darkMode
    ? "bg-white/5 border-white/10 backdrop-blur-2xl"
    : "bg-white border-gray-200";

  const cardClass = darkMode
    ? `
      bg-white/5
      border
      border-white/10
      backdrop-blur-2xl
      shadow-[0_0_30px_rgba(0,255,255,0.05)]
    `
    : "bg-white border border-gray-200";

  // =========================
  // LOADING
  // =========================
  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${bgClass}`}
      >
        <div className="text-center">
          <div
            className="
              w-12
              h-12
              border-4
              border-cyan-400/20
              border-t-cyan-400
              rounded-full
              animate-spin
              mx-auto
              mb-4
            "
          />

          <p className="text-gray-400">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (isError) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${bgClass}`}
      >
        <div
          className="
            bg-red-500/10
            border
            border-red-500/20
            px-6
            py-4
            rounded-2xl
            text-red-300
          "
        >
          Failed to load reports
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        min-h-screen
        flex
        ${bgClass}
        transition-all
        duration-500
      `}
    >
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            md:hidden
          "
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-72
          transform
          transition-transform
          duration-300
          border-r
          ${sidebarClass}
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
        `}
      >
        {/* LOGO */}
        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-6
            border-b
            border-white/10
          "
        >
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Prism
            </h1>

            <p className="text-sm text-cyan-300">
              Finance Dashboard
            </p>
          </div>

          <button
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-8 px-4">
          <p
            className="
              text-xs
              uppercase
              tracking-widest
              text-gray-400
              px-4
              mb-4
            "
          >
            Navigation
          </p>

          <ul className="space-y-2">
            {SidebarData.map(
              (item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-2xl
                      text-gray-300
                      hover:bg-cyan-400/10
                      hover:text-cyan-300
                      transition-all
                      duration-300
                      group
                    "
                  >
                    <span
                      className="
                        group-hover:scale-110
                        transition
                      "
                    >
                      {item.icon}
                    </span>

                    <span className="font-medium">
                      {item.title}
                    </span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-72 p-4 sm:p-6 lg:p-10">
        {/* HEADER */}
        <header
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-6
            mb-10
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="
                md:hidden
                p-2
                rounded-xl
                bg-white/5
                border
                border-white/10
              "
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Reports & Analytics
              </h2>

              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Real financial insights from
                your saved transactions
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* DARK MODE */}
            <button
              onClick={toggleDarkMode}
              className="
                p-3
                rounded-2xl
                bg-white/5
                border
                border-white/10
                hover:bg-white/10
                transition
              "
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 text-cyan-300" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {/* NOTIFICATIONS */}
            <button
              className="
                relative
                p-3
                rounded-2xl
                bg-white/5
                border
                border-white/10
              "
            >
              <BellIcon className="w-5 h-5 text-cyan-300" />

              <span
                className="
                  absolute
                  top-2
                  right-2
                  w-2
                  h-2
                  bg-cyan-400
                  rounded-full
                "
              />
            </button>

            {/* PROFILE */}
            <button
              className="
                flex
                items-center
                gap-3
                px-3
                py-2
                rounded-2xl
                bg-white/5
                border
                border-white/10
              "
            >
              <UserCircleIcon className="w-8 h-8 text-cyan-300" />

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold">
                  {user?.firstName}{" "}
                  {user?.lastName}
                </p>

                <p className="text-xs text-gray-400">
                  Reports Dashboard
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* STATS */}
        <section
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >
          {/* INCOME */}
          <div
            className={`rounded-3xl p-6 ${cardClass}`}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-gray-400">
                  Total Income
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                  BWP{" "}
                  {Number(
                    totalIncome
                  ).toLocaleString()}
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-400/10">
                <ArrowTrendingUpIcon className="w-7 h-7 text-emerald-300" />
              </div>
            </div>

            <p className="text-sm text-emerald-300">
              {incomeTransactions} income
              transactions recorded
            </p>
          </div>

          {/* EXPENSES */}
          <div
            className={`rounded-3xl p-6 ${cardClass}`}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-gray-400">
                  Total Expenses
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                  BWP{" "}
                  {Number(
                    totalExpenses
                  ).toLocaleString()}
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-red-400/10">
                <ArrowTrendingDownIcon className="w-7 h-7 text-red-300" />
              </div>
            </div>

            <p className="text-sm text-red-300">
              {expenseTransactions} expense
              transactions tracked
            </p>
          </div>

          {/* BALANCE */}
          <div
            className={`rounded-3xl p-6 ${cardClass}`}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-gray-400">
                  Net Savings
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                  BWP{" "}
                  {Number(
                    totalBalance
                  ).toLocaleString()}
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-400/10">
                <WalletIcon className="w-7 h-7 text-cyan-300" />
              </div>
            </div>

            <p className="text-sm text-cyan-300">
              Current available balance
            </p>
          </div>

          {/* SAVINGS RATE */}
          <div
            className={`rounded-3xl p-6 ${cardClass}`}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-gray-400">
                  Savings Rate
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                  {savingsRate}%
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-yellow-400/10">
                <CurrencyDollarIcon className="w-7 h-7 text-yellow-300" />
              </div>
            </div>

            <p className="text-sm text-yellow-300">
              Based on total income vs
              expenses
            </p>
          </div>
        </section>

        {/* REPORT TOOLS */}
        <section
          className={`rounded-3xl p-6 mt-8 ${cardClass}`}
        >
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-5
            "
          >
            <div>
              <h3 className="text-xl font-semibold">
                Export Financial Report
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                Download CSV for Excel,
                Power BI, Tableau, or
                business analytics demos
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-3
                  rounded-2xl
                  bg-white/5
                  border
                  border-white/10
                "
              >
                <CalendarDaysIcon className="w-5 h-5" />

                <span className="text-sm">
                  Live Transaction Data
                </span>
              </div>

              <button
                onClick={exportCSV}
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  bg-cyan-400
                  hover:bg-cyan-300
                  text-black
                  font-semibold
                  transition
                "
              >
                <DocumentArrowDownIcon className="w-5 h-5" />

                Export CSV
              </button>
            </div>
          </div>
        </section>

        {/* CHARTS */}
        <section
          className="
            grid
            grid-cols-1
            xl:grid-cols-3
            gap-6
            mt-8
          "
        >
          {/* MAIN BAR CHART */}
          <div
            className={`
              xl:col-span-2
              rounded-3xl
              p-6
              ${cardClass}
            `}
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <ChartBarIcon className="w-6 h-6 text-cyan-300" />

                <h3 className="text-xl font-semibold">
                  Monthly Income vs Expenses
                </h3>
              </div>

              <p className="text-sm text-gray-400">
                Compare monthly cash inflow
                and spending activity from
                your stored transactions
              </p>
            </div>

            <div className="h-[350px] sm:h-[400px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="income"
                    fill="#22C55E"
                    radius={[8, 8, 0, 0]}
                  />

                  <Bar
                    dataKey="expense"
                    fill="#F43F5E"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className="
                mt-6
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-4
              "
            >
              <div className="rounded-2xl bg-emerald-400/10 p-4 border border-emerald-400/10">
                <p className="text-sm text-gray-400">
                  Highest Income
                </p>

                <h4 className="text-xl font-bold text-emerald-300 mt-2">
                  BWP{" "}
                  {Math.max(
                    ...monthlyData.map(
                      (m) => m.income || 0
                    ),
                    0
                  ).toLocaleString()}
                </h4>
              </div>

              <div className="rounded-2xl bg-red-400/10 p-4 border border-red-400/10">
                <p className="text-sm text-gray-400">
                  Highest Expense
                </p>

                <h4 className="text-xl font-bold text-red-300 mt-2">
                  BWP{" "}
                  {Math.max(
                    ...monthlyData.map(
                      (m) => m.expense || 0
                    ),
                    0
                  ).toLocaleString()}
                </h4>
              </div>

              <div className="rounded-2xl bg-cyan-400/10 p-4 border border-cyan-400/10">
                <p className="text-sm text-gray-400">
                  Total Transactions
                </p>

                <h4 className="text-xl font-bold text-cyan-300 mt-2">
                  {totalTransactions}
                </h4>
              </div>
            </div>
          </div>

          {/* PIE CHART */}
          <div
            className={`rounded-3xl p-6 ${cardClass}`}
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <BanknotesIcon className="w-6 h-6 text-cyan-300" />

                <h3 className="text-xl font-semibold">
                  Spending Breakdown
                </h3>
              </div>

              <p className="text-sm text-gray-400">
                Expense distribution by
                transaction category
              </p>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={95}
                    label
                  >
                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* CATEGORY LEGEND */}
            <div className="space-y-3 mt-6">
              {categoryData.length > 0 ? (
                categoryData.map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS[
                                idx %
                                  COLORS.length
                              ],
                          }}
                        />

                        <span className="text-sm">
                          {item.name}
                        </span>
                      </div>

                      <span className="text-sm text-gray-400">
                        BWP{" "}
                        {Number(
                          item.value
                        ).toLocaleString()}
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="text-center text-gray-500 py-10">
                  No expense data available
                </div>
              )}
            </div>
          </div>
        </section>

        {/* INSIGHTS */}
        <section
          className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-6
            mt-8
          "
        >
          {/* SAVINGS */}
          <div
            className={`rounded-3xl p-6 ${cardClass}`}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 rounded-2xl bg-cyan-400/10">
                <WalletIcon className="w-7 h-7 text-cyan-300" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Savings Performance
                </h3>

                <p className="text-sm text-gray-400">
                  Financial efficiency
                </p>
              </div>
            </div>

            <h2 className="text-5xl font-bold text-cyan-300">
              {savingsRate}%
            </h2>

            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Your current savings rate is
              calculated using total income
              minus expenses from your
              stored transactions.
            </p>
          </div>

          {/* TOP CATEGORY */}
          <div
            className={`rounded-3xl p-6 ${cardClass}`}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 rounded-2xl bg-red-400/10">
                <ChartBarIcon className="w-7 h-7 text-red-300" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Highest Expense Category
                </h3>

                <p className="text-sm text-gray-400">
                  Most expensive category
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold">
              {topExpenseCategory?.name ||
                "No Expenses"}
            </h2>

            <p className="text-sm text-gray-400 mt-4">
              BWP{" "}
              {Number(
                topExpenseCategory?.value ||
                  0
              ).toLocaleString()}{" "}
              spent in this category.
            </p>
          </div>

          {/* SUMMARY */}
          <div
            className={`rounded-3xl p-6 ${cardClass}`}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 rounded-2xl bg-emerald-400/10">
                <CurrencyDollarIcon className="w-7 h-7 text-emerald-300" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Financial Summary
                </h3>

                <p className="text-sm text-gray-400">
                  Database-driven analytics
                </p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Your reports are generated
              directly from 
              transactions associated with
              your authenticated account.
              Exported CSV files can be used
              directly in Power BI for
              dashboards, visualizations,
              and demonstrations.
            </p>
          </div>
        </section>
      </main>

      <ToastContainer />
    </div>
  );
};

export default Reports;