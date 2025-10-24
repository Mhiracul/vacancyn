import React from "react";

const CVFooter = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#0867bc] to-[#5fabed] ">
      <div className=" py-12 text-center text-white ">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your CV?</h2>
        <p className="text-xl mb-6">
          Join thousands of successful job seekers who improved their CVs with
          our expert review
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-[#0867bc] px-8 py-3 rounded-lg hover:bg-gray-100 font-medium whitespace-nowrap cursor-pointer">
            Start Free Review
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
  );
};

export default CVFooter;
