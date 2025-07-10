import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

const AllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/classes`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Error fetching classes:", err))
      .finally(() => setLoading(false));
  }, []);

  const approvedClasses = classes.filter((cls) => cls.status === "approved");

  const filteredClasses = approvedClasses.filter((cls) =>
    cls.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center md:text-left">
        Approved Classes
      </h2>

      {/* Search Bar with Icon */}
      <div className="relative mb-6 w-full sm:w-1/2">
        <input
          type="text"
          placeholder="Search classes by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Skeleton Loader */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 rounded-xl overflow-hidden shadow flex flex-col"
            >
              <div className="h-40 bg-gray-300 w-full"></div>
              <div className="p-4 space-y-3 flex-grow">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 bg-gray-300 rounded mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-20">
          No classes found for "<span className="font-medium">{searchTerm}</span>"
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredClasses.map((cls) => (
            <div
              key={cls._id}
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col"
            >
              <img
                src={cls.image || "https://via.placeholder.com/400x250"}
                alt={cls.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-semibold truncate">{cls.title}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    By {cls.teacherName}
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    ${cls.price}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {cls.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {cls.totalEnrollment} students enrolled
                  </p>
                </div>
                <button
                  className="mt-auto w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  onClick={() => navigate(`/all-classes/${cls._id}`)}
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllClasses;
