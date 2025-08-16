import React from "react";

const JoinEduManageSkeleton = () => {
  const cards = [
    {
      title: "Total Users",
      colors: ["#bfdbfe", "#60a5fa", "#1e3a8a", "#1e3a8a", "#1e40af"],
    },
    {
      title: "Total Classes",
      colors: ["#bbf7d0", "#34d399", "#065f46", "#065f46", "#047857"],
    },
    {
      title: "Total Enrollments",
      colors: ["#e9d5ff", "#c084fc", "#6b21a8", "#6b21a8", "#7e22ce"],
    },
    {
      title: "Active Teachers",
      colors: ["#fde68a", "#fbbf24", "#92400e", "#92400e", "#b45309"],
    },
  ];

  return (
    <section className="py-12 flex flex-col items-center">
      {/* Title Skeleton */}
      <div className="flex items-center gap-2 mb-12">
        <div className="w-6 h-6 bg-blue-400 animate-pulse rounded-full"></div>
        <div className="w-48 h-6 bg-blue-400 animate-pulse rounded"></div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-7xl px-4">
        {/* Left - Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="rounded-xl p-6 shadow-md flex flex-col justify-center"
              style={{
                background: `linear-gradient(135deg, ${card.colors[0]}, ${card.colors[1]})`,
              }}
            >
              {/* Icon + Title */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gray-300 animate-pulse rounded"></div>
                <div className="w-28 h-5 bg-gray-300 animate-pulse rounded"></div>
              </div>
              {/* Number */}
              <div className="w-10 h-6 bg-gray-300 animate-pulse rounded"></div>
            </div>
          ))}
        </div>

        {/* Right - Illustration */}
        <div className="flex justify-center">
          <div className="w-72 h-56 bg-gray-300 animate-pulse rounded-xl"></div>
        </div>
      </div>
    </section>
  );
};

export default JoinEduManageSkeleton;
