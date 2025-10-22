import React, { useContext, useEffect, useState } from "react";
import { JobsContext } from "../context/jobContext";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import axios from "axios";
import BASE_URL from "../config";
import JobCard from "./JobCard";

const JobListing = ({ initialShowFilter = false }) => {
  const { isSearched, searchFilter, setSearchFilter, jobs, loading } =
    useContext(JobsContext);

  const [showFilter, setShowFilter] = useState(initialShowFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);

  // Sync with parent prop
  useEffect(() => {
    setShowFilter(initialShowFilter);
  }, [initialShowFilter]);

  // ✅ Fetch unique industries and locations from backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [industryRes, locationRes] = await Promise.all([
          axios.get(`${BASE_URL}/user/jobs/industries`),
          axios.get(`${BASE_URL}/user/jobs/locations`),
        ]);
        setIndustries(industryRes.data);
        setLocations(locationRes.data);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchFilters();
  }, []);

  // 🔄 Handle Industry selection
  const handleIndustryChange = (industry) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  // 🔄 Handle Location selection
  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  // 🎯 Filter jobs when search or filters change
  useEffect(() => {
    const matchesIndustry = (job) =>
      selectedIndustries.length === 0 ||
      selectedIndustries.includes(job.industry);

    const matchesLocation = (job) =>
      selectedLocations.length === 0 ||
      selectedLocations.includes(job.location);

    const matchesTitle = (job) =>
      searchFilter.title === "" ||
      job.title?.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      searchFilter.location === "" ||
      job.location?.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          job.isVisible &&
          matchesIndustry(job) &&
          matchesLocation(job) &&
          matchesTitle(job) &&
          matchesSearchLocation(job)
      );

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedIndustries, selectedLocations, searchFilter]);

  // 🌀 Show loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="bg-[#FFF] font-outfit ">
      <div className="container 2xl:px-20 px-4 mx-auto flex gap-10 flex-col lg:flex-row max-lg:space-y-8 py-16">
        {/* Sidebar */}
        <div
          className={`w-full lg:w-[23%] shadow-lg rounded bg-white px-4 transition-all duration-300 ${
            showFilter ? "block" : "hidden"
          }`}
        >
          {/* Search Filter Summary */}
          {isSearched &&
            (searchFilter.title !== "" || searchFilter.location !== "") && (
              <>
                <h3 className="font-medium text-lg mb-4">Current Search</h3>
                <div className="mb-4 text-gray-600">
                  {searchFilter.title && (
                    <span className="inline-flex text-sm items-center bg-blue-50 border border-blue-200 rounded px-4 py-1.5 gap-2.5 ">
                      {searchFilter.title}
                      <X
                        onClick={() =>
                          setSearchFilter((prev) => ({ ...prev, title: "" }))
                        }
                        className="cursor-pointer"
                        strokeWidth={1}
                        size={16}
                      />
                    </span>
                  )}

                  {searchFilter.location && (
                    <span className="ml-2 inline-flex text-sm items-center bg-red-50 border border-red-200 rounded px-4 py-1.5 gap-2.5 ">
                      {searchFilter.location}
                      <X
                        onClick={() =>
                          setSearchFilter((prev) => ({ ...prev, location: "" }))
                        }
                        className="cursor-pointer"
                        strokeWidth={1}
                        size={16}
                      />
                    </span>
                  )}
                </div>
              </>
            )}

          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="px-6 py-1.5 rounded border border-gray-300 lg:hidden"
          >
            {showFilter ? "Close" : "Filters"}
          </button>

          {/* Industry Filter */}
          <div className={showFilter ? "block" : "hidden"}>
            <h4 className="font-medium text-base py-4">Search by Industry</h4>
            <ul className="space-y-4 text-gray-600">
              {industries.length > 0 ? (
                industries.map((industry, index) => (
                  <li className="flex gap-3 text-sm items-center" key={index}>
                    <input
                      className="scale-125"
                      type="checkbox"
                      onChange={() => handleIndustryChange(industry)}
                      checked={selectedIndustries.includes(industry)}
                    />
                    {industry}
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No industries found.</p>
              )}
            </ul>
          </div>

          {/* Location Filter */}
          <div className={showFilter ? "block" : "hidden"}>
            <h4 className="font-medium text-base py-4 pt-14">
              Search by Location
            </h4>
            <ul className="space-y-4 mb-4 text-gray-600">
              {locations.length > 0 ? (
                locations.map((location, index) => (
                  <li className="flex gap-3 text-sm items-center" key={index}>
                    <input
                      className="scale-125"
                      type="checkbox"
                      onChange={() => handleLocationChange(location)}
                      checked={selectedLocations.includes(location)}
                    />
                    {location}
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No locations found.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Job Listing */}
        <section
          className={`w-full text-gray-800 ${
            showFilter ? "lg:w-3/4" : "w-full"
          }`}
        >
          <h3 className="font-medium text-3xl py-2" id="job-list">
            Latest Jobs
          </h3>
          <p className="mb-8">Get your desired job from top companies</p>

          {filteredJobs.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No jobs available right now.
            </p>
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  showFilter
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 "
                }`}
              >
                {filteredJobs
                  .slice((currentPage - 1) * 6, currentPage * 6)
                  .map((job, index) => (
                    <JobCard key={index} job={job} />
                  ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center space-x-2 mt-10">
                <a href="#job-list">
                  <ChevronLeft
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    strokeWidth={1.25}
                  />
                </a>
                {Array.from({
                  length: Math.ceil(filteredJobs.length / 6),
                }).map((_, index) => (
                  <a key={index} href="#job-list">
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-10 h-10 text-sm flex items-center justify-center border border-gray-300 rounded ${
                        currentPage === index + 1
                          ? "bg-blue-100 text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </button>
                  </a>
                ))}
                <a href="#job-list">
                  <ChevronRight
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          currentPage + 1,
                          Math.ceil(filteredJobs.length / 6)
                        )
                      )
                    }
                    strokeWidth={1.25}
                  />
                </a>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobListing;
