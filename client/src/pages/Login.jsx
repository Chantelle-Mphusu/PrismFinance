import Prism from "../images/prism.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import {
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // handleSubmit updated to handle 2FA and unverified email ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login({ email, password });

      //2FA required 
      if (data.twoFactorRequired) {
        navigate("/two-factor", { state: { userId: data.userId } });
        return;
      }

      // Email not verified 
      if (data.isVerified === false) {
        toast.error("Please verify your email before logging in.");
        return;
      }

      navigate("/Dashboard");

    } catch (err) {
      const message = err?.response?.data?.message;

      // Unverified email comes back as 403 
      if (err?.response?.status === 403) {
        toast.error("Please verify your email before logging in.");
        return;
      }

      toast.error(message || "Incorrect email or password. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Welcome Back
            </p>

            <p className="text-sm text-gray-300">
              Login to continue managing your finances
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-400
                  transition-all
                  duration-300
                "
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">
                Password
              </label>

              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    bg-white/5
                    border
                    border-white/10
                    text-white
                    placeholder-gray-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-cyan-400
                    transition-all
                    duration-300
                  "
                />

                {/* TOGGLE PASSWORD */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-300
                    hover:text-cyan-300
                    transition
                  "
                >
                  {isPasswordVisible ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD ── CHANGE: was a button, now a Link ── */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="
                  text-sm
                  text-cyan-300
                  hover:text-cyan-200
                  hover:underline
                  transition
                "
              >
                Forgot password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="mt-8 text-center text-sm text-gray-300">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="
                text-cyan-300
                font-semibold
                hover:text-cyan-200
                hover:underline
                transition
              "
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - DEVICE IMAGE */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">

        {/* GLOW */}
        <div
          className="
            absolute
            w-[500px]
            h-[500px]
            bg-cyan-500/20
            blur-3xl
            rounded-full
          "
        />

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

      <ToastContainer />
    </div>
  );
};

export default Login;