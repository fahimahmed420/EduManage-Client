import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";

const EnrollClassDetails = () => {
  const { id: classId } = useParams();
  const { userFromDB } = useContext(AuthContext);

  const [assignments, setAssignments] = useState([]);
  const [submitting, setSubmitting] = useState({});
  const [submissionLinks, setSubmissionLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch assignments for this class
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/assignments/${classId}`
        );
        setAssignments(res.data);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
        setError("Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [classId]);

  // Handle assignment submission
  const handleSubmit = async (assignmentId) => {
    const link = submissionLinks[assignmentId]?.trim();
    if (!link) {
      toast.error("Please enter a submission link.");
      return;
    }

    try {
      setSubmitting((prev) => ({ ...prev, [assignmentId]: true }));

      const submissionPayload = {
        studentId: userFromDB._id,
        assignmentId,
        submissionLink: link,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/submissions`,
        submissionPayload
      );
      console.log(res);

      toast.success("Assignment submitted!");
      setSubmissionLinks((prev) => ({ ...prev, [assignmentId]: "" }));
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Failed to submit assignment.");
    } finally {
      setSubmitting((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg font-medium">Loading assignments...</span>
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
      <h1 className="text-3xl font-bold mb-6">Class Assignments</h1>
      {assignments.length === 0 ? (
        <p className="text-gray-600">No assignments have been added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-200 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Deadline</th>
                <th className="px-4 py-2">Submit</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className="border-t">
                  <td className="px-4 py-2">{assignment.title}</td>
                  <td className="px-4 py-2">{assignment.description}</td>
                  <td className="px-4 py-2">
                    {assignment.deadline
                      ? new Date(assignment.deadline).toLocaleString()
                      : "No deadline"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        placeholder="Submission link"
                        className="border px-2 py-1 rounded w-60"
                        value={submissionLinks[assignment._id] || ""}
                        onChange={(e) =>
                          setSubmissionLinks((prev) => ({
                            ...prev,
                            [assignment._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleSubmit(assignment._id)}
                        disabled={submitting[assignment._id]}
                      >
                        {submitting[assignment._id] ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnrollClassDetails;
