
import { useReducer, useState } from "react";
import InputField from "./InputField";
import { Mail, Lock, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import bgImage from "./img.png";

const initialFormState = {
  Email: "",
  Password: "",
  Role: ""
}
const formreducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET_FORM":
      return initialFormState;
    default:
      return state;
  }
};

const Login = () => {
  const [formData, dispatch] = useReducer(formreducer, initialFormState);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value

    });
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ""
    }));
  };

  const validate = () => {
    const newErrors = {};
    // Email validation
    if (!formData.Email) newErrors.Email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.Email))
      newErrors.Email = "Invalid email format";

    // Password validation
    if (!formData.Password) newErrors.Password = "Password is required";

    // Role validation
    if (!formData.Role) newErrors.Role = "Please select a role";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const result = await authApi.login(formData.Email, formData.Password, formData.Role);

      // AuthContext will handle normalization and storage
      login(result);

      // Redirect logic based on returned (canonical) role
      const role = result.role || result.Role;
      if (role === 'DONOR') {
        navigate("/donor");
      } else if (role === 'ORGANIZATION') {
        // Both hospitals and blood banks use the unified org dashboard
        navigate("/org");
      } else if (role === 'ADMIN') {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, form: "Login failed. Please check your credentials." }));
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center font-outfit relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}
    >
      <div className="w-full max-w-md mx-auto animate-fade-in py-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

          {/* Header Section */}
          <div className="bg-red-50 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <HeartPulse size={120} className="text-red-900" />
            </div>

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4 shadow-sm">
              <HeartPulse size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="p-8 pt-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* General Error Message */}
              {errors.form && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">⚠️</span>
                  <span className="text-sm">{errors.form}</span>
                </div>
              )}

              <div>
                <InputField
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
                {errors.Email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.Email}</p>
                )}
              </div>

              <div>
                <InputField
                  icon={Lock}
                  label="Password"
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                {errors.Password && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.Password}</p>
                )}

                <div className="col-span-1 md:col-span-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Select Your Role <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <select
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                      name="Role"
                      value={formData.Role}
                      onChange={handleChange}
                    >
                      <option value="">Choose a role...</option>
                      <option value="donor">🩸 Donor</option>
                      <option value="organization">🏥 Organization (Hospital/Blood Bank)</option>
                      <option value="admin">👨‍💼 Admin</option>
                    </select>
                  </div>
                  {errors.Role && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.Role}</p>
                  )}
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-600/40 transition-all transform active:scale-[0.98]">
                Sign In
              </button>

              <p className="text-center text-gray-600 mt-1">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors ml-1"
                  onClick={() => navigate("/signup")}
                >
                  Create Account
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
