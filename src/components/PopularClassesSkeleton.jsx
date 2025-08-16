import React from "react";

const PopularClassesSkeleton = () => {
  return (
    <section className="py-10">
      {/* Title Skeleton */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-6 h-6 bg-blue-400 animate-pulse rounded-full"></div>
        <div className="w-40 h-6 bg-blue-400 animate-pulse rounded"></div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 flex flex-col items-center shadow-md h-full"
          >
            {/* Circle image skeleton */}
            <div className="w-24 h-24 bg-gray-300 animate-pulse rounded-full mb-4"></div>

            {/* Title skeleton */}
            <div className="w-40 h-5 bg-gray-300 animate-pulse rounded mb-3"></div>

            {/* Description skeleton */}
            <div className="w-52 h-4 bg-gray-300 animate-pulse rounded mb-1"></div>
            <div className="w-32 h-4 bg-gray-300 animate-pulse rounded mb-6"></div>

            {/* Button skeleton */}
            <div className="w-32 h-10 bg-gray-300 animate-pulse rounded-full"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularClassesSkeleton;
