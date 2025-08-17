import React from "react";

const TestimonialsSkeleton = () => {
  // Determine number of cards for each breakpoint using Tailwind's responsive grid
  const cards = [1, 2, 3, 4, 5]; // Max cards for xl

  return (
    <section className="py-12 flex flex-col items-center">
      {/* Title Skeleton */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full"></div>
        <div className="w-44 h-6 bg-gray-300 animate-pulse rounded"></div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full max-w-7xl px-6">
        {cards.map((item) => (
          <div
            key={item}
            className="bg-gray-300 rounded-2xl p-6 flex flex-col items-center shadow-md animate-pulse"
          >
            {/* Avatar */}
            <div className="w-20 h-20 bg-gray-400 rounded-full mb-4"></div>

            {/* Name */}
            <div className="w-32 h-5 bg-gray-400 rounded mb-2"></div>

            {/* Role */}
            <div className="w-28 h-4 bg-gray-400 rounded mb-4"></div>

            {/* Review text */}
            <div className="w-48 h-4 bg-gray-400 rounded mb-2"></div>
            <div className="w-40 h-4 bg-gray-400 rounded mb-6"></div>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-400 rounded"></div>
              ))}
            </div>

            {/* Date */}
            <div className="w-20 h-4 bg-gray-400 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSkeleton;
