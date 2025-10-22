import React from "react";

const CVFooter = () => {
  return (
    <div className="2xl:py-20 py-10">
      <div className="bg-gradient-to-r from-[#0867bc] to-[#5fabed]  py-12 px-8 text-center text-white max-w-7xl mx-auto ">
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
            href="/preview/1611a7a2-9f1a-4f85-9b99-6866b2521535/3389848/pricing"
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
