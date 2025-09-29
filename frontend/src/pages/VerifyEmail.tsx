import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../lib/auth-client";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();
  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail({ code });
        setStatus("success");
        setTimeout(() => navigate("/dashboard"), 3000);
      } catch (error) {
        setStatus("error");
      }
    };

    verify();
  }, [code, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-lg shadow-md">
        {status === "verifying" && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Verifying your email...
            </h1>
            <p className="text-gray-600">Please wait a moment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Email Verified!
            </h1>
            <p className="text-gray-600">
              You will be redirected to the dashboard shortly.
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-600">
              The verification link is invalid or has expired. Please try again.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
