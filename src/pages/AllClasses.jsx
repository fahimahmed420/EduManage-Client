import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const LIMIT = 8;

const fetchClasses = async ({ queryKey }) => {
  const [, page, searchTerm] = queryKey;
  const res = await axios.get(`${API}/classes`, {
    params: {
      page,
      limit: LIMIT,
      search: searchTerm,
    },
  });
  return res.data; // contains: { classes, total }
};

const AllClasses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["classes", page, searchTerm],
    queryFn: fetchClasses,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const totalPages = data?.total ? Math.ceil(data.total / LIMIT) : 1;

  const approvedClasses = data?.classes?.filter((cls) => cls.status === "approved") || [];

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center md:text-left text-blue-500">
        Approved Classes
      </h2>

      {/* Search Bar */}
      <div className="relative mb-6 w-full sm:w-1/2">
        <input
          type="text"
          placeholder="Search classes by name..."
          value={searchTerm}
          onChange={(e) => {
            setPage(1); // reset to page 1 on new search
            setSearchTerm(e.target.value);
          }}
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(LIMIT)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 rounded-xl overflow-hidden shadow flex flex-col"
            >
              <div className="h-40 bg-gray-300 w-full"></div>
              <div className="p-4 space-y-3 flex-grow">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 bg-gray-300 rounded mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center text-red-600 text-lg py-20">
          Error loading classes: {error.message}
        </div>
      ) : approvedClasses.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-20">
          No classes found
        </div>
      ) : (
        <>
          {/* Class Cards */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {approvedClasses.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col"
              >
                <img
                  src={cls.image || "https://via.placeholder.com/400x250"}
                  alt={cls.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <div className="space-y-2 mb-4">
                    <h3 className="text-lg font-semibold truncate">{cls.title}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      By {cls.teacherName}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">${cls.price}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {cls.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {cls.totalEnrollment} students enrolled
                    </p>
                  </div>
                  <button
                    className="mt-auto w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    onClick={() => navigate(`/all-classes/${cls._id}`)}
                  >
                    Enroll
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-40 gap-2 flex-wrap">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages).keys()].map((num) => {
              const pageNum = num + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 rounded hover:bg-blue-500 hover:text-white ${
                    page === pageNum ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
    </section>
  );
};

export default AllClasses;
