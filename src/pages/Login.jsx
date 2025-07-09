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

const ChecklistItem = ({ valid, label }) => (
  <div className="flex items-center gap-2">
    {valid ? (
      <span className="text-green-500 text-base font-semibold">
        <FaCheck />
      </span>
    ) : (
      <span className="text-red-500 text-base font-semibold">✖</span>
    )}
    <span
      className={valid ? "text-green-600 text-sm" : "text-red-500 text-sm"}
    >
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
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error("Error saving user to DB:", err.message);
  }
};



export default function Login() {
  const { signInUser, signInWithGoogle, passReset } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordRegex = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    digit: /\d/,
  };

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid =
    passwordRegex.length.test(password) &&
    passwordRegex.uppercase.test(password) &&
    passwordRegex.lowercase.test(password) &&
    passwordRegex.digit.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) {
      toast.error("Please enter a valid email and password.");
      return;
    }

    try {
      setLoading(true);
      await signInUser(email, password);
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
    if (!email) {
      toast.error("Enter your email to reset password.");
      return;
    }
    try {
      await passReset(email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 px-4">
      {/* Glassmorphic Card */}
      <div className="glass-card w-full max-w-sm p-6 space-y-6 shadow-2xl rounded-2xl">
        {/* Logo */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="flex justify-center items-center gap-2 text-blue-600 font-extrabold text-2xl hover:underline"
          >
            <Lottie
              className="w-14"
              animationData={GraduationHat}
              loop
              autoplay
            />
            EduManage
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Sign in to EduManage
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Access your classes, assignments, and resources.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 bg-white/70 backdrop-blur-md"
            />
            {!isEmailValid && email && (
              <p className="text-red-500 text-xs mt-1">
                Please enter a valid email.
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 bg-white/70 backdrop-blur-md pr-10"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Password Checklist */}
          {(passwordFocused || password.length > 0) && (
            <div className="space-y-1">
              <ChecklistItem
                valid={passwordRegex.length.test(password)}
                label="At least 8 characters"
              />
              <ChecklistItem
                valid={passwordRegex.uppercase.test(password)}
                label="At least 1 uppercase letter"
              />
              <ChecklistItem
                valid={passwordRegex.lowercase.test(password)}
                label="At least 1 lowercase letter"
              />
              <ChecklistItem
                valid={passwordRegex.digit.test(password)}
                label="At least 1 number"
              />
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
            className={`w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex justify-center items-center gap-2 transition ${loading && "opacity-50 cursor-not-allowed"
              }`}
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
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
