import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../contexts/AuthContext";
import GraduationHat from "../assets/logo-animation.json";
import Lottie from "lottie-react";
import { useForm } from "react-hook-form";

const ChecklistItem = ({ valid, label }) => (
  <div className="flex items-center gap-2">
    <span className={valid ? "text-green-500" : "text-red-500"}>
      {valid ? <FaCheck /> : "✖"}
    </span>
    <span className={`text-sm ${valid ? "text-green-600" : "text-red-500"}`}>
      {label}
    </span>
  </div>
);

const saveUserToDB = async (user) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.displayName || user.name,
        email: user.email,
        photo: user.photoURL || user.photo,
        role: "student",
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Failed to save user:", errorData);
    } else {
      return await res.json();
    }
  } catch (err) {
    console.error("Error saving user to DB:", err.message);
  }
};

const getJwtToken = async (email) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
  } catch (err) {
    console.error("JWT fetch error:", err.message);
  }
};

export default function Login() {
  const { signInUser, signInWithGoogle, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const password = watch("password") || "";

  const onSubmit = async ({ email, password }) => {
    try {
      setLoading(true);
      await signInUser(email, password);
      await getJwtToken(email);
      toast.success("Welcome to EduManage!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      const user = result?.user;
      if (user) {
        await saveUserToDB(user);
        await getJwtToken(user.email);
      }
      toast.success("Signed in with Google!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = watch("email");
    if (!email) return toast.error("Enter your email to reset password.");
    try {
      await resetPassword(email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 px-4">
      <div className="glass-card w-full max-w-sm p-6 space-y-6 shadow-2xl rounded-2xl">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-extrabold text-2xl hover:underline">
            <Lottie className="w-14" animationData={GraduationHat} loop autoplay />
            EduManage
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Sign in to EduManage</h1>
          <p className="text-gray-500 text-sm mt-1">
            Access your classes, assignments, and resources.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="student@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email",
                },
              })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 bg-white/70 backdrop-blur-md"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                validate: {
                  length: (v) => v.length >= 8 || "Minimum 8 characters",
                  hasUpper: (v) => /[A-Z]/.test(v) || "At least 1 uppercase letter",
                  hasLower: (v) => /[a-z]/.test(v) || "At least 1 lowercase letter",
                  hasDigit: (v) => /\d/.test(v) || "At least 1 number",
                },
              })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 bg-white/70 backdrop-blur-md pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Password Checklist */}
          {password && (
            <div className="space-y-1">
              <ChecklistItem valid={password.length >= 8} label="At least 8 characters" />
              <ChecklistItem valid={/[A-Z]/.test(password)} label="At least 1 uppercase letter" />
              <ChecklistItem valid={/[a-z]/.test(password)} label="At least 1 lowercase letter" />
              <ChecklistItem valid={/\d/.test(password)} label="At least 1 number" />
            </div>
          )}

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex justify-center items-center gap-2 transition ${loading && "opacity-50 cursor-not-allowed"}`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <div className="h-px flex-1 bg-gray-300" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center w-full py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur-md hover:shadow-lg hover:scale-[1.02] transition-all duration-150 ease-in-out"
          >
            <FcGoogle className="text-xl mr-2" /> Sign in with Google
          </button>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          New to EduManage?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
