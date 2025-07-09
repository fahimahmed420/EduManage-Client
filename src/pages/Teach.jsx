import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
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
            <p className="text-sm text-gray-600">{name}, we'll review your application soon.</p>
        </div>
    </div>
);

const Teach = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: user?.displayName || "",
        email: user?.email || "",
        photo: user?.photoURL || "",
        experienceLevel: "",
        title: "",
        category: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, experienceLevel, title, category } = formData;
        if (!name || !email || !experienceLevel || !title || !category) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/teacherRequests`,
                formData
            );
            toast.success(<CustomSuccessToast name={formData.name} />, {
                icon: false,
                closeButton: false,
                className: "bg-white shadow-md rounded-lg p-4",
            });
            setFormData({
                name: user?.displayName || "",
                email: user?.email || "",
                photo: user?.photoURL || "",
                experienceLevel: "",
                title: "",
                category: "",
            });
        } catch (err) {
            toast.error("Failed to submit. Please try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold mb-2">Teach Application</h2>
            <p className="text-gray-500 mb-8">
                Share your expertise and inspire learners worldwide. Complete the form
                below to start your application.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                        placeholder="Full Name"
                        required
                    />
                </div>

                {/* Profile Picture */}
                <div className="flex items-center gap-3">
                    <img
                        src={formData.photo || "https://i.ibb.co/9t9cYgW/avatar.png"}
                        className="w-12 h-12 rounded-full border"
                        alt="Profile"
                    />
                    <span className="text-sm text-gray-600">Profile Picture</span>
                </div>

                {/* Email */}
                <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        readOnly
                        value={formData.email}
                        className="w-full border px-4 py-2 rounded bg-gray-100 cursor-not-allowed"
                        required
                    />
                </div>

                {/* Experience Level */}
                <div>
                    <label className="block font-medium mb-1">Experience Level</label>
                    <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                        required
                    >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                        placeholder="e.g., Expert in Data Science"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block font-medium mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Business">Business</option>
                        <option value="AI & Data">AI & Data</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                >
                    Submit for Review
                </button>
            </form>
        </div>
    );
};

export default Teach;
