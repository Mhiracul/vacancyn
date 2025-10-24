import React from "react";
import cvHeroBg from "../assets/cvv.jpg"; // adjust path as needed
const CVHero = () => {
  return (
    <section className="relative bg-gradient-to-r from-[#0867bc] to-[#5fabed] text-white py-20 overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${cvHeroBg})` }}
      ></div>

      {/* Overlay tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0867bc] to-[#5fabed]/80"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Get Your CV Reviewed by Experts
        </h1>
        <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
          Boost your chances of landing interviews with our AI-powered CV
          analysis and expert human review. Stand out from the competition.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-[#0867bc] px-8 py-3 rounded-lg hover:bg-gray-100 font-medium transition">
            Start Free Review
          </button>
          <a
            href="/pricing-page"
            data-discover="true"
            className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#0867bc] font-medium transition"
          >
            Upgrade to Gold
          </a>
        </div>
      </div>
    </section>
  );
};

export default CVHero;
