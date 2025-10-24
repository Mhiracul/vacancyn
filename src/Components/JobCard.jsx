// JobCard.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from "../config";
import { JobsContext } from "../context/jobContext";
import Swal from "sweetalert2";

const JobCard = ({ job, onToast }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useContext(JobsContext);

  // safe parse with fallback

  // notify helper: prefer parent's onToast, otherwise use react-hot-toast
  const notify = (msg, type = "success") => {
    const icon = type === "success" ? "success" : "error";

    Swal.fire({
      text: msg,
      icon,
      showConfirmButton: false,
      timer: 2000, // closes automatically after 2s
      timerProgressBar: true,
      toast: true,
      position: "top-end",
    });
  };

  const requireLogin = () => {
    // re-read token/user in case localStorage changed while mounted
    const _token = localStorage.getItem("token");
    let _user = null;
    try {
      const raw = localStorage.getItem("user");
      _user = raw ? JSON.parse(raw) : null;
    } catch (err) {
      _user = null;
    }

    if (!_token || !user) {
      //console.log("JobCard.requireLogin -> not logged in");
      notify("Please log in to continue.", "error");
      return false;
    }
    //console.log("JobCard.requireLogin -> logged in");
    return true;
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const _token = localStorage.getItem("token");
      if (!_token) return;
      try {
        const res = await axios.get(`${BASE_URL}/user/jobs/favorites`, {
          headers: { Authorization: `Bearer ${_token}` },
        });
        const favorites = res.data || [];
        const isFav = favorites.some((fav) => fav._id === job._id);
        setIsFavorite(isFav);
      } catch (err) {
        //console.error("JobCard: error fetching favorites", err);
      }
    };
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job._id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const _token = localStorage.getItem("token");
    if (!_token) {
      notify("Please log in to save jobs.", "error");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/user/jobs/favorites/toggle`,
        { jobId: job._id },
        { headers: { Authorization: `Bearer ${_token}` } }
      );
      setIsFavorite(res.data.favorite);
      notify(
        res.data.favorite
          ? "Job added to favorites!"
          : "Job removed from favorites.",
        res.data.favorite ? "success" : "error"
      );
    } catch (err) {
      //console.error("JobCard: error toggling favorite", err);
      notify("Something went wrong. Please try again.", "error");
    }
  };

  const handleApply = (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token || !user) {
      notify("Please log in to apply for jobs.", "error");
      return;
    }
    if (!user.isJobAccessActive) {
      notify("You need to unlock Job Application Access to apply.", "error");
      return;
    }
    navigate(`/apply-job/${job._id}`);
    window.scrollTo(0, 0);
  };

  const companyLogo = job.recruiter?.company?.logo;

  return (
    <div className="relative  font-outfit bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow  duration-300  flex flex-col justify-between">
      {/* Job Type Badge */}
      {job.jobType && (
        <span className="absolute top-4 left-0 bg-[#0867bc]/10 text-[#0867bc] font-normal text-[10px] px-1 rounded-r-full border border-[#0867bc]/20 uppercase">
          {job.jobType}
        </span>
      )}

      {/* Favorite icon */}
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-all"
      >
        <Heart
          className={`w-5 h-5 ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
          }`}
        />
      </button>

      <div>
        <div className="flex justify-between items-center mt-6">
          <img
            className="h-8 rounded-full object-contain"
            src={companyLogo}
            alt="Company Logo"
          />
        </div>

        <h4 className="font-semibold text-xl mt-3 text-gray-800 line-clamp-1">
          {job.title}
        </h4>

        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
          {job.location && (
            <span className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded text-blue-600">
              {job.location}
            </span>
          )}
          {job.experience && (
            <span className="bg-red-50 border border-red-200 px-3 py-1.5 rounded text-red-600">
              {job.experience}
            </span>
          )}
          {job.industry && (
            <span className="bg-green-50 border border-green-200 px-3 py-1.5 rounded text-green-600">
              {job.industry}
            </span>
          )}
        </div>

        <p
          className="text-gray-500 mt-4 text-sm line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: job.description
              ? job.description.slice(0, 150)
              : "No description available.",
          }}
        />

        <p className="mt-4 text-sm text-gray-700 font-medium">
          {job.minSalary && job.maxSalary ? (
            <>
              ₦{job.minSalary.toLocaleString()} - ₦
              {job.maxSalary.toLocaleString()}
            </>
          ) : job.salary ? (
            <>₦{job.salary.toLocaleString()}</>
          ) : (
            <>Salary not specified</>
          )}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 text-sm">
        <button
          onClick={handleApply}
          className="bg-[#0867bc] hover:bg-[#075a9c] text-white font-medium rounded px-4 py-2 transition-all"
        >
          Apply Now
        </button>
        <button
          onClick={handleApply}
          className="text-gray-600 border border-gray-400 hover:bg-gray-100 px-4 py-2 rounded transition-all"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
