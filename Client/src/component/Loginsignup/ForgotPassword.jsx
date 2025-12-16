import { useState } from "react";
import { Mail, ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import InputField from "./InputField";

const ForgotPassword = ({ switchPage }) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Email validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call your backend API
      const response = await fetch("http://localhost:3000/api/forgot-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const result = await response.json();
        setError(result.message || "Failed to send reset link. Please try again.");
        setIsLoading(false);
        return;
      }
      
      const result = await response.json();
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

        {/* Header Section */}
        <div className="bg-red-50 p-8 text-center relative overflow-hidden border-b border-red-100">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <KeyRound size={120} className="text-red-900" />
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4 shadow-sm">
            <KeyRound size={32} />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isSubmitted ? "Check Your Email" : "Forgot Password?"}
          </h2>
          
          <p className="text-gray-600">
            {isSubmitted 
              ? "We've sent a password reset link to your email" 
              : "Enter your email to reset password"}
          </p>
        </div>

        <div className="p-8 pt-6">
          <button
            className="flex items-center text-sm font-medium text-gray-500 hover:text-red-600 transition-colors group/back mb-6"
            onClick={() => switchPage("login")}
            disabled={isLoading}
            type="button"
          >
            <ArrowLeft size={18} className="mr-2 group-hover/back:-translate-x-1 transition-transform" />
            Back to Login
          </button>

          {isSubmitted ? (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
                <CheckCircle size={40} />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Reset Link Sent!
                </h3>
                <p className="text-gray-600">
                  We've sent a password reset link to:
                  <br />
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Check your inbox and follow the instructions in the email.
                  The link will expire in 1 hour.
                </p>
              </div>
              
              <div className="space-y-4 pt-4">
                <button
                  onClick={() => switchPage("login")}
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-600/40 transition-all"
                  type="button"
                >
                  Back to Login
                </button>
                
                <button
                  onClick={handleReset}
                  className="w-full py-3 bg-white text-red-600 font-bold rounded-lg border-2 border-red-200 hover:border-red-300 hover:bg-red-50 transition-all"
                  type="button"
                >
                  Send Another Link
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <InputField
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@example.com"
                  required
                  disabled={isLoading}
                />
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <p className="text-sm text-gray-500">
                  Enter the email address associated with your account.
                  We'll send you a link to reset your password.
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-600/40 transition-all transform active:scale-[0.98] ${
                  isLoading ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending Reset Link...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
              
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Remember your password?{" "}
                  <button
                    type="button"
                    className="font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
                    onClick={() => switchPage("login")}
                    disabled={isLoading}
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;