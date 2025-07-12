import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const MyClassDetails = () => {
  const { id } = useParams();
  const API = import.meta.env.VITE_API_URL;

  const [classInfo, setClassInfo] = useState(null);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  // Fetch class info
  useEffect(() => {
    fetch(`${API}/classes/${id}`)
      .then((res) => res.json())
      .then((data) => setClassInfo(data))
      .catch(() => toast.error("Failed to load class info"));
  }, [id, API]);

  // Fetch assignment count
  useEffect(() => {
    fetch(`${API}/assignments/${id}`)
      .then((res) => res.json())
      .then((data) => setAssignmentsCount(data.length))
      .catch(() => toast.error("Failed to load assignments"));
  }, [id, API]);

  // Fetch submissions count for the class
  useEffect(() => {
    fetch(`${API}/submissions/class/${id}`)
      .then((res) => res.json())
      .then((data) => setSubmissionsCount(data.length))
      .catch(() => toast.error("Failed to load submissions"));
  }, [id, API]);

  // Handle assignment creation
  const handleAssignmentCreate = async (e) => {
    e.preventDefault();

    if (!newAssignment.title.trim()) {
      return toast.error("Assignment title is required.");
    }

    if (!newAssignment.deadline) {
      return toast.error("Assignment deadline is required.");
    }

    const payload = {
      ...newAssignment,
      classId: id,
    };

    try {
      const res = await fetch(`${API}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create assignment");

      toast.success("Assignment created!");
      setNewAssignment({ title: "", description: "", deadline: "" });
      setAssignmentsCount((prev) => prev + 1);
    } catch (err) {
      toast.error(err.message || "Error creating assignment");
    }
  };

  if (!classInfo) {
    return <div className="text-center mt-10 text-lg">Loading class info...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">{classInfo.title}</h1>
      <p className="text-blue-600 text-sm mt-1">{classInfo.section || "Section 1"}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="border border-gray-300 p-4 rounded-lg bg-white shadow">
          <h3 className="text-sm text-gray-600">Total Enrollment</h3>
          <p className="text-xl font-bold">{classInfo.totalEnrollment}</p>
        </div>
        <div className="border border-gray-300 p-4 rounded-lg bg-white shadow">
          <h3 className="text-sm text-gray-600">Total Assignments</h3>
          <p className="text-xl font-bold">{assignmentsCount}</p>
        </div>
        <div className="border border-gray-300 p-4 rounded-lg bg-white shadow">
          <h3 className="text-sm text-gray-600">Total Assignment Submissions</h3>
          <p className="text-xl font-bold">{submissionsCount}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Class Assignments</h2>

        <form onSubmit={handleAssignmentCreate} className="space-y-4 max-w-md">
          <input
            type="text"
            placeholder="Assignment Title"
            value={newAssignment.title}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <textarea
            placeholder="Description"
            value={newAssignment.description}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={3}
          ></textarea>

          {/* Date Picker for Deadline */}
          <input
            type="date"
            value={newAssignment.deadline}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, deadline: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />

          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FaPlus /> Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyClassDetails;
