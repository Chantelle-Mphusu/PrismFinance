import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    const verify = async () => {
      try {
        const data = await verifyEmail(token);
        setStatus("success");
        setMessage(data.message);
      } catch (err) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message || "Verification failed. The link may have expired."
        );
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f8fb]">
      <div className="bg-white border border-gray-200 rounded-3xl p-10 max-w-md w-full text-center shadow-sm">

        {status === "verifying" && (
          <>
            <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-black text-gray-900">Verifying your email...</h1>
            <p className="text-gray-500 mt-2">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Email verified</h1>
            <p className="text-gray-500 mt-2">{message}</p>
            <Link
              to="/login"
              className="mt-8 inline-block px-6 py-3 rounded-2xl bg-cyan-400 text-black font-semibold"
            >
              Go to login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Verification failed</h1>
            <p className="text-gray-500 mt-2">{message}</p>
            <Link
              to="/login"
              className="mt-8 inline-block px-6 py-3 rounded-2xl bg-cyan-400 text-black font-semibold"
            >
              Back to login
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;