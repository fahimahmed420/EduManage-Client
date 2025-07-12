import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";
import Rating from "react-rating";
import { FaStar, FaRegStar } from "react-icons/fa";

const EnrollClassDetails = () => {
  const { id: classId } = useParams();
  const { userFromDB } = useContext(AuthContext);

  const [assignments, setAssignments] = useState([]);
  const [submitting, setSubmitting] = useState({});
  const [submissionLinks, setSubmissionLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Feedback Modal State
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    description: "",
  });

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/assignments/${classId}`);
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
        classId,
        submissionLink: link,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/submissions`, submissionPayload);
      toast.success("Assignment submitted!");
      setSubmissionLinks((prev) => ({ ...prev, [assignmentId]: "" }));
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Failed to submit assignment.");
    } finally {
      setSubmitting((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  const handleFeedbackSend = async () => {
    if (!feedback.rating || !feedback.description.trim()) {
      return toast.error("All fields are required.");
    }

    const payload = {
      studentId: userFromDB._id,
      classId,
      description: feedback.description.trim(),
      rating: feedback.rating,
      createdAt: new Date(),
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/feedback`, payload);
      toast.success("Feedback sent!");
      setFeedback({ rating: 0, description: "" });
      setShowModal(false);
    } catch (err) {
      console.error("Failed to send feedback:", err);
      toast.error("Failed to send feedback.");
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
      {/* TER Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Teaching Evaluation Report (TER)
        </button>
      </div>

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

      {/* Feedback Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Teaching Evaluation Report</h2>

            <label className="block mb-2 font-medium">Rating:</label>
            <Rating
              initialRating={feedback.rating}
              onChange={(rate) => setFeedback((prev) => ({ ...prev, rating: rate }))}
              fullSymbol={<FaStar className="text-yellow-400 text-2xl" />}
              emptySymbol={<FaRegStar className="text-gray-300 text-2xl" />}
            />

            <label className="block mt-4 mb-2 font-medium">Description:</label>
            <textarea
              rows="4"
              placeholder="Write your feedback..."
              className="w-full px-3 py-2 border rounded"
              value={feedback.description}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, description: e.target.value }))
              }
            />

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSend}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollClassDetails;
