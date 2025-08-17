import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherRequests = () => {
  const API = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  //  Fetch teacher requests with auto refetch every 5 seconds
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["teacherRequests"],
    queryFn: async () => {
      const res = await axios.get(`${API}/teacherRequests`);
      return res.data;
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
  });


  // Mutation to update request status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axios.patch(`${API}/teacherRequests/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teacherRequests"]);
    },
    onError: () => {
      toast.error("Error updating request", {
        position: "bottom-right",
        theme: "colored",
      });
    },
  });

  // Mutation to update user role
  const updateRoleMutation = useMutation({
    mutationFn: async (email) => {
      return await axios.patch(`${API}/users/role/${email}`, { role: "teacher" });
    },
    onError: (error) => {
      if (error?.response?.status === 404) {
        toast.success("✅ Approved (role already updated)", {
          position: "bottom-right",
          theme: "colored",
        });
      } else {
        toast.error("Error updating role", {
          position: "bottom-right",
          theme: "colored",
        });
      }
    },
  });

  const handleUpdateStatus = async (id, email, status, currentStatus) => {
    if (currentStatus === status) return;

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
      await updateStatusMutation.mutateAsync({ id, status });

      if (status === "accepted") {
        await updateRoleMutation.mutateAsync(email);
        toast.success("✅ Approved & role updated!", {
          position: "bottom-right",
          theme: "colored",
        });
      } else {
        toast.info("❌ Request rejected", {
          position: "bottom-right",
          theme: "colored",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-1/2">
      <div className="flex gap-x-2">
        <div className="w-5 h-5 bg-[#d991c2] animate-pulse rounded-full"></div>
        <div className="w-5 h-5 bg-[#9869b8] animate-bounce rounded-full"></div>
        <div className="w-5 h-5 bg-[#6756cc] animate-pulse rounded-full"></div>
      </div>
    </div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 overflow-x-auto">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-500">
        Teacher Requests
      </h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-left text-xs sm:text-sm select-none">
            <th className="py-2 px-4 font-medium">Name</th>
            <th className="hidden sm:table-cell py-2 px-4 font-medium">Image</th>
            <th className="py-2 px-4 font-medium">Experience</th>
            <th className="hidden md:table-cell py-2 px-4 font-medium">Title</th>
            <th className="hidden lg:table-cell py-2 px-4 font-medium">Category</th>
            <th className="py-2 px-4 font-medium">Status</th>
            <th className="py-2 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r, i) => (
            <tr
              key={r._id}
              className={`text-gray-800 text-xs sm:text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors`}
            >

              <td className="py-2 px-4 font-semibold">{r.name}</td>
              <td className="hidden sm:table-cell py-2 px-4">
                <img
                  src={r.photo || "/default-avatar.png"}
                  alt={r.name}
                  onError={(e) => {
                    e.target.onerror = null; // ⛔ prevent infinite fallback loop
                    e.target.src = "/default-avatar.png";
                    console.log("Photo URL:", r);

                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300"
                />

              </td>
              <td className="py-2 px-4">{r.experienceLevel}</td>
              <td className="hidden md:table-cell py-2 px-4">{r.title}</td>
              <td className="hidden lg:table-cell py-2 px-4">{r.category}</td>
              <td className="py-2 px-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${r.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : r.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </td>
              <td className="py-2 px-4">
                {r.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(r._id, r.email, "accepted", r.status)
                      }
                      className="text-indigo-600 hover:text-indigo-800 font-semibold transition text-xs sm:text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(r._id, r.email, "rejected", r.status)
                      }
                      className="text-red-600 hover:text-red-800 font-semibold transition text-xs sm:text-sm"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500 italic text-xs sm:text-sm">
                    Action Completed
                  </span>
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
