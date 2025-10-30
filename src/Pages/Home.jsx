import React from "react";
import Header from "../Components/Header";
import Hero from "../Components/Hero";
import JobListing from "../Components/JobListing";
import TrustedBy from "../Components/TrustedBy";
import HowItWorks from "../Components/HowItWorks";
import Footer from "../Components/Footer";
import Pricing from "../Components/Pricing";
import CVFooter from "../Components/CVFooter";
import IndustryFilterPage from "./IndustryFilterPage";

const Home = () => {
  return (
    <div className="font-outfit ">
      <Header />
      <Hero />
      <IndustryFilterPage />

      <JobListing showPagination={false} maxJobs={6} />
      <HowItWorks />
      <div className="2xl:py-20 py-10">
        <div className="bg-gradient-to-r from-[#0867bc] to-[#5fabed]  py-12 px-8 text-center text-white max-w-7xl mx-auto ">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your CV?
          </h2>
          <p className="text-xl mb-6">
            Join thousands of successful job seekers who improved their CVs with
            our expert review
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-[#0867bc] px-8 py-3 rounded-lg hover:bg-gray-100 font-medium whitespace-nowrap cursor-pointer">
              <a href="/cv-review">Start Free Review</a>
            </button>
            <a
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#0867bc] font-medium whitespace-nowrap cursor-pointer"
              href="/pricing-page"
              data-discover="true"
            >
              View Pricing Plans
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
