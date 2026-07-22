import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    const token = searchParams.get("token");

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      await resetPassword(token, formData.newPassword);
      setStatus("success");
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

        {status === "success" ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Password reset</h1>
            <p className="text-gray-500 mt-2">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-8 inline-block px-6 py-3 rounded-2xl bg-cyan-400 text-black font-semibold"
            >
              Go to login
            </button>
          </div>

        ) : (

          <>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Reset password</h1>
            <p className="text-gray-500 mb-8">
              Enter your new password below.
            </p>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />

              <input
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
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
                {status === "loading" ? "Resetting..." : "Reset password"}
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

export default ResetPassword;