import { useState } from "react";
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
  WalletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { SidebarData } from "../DBfunctions/SideBar.jsx";
import useTransactions from "../hooks/useTransactions.jsx";
import useCreateTransaction from "../hooks/useCreateTransaction.jsx";
import useUIStore from "../store/uiStore";
import {
  calculateTotals,
  generateMonthlyData,
  generateCategoryData,
} from "../utils/transactionAnalytics";

// ── CHANGED: import from shared constants ──
import { CATEGORIES } from "../utils/categories";

// =======================================
// COMPONENT
// =======================================
const Transactions = () => {

  // =======================================
  // SERVER STATE
  // =======================================
  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useTransactions();

  const createTransactionMutation = useCreateTransaction();

  // =======================================
  // GLOBAL UI STATE
  // =======================================
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const darkMode = useUIStore((state) => state.darkMode);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);

  // =======================================
  // LOCAL FORM STATE
  // =======================================
  const [showForm, setShowForm] = useState(false);

  // ── CHANGED: category defaults to "Food", not empty string ──
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: "",
    notes: "",
  });

  // =======================================
  // THEME CLASSES
  // =======================================
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

  const inputClass = darkMode
    ? `
      w-full px-4 py-3 rounded-2xl
      bg-white/5 border border-white/10
      text-white placeholder:text-gray-500
      focus:outline-none focus:ring-2 focus:ring-cyan-400
    `
    : `
      w-full px-4 py-3 rounded-2xl
      border border-gray-300 bg-white
      focus:outline-none focus:ring-2 focus:ring-cyan-500
    `;

  // =======================================
  // ANALYTICS
  // =======================================
  const analytics = calculateTotals(transactions);
  const totalIncome = analytics?.totalIncome || 0;
  const totalExpenses = analytics?.totalExpenses || 0;
  const totalBalance = analytics?.totalBalance || 0;
  const monthlyChartData = generateMonthlyData(transactions);
  const categoryChartData = generateCategoryData(transactions);

  // =======================================
  // FORM HANDLERS
  // =======================================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "amount"
          ? Number(e.target.value)
          : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      date: formData.date ? new Date(formData.date) : new Date(),
      category: formData.category || "Food",
      notes: formData.notes || "",
    };

    await createTransactionMutation.mutateAsync(payload);

    // ── CHANGED: reset category to "Food" not empty string ──
    setFormData({
      title: "",
      amount: "",
      type: "expense",
      category: "Food",
      date: "",
      notes: "",
    });

    setShowForm(false);
  };

  const { user } = useAuth();

  // =======================================
  // LOADING
  // =======================================
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  // =======================================
  // ERROR
  // =======================================
  if (isError) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
        <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-2xl text-red-300">
          Failed to load transactions
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${bgClass} transition-all duration-500`}>

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
          fixed inset-y-0 left-0 z-50 w-72
          transform transition-transform duration-300
          border-r ${sidebarClass}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Prism</h1>
            <p className="text-sm text-cyan-300">Finance Dashboard</p>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-8 px-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 px-4 mb-4">
            Navigation
          </p>
          <ul className="space-y-2">
            {SidebarData.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-300 transition-all duration-300 group"
                >
                  <span className="group-hover:scale-110 transition">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-72 p-6 lg:p-10">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-10">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10"
            >
              <Bars3Icon className="w-6 h-6 text-white" />
            </button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
              <p className="text-gray-400 mt-1">Track and manage your financial activity</p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 text-cyan-300" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            <button className="relative p-3 rounded-2xl bg-white/5 border border-white/10">
              <BellIcon className="w-5 h-5 text-cyan-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full" />
            </button>

            <button className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 border border-white/10">
              <UserCircleIcon className="w-8 h-8 text-cyan-300" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-400">Personal Account</p>
              </div>
            </button>
          </div>
        </header>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* BALANCE */}
          <div className={`rounded-3xl p-6 ${cardClass}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400">Total Balance</p>
                <h3 className="text-3xl font-bold mt-2">BWP {Number(totalBalance).toLocaleString()}</h3>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-400/10">
                <WalletIcon className="w-7 h-7 text-cyan-300" />
              </div>
            </div>
            <p className="text-sm text-cyan-300">Updated from transactions</p>
          </div>

          {/* INCOME */}
          <div className={`rounded-3xl p-6 ${cardClass}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400">Income</p>
                <h3 className="text-3xl font-bold mt-2">BWP {Number(totalIncome).toLocaleString()}</h3>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-400/10">
                <ArrowTrendingUpIcon className="w-7 h-7 text-emerald-300" />
              </div>
            </div>
            <p className="text-sm text-emerald-300">Positive cash flow</p>
          </div>

          {/* EXPENSES */}
          <div className={`rounded-3xl p-6 ${cardClass}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400">Expenses</p>
                <h3 className="text-3xl font-bold mt-2">BWP {Number(totalExpenses).toLocaleString()}</h3>
              </div>
              <div className="p-4 rounded-2xl bg-red-400/10">
                <ArrowTrendingDownIcon className="w-7 h-7 text-red-300" />
              </div>
            </div>
            <p className="text-sm text-red-300">Spending overview</p>
          </div>
        </section>

        {/* LOWER SECTION */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

          {/* TRANSACTIONS */}
          <div className={`xl:col-span-2 rounded-3xl p-6 ${cardClass}`}>

            {/* TOP */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Recent Transactions</h3>
                <p className="text-sm text-gray-400 mt-1">Your latest financial activity</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                  <FunnelIcon className="w-4 h-4" />
                  <span className="text-sm">Filter</span>
                </button>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold transition"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span className="text-sm">Add</span>
                </button>
              </div>
            </div>

            {/* FORM */}
            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>

                {/* ── CHANGED: category is now a dropdown ── */}
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={inputClass}
                />

                <textarea
                  name="notes"
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={`${inputClass} md:col-span-2`}
                  rows="4"
                />

                <button
                  type="submit"
                  disabled={createTransactionMutation.isPending}
                  className="md:col-span-2 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold transition"
                >
                  {createTransactionMutation.isPending ? "Adding..." : "Create Transaction"}
                </button>
              </form>
            )}

            {/* TRANSACTION LIST */}
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${tx.type === "income" ? "bg-emerald-400/10" : "bg-red-400/10"}`}>
                        {tx.type === "income" ? (
                          <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-300" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-5 h-5 text-red-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">
                            {tx.category || "General"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {tx?.date ? new Date(tx.date).toLocaleDateString() : "No Date"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AMOUNT */}
                    <div>
                      <p className={`font-semibold ${tx.type === "income" ? "text-emerald-300" : "text-red-300"}`}>
                        {tx.type === "income" ? "+" : "-"} BWP {Number(tx?.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                  <WalletIcon className="w-14 h-14 text-gray-500 mb-4" />
                  <h3 className="text-lg font-semibold">No Transactions Yet</h3>
                  <p className="text-sm text-gray-400 mt-2">Start tracking your finances</p>
                </div>
              )}
            </div>
          </div>

          {/* OVERVIEW */}
          <div className={`rounded-3xl p-6 ${cardClass}`}>
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Financial Overview</h3>
              <p className="text-sm text-gray-400 mt-1">Monthly analytics and spending insights</p>
            </div>
            <div className="h-[350px] rounded-3xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center text-gray-500">
              Chart Component Here
            </div>
          </div>
        </section>
      </main>

      <ToastContainer />
    </div>
  );
};

export default Transactions;