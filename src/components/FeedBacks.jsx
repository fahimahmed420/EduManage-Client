import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaQuoteRight } from "react-icons/fa"; // ✅ Relevant icon added
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeedBacks = () => {
  const API = import.meta.env.VITE_API_URL;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const [feedbackRes, usersRes, classesRes] = await Promise.all([
        axios.get(`${API}/feedback`),
        axios.get(`${API}/users`),
        axios.get(`${API}/classes`),
      ]);

      const feedbackList = feedbackRes.data;
      const users = usersRes.data;
      const classes = classesRes.data;

      return feedbackList.map((feedback) => {
        const student = users.find((user) => user._id === feedback.studentId);
        const classInfo = classes.find((cls) => cls._id === feedback.classId);

        return {
          ...feedback,
          student,
          classInfo,
        };
      });
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const cardColors = [
    "from-blue-100 to-blue-300",
    "from-indigo-100 to-indigo-300",
    "from-cyan-100 to-cyan-300",
  ];

  if (isLoading) {
    return <div className="text-center py-10">Loading feedbacks...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load feedbacks: {error.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-10">No feedbacks available.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-8 flex items-center justify-center gap-3">
        <FaQuoteRight className="text-blue-700 w-8 h-8" />
        What Students Say
      </h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="feedback-carousel"
      >
        {data.map((fb, index) => (
          <SwiperSlide key={fb._id}>
            <div
              className={`bg-gradient-to-br ${cardColors[index % cardColors.length]} rounded-xl shadow-lg p-6 m-6 flex flex-col items-center text-center hover:shadow-2xl transition-transform duration-300 hover:scale-105`}
            >
              <img
                src={fb.student?.photo || "/default-avatar.png"}
                alt={fb.student?.name || "Anonymous"}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 mb-4"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {fb.student?.name || "Anonymous"}
              </h3>
              <p className="text-sm text-blue-600 font-medium mb-2">
                {fb.classInfo?.title || "Unknown Class"}
              </p>
              <p className="text-gray-700 italic mb-3">
                “
                {fb.description.length > 100
                  ? `${fb.description.slice(0, 100)}...`
                  : fb.description}
                ”
              </p>
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={i < fb.rating ? "orange" : "gray"}
                    className="w-5 h-5"
                  >
                    <path d="M9.049 2.927a.75.75 0 011.402 0l1.286 3.95h4.156a.75.75 0 01.442 1.353l-3.362 2.445 1.287 3.95a.75.75 0 01-1.155.853L10 13.348l-3.363 2.445a.75.75 0 01-1.155-.853l1.287-3.95-3.362-2.445a.75.75 0 01.442-1.353h4.156l1.286-3.95z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {fb.createdAt
                  ? new Date(fb.createdAt).toLocaleDateString()
                  : "Date Unknown"}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeedBacks;
