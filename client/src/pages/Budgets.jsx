import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  Bars3Icon,
  XMarkIcon,
  BanknotesIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

import { SidebarData } from "../DBfunctions/SideBar.jsx";
import useUIStore from "../store/uiStore";
import useBudgets from "../hooks/useBudgets";
import useCreateBudget from "../hooks/useCreateBudget";
import useUpdateBudget from "../hooks/useUpdateBudget";
import useDeleteBudget from "../hooks/useDeleteBudget";

// ── CHANGED: import from shared constants instead of defining locally ──
import { CATEGORIES } from "../utils/categories";

const Budgets = () => {
  // =====================================
  // SERVER DATA
  // =====================================
  const { data: budgets, isLoading } = useBudgets();
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();

  // =====================================
  // GLOBAL UI
  // =====================================
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const darkMode = useUIStore((state) => state.darkMode);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);

  // =====================================
  // LOCAL STATE
  // =====================================
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({ category: "Food", limit: "" });

  // =====================================
  // HANDLERS
  // =====================================
  const handleCreate = async () => {
    if (!formData.limit || isNaN(formData.limit) || Number(formData.limit) <= 0) {
      return;
    }
    try {
      await createBudgetMutation.mutateAsync({
        category: formData.category,
        limit: Number(formData.limit),
      });
      setFormData({ category: "Food", limit: "" });
      setShowForm(false);
    } catch {}
  };

  const handleUpdate = async () => {
    if (!formData.limit || isNaN(formData.limit) || Number(formData.limit) <= 0) {
      return;
    }
    try {
      await updateBudgetMutation.mutateAsync({
        id: editingBudget._id,
        limit: Number(formData.limit),
      });
      setEditingBudget(null);
      setFormData({ category: "Food", limit: "" });
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudgetMutation.mutateAsync(id);
    } catch {}
  };

  const openEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({ category: budget.category, limit: budget.limit });
    setShowForm(false);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBudget(null);
    setFormData({ category: "Food", limit: "" });
  };

  // =====================================
  // THEME
  // =====================================
  const bgClass = darkMode
    ? "bg-[#06141f] text-white"
    : "bg-[#f3f8fb] text-gray-900";

  const sidebarBg = darkMode
    ? "bg-white/5 border-white/10"
    : "bg-white border-gray-200";

  const glassCard = darkMode
    ? "bg-white/5 border border-white/10"
    : "bg-white border border-gray-200";

  const mutedText = darkMode ? "text-gray-400" : "text-gray-500";

  const inputClass = `
    w-full px-4 py-3 rounded-2xl
    bg-white/5 border border-white/10
    focus:outline-none focus:ring-2
    focus:ring-cyan-400
    transition-all duration-300
  `;

  // =====================================
  // LOADING
  // =====================================
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
        <div className="w-14 h-14 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  // =====================================
  // HELPERS
  // =====================================
  const getBarColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 50) return "bg-yellow-400";
    return "bg-cyan-400";
  };

  const getTextColor = (percentage) => {
    if (percentage >= 100) return "text-red-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-cyan-400";
  };

  return (
    <div className={`min-h-screen flex transition-all duration-300 ${bgClass}`}>

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
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          backdrop-blur-2xl border-r
          ${sidebarBg}
        `}
      >
        {/* LOGO */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Prism Finance</h1>
            <p className={`text-sm mt-1 ${mutedText}`}>Personal finance workspace</p>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="px-4 py-6 space-y-2">
          {SidebarData.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-cyan-400/10 hover:text-cyan-300 transition-all duration-300"
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* MOBILE MENU */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-5 left-5 z-40 p-2 rounded-xl bg-white/10 backdrop-blur-xl"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* MAIN */}
      <main className="flex-1 md:ml-72 p-6 lg:p-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Budgets</h1>
            <p className={`mt-2 ${mutedText}`}>
              Track your spending limits for this month
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-2xl bg-cyan-400/10"
            >
              <MoonIcon className="w-5 h-5 text-cyan-300" />
            </button>

            <button
              onClick={() => {
                setShowForm(true);
                setEditingBudget(null);
                setFormData({ category: "Food", limit: "" });
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-400 text-black font-semibold"
            >
              <PlusIcon className="w-5 h-5" />
              Add Budget
            </button>
          </div>
        </div>

        {/* CREATE FORM */}
        {showForm && (
          <div className={`mt-8 rounded-3xl p-6 ${glassCard}`}>
            <h2 className="text-xl font-bold mb-6">New Budget</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`text-sm mb-2 block ${mutedText}`}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className={inputClass}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`text-sm mb-2 block ${mutedText}`}>Monthly Limit (BWP)</label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={formData.limit}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, limit: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreate}
                disabled={createBudgetMutation.isPending}
                className="px-6 py-3 rounded-2xl bg-cyan-400 text-black font-semibold disabled:opacity-60"
              >
                {createBudgetMutation.isPending ? "Creating..." : "Create Budget"}
              </button>
              <button
                onClick={closeForm}
                className={`px-6 py-3 rounded-2xl border border-white/10 ${mutedText}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* EDIT FORM */}
        {editingBudget && (
          <div className={`mt-8 rounded-3xl p-6 ${glassCard}`}>
            <h2 className="text-xl font-bold mb-6 color-black">
              Edit Budget — {editingBudget.category}
            </h2>
            <div className="max-w-sm">
              <label className={`text-sm mb-2 block ${mutedText}`}>New Limit (BWP)</label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={formData.limit}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, limit: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdate}
                disabled={updateBudgetMutation.isPending}
                className="px-6 py-3 rounded-2xl bg-cyan-400 text-black font-semibold disabled:opacity-60"
              >
                {updateBudgetMutation.isPending ? "Updating..." : "Update Budget"}
              </button>
              <button
                onClick={closeForm}
                className={`px-6 py-3 rounded-2xl border border-white/10 ${mutedText}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* BUDGET LIST */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          {budgets?.length === 0 && (
            <div className={`col-span-2 rounded-3xl p-10 text-center ${glassCard}`}>
              <BanknotesIcon className="w-12 h-12 text-cyan-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No budgets yet</h2>
              <p className={mutedText}>
                Click "Add Budget" to set your first spending limit.
              </p>
            </div>
          )}

          {budgets?.map((budget) => (
            <div key={budget._id} className={`rounded-3xl p-6 ${glassCard}`}>

              {/* BUDGET HEADER */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{budget.category}</h3>
                  <p className={`text-sm mt-1 ${mutedText}`}>
                    BWP {Number(budget.spent).toLocaleString()} of BWP {Number(budget.limit).toLocaleString()} spent
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(budget)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-400/10 hover:text-cyan-300 transition"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    disabled={deleteBudgetMutation.isPending}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-400/10 hover:text-red-400 transition"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="w-full bg-white/10 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getBarColor(budget.percentage)}`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>

              {/* PERCENTAGE + REMAINING */}
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${getTextColor(budget.percentage)}`}>
                  {budget.percentage}% used
                </span>
                <span className={`text-sm ${mutedText}`}>
                  {budget.percentage >= 100
                    ? "Budget exceeded"
                    : `BWP ${Number(budget.remaining).toLocaleString()} remaining`}
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>

      <ToastContainer />
    </div>
  );
};

export default Budgets;