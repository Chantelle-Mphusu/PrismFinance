import { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
 UserCircleIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

import { SidebarData } from "../DBfunctions/SideBar.jsx";

import useUIStore from "../store/uiStore";

import useSettings from "../hooks/useSettings";
import useUpdateSettings from "../hooks/useUpdateSettings";
import useChangePassword from "../hooks/useChangePassword";

// =====================================
// FORM DATA FACTORY
// =====================================
const createFormData = (settingsData) => ({
  firstName: settingsData?.firstName || "",
  lastName: settingsData?.lastName || "",
  email: settingsData?.email || "",
  currency: settingsData?.settings?.currency || "BWP",
  language: settingsData?.settings?.language || "English",
  notifications: settingsData?.settings?.notifications || {
    budgetAlerts: true,
    weeklyReports: true,
    transactionNotifications: true,
    securityUpdates: true,
  },
  twoFactorEnabled: settingsData?.settings?.twoFactorEnabled || false,
});

const Settings = () => {
  // =====================================
  // SERVER DATA
  // =====================================
  const { data, isLoading } =
    useSettings();

  const updateSettingsMutation =
    useUpdateSettings();

  const changePasswordMutation =
    useChangePassword();

  // =====================================
  // GLOBAL UI
  // =====================================
  const sidebarOpen = useUIStore(
    (state) => state.sidebarOpen
  );

  const darkMode = useUIStore(
    (state) => state.darkMode
  );

  const toggleSidebar =
    useUIStore(
      (state) =>
        state.toggleSidebar
    );

  const toggleDarkMode =
    useUIStore(
      (state) =>
        state.toggleDarkMode
    );

  // =====================================
  // LOCAL STATE
  // =====================================

//  Initialize directly from data using lazy initializer — avoids the
//    useEffect + setFormData cascade entirely on mount.
const [formData, setFormData] = useState(() => createFormData());

const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
});

// Sync once when server data first arrives.
//    Using a ref instead of state for the flag eliminates
//    the extra render that `setIsInitialized(true)` caused.
const isInitialized = useRef(false);

useEffect(() => {
  if (data && !isInitialized.current) {
    setFormData(createFormData(data));
    isInitialized.current = true; //  Mutating ref = no re-render
  }
}, [data]);

  // =====================================
  // HANDLERS
  // =====================================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,

      [e.target.name]:
        e.target.value,
    }));
  };

  const toggleNotification = (
    key
  ) => {
    setFormData((prev) => ({
      ...prev,

      notifications: {
        ...prev.notifications,

        [key]:
          !prev.notifications[
            key
          ],
      },
    }));
  };

 
const handleSave = async () => {
  try {
    const updated = await updateSettingsMutation.mutateAsync(formData);
    setFormData(createFormData(updated.user));
  } catch {
    // onError in useUpdateSettings handles the toast
  }
};

  const handlePasswordChange = async () => {
  if (!passwordData.currentPassword || !passwordData.newPassword) {
    toast.error("Please fill in both password fields");
    return;
  }
  if (passwordData.newPassword.length < 6) {
    toast.error("New password must be at least 6 characters");
    return;
  }
  await changePasswordMutation.mutateAsync(passwordData);
  setPasswordData({ currentPassword: "", newPassword: "" });
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

  const mutedText = darkMode
    ? "text-gray-400"
    : "text-gray-500";

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
    <div
      className={`min-h-screen flex items-center justify-center ${bgClass}`}
    >
      <div
        className="
          w-14 h-14
          border-4
          border-cyan-400/20
          border-t-cyan-400
          rounded-full
          animate-spin
        "
      />
    </div>
  );
}

  return (
    <div
      className={`min-h-screen flex transition-all duration-300 ${bgClass}`}
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
          fixed inset-y-0 left-0 z-50 w-72
          transform transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
          backdrop-blur-2xl
          border-r
          ${sidebarBg}
        `}
      >
        {/* LOGO */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Prism Finance
            </h1>

            <p
              className={`text-sm mt-1 ${mutedText}`}
            >
              Personal finance
              workspace
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
        <nav className="px-4 py-6 space-y-2">
          {SidebarData.map(
            (item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="
                  flex items-center gap-3
                  px-4 py-3 rounded-2xl
                  hover:bg-cyan-400/10
                  hover:text-cyan-300
                  transition-all duration-300
                "
              >
                {item.icon}

                <span>
                  {item.title}
                </span>
              </Link>
            )
          )}
        </nav>
      </aside>

      {/* MOBILE MENU */}
      <button
        onClick={toggleSidebar}
        className="
          md:hidden fixed top-5 left-5 z-40
          p-2 rounded-xl
          bg-white/10 backdrop-blur-xl
        "
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* MAIN */}
      <main className="flex-1 md:ml-72 p-6 lg:p-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Settings
            </h1>

            <p
              className={`mt-2 ${mutedText}`}
            >
              Customize your Prism
              Finance experience
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {/* DARK MODE */}
            <button
              onClick={toggleDarkMode}
              className="
                p-3 rounded-2xl
                bg-cyan-400/10
              "
            >
              <MoonIcon className="w-5 h-5 text-cyan-300" />
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
                  absolute top-2 right-2
                  w-2 h-2 rounded-full
                  bg-cyan-400
                "
              />
            </button>

            {/* SAVE */}
            <button
              onClick={handleSave}
              disabled={
                updateSettingsMutation.isPending
              }
              className="
                px-5 py-3 rounded-2xl
                bg-cyan-400 text-black
                font-semibold
              "
            >
              {updateSettingsMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>

        {/* GRID */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
          {/* PROFILE */}
          <div
            className={`rounded-3xl p-6 ${glassCard}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <UserCircleIcon className="w-6 h-6 text-cyan-300" />

              <h2 className="text-xl font-bold">
                Profile Settings
              </h2>
            </div>

            <div className="space-y-5">
              <input
                type="text"
                name="firstName"
                value={
                  formData.firstName
                }
                onChange={handleChange}
                placeholder="First Name"
                className={inputClass}
              />

              <input
                type="text"
                name="lastName"
                value={
                  formData.lastName
                }
                onChange={handleChange}
                placeholder="Last Name"
                className={inputClass}
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={inputClass}
              />
            </div>
          </div>

          {/* APPEARANCE */}
          <div
            className={`rounded-3xl p-6 ${glassCard}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <PaintBrushIcon className="w-6 h-6 text-cyan-300" />

              <h2 className="text-xl font-bold">
                Appearance
              </h2>
            </div>

            <div className="space-y-5">
              {/* DARK MODE */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <MoonIcon className="w-5 h-5 text-cyan-300" />

                  <div>
                    <h3 className="font-semibold">
                      Dark Mode
                    </h3>

                    <p
                      className={`text-sm ${mutedText}`}
                    >
                      Switch app theme
                    </p>
                  </div>
                </div>

                <button
                  onClick={
                    toggleDarkMode
                  }
                  className={`w-14 h-8 rounded-full relative ${
                    darkMode
                      ? "bg-cyan-400"
                      : "bg-gray-500"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-all ${
                      darkMode
                        ? "translate-x-6"
                        : ""
                    }`}
                  />
                </button>
              </div>

              {/* LANGUAGE */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <GlobeAltIcon className="w-5 h-5 text-cyan-300" />

                  <h3 className="font-semibold">
                    Language
                  </h3>
                </div>

                <select
                  name="language"
                  value={
                    formData.language
                  }
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="English">
                    English
                  </option>

                  <option value="Setswana">
                    Setswana
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* SECURITY */}
          <div
            className={`rounded-3xl p-6 ${glassCard}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheckIcon className="w-6 h-6 text-cyan-300" />

              <h2 className="text-xl font-bold">
                Security
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={
                  passwordData.currentPassword
                }
                onChange={(e) =>
                  setPasswordData(
                    (prev) => ({
                      ...prev,
                      currentPassword:
                        e.target.value,
                    })
                  )
                }
                className={inputClass}
              />

              <input
                type="password"
                placeholder="New Password"
                value={
                  passwordData.newPassword
                }
                onChange={(e) =>
                  setPasswordData(
                    (prev) => ({
                      ...prev,
                      newPassword:
                        e.target.value,
                    })
                  )
                }
                className={inputClass}
              />

              {/* CHANGE PASSWORD */}
              <button
                onClick={
                  handlePasswordChange
                }
                disabled={
                  changePasswordMutation.isPending
                }
                className="
                  w-full p-4 rounded-2xl
                  bg-cyan-400 text-black
                  font-semibold
                  flex items-center justify-center gap-2
                "
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />

                {changePasswordMutation.isPending
                  ? "Updating..."
                  : "Change Password"}
              </button>

              {/* 2FA */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-cyan-300" />

                  <div>
                    <h3 className="font-semibold">
                      Two-Factor
                      Authentication
                    </h3>

                    <p
                      className={`text-sm ${mutedText}`}
                    >
                      Extra account
                      protection
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        twoFactorEnabled:
                          !prev.twoFactorEnabled,
                      })
                    )
                  }
                  className={`w-14 h-8 rounded-full relative ${
                    formData.twoFactorEnabled
                      ? "bg-cyan-400"
                      : "bg-gray-500"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-all ${
                      formData.twoFactorEnabled
                        ? "translate-x-6"
                        : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div
            className={`rounded-3xl p-6 ${glassCard}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <BellIcon className="w-6 h-6 text-cyan-300" />

              <h2 className="text-xl font-bold">
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              {[
                [
                  "Budget Alerts",
                  "budgetAlerts",
                ],

                [
                  "Weekly Reports",
                  "weeklyReports",
                ],

                [
                  "Transaction Notifications",
                  "transactionNotifications",
                ],

                [
                  "Security Updates",
                  "securityUpdates",
                ],
              ].map(([label, key]) => (
                <div
                  key={key}
                  className="
                    flex items-center justify-between
                    p-4 rounded-2xl
                    bg-white/5 border border-white/10
                  "
                >
                  <span>{label}</span>

                  <button
                    onClick={() =>
                      toggleNotification(
                        key
                      )
                    }
                    className={`w-12 h-7 rounded-full relative ${
                      formData
                        .notifications[
                        key
                      ]
                        ? "bg-cyan-400"
                        : "bg-gray-500"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                        formData
                          .notifications[
                          key
                        ]
                          ? "right-1"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <ToastContainer />
    </div>
  );
};

export default Settings;