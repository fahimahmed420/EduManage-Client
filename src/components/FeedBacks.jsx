import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaQuoteRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import TestimonialsSkeleton from "./TestimonialsSkeleton";

const FeedBacks = () => {
  const API = import.meta.env.VITE_API_URL;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const [feedbackRes, usersRes, classesRes] = await Promise.all([
        axios.get(`${API}/feedback`),
        axios.get(`${API}/users`),
        axios.get(`${API}/classes?all=true`),
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

  if (isLoading) return <TestimonialsSkeleton />;
  if (isError)
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load feedbacks: {error.message}
      </div>
    );
  if (!data || data.length === 0)
    return <div className="text-center py-10">No feedbacks available.</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-8 flex items-center justify-center gap-3">
        <FaQuoteRight className="text-blue-600 w-8 h-8" />
        What Students Say
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={2} // default
        autoplay={{ delay: 4000 }}
        breakpoints={{
          640: { slidesPerView: 2 }, // small
          768: { slidesPerView: 3 }, // medium
          1024: { slidesPerView: 4 }, // large
          1280: { slidesPerView: 5 }, // extra large
        }}
        className="feedback-carousel">
        {data.map((fb, index) => (
          <SwiperSlide key={fb._id} className="p-4">
            <div
              className={`group bg-gradient-to-br ${cardColors[index % cardColors.length]
                } rounded-2xl p-6 flex flex-col min-h-[340px] items-center text-center shadow-lg shadow-[rgba(0,0,0,0.12)]
                hover:shadow-2xl hover:shadow-[rgba(0,0,0,0.18)] transition-all duration-500 hover:scale-105`}>
              {/* Avatar */}
              <div className="flex justify-center items-center mt-4">
                <img
                  src={fb.student?.photo || "/default-avatar.png"}
                  alt={fb.student?.name || "Anonymous"}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 shadow-md mb-4"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {fb.student?.name || "Anonymous"}
                </h3>
                <p className="text-sm text-blue-600 font-medium mb-2">
                  {fb.classInfo?.title || "Unknown Class"}
                </p>

                {/* FIXED HEIGHT DESCRIPTION */}
                <p className="text-gray-700 italic mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  “{fb.description}”
                </p>

                {/* Stars + Date */}
                <div className="mt-auto">
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
              </div>
            </div>
          </SwiperSlide>

        ))}
      </Swiper>
    </div>
  );
};

export default FeedBacks;
