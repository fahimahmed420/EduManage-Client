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

export default function Register() {
  const { createUser, signInWithGoogle } = useContext(AuthContext); // Use createUser from context
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState(""); // New photoURL input
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

    if (!name || !isEmailValid || !isPasswordValid) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    try {
      setLoading(true);
      // Call createUser from AuthContext
      await createUser(email, password, name, photoURL);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success("Signed up with Google!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google Sign up failed.");
    } finally {
      setLoading(false);
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
            Create your account
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign up to access all educational tools and resources.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setNameTouched(true)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 bg-white/70 backdrop-blur-md"
            />
            {nameTouched && !name && (
              <p className="text-red-500 text-xs mt-1">
                Please enter your name.
              </p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <input
              type="url"
              placeholder="Profile Photo URL (optional)"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 bg-white/70 backdrop-blur-md"
            />
            {photoURL && (
              <div className="flex justify-center mt-2">
                <img
                  src={photoURL}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                />
              </div>
            )}
          </div>

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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex justify-center items-center gap-2 transition ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <div className="h-px flex-1 bg-gray-300" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Google Signup */}
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center w-full py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur-md hover:shadow-lg hover:scale-[1.02] transition-all duration-150 ease-in-out"
          >
            <FcGoogle className="text-xl mr-2" /> Sign up with Google
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
