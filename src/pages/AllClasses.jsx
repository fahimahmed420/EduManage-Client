import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import debounce from "lodash.debounce";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const LIMIT = 8;

const fetchClasses = async ({ queryKey }) => {
  const [, page, searchTerm, sortOrder] = queryKey;
  const res = await axios.get(`${API}/classes`, {
    params: {
      page,
      limit: LIMIT,
      search: searchTerm,
      sort: sortOrder,
    },
  });
  return res.data; // { classes, total }
};

const sortOptions = [
  { label: "Sort by Price", value: "" },
  { label: "Low to High", value: "asc" },
  { label: "High to Low", value: "desc" },
];

const AllClasses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const navigate = useNavigate();

  // Debounced search to reduce API calls
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const handleSearch = debounce((value) => {
    setPage(1);
    setDebouncedSearch(value);
  }, 300);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["classes", page, debouncedSearch, sortOrder],
    queryFn: fetchClasses,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const totalPages = data?.total ? Math.ceil(data.total / LIMIT) : 1;

  return (
    <section className="section-0 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center md:text-left text-blue-600">
          Approved Classes
        </h2>

        {/* Search + Sort */}
        <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search classes by name..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Sort */}
          <div className="w-full sm:w-40">
            <Listbox value={sortOrder} onChange={(value) => setSortOrder(value)}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span>
                    {sortOptions.find((o) => o.value === sortOrder)?.label ||
                      "Sort by Price"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>

                <Listbox.Options className="absolute mt-1 w-full rounded-lg border border-blue-400 bg-white shadow-lg z-10">
                  {sortOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active, selected }) =>
                        `relative cursor-pointer select-none rounded-lg px-4 py-2 ${
                          active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                        } ${selected ? "font-semibold" : ""}`
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {selected && <CheckIcon className="h-4 w-4 text-blue-600" />}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>

        {/* Loading / Error / Empty */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(LIMIT)].map((_, i) => (
              <div
                key={i}
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
        ) : isError ? (
          <div className="text-center text-red-600 text-lg py-20">
            Error loading classes: {error.message}
          </div>
        ) : data?.classes?.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-20">
            No classes found
          </div>
        ) : (
          <>
            {/* Class Cards */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.classes.map((cls) => (
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
                      <p className="text-sm text-gray-700 font-medium">${cls.price}</p>
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

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2 flex-wrap">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-4 py-2 rounded hover:bg-blue-500 hover:text-white ${
                    page === num ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AllClasses;
