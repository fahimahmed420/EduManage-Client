import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const TeacherRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  useEffect(() => {
    axios
      .get(`${API}/teacherRequests`)
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch teacher requests.");
        setLoading(false);
      });
  }, [API]);

  const handleUpdateStatus = async (id, email, status) => {
    const request = requests.find((r) => r._id === id);
    if (!request || request.status === status) return;

    const confirmResult = await Swal.fire({
      title: `Confirm ${status === "accepted" ? "Approval" : "Rejection"}`,
      text: `Are you sure you want to ${status} this request?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await axios.patch(`${API}/teacherRequests/${id}`, { status });

      if (status === "accepted") {
        try {
          await axios.patch(`${API}/users/role/${email}`, { role: "teacher" });
          toast.success("✅ Approved & role updated!", {
            position: "bottom-right",
            theme: "colored",
          });
        } catch (roleErr) {
          if (roleErr.response && roleErr.response.status === 404) {
            toast.success("✅ Approved (role was already updated)", {
              position: "bottom-right",
              theme: "colored",
            });
          } else {
            throw roleErr;
          }
        }
      } else {
        toast.info("❌ Request rejected", {
          position: "bottom-right",
          theme: "colored",
        });
      }

      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status } : req))
      );
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating request", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 overflow-x-auto">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Teacher Requests</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-left text-xs sm:text-sm select-none">
            <th className="py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-300 font-medium">Name</th>
            <th className="hidden sm:table-cell py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-300 font-medium">Image</th>
            <th className="py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-300 font-medium">Experience</th>
            <th className="hidden md:table-cell py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-300 font-medium">Title</th>
            <th className="hidden lg:table-cell py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-300 font-medium">Category</th>
            <th className="py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-300 font-medium">Status</th>
            <th className="py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r, i) => (
            <tr
              key={r._id}
              className={`text-gray-800 text-xs sm:text-sm ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition-colors`}
            >
              <td className="py-2 px-2 sm:py-3 sm:px-4 font-semibold">{r.name}</td>
              <td className="hidden sm:table-cell py-2 px-2 sm:py-3 sm:px-4">
                <img
                  src={r.photo}
                  alt={r.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300"
                />
              </td>
              <td className="py-2 px-2 sm:py-3 sm:px-4">{r.experienceLevel}</td>
              <td className="hidden md:table-cell py-2 px-2 sm:py-3 sm:px-4">{r.title}</td>
              <td className="hidden lg:table-cell py-2 px-2 sm:py-3 sm:px-4">{r.category}</td>
              <td className="py-2 px-2 sm:py-3 sm:px-4">
                <span
                  className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                    r.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : r.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </td>
              <td className="py-2 px-2 sm:py-3 sm:px-4 space-x-2 whitespace-nowrap">
                {r.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(r._id, r.email, "accepted")}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold transition text-xs sm:text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(r._id, r.email, "rejected")}
                      className="text-red-600 hover:text-red-800 font-semibold transition text-xs sm:text-sm"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 italic text-xs sm:text-sm">Action Completed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherRequests;
