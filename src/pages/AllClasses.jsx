import { useEffect, useState } from "react";
import axios from "axios";

const AllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/classes`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Error fetching classes:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Loading classes...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Approved Classes</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((cls) => (
          <div
            key={cls._id}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition duration-300"
          >
            <img
              src={cls.image || "https://via.placeholder.com/400x250"}
              alt={cls.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">{cls.title}</h3>
              <p className="text-sm text-gray-500">By {cls.teacherName}</p>
              <p className="text-sm text-gray-600">
                ${cls.price} | {cls.description}
              </p>
              <p className="text-sm text-gray-500">
                {cls.totalEnrollment} students enrolled
              </p>
              <button className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium">
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllClasses;
