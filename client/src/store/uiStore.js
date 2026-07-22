import { create } from "zustand";

/**
 * GLOBAL UI STORE
 * Used across:
 * - Transactions page
 * - Dashboard page
 * - Reports page
 * - Future components (Navbar, Sidebar, etc.)
 */
const useUIStore = create((set) => ({
  // =========================
  // SIDEBAR STATE (GLOBAL)
  // =========================
  sidebarOpen: false,

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  openSidebar: () => set({ sidebarOpen: true }),

  closeSidebar: () => set({ sidebarOpen: false }),

  // =========================
  // DARK MODE STATE (GLOBAL)
  // =========================
  darkMode: (() => {
    try {
      return localStorage.getItem("prism-dark") === "true";
    } catch {
      return false;
    }
  })(),

  toggleDarkMode: () =>
    set((state) => {
      const newValue = !state.darkMode;

      // persist globally once (no repeated useEffect needed anywhere)
      try {
        localStorage.setItem("prism-dark", newValue ? "true" : "false");
      } catch (err) {
        console.error("Theme save failed:", err);
      }

      return { darkMode: newValue };
    }),

  setDarkMode: (value) => {
    try {
      localStorage.setItem("prism-dark", value ? "true" : "false");
    } catch (err) {
      console.error("Theme save failed:", err);
    }

    set({ darkMode: value });
  },
}));

export default useUIStore;