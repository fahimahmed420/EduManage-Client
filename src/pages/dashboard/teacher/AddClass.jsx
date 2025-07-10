import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Load user info
  useEffect(() => {
    if (!user?.email) return;

    fetch(`${API}/users/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setValue("teacherName", data.name);
        setValue("teacherEmail", data.email);
      })
      .catch((err) => {
        console.error(err);
        toast.error("❌ Failed to load user data");
      });
  }, [user?.email, API, setValue]);

  // Toggle day selection
  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const onSubmit = async (data) => {
    if (!userData) return toast.error("❌ User data not loaded");

    if (selectedDays.length === 0 || !startTime || !endTime) {
      toast.error("❌ Please select days and time range");
      return;
    }

    // Format schedule string
    const schedule = `${selectedDays.join(", ")} — ${formatTime(startTime)} to ${formatTime(endTime)}`;

    const payload = {
      ...data,
      teacherName: userData.name,
      teacherEmail: userData.email,
      teacherId: userData._id,
      schedule,
      status: "pending",
    };

    try {
      const res = await fetch(`${API}/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add class");

      toast.success("✅ Class added successfully! Wait for review.");
      reset();
      setSelectedDays([]);
      setStartTime("");
      setEndTime("");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error adding class");
    }
  };

  const formatTime = (time) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${suffix}`;
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
          <InputField
            id="title"
            label="Title"
            register={register}
            required
            errors={errors}
          />

          {/* Price */}
          <InputField
            id="price"
            label="Price"
            type="text"
            register={register}
            required
            errors={errors}
            validation={{
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Enter a valid price (e.g. 19.99)",
              },
            }}
          />

          {/* Image */}
          <InputField
            id="image"
            label="Image URL"
            type="text"
            register={register}
            required
            errors={errors}
            validation={{
              pattern: {
                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
                message: "Enter a valid image URL",
              },
            }}
          />

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows="4"
              {...register("description", { required: "Description is required" })}
              className="w-full bg-gray-100 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Course description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Duration */}
          <InputField
            id="duration"
            label="Duration (in weeks)"
            type="number"
            register={register}
            required
            errors={errors}
            validation={{ min: { value: 1, message: "Minimum 1 week" } }}
          />

          {/* Level */}
          <div>
            <label htmlFor="level" className="block font-medium text-gray-700 mb-1">
              Level <span className="text-red-500">*</span>
            </label>
            <select
              {...register("level", { required: "Level is required" })}
              className="w-full bg-gray-100 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
            {errors.level && (
              <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
            )}
          </div>

          {/* Schedule Picker */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Schedule <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {daysList.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedDays.includes(day)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-gray-100 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-gray-100 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Read-only teacher fields */}
          <InputField
            id="teacherName"
            label="Teacher Name"
            register={register}
            disabled
          />
          <InputField
            id="teacherEmail"
            label="Teacher Email"
            register={register}
            disabled
          />

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 rounded-md text-white transition ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
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

const InputField = ({ id, label, type = "text", register, required = false, errors, validation = {}, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      disabled={disabled}
      {...register(id, required ? { required: `${label} is required`, ...validation } : {})}
      className={`w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 ${
        errors?.[id] ? "focus:ring-red-500" : "focus:ring-blue-400"
      } ${disabled ? "bg-gray-200 cursor-not-allowed" : ""}`}
    />
    {errors?.[id] && <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>}
  </div>
);

export default AddClass;
