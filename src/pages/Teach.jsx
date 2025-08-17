import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CustomSuccessToast = ({ name }) => (
  <div className="flex items-center gap-3">
    <img
      src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
      alt="check"
      className="w-6 h-6"
    />
    <div>
      <p className="font-semibold text-green-600">Request Submitted!</p>
      <p className="text-sm text-gray-600">
        {name}, we'll review your application soon.
      </p>
    </div>
  </div>
);

const Teach = () => {
  const { user, userFromDB } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const photo = watch("photo");

  // Prefill values from context
  useEffect(() => {
    if (user) {
      setValue("name", user.displayName);
      setValue("email", user.email);
    }
    if (userFromDB) {
      setValue("photo", userFromDB.photo || "https://i.ibb.co/9t9cYgW/avatar.png");
    }
  }, [user, userFromDB, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/teacherRequests`, data);
      toast.success(<CustomSuccessToast name={data.name} />, {
        icon: false,
        closeButton: false,
        className: "bg-white shadow-md rounded-lg p-4 animate-slide-in",
      });
      reset({
        name: user?.displayName || "",
        email: user?.email || "",
        photo: userFromDB?.photo || "",
        experienceLevel: "",
        title: "",
        category: "",
      });
    } catch (err) {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-blue-500">
        Teach Application
      </h2>
      <p className="text-gray-500 mb-8 text-center text-sm sm:text-base">
        Share your expertise and inspire learners worldwide. Complete the form
        below to start your application.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 sm:space-y-6 bg-white p-4 sm:p-6 rounded-xl shadow-sm"
      >
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="Full Name"
            {...register("name", { required: true })}
            className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring focus:ring-blue-200 shadow-sm transition"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
        </div>

        {/* Profile Picture Preview */}
        <div className="flex items-center gap-3">
          <img
            src={photo || "https://i.ibb.co/9t9cYgW/avatar.png"}
            className="w-12 h-12 rounded-full border object-cover"
            alt="Profile"
          />
          <span className="text-sm text-gray-600">Profile Picture</span>
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            readOnly
            {...register("email", { required: true })}
            className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Experience Level */}
        <div>
          <label className="block font-medium mb-1">Experience Level</label>
          <select
            {...register("experienceLevel", { required: true })}
            className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring focus:ring-blue-200 shadow-sm transition"
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
          {errors.experienceLevel && (
            <p className="text-red-500 text-sm mt-1">Experience level is required</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="e.g., Expert in Data Science"
            {...register("title", { required: true })}
            className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring focus:ring-blue-200 shadow-sm transition"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">Title is required</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            {...register("category", { required: true })}
            className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring focus:ring-blue-200 shadow-sm transition"
          >
            <option value="">Select Category</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Business">Business</option>
            <option value="AI & Data">AI & Data</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">Category is required</p>
          )}
        </div>

        {/* Hidden photo input */}
        <input type="hidden" {...register("photo")} />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-md text-white font-semibold transition ${
            isSubmitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
    </div>
    </section>
  );
};

export default Teach;
