import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../hooks/useAuth.jsx";
import useTransactions from "../hooks/useTransactions.jsx";

import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  WalletIcon,
  ChartBarIcon,
  BanknotesIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { SidebarData } from "../DBfunctions/SideBar.jsx";

import {
  calculateTotals,
  generateMonthlyData,
} from "../utils/transactionAnalytics";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(() => {
      try {
        return (
          localStorage.getItem(
            "prism-dark"
          ) === "true"
        );
      } catch {
        return true;
      }
    });

  // =========================
  // TRANSACTIONS
  // =========================
  const {
    data: transactions = [],
    isLoading,
  } = useTransactions();

  // =========================
  // ANALYTICS
  // =========================
  const analytics =
    calculateTotals(transactions);

  const totalIncome =
    analytics?.totalIncome || 0;

  const totalExpenses =
    analytics?.totalExpenses || 0;

  const totalBalance =
    analytics?.totalBalance || 0;

  const monthlyData =
    generateMonthlyData(transactions);

  // =========================
  // RECENT TRANSACTIONS
  // =========================
  const recentTransactions =
    [...transactions]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 5);

  // =========================
  // SAVE THEME
  // =========================
  useEffect(() => {
    try {
      localStorage.setItem(
        "prism-dark",
        darkMode ? "true" : "false"
      );
    } catch (error) {
      console.error(
        "Failed to save dark mode preference:",
        error
      );
    }
  }, [darkMode]);

  const toggleSidebar = () =>
    setSidebarOpen(!sidebarOpen);

  const toggleDarkMode = () =>
    setDarkMode((prev) => !prev);

  // =========================
  // THEME CLASSES
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

  const { user } = useAuth();

  return (
    <div
      className={`min-h-screen flex ${bgClass} transition-all duration-500`}
    >
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
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
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
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
          <p className="text-xs uppercase tracking-widest text-gray-400 px-4 mb-4">
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
                    <span className="group-hover:scale-110 transition">
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

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-72 p-4 sm:p-6 lg:p-10">
        {/* TOPBAR */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* MOBILE MENU */}
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
              <Bars3Icon className="w-6 h-6 text-white" />
            </button>

            {/* TITLE */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Dashboard
              </h2>

              <p className="text-gray-400 mt-1">
                Welcome back to Prism
                Finance
              </p>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
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
                hover:bg-white/10
                transition
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

            {/* USER */}
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
                hover:bg-white/10
                transition
              "
            >
              <UserCircleIcon className="w-8 h-8 text-cyan-300" />

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold">
                  Welcome Back,{" "}
                  {user?.firstName}
                </p>

                <p className="text-xs text-gray-400">
                  {user?.firstName}{" "}
                  {user?.lastName}
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* BALANCE */}
          <div
            className={`
              rounded-3xl
              p-6
              ${cardClass}
            `}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400">
                  Total Balance
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  BWP{" "}
                  {Number(
                    totalBalance
                  ).toLocaleString()}
                </h3>
              </div>

              <div
                className="
                  p-4
                  rounded-2xl
                  bg-cyan-400/10
                "
              >
                <WalletIcon className="w-7 h-7 text-cyan-300" />
              </div>
            </div>

            <p className="text-sm text-cyan-300">
              Current financial standing
            </p>
          </div>

          {/* INCOME */}
          <div
            className={`
              rounded-3xl
              p-6
              ${cardClass}
            `}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400">
                  Income
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  BWP{" "}
                  {Number(
                    totalIncome
                  ).toLocaleString()}
                </h3>
              </div>

              <div
                className="
                  p-4
                  rounded-2xl
                  bg-emerald-400/10
                "
              >
                <ArrowTrendingUpIcon className="w-7 h-7 text-emerald-300" />
              </div>
            </div>

            <p className="text-sm text-emerald-300">
              Total earnings tracked
            </p>
          </div>

          {/* EXPENSES */}
          <div
            className={`
              rounded-3xl
              p-6
              ${cardClass}
            `}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400">
                  Expenses
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  BWP{" "}
                  {Number(
                    totalExpenses
                  ).toLocaleString()}
                </h3>
              </div>

              <div
                className="
                  p-4
                  rounded-2xl
                  bg-red-400/10
                "
              >
                <ArrowTrendingDownIcon className="w-7 h-7 text-red-300" />
              </div>
            </div>

            <p className="text-sm text-red-300">
              Total spending tracked
            </p>
          </div>
        </section>

        {/* LOWER GRID */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          {/* RECENT TRANSACTIONS */}
          <div
            className={`
              xl:col-span-2
              rounded-3xl
              p-6
              ${cardClass}
            `}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">
                  Recent Transactions
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Your latest financial
                  activity
                </p>
              </div>

              <button
                className="
                  text-sm
                  text-cyan-300
                  hover:text-cyan-200
                  transition
                "
              >
                View All
              </button>
            </div>

            {/* TRANSACTION ITEMS */}
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-400">
                  Loading transactions...
                </p>
              ) : recentTransactions.length >
                0 ? (
                recentTransactions.map(
                  (tx) => (
                    <div
                      key={tx._id}
                      className="
                      flex
                      items-center
                      justify-between
                      p-4
                      rounded-2xl
                      bg-white/5
                      border
                      border-white/5
                      hover:bg-white/10
                      transition
                    "
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                          p-3
                          rounded-2xl
                          ${
                            tx.type ===
                            "income"
                              ? "bg-emerald-400/10"
                              : "bg-red-400/10"
                          }
                        `}
                        >
                          {tx.type ===
                          "income" ? (
                            <BanknotesIcon className="w-5 h-5 text-emerald-300" />
                          ) : (
                            <WalletIcon className="w-5 h-5 text-red-300" />
                          )}
                        </div>

                        <div>
                          <p className="font-medium">
                            {tx.title}
                          </p>

                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-sm text-gray-400">
                              {tx.category ||
                                "General"}
                            </span>

                            <span className="text-xs text-gray-500">
                              •
                            </span>

                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarDaysIcon className="w-4 h-4" />
                              {new Date(
                                tx.date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p
                        className={`font-semibold text-sm sm:text-base ${
                          tx.type ===
                          "income"
                            ? "text-emerald-300"
                            : "text-red-300"
                        }`}
                      >
                        {tx.type ===
                        "income"
                          ? "+"
                          : "-"}{" "}
                        BWP{" "}
                        {Number(
                          tx.amount
                        ).toLocaleString()}
                      </p>
                    </div>
                  )
                )
              ) : (
                <div
                  className="
                    h-[250px]
                    rounded-3xl
                    border
                    border-dashed
                    border-white/10
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    bg-white/5
                  "
                >
                  <WalletIcon className="w-14 h-14 text-gray-500 mb-4" />

                  <h3 className="text-lg font-semibold">
                    No Transactions Yet
                  </h3>

                  <p className="text-sm text-gray-400 mt-2">
                    Start tracking your
                    finances
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FINANCIAL OVERVIEW */}
          <div
            className={`
              rounded-3xl
              p-6
              ${cardClass}
            `}
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <ChartBarIcon className="w-6 h-6 text-cyan-300" />

                <h3 className="text-xl font-semibold">
                  Financial Overview
                </h3>
              </div>

              <p className="text-sm text-gray-400 mt-1">
                Monthly income vs
                expenses
              </p>
            </div>

            {/* CHART */}
            <div className="h-[320px]">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={monthlyData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="month"
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="income"
                      fill="#22C55E"
                      radius={[
                        8, 8, 0, 0,
                      ]}
                    />

                    <Bar
                      dataKey="expense"
                      fill="#F43F5E"
                      radius={[
                        8, 8, 0, 0,
                      ]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  className="
                    h-full
                    rounded-3xl
                    border
                    border-dashed
                    border-white/10
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    text-gray-500
                    bg-white/5
                    p-6
                  "
                >
                  <ChartBarIcon className="w-14 h-14 mb-4" />

                  <h3 className="text-lg font-semibold">
                    No Analytics Yet
                  </h3>

                  <p className="text-sm mt-2">
                    Add transactions to
                    generate financial
                    insights
                  </p>
                </div>
              )}
            </div>

            {/* OVERVIEW STATS */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-400">
                  Transactions
                </p>

                <h4 className="text-2xl font-bold mt-2">
                  {transactions.length}
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-400">
                  Savings
                </p>

                <h4 className="text-2xl font-bold mt-2 text-cyan-300">
                  {totalIncome > 0
                    ? `${(
                        (totalBalance /
                          totalIncome) *
                        100
                      ).toFixed(1)}%`
                    : "0%"}
                </h4>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;