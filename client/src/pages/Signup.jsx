import Prism from "../images/prism.png";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const Signup = () => {
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── CHANGE: added success state to show check-your-email screen ──
  const [signedUp, setSignedUp] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible((prev) => !prev);

  // ── CHANGE: handleSubmit updated — no longer navigates, shows success screen instead ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // ── Show check-your-email screen instead of navigating ──
      setSignedUpEmail(formData.email);
      setSignedUp(true);

    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err?.response?.data?.message || "Something went wrong during signup"
      );
    } finally {
      setLoading(false);
    }
  };

  // ── CHANGE: success screen shown after signup ──
  if (signedUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-cyan-950">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-[0_0_40px_rgba(0,255,255,0.08)]">

          {/* ICON */}
          <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-black text-white mb-2">Check your email</h1>
          <p className="text-gray-400">
            We sent a verification link to{" "}
            <span className="text-cyan-300 font-semibold">{signedUpEmail}</span>.
            Click the link to activate your account.
          </p>
          <p className="text-gray-500 text-sm mt-3">
            Check your spam folder if you don't see it.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-block px-6 py-3 rounded-2xl bg-cyan-400 text-black font-semibold"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-black via-slate-900 to-cyan-950 overflow-hidden">

      {/* LEFT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-20">

        <div
          className="
            w-full
            max-w-md
            bg-white/5
            backdrop-blur-2xl
            border
            border-white/10
            rounded-3xl
            p-8
            shadow-[0_0_40px_rgba(0,255,255,0.08)]
            transition-all
            duration-300
          "
        >
          {/* BRANDING */}
          <div className="space-y-3 text-center mb-8">
            <h1 className="text-5xl font-extrabold tracking-tight text-white">
              Prism Finance
            </h1>

            <p className="text-2xl font-semibold text-white">
              Create Account
            </p>

            <p className="text-sm text-gray-300">
              Start managing your finances smarter
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* FIRST NAME + LAST NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* FIRST NAME */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Chantelle"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                />
              </div>

              {/* LAST NAME */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Mphusu"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-cyan-300 transition"
                >
                  {isPasswordVisible ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Use at least 6 characters with letters and numbers
              </p>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-cyan-300 transition"
                >
                  {isConfirmPasswordVisible ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* TERMS */}
            <div className="flex items-start gap-3">
              <input type="checkbox" required className="mt-1 accent-cyan-400" />
              <p className="text-sm text-gray-300 leading-relaxed">
                I agree to the{" "}
                <span className="text-cyan-300 hover:underline cursor-pointer">Terms of Service</span>
                {" "}and{" "}
                <span className="text-cyan-300 hover:underline cursor-pointer">Privacy Policy</span>
              </p>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-cyan-400
                hover:bg-cyan-300
                text-black
                font-bold
                py-3
                rounded-xl
                shadow-lg
                transition-all
                duration-300
                hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-8 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-300 font-semibold hover:text-cyan-200 hover:underline transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - DEVICE IMAGE */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">

        {/* GLOW */}
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full" />

        {/* DEVICE IMAGE */}
        <img
          src={Prism}
          alt="Prism Finance App Preview"
          className="
            relative
            z-10
            max-h-[85vh]
            object-contain
            drop-shadow-[0_0_40px_rgba(0,255,255,0.25)]
            hover:scale-[1.02]
            transition-all
            duration-500
          "
        />
      </div>
    </div>
  );
};

export default Signup;