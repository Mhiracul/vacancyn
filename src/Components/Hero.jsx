import React, { useContext, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { ReactTyped } from "react-typed";
import { FaPlaneDeparture } from "react-icons/fa";
import HeroBg from "../assets/bannerrr.png";
import BG from "../assets/bggg.png";
import SideImage from "../assets/banner-side.svg";
import { JobsContext } from "../context/jobContext";

const Hero = () => {
  const { setSearchFilter, SetIsSearched } = useContext(JobsContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    SetIsSearched(true);
  };

  return (
    <div className="relative font-outfit bg-white">
      {/* ======= TYPING TEXT SECTION ======= */}
      <div className="flex items-center justify-center gap-3 mt-10 mb-4">
        <FaPlaneDeparture className="text-[#0867bc] text-lg animate-bounce" />
        <h3 className="text-base md:text-lg font-normal text-gray-700">
          <ReactTyped
            strings={[
              "Get hired within 7 days!",
              "Find your dream job today!",
              "Apply and start your new career!",
            ]}
            typeSpeed={80}
            backSpeed={40}
            loop
          />
        </h3>
      </div>

      {/* ======= HERO SECTION ======= */}
      <div
        className="relative bg-cover bg-center bg-no-repeat shadow flex flex-col justify-center"
        style={{ backgroundImage: `url(${HeroBg})` }}
      >
        {/* Overlay pattern */}
        <div className="absolute inset-0">
          <img src={BG} alt="" className="w-[20%] h-full object-cover" />
        </div>

        <div className="relative py-20 container z-10 px-4 2xl:px-20 mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          {/* LEFT CONTENT */}
          <div className="flex-1 text-center md:text-left">
            {/* --- MOBILE VERSION --- */}
            <div className="block md:hidden">
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                There Are{" "}
                <span className="text-[#0867bc] font-bold">10,000</span>{" "}
                Postings Here For You!
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Find Jobs, Employment & Career Opportunities
              </p>

              <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
                <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-200 px-3 py-2">
                  <Search className="h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="w-full text-sm outline-none"
                    ref={titleRef}
                  />
                </div>

                <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-200 px-3 py-2">
                  <MapPin className="h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="City or postcode"
                    className="w-full text-sm outline-none"
                    ref={locationRef}
                  />
                </div>

                <button
                  onClick={onSearch}
                  className="bg-[#0867bc] text-white rounded-md py-3 font-medium hover:bg-[#065b9b] transition-all duration-200"
                >
                  Find Jobs
                </button>
              </div>

              <div className="mt-6 text-xs text-gray-500">
                <span className="font-semibold">Popular Searches:</span>{" "}
                Designer, Developer, Web, IOS, PHP, Senior, Engineer
              </div>
            </div>

            {/* --- DESKTOP VERSION --- */}
            <div className="hidden md:block">
              <h2 className="text-3xl bg-gradient-to-r from-[#0867bc] to-[#00aaff] bg-clip-text text-transparent md:text-4xl lg:text-6xl font-semibold mb-9">
                Over 10,000+ Jobs to Apply
              </h2>
              <p className="mb-9 text-black max-w-2xl mx-auto md:mx-0 text-sm md:text-base font-light">
                Your Next Big Career Move Starts Right Here — Explore the Best
                Job Opportunities and Take the First Step Toward Your Future!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between border border-gradient-to-r from-[#0867bc] to-[#00aaff] rounded-md text-gray-600 p-2 max-w-xl bg-white shadow-md mx-auto md:mx-0">
                <div className="flex items-center w-full sm:w-1/2">
                  <Search
                    className="h-4 sm:h-5 text-gray-400 mx-2"
                    strokeWidth={0.5}
                  />
                  <input
                    type="text"
                    placeholder="Search for jobs"
                    className="text-sm p-2 w-full outline-none"
                    ref={titleRef}
                  />
                </div>
                <div className="flex items-center w-full sm:w-1/2 sm:border-l border-gray-200">
                  <MapPin
                    className="h-4 sm:h-5 text-gray-400 mx-2"
                    strokeWidth={0.5}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    className="text-sm p-2 w-full outline-none"
                    ref={locationRef}
                  />
                </div>
                <button
                  onClick={onSearch}
                  className="bg-[#0867bc] px-6 py-2 text-white rounded-md sm:ml-2 mt-2 sm:mt-0"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 md:flex hidden justify-center md:justify-end">
            <img
              src={SideImage}
              alt="Hero visual"
              className="w-[90%] md:w-[80%] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
