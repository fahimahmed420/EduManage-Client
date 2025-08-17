import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LIMIT = 8; // Set your limit per page here

const AllClassAdmin = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  // Fetch paginated classes whenever page changes
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/classes`, {
        params: { page, limit: LIMIT, all: false }, // adjust params as needed
      })
      .then((res) => {
        // If your API returns an array (old), convert it to { classes, total }
        // But your server code shows { classes, total } object, so:
        const data = res.data;
        if (Array.isArray(data)) {
          // fallback if API returns array only
          setClasses(data);
          setTotalPages(1);
        } else {
          setClasses(data.classes || []);
          setTotalPages(Math.ceil((data.total || 0) / LIMIT));
        }
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch classes.");
        setLoading(false);
      });
  }, [API, page]);

  // Approve / Reject Action
  const handleAction = (id, action) => {
    Swal.fire({
      title: `Are you sure you want to ${action}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
      confirmButtonColor:
        action === "approved"
          ? "#16a34a"
          : action === "rejected"
            ? "#dc2626"
            : "#3b82f6",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`${API}/classes/${id}`, { status: action })
          .then(() => {
            setClasses((prev) =>
              prev.map((cls) =>
                cls._id === id ? { ...cls, status: action } : cls
              )
            );
            Swal.fire(`${action} successfully!`, "", "success");
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Failed to update class status.", "", "error");
          });
      }
    });
  };

  // Navigate to progress page
  const handleProgressClick = (id) => {
    navigate(`/dashboard/my-classes/${id}`);
  };

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-600">All Classes</h1>
      {loading && (
        <div className="flex justify-center items-center min-h-1/2">
          <div className="flex gap-x-2">
            <div className="w-5 h-5 bg-[#d991c2] animate-pulse rounded-full"></div>
            <div className="w-5 h-5 bg-[#9869b8] animate-bounce rounded-full"></div>
            <div className="w-5 h-5 bg-[#6756cc] animate-pulse rounded-full"></div>
          </div>
        </div>
      )}

      {error && <div className="text-center py-6 text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          {/* Table for medium and larger screens */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="p-4">Title</th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Instructor's Email</th>
                  <th className="p-4">Short Description</th>
                  <th className="p-4">Approve</th>
                  <th className="p-4">Reject</th>
                  <th className="p-4">Progress</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr
                    key={cls._id}
                    className="border-t border-gray-300 hover:bg-gray-50 text-sm"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {cls.title}
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${cls.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : cls.status === "rejected"
                              ? "bg-red-100 text-red-600"
                              : cls.status === "in progress"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {cls.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <img
                        src={cls.image}
                        alt={cls.title}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </td>
                    <td className="p-4 text-gray-600">{cls.teacherEmail}</td>
                    <td className="p-4 text-gray-600 truncate">{cls.description}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleAction(cls._id, "approved")}
                        disabled={cls.status === "approved"}
                        className={`px-3 py-1 rounded-md text-white text-sm font-medium ${cls.status === "approved"
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                          }`}
                      >
                        Approve
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleAction(cls._id, "rejected")}
                        disabled={cls.status === "rejected"}
                        className={`px-3 py-1 rounded-md text-white text-sm font-medium ${cls.status === "rejected"
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                          }`}
                      >
                        Reject
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleProgressClick(cls._id)}
                        disabled={cls.status !== "approved"}
                        className={`px-3 py-1 rounded-md text-white text-sm font-medium ${cls.status !== "approved"
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                          }`}
                      >
                        Progress
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout for small screens */}
          <div className="md:hidden space-y-4">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-lg">{cls.title}</h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${cls.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : cls.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : cls.status === "in progress"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {cls.status}
                  </span>
                </div>
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Instructor:</strong> {cls.teacherEmail}
                </p>
                <p className="text-sm text-gray-600 mb-3">{cls.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleAction(cls._id, "approved")}
                    disabled={cls.status === "approved"}
                    className={`flex-1 px-3 py-1 rounded-md text-white text-sm font-medium ${cls.status === "approved"
                        ? "bg-green-300 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                      }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(cls._id, "rejected")}
                    disabled={cls.status === "rejected"}
                    className={`flex-1 px-3 py-1 rounded-md text-white text-sm font-medium ${cls.status === "rejected"
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                      }`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleProgressClick(cls._id)}
                    disabled={cls.status !== "approved"}
                    className={`flex-1 px-3 py-1 rounded-md text-white text-sm font-medium ${cls.status !== "approved"
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                      }`}
                  >
                    Progress
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls with page numbers */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3 py-1 rounded ${pageNumber === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllClassAdmin;
