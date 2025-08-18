import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, ""); // Remove trailing slash

const fetchEnrolledClasses = async (userId) => {
  if (!userId) throw new Error("User not found");

  // 1. Fetch enrollments for the current user
  const enrollmentsRes = await axios.get(`${API}/enrollments/${userId}`);
  const enrollments = enrollmentsRes.data;

  if (!enrollments.length) return []; // No enrollments found

  // 2. Extract classId strings
  const classIds = enrollments.map((enroll) => enroll.classId);

  // 3. Fetch all class details in one batch request
  const classRes = await axios.post(`${API}/classes/by-ids`, { ids: classIds });

  return classRes.data;
};

const MyEnrollClasses = () => {
  const { userFromDB } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    data: classes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["enrolledClasses", userFromDB?._id],
    queryFn: () => fetchEnrolledClasses(userFromDB._id),
    enabled: !!userFromDB?._id, // Only run if userFromDB exists
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-1/2">
        <div className="flex gap-x-2">
          <div className="w-5 h-5 bg-[#d991c2] animate-pulse rounded-full"></div>
          <div className="w-5 h-5 bg-[#9869b8] animate-bounce rounded-full"></div>
          <div className="w-5 h-5 bg-[#6756cc] animate-pulse rounded-full"></div>
        </div>
      </div>

    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-red-500">{error.message || "Failed to load classes."}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl p-4 mx-auto">
      <h1 className="text-3xl font-bold mb-10 ">My Enrolled Classes</h1>
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
                  onClick={() =>
                    navigate(`/dashboard/my-enroll-classes/${classItem._id}`)
                  }
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
