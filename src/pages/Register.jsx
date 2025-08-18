import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
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
    <span className={valid ? "text-green-500" : "text-red-500"}>
      {valid ? <FaCheck /> : "✖"}
    </span>
    <span className={`${valid ? "text-green-600" : "text-red-500"} text-sm`}>
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
    }
  } catch (err) {
    console.error("Error saving user:", err.message);
  }
};

export default function Register() {
  const { createUser, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordRegex = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    digit: /\d/,
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const photoURL = watch("photo");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userCredential = await createUser(
        data.email,
        data.password,
        data.name,
        data.photo
      );
      await saveUserToDB(userCredential.user);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      const user = result?.user;
      if (user) await saveUserToDB(user);
      toast.success("Signed up with Google!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center section-0 px-4 bg-theme text-theme">
      <div className="w-full max-w-sm p-6 space-y-6 shadow-2xl shadow-gray-950 rounded-2xl backdrop-blur-md bg-theme/80">
        {/* Logo */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-theme font-extrabold text-2xl hover:underline"
          >
            <Lottie className="w-14" animationData={GraduationHat} loop autoplay />
            EduManage
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign up to access all educational tools and resources.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", { required: true })}
              className="w-full px-4 py-3 rounded-lg border bg-theme text-theme focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 backdrop-blur-md"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">Name is required.</p>}
          </div>

          {/* Photo URL */}
          <div>
            <input
              type="url"
              placeholder="Profile Photo URL (optional)"
              {...register("photo")}
              className="w-full px-4 py-3 rounded-lg border bg-theme text-theme focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 backdrop-blur-md"
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email",
                },
              })}
              className="w-full px-4 py-3 rounded-lg border bg-theme text-theme focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 backdrop-blur-md"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                validate: {
                  length: (val) => passwordRegex.length.test(val) || "At least 8 characters",
                  upper: (val) =>
                    passwordRegex.uppercase.test(val) || "At least 1 uppercase letter",
                  lower: (val) =>
                    passwordRegex.lowercase.test(val) || "At least 1 lowercase letter",
                  digit: (val) => passwordRegex.digit.test(val) || "At least 1 number",
                },
              })}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full px-4 py-3 pr-10 rounded-lg border bg-theme text-theme focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 backdrop-blur-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Password Checklist */}
          {(passwordFocused || password) && (
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
            className={`w-full py-3 mt-10 border rounded-lg bg-theme text-theme text-theme-hover font-semibold flex justify-center
               items-center gap-2 transition cursor-pointer ${loading ? 
                "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? <><FaSpinner className="animate-spin" /> Creating account...</> : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <div className="h-px flex-1 bg-gray-600" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-600" />
        </div>

        {/* Google Signup */}
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center cursor-pointer justify-center w-full py-3 rounded-lg border
             bg-theme text-theme text-theme-hover hover:shadow-lg hover:scale-[1.02] transition-all
              duration-150 ease-in-out"
          >
            <FcGoogle className="text-xl mr-2" /> Sign up with Google
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
