import React from "react";
import { Check } from "lucide-react";

const BillingPage = () => {
  const plans = [
    {
      name: "Gold Tag Membership",
      price: "$49",
      duration: "Monthly",
      features: [
        "Access to CV Revamp Services",
        "Exclusive Career Courses",
        "View All Employers & Recruiters",
        "Priority Job Recommendations",
        "Dedicated Career Support",
      ],
      buttonText: "Get Gold Access",
      highlighted: true,
    },
    {
      name: "Job Application Access",
      price: "$10",
      duration: "One-Time Fee",
      features: [
        "Apply to Unlimited Jobs",
        "Full Job Description Access",
        "Instant Application Confirmation",
        "Track Your Applications",
      ],
      buttonText: "Unlock Job Access",
      highlighted: false,
    },
  ];

  return (
    <div className="bg-gray-50  flex flex-col items-center justify-center py-6 px-4">
      <div className="max-w-5xl w-full text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-gray-600 mt-2">
          Upgrade your experience — get premium tools to grow your career and
          reach more employers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-2xl shadow-md border ${
              plan.highlighted
                ? "border-blue-500 shadow-lg scale-105"
                : "border-gray-200"
            } p-8 flex flex-col`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full">
                Recommended
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {plan.name}
            </h3>
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {plan.price}
              <span className="text-base text-gray-500 font-normal ml-1">
                /{plan.duration}
              </span>
            </p>

            <ul className="text-sm text-gray-600 mt-4 space-y-3 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`mt-6 w-full py-2.5 rounded-lg text-white font-medium transition ${
                plan.highlighted
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-10">
        © {new Date().getFullYear()} Vacancy.NG. All rights reserved.
      </p>
    </div>
  );
};

export default BillingPage;
