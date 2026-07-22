import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setStatus("loading");

    try {
      await forgotPassword(email);
      setStatus("sent");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f8fb]">
      <div className="bg-white border border-gray-200 rounded-3xl p-10 max-w-md w-full shadow-sm">

        {status === "sent" ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Check your email</h1>
            <p className="text-gray-500 mt-2">
              If an account exists for <span className="font-semibold text-gray-700">{email}</span>, a reset link has been sent. Check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-block px-6 py-3 rounded-2xl bg-cyan-400 text-black font-semibold"
            >
              Back to login
            </Link>
          </div>

        ) : (

          <>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Forgot password</h1>
            <p className="text-gray-500 mb-8">
              Enter your email and we'll send you a reset link.
            </p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="w-full py-3 rounded-2xl bg-cyan-400 text-black font-semibold disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : "Send reset link"}
              </button>

              <Link
                to="/login"
                className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-4"
              >
                Back to login
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;