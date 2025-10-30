import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Eye, CheckCircle, XCircle, Trash2, MapPin } from "lucide-react";
import BASE_URL from "../config";
import FineSelect from "../context/FineSelect";

const ViewApplication = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Filters
  const [selectedProfession, setSelectedProfession] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest"); // latest | oldest

  // Fetch recruiter applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}/jobs/applications/recruiter`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data.success) {
        setApplications(data.applications);
        setFilteredApplications(data.applications);
      } else toast.error("Failed to fetch applications!");
    } catch (err) {
      //console.error(err);
      toast.error("Error fetching applications!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // 🔹 Apply filters and sorting whenever filter/sort changes
  useEffect(() => {
    let filtered = [...applications];

    // Profession filter
    if (selectedProfession !== "All") {
      filtered = filtered.filter((app) =>
        (app.user?.profession || app.job?.title)
          ?.toLowerCase()
          .includes(selectedProfession.toLowerCase())
      );
    }

    // Sort by date (assuming `app.createdAt` exists)
    filtered.sort((a, b) => {
      const dateA = new Date(a.appliedAt);
      const dateB = new Date(b.appliedAt);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredApplications(filtered);
  }, [applications, selectedProfession, sortOrder]);

  // Get unique professions
  const professions = [
    "All",
    ...new Set(
      applications
        .map((app) => app.user?.profession || app.job?.title)
        .filter(Boolean)
    ),
  ];

  const handleApplicationAction = async (id, action) => {
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/user/jobs/applications/${id}`,
        { action },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: action } : a))
        );
        toast.success(`Application ${action}ed`);
      }
    } catch (err) {
      toast.error("Error performing action");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 font-outfit">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">Applicants</h2>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Profession Filter */}
          <div className="w-52">
            <FineSelect
              label="Profession"
              options={professions.map((prof) => ({
                label: prof,
                value: prof,
              }))}
              value={selectedProfession}
              onChange={setSelectedProfession}
              placeholder="Filter by profession"
            />
          </div>

          {/* Sort Filter */}
          <div className="w-52">
            <FineSelect
              label="Sort By"
              options={[
                { label: "Latest to Oldest", value: "latest" },
                { label: "Oldest to Latest", value: "oldest" },
              ]}
              value={sortOrder}
              onChange={setSortOrder}
              placeholder="Sort order"
            />
          </div>
        </div>
      </div>

      {/* Applicants List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading applications...</p>
      ) : filteredApplications.length === 0 ? (
        <p className="text-center text-gray-500">
          No job applications found for this selection.
        </p>
      ) : (
        <div className="grid 2xl:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-6">
          {filteredApplications.map((app, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col sm:flex-row gap-4 items-center"
            >
              <img
                src={app.user?.profileImage || "/default-avatar.png"}
                alt={app.user?.firstName}
                className="w-20 h-20 rounded-full object-cover border"
              />

              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                  {app.user?.firstName} {app.user?.lastName}
                  {(app.user?.isGoldMember === true ||
                    app.user?.isGoldMember === "true") && (
                    <span className="text-blue-600 whitespace-nowrap bg-blue-50 border border-blue-200 text-[10px] font-medium px-2 py-[2px] rounded-full flex items-center gap-1">
                      ✅ Verified
                    </span>
                  )}
                </h3>

                <p className="text-blue-600 text-sm">
                  {app.user?.profession || app.job?.title}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-gray-500 text-sm mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {app.job?.location || "Nigeria"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Applied: {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2 mt-3 sm:mt-0">
                <button
                  onClick={() => {
                    setSelectedApp(app);
                    setShowModal(true);
                  }}
                  className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  <Eye size={18} />
                </button>
                <div className="flex  items-center gap-2">
                  {/* ✅ Accept Button */}
                  <button
                    disabled={app.status !== "pending"}
                    onClick={() => handleApplicationAction(app._id, "accepted")}
                    className={`p-2 rounded transition-all ${
                      app.status === "accepted"
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                    title="Accept Application"
                  >
                    <CheckCircle size={18} />
                  </button>

                  {/* ❌ Reject Button */}
                  <button
                    disabled={app.status !== "pending"}
                    onClick={() => handleApplicationAction(app._id, "rejected")}
                    className={`p-2 rounded transition-all ${
                      app.status === "rejected"
                        ? "bg-red-500 text-white cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                    title="Reject Application"
                  >
                    <XCircle size={18} />
                  </button>

                  {/* 🕒 Status Label */}
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      app.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>

                <button className="p-2 bg-gray-50 text-gray-500 rounded hover:bg-gray-100">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-3 sm:px-4">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <div className="overflow-y-auto p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedApp.user?.profileImage || "/default-avatar.png"}
                  alt="User"
                  className="w-20 h-20 rounded-full border object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedApp.user?.firstName} {selectedApp.user?.lastName}
                  </h2>
                  <p className="text-gray-500">
                    {selectedApp.user?.profession || selectedApp.job?.title}
                  </p>
                </div>
              </div>

              <h4 className="font-medium text-gray-800 mb-2">Cover Letter</h4>
              <div
                className="bg-gray-50 p-4 rounded text-sm text-gray-700 mb-6"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedApp.coverLetter || "No cover letter provided.",
                }}
              />

              {selectedApp.user?.resumes &&
              selectedApp.user?.resumes.length > 0 ? (
                <ul className=" text-sm text-gray-700 space-y-1">
                  {selectedApp.user?.resumes.map((resume, index) => (
                    <li key={index}>
                      <a
                        href={`https://app.assuchglobal.com${resume.url}`} // adjust BASE_URL if needed
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium inline-block"
                      >
                        Download Resume
                      </a>{" "}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No resume uploaded</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplication;
