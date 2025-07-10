import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddClass = () => {
  const [userData, setUserData] = useState(null);
  const { user } = useContext(AuthContext);
  const API = import.meta.env.VITE_API_URL;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (!user?.email) return;

    // Fetch user data from backend by email
    fetch(`${API}/users/${(user.email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        // Set teacherName & teacherEmail in form state
        setValue("teacherName", data.name);
        setValue("teacherEmail", data.email);
      })
      .catch((err) => {
        console.error(err);
        toast.error("❌ Failed to load user data");
      });
  }, [user?.email, API, setValue]);

  const onSubmit = async (data) => {
    if (!userData) {
      toast.error("❌ User data not loaded yet");
      return;
    }

    // Add teacher info to form data
    data.teacherName = userData.name;
    data.teacherEmail = userData.email;
    data.teacherId = userData._id;
    data.status = "pending";

    try {
      const response = await fetch(`${API}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add class");

      toast.success("✅ Class added successfully! Wait for Review.");
      reset(); // Clear form after success
    } catch (err) {
      console.error(err);
      toast.error("❌ Error adding class");
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 p-4">
      <main className="w-full max-w-lg bg-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Class</h1>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block mb-1 text-gray-700 font-medium"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter class title"
              className={`w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.title ? "focus:ring-red-500" : "focus:ring-blue-400"
              }`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block mb-1 text-gray-700 font-medium"
            >
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="text"
              placeholder="Enter class price"
              className={`w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.price ? "focus:ring-red-500" : "focus:ring-blue-400"
              }`}
              {...register("price", {
                required: "Price is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Enter a valid price (e.g. 19.99)",
                },
              })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="image"
              className="block mb-1 text-gray-700 font-medium"
            >
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              id="image"
              type="text"
              placeholder="Enter image URL"
              className={`w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.image ? "focus:ring-red-500" : "focus:ring-blue-400"
              }`}
              {...register("image", {
                required: "Image URL is required",
                pattern: {
                  value:
                    /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
                  message: "Enter a valid image URL",
                },
              })}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block mb-1 text-gray-700 font-medium"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="Enter class description"
              className={`w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 ${
                errors.description
                  ? "focus:ring-red-500"
                  : "focus:ring-blue-400"
              }`}
              {...register("description", {
                required: "Description is required",
              })}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Teacher Name - readonly */}
          <div>
            <label
              htmlFor="teacherName"
              className="block mb-1 text-gray-700 font-medium"
            >
              Teacher Name
            </label>
            <input
              id="teacherName"
              type="text"
              {...register("teacherName")}
              readOnly
              className="w-full px-3 py-2 rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* Teacher Email - readonly */}
          <div>
            <label
              htmlFor="teacherEmail"
              className="block mb-1 text-gray-700 font-medium"
            >
              Teacher Email
            </label>
            <input
              id="teacherEmail"
              type="email"
              {...register("teacherEmail")}
              readOnly
              className="w-full px-3 py-2 rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 rounded-md text-white transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Add Class"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddClass;
