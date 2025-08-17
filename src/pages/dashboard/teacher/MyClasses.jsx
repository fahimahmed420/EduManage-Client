import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

const LIMIT = 6; // number of classes per page

const MyClasses = () => {
  const { user } = useContext(AuthContext);
  const [editingClass, setEditingClass] = useState(null);
  const [removingIds, setRemovingIds] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  // Fetch paginated classes
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myClasses", user?.email, page],
    queryFn: async () => {
      const res = await axios.get(`${API}/classes`, {
        params: {
          teacherEmail: user.email,
          page,
          limit: LIMIT,
        },
      });
      return res.data; // expecting { classes: [], total: number }
    },
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  const classes = data?.classes || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / LIMIT);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This class will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#a0aec0",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setRemovingIds((prev) => [...prev, id]);
      await new Promise((resolve) => setTimeout(resolve, 400));

      await axios.delete(`${API}/classes/${id}`);

      toast.success("✅ Class deleted successfully!");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete class");
    } finally {
      setRemovingIds((prev) => prev.filter((remId) => remId !== id));
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().min(3, "Must be at least 3 characters").required("Required"),
    description: Yup.string().min(10, "Must be at least 10 characters").required("Required"),
    price: Yup.number().positive("Must be a positive number").required("Required"),
    image: Yup.string().url("Must be a valid URL").required("Required"),
  });

  const handleUpdateSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.patch(`${API}/classes/${editingClass._id}`, values);

      toast.success("✅ Class updated successfully!");
      setEditingClass(null);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update class");
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="min-h-screen flex justify-center items-center text-red-600">
        <p className="text-lg font-semibold">Error: {error.message}</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold">No classes found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 mx-auto max-w-7xl rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">My Classes</h1>

      <div className="space-y-6">
        {classes.map((cls) => {
          const isActive =
            cls.status?.toLowerCase() === "approved" ||
            cls.status?.toLowerCase() === "active";

          return (
            <div
              key={cls._id}
              className={`flex justify-between bg-gray-50 rounded-lg shadow-sm p-4 transition-all duration-500 ease-in-out
                  hover:shadow-md hover:scale-[1.02]
                  ${removingIds.includes(cls._id) ? "opacity-50 blur-sm" : ""}
              `}
            >
              <div className="flex-1 pr-4">
                <p
                  className={`text-sm px-2 py-1 w-fit rounded-full
                      ${isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                    }
                  `}
                >
                  {isActive ? "Active" : "Pending"}
                </p>

                <h2 className="text-lg font-semibold mt-1">{cls.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Name:</span> {cls.teacherName},&nbsp;
                  <span className="font-medium">Email:</span> {cls.teacherEmail},&nbsp;
                  <span className="font-medium">Price:</span> ${cls.price},&nbsp;
                  <span className="font-medium">Description:</span> {cls.description}
                </p>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {isActive ? (
                    <button
                      onClick={() => navigate(`/dashboard/my-classes/${cls._id}`)}
                      className="px-3 py-1 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
                    >
                      See Details
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-400 rounded cursor-not-allowed"
                    >
                      See Details
                    </button>
                  )}
                  <button
                    onClick={() => setEditingClass(cls)}
                    className="px-3 py-1 text-sm font-medium bg-yellow-200 rounded hover:bg-yellow-300 transition cursor-pointer"
                  >
                    Update Class
                  </button>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="px-3 py-1 text-sm font-medium bg-red-200 rounded hover:bg-red-300 transition cursor-pointer"
                  >
                    Delete Class
                  </button>
                </div>
              </div>

              <div className="w-40 flex-shrink-0">
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="rounded-md w-full h-28 object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2 flex-wrap">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
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
              className={`px-4 py-2 rounded hover:bg-blue-500 hover:text-white ${page === pageNum ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Update Modal with animation */}
      <AnimatePresence>
        {editingClass && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/20"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl relative"
            >
              <h2 className="text-xl font-bold mb-4">Update Class</h2>
              <Formik
                initialValues={{
                  title: editingClass.title,
                  description: editingClass.description,
                  price: editingClass.price,
                  image: editingClass.image,
                }}
                validationSchema={validationSchema}
                onSubmit={handleUpdateSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Field
                        type="text"
                        name="title"
                        className="w-full border border-gray-200 rounded p-2 focus:border-blue-300 focus:ring focus:ring-blue-100 transition"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        className="w-full border border-gray-200 rounded p-2 focus:border-blue-300 focus:ring focus:ring-blue-100 transition"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Price ($)</label>
                      <Field
                        type="number"
                        name="price"
                        className="w-full border border-gray-200 rounded p-2 focus:border-blue-300 focus:ring focus:ring-blue-100 transition"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <Field
                        type="text"
                        name="image"
                        className="w-full border border-gray-200 rounded p-2 focus:border-blue-300 focus:ring focus:ring-blue-100 transition"
                      />
                      <ErrorMessage
                        name="image"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setEditingClass(null)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyClasses;
