import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const TwoFactorAuth = () => {
  const { verify2FA } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // userId is passed via navigation state from the Login page
  const userId = location.state?.userId;

  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!userId) {
      setError("Session expired. Please log in again.");
      return;
    }

    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setStatus("loading");

    try {
      await verify2FA(userId, code);
      navigate("/Dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid or expired code. Please try again."
      );
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f8fb]">
      <div className="bg-white border border-gray-200 rounded-3xl p-10 max-w-md w-full shadow-sm">

        {/* ICON */}
        <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-gray-900 text-center mb-2">
          Check your email
        </h1>
        <p className="text-gray-500 text-center mb-8">
          We sent a 6-digit code to your email address. It expires in 10 minutes.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-center text-2xl font-bold tracking-widest"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="w-full py-3 rounded-2xl bg-cyan-400 text-black font-semibold disabled:opacity-60"
          >
            {status === "loading" ? "Verifying..." : "Verify code"}
          </button>

          <Link
            to="/login"
            className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-4"
          >
            Back to login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TwoFactorAuth;