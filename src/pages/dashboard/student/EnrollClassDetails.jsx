import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Rating from "react-rating";
import { FaStar, FaRegStar } from "react-icons/fa";
import { AuthContext } from "../../../contexts/AuthContext";

const EnrollClassDetails = () => {
  const { id: classId } = useParams();
  const { userFromDB } = useContext(AuthContext);
  const API = import.meta.env.VITE_API_URL;

  const [assignments, setAssignments] = useState([]);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [feedbackExists, setFeedbackExists] = useState(false);
  const [submitting, setSubmitting] = useState({});
  const [submissionLinks, setSubmissionLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ description: "", rating: 0 });

  useEffect(() => {
    if (!userFromDB?._id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [assignmentsRes, submissionsRes, feedbackCheckRes] = await Promise.all([
          axios.get(`${API}/assignments/${classId}`),
          axios.get(`${API}/submissions`, {
            params: {
              studentId: userFromDB._id,
              classId,
            },
          }),
          axios.get(`${API}/feedback/check`, {
            params: {
              classId,
              studentId: userFromDB._id,
            },
          }),
        ]);

        setAssignments(assignmentsRes.data || []);
        setStudentSubmissions(submissionsRes.data || []);
        setFeedbackExists(feedbackCheckRes.data?.exists || false);
      } catch (err) {
        console.error("❌ Failed to fetch class details", err);
        toast.error("Error loading class details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, API, userFromDB]);

  const hasSubmitted = (assignmentId) =>
    studentSubmissions?.some((sub) => sub.assignmentId === assignmentId);

  const handleSubmit = async (assignmentId) => {
    const link = submissionLinks[assignmentId]?.trim();
    if (!link) return toast.error("Please enter a submission link.");
    if (hasSubmitted(assignmentId)) return toast.error("Already submitted.");

    try {
      setSubmitting((prev) => ({ ...prev, [assignmentId]: true }));

      await axios.post(`${API}/submissions`, {
        studentId: userFromDB._id,
        assignmentId,
        classId,
        submissionLink: link,
      });

      toast.success("Assignment submitted!");
      setSubmissionLinks((prev) => ({ ...prev, [assignmentId]: "" }));
      setStudentSubmissions((prev) => [
        ...prev,
        { assignmentId },
      ]);
    } catch (err) {
      toast.error(err.response?.data?.error || "Submission failed");
    } finally {
      setSubmitting((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackData.rating || !feedbackData.description.trim()) {
      return toast.error("Please provide both rating and description.");
    }

    try {
      await axios.post(`${API}/feedback`, {
        ...feedbackData,
        studentId: userFromDB._id,
        classId,
        createdAt: new Date(),
      });

      toast.success("Feedback submitted!");
      setFeedbackExists(true);
      setFeedbackData({ description: "", rating: 0 });
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit feedback.");
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-1/2">
    <div className="flex gap-x-2">
      <div className="w-5 h-5 bg-[#d991c2] animate-pulse rounded-full"></div>
      <div className="w-5 h-5 bg-[#9869b8] animate-bounce rounded-full"></div>
      <div className="w-5 h-5 bg-[#6756cc] animate-pulse rounded-full"></div>
    </div>
  </div>;

  return (
    <div className="max-w-7xl p-4 mx-auto relative">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">Class Assignments</h1>

      <button
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        onClick={() => setModalOpen(true)}
        disabled={feedbackExists}
      >
        {feedbackExists ? "Feedback Submitted" : "Teaching Evaluation Report (TER)"}
      </button>

      {assignments.length === 0 ? (
        <p>No assignments has been assigned for this class yet.</p>
      ) : (
        <table className="table-auto w-full border">
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
                  {hasSubmitted(assignment._id) ? (
                    <span className="text-green-600 font-medium">Submitted</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        className="border px-2 py-1 rounded w-60"
                        placeholder="Submission link"
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Feedback Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Teaching Evaluation Report</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Rating</label>
              <Rating
                initialRating={feedbackData.rating}
                onChange={(rate) =>
                  setFeedbackData((prev) => ({ ...prev, rating: rate }))
                }
                fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                emptySymbol={<FaRegStar className="text-gray-300 text-2xl" />}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={4}
                value={feedbackData.description}
                onChange={(e) =>
                  setFeedbackData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              ></textarea>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleFeedbackSubmit}
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
