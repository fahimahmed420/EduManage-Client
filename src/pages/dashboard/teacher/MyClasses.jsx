import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const MyClasses = () => {
    const { user } = useContext(AuthContext);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingClass, setEditingClass] = useState(null);
    const [updatedData, setUpdatedData] = useState({});
    const [removingIds, setRemovingIds] = useState([]); 
    const navigate = useNavigate();

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!user?.email) return;

        fetch(`${API}/classes?teacherEmail=${encodeURIComponent(user.email)}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch classes");
                return res.json();
            })
            .then((data) => {
                const animatedData = data.map((cls) => ({ ...cls, appearing: true }));
                setClasses(animatedData);
                console.log(animatedData);

                setTimeout(() => {
                    setClasses((prev) =>
                        prev.map((cls) => ({ ...cls, appearing: false }))
                    );
                }, 500);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("❌ Failed to load classes");
                setLoading(false);
            });
    }, [user?.email, API]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This class will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e53e3e",
            cancelButtonColor: "#a0aec0",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            setRemovingIds((prev) => [...prev, id]);

            await new Promise((resolve) => setTimeout(resolve, 400));

            const res = await fetch(`${API}/classes/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete class");

            setClasses((prev) => prev.filter((cls) => cls._id !== id));
            Swal.fire("Deleted!", "Your class has been deleted.", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to delete the class.", "error");
        } finally {
            setRemovingIds((prev) => prev.filter((remId) => remId !== id));
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API}/classes/${editingClass._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error("Failed to update class");

            setClasses((prev) =>
                prev.map((cls) =>
                    cls._id === editingClass._id ? { ...cls, ...updatedData } : cls
                )
            );
            setEditingClass(null);

            Swal.fire({
                title: "Updated!",
                text: "Your class has been updated successfully.",
                icon: "success",
                confirmButtonColor: "#4299e1",
            });
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to update the class.", "error");
        }
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-lg font-semibold">Loading classes...</p>
            </div>
        );
    }

    if (classes.length === 0) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-lg font-semibold">No classes found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <h1 className="text-3xl font-bold mb-8">My Classes</h1>

            <div className="space-y-6">
                {classes.map((cls) => {
                    const isActive =
                        cls.status?.toLowerCase() === "approved" ||
                        cls.status?.toLowerCase() === "active";

                    return (
                        <div
                            key={cls._id}
                            className={`flex justify-between bg-gray-50 rounded-lg shadow-sm p-4 transition-all duration-500 ease-in-out
                                ${cls.appearing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
                                ${removingIds.includes(cls._id) ? "opacity-0 -translate-y-5" : ""}
                            `}
                        >
                            {/* Left Content */}
                            <div className="flex-1 pr-4">
                                <p
                                    className={`text-sm px-2 py-1 w-fit rounded-full
                                        ${isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }
                                    `}
                                >
                                    {isActive ? "Active" : "Pending"}
                                </p>

                                <h2 className="text-lg font-semibold mt-1">{cls.title}</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Name:</span> {cls.teacherName},&nbsp;
                                    <span className="font-medium">Email:</span> {cls.teacherEmail},&nbsp;
                                    <span className="font-medium">Price:</span> ${cls.price},&nbsp;
                                    <span className="font-medium">Description:</span> {cls.description}
                                </p>

                                {/* Buttons */}
                                <div className="flex gap-2 mt-4 flex-wrap">
                                    {isActive ? (
                                        <button
                                            onClick={() => navigate(`/dashboard/my-class/${cls._id}`)}
                                            className="px-3 py-1 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300 transition"
                                        >
                                            See Details
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-400 rounded cursor-not-allowed"
                                        >
                                            See Details
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setEditingClass(cls);
                                            setUpdatedData({
                                                title: cls.title,
                                                description: cls.description,
                                                price: cls.price,
                                                image: cls.image,
                                            });
                                        }}
                                        className="px-3 py-1 text-sm font-medium bg-yellow-200 rounded hover:bg-yellow-300 transition"
                                    >
                                        Update Class
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cls._id)}
                                        className="px-3 py-1 text-sm font-medium bg-red-200 rounded hover:bg-red-300 transition"
                                    >
                                        Delete Class
                                    </button>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="w-40 flex-shrink-0">
                                <img
                                    src={cls.image}
                                    alt={cls.title}
                                    className="rounded-md w-full h-28 object-cover"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Update Modal */}
            {editingClass && (
                <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/20">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl relative animate-slide-in">
                        <h2 className="text-xl font-bold mb-4">Update Class</h2>
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={updatedData.title}
                                    onChange={handleFieldChange}
                                    className="w-full border border-gray-200 rounded p-2 focus:border-blue-300 focus:ring focus:ring-blue-100 transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={updatedData.description}
                                    onChange={handleFieldChange}
                                    className="w-full border border-gray-200 rounded p-2 focus:border-blue-300 focus:ring focus:ring-blue-100 transition"
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={updatedData.price}
                                    onChange={handleFieldChange}
                                    className="w-full border border-gray-200 rounded p-2 focus:border-blue-300 focus:ring focus:ring-blue-100 transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={updatedData.image}
                                    onChange={handleFieldChange}
                                    className="w-full border border-gray-200 rounded p-2 focus:border-blue-300 focus:ring focus:ring-blue-100 transition"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingClass(null)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyClasses;
