import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Users, Briefcase, User } from "lucide-react";
import { UserRound, UserLock, Check, Clock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminTabs from "../../Components/AdminTabs";
import BASE_URL from "../../config";
import ManageFAQs from "./ManageFAQs";
import { JobsContext } from "../../context/jobContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [users, setUsers] = useState([]);
  const { setUser } = useContext(JobsContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleView = (job) => setSelectedJob(job);
  const handleViewUser = (user) => setSelectedUser(user);

  const handleDelete = (id) => {
    setJobToDelete(id);
    setShowDeleteModal(true);
  };

  const handleTokenExpiry = () => {
    toast.error("Session expired. Please login again.");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/admin/jobs/${jobToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prev) => prev.filter((j) => j._id !== jobToDelete));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Delete job failed:", error);
      toast.error("Failed to delete job");
    } finally {
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  // Fetch data based on tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "jobs") {
          const { data } = await axios.get(`${BASE_URL}/admin/jobs`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJobs(Array.isArray(data) ? data : data.jobs || data.data || []);
        } else if (activeTab === "recruiters") {
          const { data } = await axios.get(`${BASE_URL}/admin/recruiters`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRecruiters(
            Array.isArray(data) ? data : data.recruiters || data.data || []
          );
        } else if (activeTab === "users") {
          const { data } = await axios.get(`${BASE_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(Array.isArray(data) ? data : data.users || data.data || []);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        if (err.response?.data?.message?.includes("Token expired")) {
        } else {
          toast.error("Failed to load data");
        }
      }
    };
    fetchData();
  }, [activeTab, token]);

  // Update job status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${BASE_URL}/admin/jobs/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJobs((prev) =>
        prev.map((job) => (job._id === id ? { ...job, status } : job))
      );
      toast.success(`Job marked as ${status}`);
    } catch (error) {
      console.error("Update status failed:", error);
      if (error.response?.data?.message?.includes("Token expired")) {
        handleTokenExpiry();
      } else {
        toast.error("Update failed");
      }
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      //console.warn("Backend logout failed:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/home");
    }
  };

  return (
    <div className=" bg-white font-outfit min-h-screen">
      <div className="w-full bg-white shadow-sm border-b border-gray-200 py-6">
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-0.5">
              <div className="px-0.5 h-8 bg-blue-600 rounded-lg text-sm flex items-center justify-center mr-3">
                <UserLock className="text-white" />
              </div>
              <div className="">
                <h1 className="md:text-xl text-base font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="md:text-sm text-xs text-gray-500">
                  Manage job posts, employers, and job seekers
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserRound className="text-blue-600" />
              </div>
              <span className="text-sm md:block hidden text-gray-700 font-medium">
                Admin User
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Summary cards (for Job Posts tab) */}

      {activeTab === "jobs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-blue-50 p-4 rounded-lg ">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Briefcase strokeWidth={1} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Jobs</p>
                <h2 className="text-2xl font-bold text-blue-900">
                  {jobs.length}
                </h2>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg ">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <Check strokeWidth={1} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Active Jobs
                </p>
                <h2 className="text-2xl font-bold text-green-900">
                  {jobs.filter((j) => j.status === "active").length}
                </h2>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg ">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                <Clock strokeWidth={1} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-yellow-600 font-medium">
                  Pending Jobs
                </p>
                <h2 className="text-2xl font-bold text-yellow-900">
                  {jobs.filter((j) => j.status === "pending").length}
                </h2>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <X strokeWidth={1} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">Expired Jobs</p>
                <h2 className="text-2xl font-bold text-red-900">
                  {
                    jobs.filter((j) => new Date(j.expirationDate) < new Date())
                      .length
                  }
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table section */}
      <div className="bg-white mt-6 font-outfit max-w-7xl mx-auto  rounded-lg shadow-sm overflow-x-auto">
        <div className="hidden sm:block overflow-x-auto">
          {activeTab === "jobs" && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className=" text-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.recruiter?.company?.name || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{job.minSalary?.toLocaleString()} - ₦
                      {job.maxSalary?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(() => {
                        const now = new Date();
                        const expiration = new Date(job.expirationDate);
                        const isExpired = expiration < now;

                        const displayStatus = isExpired
                          ? "expired"
                          : job.status;

                        const statusColor =
                          displayStatus === "active"
                            ? "bg-green-100 text-green-800"
                            : displayStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800";

                        return (
                          <span
                            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${statusColor}`}
                          >
                            {displayStatus}
                          </span>
                        );
                      })()}
                    </td>

                    {/* ✅ Action Bar */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-3 items-center">
                      {/* View Details */}
                      <button
                        onClick={() => handleView(job)}
                        title="View"
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.207.07.435 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>

                      {/* Approve */}
                      {job.status !== "active" && (
                        <button
                          onClick={() => updateStatus(job._id, "active")}
                          title="Approve"
                          className="text-green-600 hover:text-green-800 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(job._id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ✅ Mobile view (stacked cards) */}
        <div className="block sm:hidden space-y-4 p-4">
          {activeTab === "jobs" &&
            jobs.map((job) => (
              <div
                key={job._id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <h3 className="text-base font-semibold text-gray-900">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {job.recruiter?.company?.name || "—"} — {job.location}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  ₦{job.minSalary?.toLocaleString()} - ₦
                  {job.maxSalary?.toLocaleString()}
                </p>
                <p className="text-sm mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      job.status === "active"
                        ? "bg-green-100 text-green-800"
                        : job.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </p>

                {/* Actions */}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleView(job)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </button>
                  {job.status !== "active" && (
                    <button
                      onClick={() => updateStatus(job._id, "active")}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
        {selectedJob && (
          <div className="fixed inset-0 font-outfit bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-2 text-gray-900">
                {selectedJob.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {selectedJob.recruiter?.company?.name} — {selectedJob.location}
              </p>

              <p className="text-sm text-gray-800 mb-2">
                <strong>Type:</strong> {selectedJob.jobType}
              </p>
              <p className="text-sm text-gray-800 mb-2">
                <strong>Experience:</strong> {selectedJob.experience}
              </p>
              <p className="text-sm text-gray-800 mb-2">
                <strong>Salary:</strong> ₦
                {selectedJob.minSalary?.toLocaleString()} - ₦
                {selectedJob.maxSalary?.toLocaleString()}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Description
                </h3>
                <p
                  className="text-gray-700 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: selectedJob.description
                      ? selectedJob.description
                      : "No description available.",
                  }}
                />
              </div>

              {selectedJob.requirements && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Requirements
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedRecruiter && (
          <div className="fixed inset-0 font-outfit bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedRecruiter(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-2 text-gray-900">
                {selectedRecruiter.company?.name || "Company Details"}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Recruiter:</strong> {selectedRecruiter.firstName}{" "}
                {selectedRecruiter.lastName}
                <br />
                <strong>Email:</strong> {selectedRecruiter.email}
                <br />
                <strong>Phone:</strong> {selectedRecruiter.phone || "—"}
              </p>

              {/* Company Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Company Info</h3>

                <p className="text-sm text-gray-700">
                  <strong>Employees:</strong>{" "}
                  {selectedRecruiter.company?.employees || "—"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Website:</strong>{" "}
                  {selectedRecruiter.company?.website ? (
                    <a
                      href={selectedRecruiter.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedRecruiter.company.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </p>

                {/* About */}
                {selectedRecruiter.company?.about && (
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900 mb-1">About</h3>
                    <p className="text-sm text-gray-700">
                      {selectedRecruiter.company.about}
                    </p>
                  </div>
                )}

                {/* Vision */}
                {selectedRecruiter.company?.vision && (
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900 mb-1">Vision</h3>
                    <p className="text-sm text-gray-700">
                      {selectedRecruiter.company.vision}
                    </p>
                  </div>
                )}

                {/* Social Links */}
                <div className="mt-3">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Social Links
                  </h3>
                  <ul className="text-sm text-blue-600 space-y-1">
                    {selectedRecruiter.company?.socialLinks?.facebook && (
                      <li>
                        <a
                          href={selectedRecruiter.company.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Facebook
                        </a>
                      </li>
                    )}
                    {selectedRecruiter.company?.socialLinks?.instagram && (
                      <li>
                        <a
                          href={selectedRecruiter.company.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Instagram
                        </a>
                      </li>
                    )}
                    {selectedRecruiter.company?.socialLinks?.youtube && (
                      <li>
                        <a
                          href={selectedRecruiter.company.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          YouTube
                        </a>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Payment and Plan */}
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Subscription & Payment
                  </h3>

                  <p className="text-sm text-gray-700">
                    <strong>Payment Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedRecruiter.company.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedRecruiter.company.paymentStatus || "unpaid"}
                    </span>
                  </p>
                </div>

                {/* Job posts */}
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Job Posts
                  </h3>
                  {selectedRecruiter.jobPosts?.length ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {selectedRecruiter.jobPosts.map((job, i) => (
                        <li key={i}>{job.title || "Untitled job"}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No job posts available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-lg font-bold"
              >
                ✕
              </button>

              {/* Personal Info */}
              <h2 className="text-2xl font-bold mb-1 text-gray-900">
                {selectedUser.firstName} {selectedUser.lastName}
              </h2>
              <p className="text-sm text-gray-600 mb-2">{selectedUser.email}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedUser.isGoldMember && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                    Gold Member
                  </span>
                )}
                {selectedUser.isJobAccessActive && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                    JobAccess Member
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 mb-4">
                <p>
                  <strong>Bio:</strong> {selectedUser.bio || "—"}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedUser.phone || "—"}
                </p>
                <p>
                  <strong>DOB:</strong>{" "}
                  {selectedUser.dob
                    ? new Date(selectedUser.dob).toLocaleDateString()
                    : "—"}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedUser.gender || "—"}
                </p>
                <p>
                  <strong>Profession:</strong> {selectedUser.profession || "—"}
                </p>
                <p>
                  <strong>Experience:</strong> {selectedUser.experience || "—"}
                </p>
              </div>

              {/* Applications */}

              {/* Skills */}
              {selectedUser.skills?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Skills</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {selectedUser.skills.map((skill, i) => (
                      <li key={i}>
                        {skill.name} {skill.level ? `(${skill.level})` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resume / CV */}
              {selectedUser.resumes?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Resume / CV
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {selectedUser.resumes.map((resume, index) => (
                      <li key={index}>
                        <a
                          href={`https://app.assuchglobal.com${resume.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {resume.name}
                        </a>{" "}
                        <span className="text-gray-500 text-xs">
                          (Uploaded:{" "}
                          {new Date(resume.uploadedAt).toLocaleDateString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Membership & Payment */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Membership & Payment
                </h3>
                <p className="text-sm text-gray-800 mb-1">
                  <strong>Plan:</strong>{" "}
                  {selectedUser.isGoldMember && selectedUser.isJobAccessActive
                    ? "Gold + Job Access"
                    : selectedUser.isGoldMember
                    ? "Gold Member"
                    : selectedUser.isJobAccessActive
                    ? "JobAccess Member"
                    : "Free"}
                </p>
              </div>

              {/* KYC / Verification */}
              {selectedUser.kycApproved !== undefined && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    KYC Status
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedUser.kycApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedUser.kycApproved ? "Approved" : "Pending"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "recruiters" && (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full font-outfit divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Industry
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Job Posts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recruiters.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {r.company?.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {r.firstName} {r.lastName}
                        <br />
                        <span className="text-gray-500 text-xs">{r.email}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {r.company?.industry || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {r.jobPosts?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <button
                          onClick={() => setSelectedRecruiter(r)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="block sm:hidden space-y-4 p-4">
              {recruiters.map((r) => (
                <div
                  key={r._id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-gray-900">
                    {r.company?.name || "—"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {r.firstName} {r.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">{r.email}</p>
                  <p className="text-sm text-gray-700">
                    <strong>Industry:</strong> {r.company?.industry || "—"}
                  </p>

                  <p className="text-sm">
                    <strong>Jobs:</strong> {r.jobPosts?.length || 0}
                  </p>

                  <div className="flex gap-3 mt-3 text-sm">
                    <button
                      onClick={() => setSelectedRecruiter(r)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      View
                    </button>

                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full font-outfit divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Job Seeker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Profession
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Experience
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {u.firstName} {u.lastName}
                        <br />
                        <span className="text-gray-500 text-xs">{u.email}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {u.profession || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {u.experience || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        <button
                          onClick={() => handleViewUser(u)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="block sm:hidden space-y-4 p-4">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-gray-900">
                    {u.firstName} {u.lastName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{u.email}</p>
                  <p className="text-sm">
                    <strong>Profession:</strong> {u.profession || "—"}
                  </p>
                  <p className="text-sm">
                    <strong>Experience:</strong> {u.experience || "—"}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {u.paymentStatus || "Pending"}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-3 text-sm">
                    <button
                      onClick={() => handleViewUser(u)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "faqs" && <ManageFAQs />}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this job? This action cannot be
              undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
