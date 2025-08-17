import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const fetchClassDetails = async (id) => {
  const res = await axios.get(`${API}/classes/${id}`);
  return res.data;
};

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: classData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["classDetails", id],
    queryFn: () => fetchClassDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !classData) {
    return (
      <div className="flex flex-col justify-center items-center h-60 text-center">
        <p className="text-red-500 text-xl font-semibold mb-4">
          {error?.message || "Class not found"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
      {/* Banner Image */}
      <div className="relative rounded-lg overflow-hidden mb-6 shadow h-48">
        {classData?.image ? (
          <img
            src={classData.image}
            alt={classData.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {classData?.title || "Untitled Class"}
          </h1>
        </div>
      </div>

      {/* Course Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-gray-50 p-4 font-semibold text-lg border-b border-gray-200">
          Course Details
        </div>
        <div className="divide-y divide-gray-200">
          <DetailRow label="Teacher" value={classData?.teacherName || "Not Assigned"} />
          <DetailRow
            label="Price"
            value={classData?.price ? `$${classData.price}` : "Free"}
          />
          <DetailRow
            label="Duration"
            value={`${classData?.duration || "N/A"} weeks`} />
          <DetailRow label="Level" value={classData?.level || "Beginner"} />
          <DetailRow label="Schedule" value={classData?.schedule || "To Be Announced"} />
          <DetailRow
            label="Total Enrolled"
            value={classData?.totalEnrollment ?? 0}
          />
        </div>
      </div>

      {/* About Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">About the Course</h2>
        <p className="text-gray-700 leading-relaxed">
          {classData?.description || "No description available for this class."}
        </p>
      </div>

      {/* CTA Button */}
      <div className="mt-8 flex justify-center">
        {classData?.price ? (
          <Link
            to={`/payment/${classData._id}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition transform hover:scale-105"
          >
            Pay ${classData.price}
          </Link>
        ) : (
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition transform hover:scale-105"
            onClick={() => {
              // Implement free enroll logic here if needed
            }}
          >
            Enroll for Free
          </button>
        )}
      </div>
    </div>
  );
};

// Detail Row Component
const DetailRow = ({ label, value }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 text-sm md:text-base space-y-2 md:space-y-0">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);

export default ClassDetails;
