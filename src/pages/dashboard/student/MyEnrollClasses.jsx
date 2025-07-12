import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router";

const MyEnrollClasses = () => {
    const { userFromDB } = useContext(AuthContext);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                setLoading(true);
                setError("");

                if (!userFromDB?._id) {
                    setError("User not found");
                    return;
                }

                // 1. Fetch enrollments for the current user
                const enrollmentsRes = await axios.get(
                    `${import.meta.env.VITE_API_URL}/enrollments/${userFromDB._id}`
                );
                const enrollments = enrollmentsRes.data;

                if (!enrollments.length) {
                    setClasses([]);
                    return;
                }

                // 2. Extract classId strings from enrollments
                const classIds = enrollments.map((enroll) => enroll.classId);

                // 3. Fetch all class details in one batch request
                const classRes = await axios.post(
                    `${import.meta.env.VITE_API_URL}/classes/by-ids`,
                    { ids: classIds }
                );

                setClasses(classRes.data);
            } catch (err) {
                console.error("❌ Failed to fetch enrolled classes:", err);
                setError("Failed to load enrolled classes.");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [userFromDB?._id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="text-lg font-medium">Loading enrolled classes...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="text-red-500">{error}</span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">My Enrolled Classes</h1>
            {classes.length === 0 ? (
                <p className="text-gray-600">You haven't enrolled in any classes yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((classItem) => (
                        <div
                            key={classItem._id}
                            className="rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300"
                        >
                            <img
                                src={classItem.image || "https://via.placeholder.com/400x200"}
                                alt={classItem.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">
                                    {classItem.title}
                                </h2>
                                <p className="text-gray-600 mb-1">
                                    Instructor: {classItem.teacherName || "Unknown"}
                                </p>
                                <button
                                    className="text-blue-600 font-medium hover:underline"
                                    onClick={() => navigate(`/dashboard/my-enroll-classes/${classItem._id}`)}
                                >
                                    Continue
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEnrollClasses;
