import React from "react";
import { Check } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import PricingDetails from "./PricingDetails";
import Footer from "./Footer";
import BASE_URL from "../config";

const Pricing = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // ✅ assuming you store it after login

  const plans = [
    {
      name: "Gold Tag Membership",
      price: 10000, // ₦100 in kobo
      displayPrice: "₦100",
      features: [
        "Access to CV Revamp Services",
        "Exclusive Career Courses",
        "View All Employers & Recruiters",
        "Priority Job Recommendations",
        "Dedicated Career Support",
      ],
      buttonText: "Get Gold Tag",
      highlighted: true,
      type: "one-time",
      userField: "isGoldMember", // ✅ check this field on the user
    },
    {
      name: "Job Application Access",
      price: 10000,
      displayPrice: "₦100",
      features: [
        "Apply to Unlimited Jobs",
        "Full Job Description Access",
        "Instant Application Confirmation",
        "Track Your Applications",
      ],
      buttonText: "Unlock Job Access",
      highlighted: false,
      type: "one-time",
      userField: "isJobAccessActive",
    },
  ];

  const handlePayment = async (plan) => {
    if (!token) {
      toast.error("Please log in to continue");
      return;
    }

    // Prevent paying again for same plan
    if (user && user[plan.userField]) {
      toast("You already purchased this plan!", { icon: "ℹ️" });
      return;
    }

    try {
      toast.loading("Redirecting to Paystack...");

      const response = await axios.post(
        `${BASE_URL}/monthly/initialize`,
        {
          amount: plan.price,
          type: plan.type,
          planName: plan.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.dismiss();

      if (response.data.success) {
        const { authorization_url } = response.data.data;
        window.location.href = authorization_url;
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (error) {
      toast.dismiss();
      //console.error("Payment initialization failed:",error.response?.data || error.message);
      toast.error("Unable to initialize payment");
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-50 font-outfit">
        <div className="container mx-auto px-4  ">
          <Toaster position="top-center" />
          <div className="flex flex-col items-center justify-center ">
            <div className="text-center py-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Choose Your Career Success Plan
              </h1>
              <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                From free job searching to expert CV reviews and career
                consultation. Find the perfect plan to accelerate your career
                growth.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
              {plans.map((plan, i) => {
                const alreadyBought = user && user[plan.userField];

                return (
                  <div
                    key={i}
                    className={`relative bg-white rounded-2xl shadow-md border ${
                      plan.highlighted
                        ? "bg-white rounded-lg shadow-lg border-2 border-yellow-400 relative"
                        : "border-gray-200"
                    } p-8 flex flex-col`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span class="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-medium">
                          Recommended
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-4xl font-bold text-[#000] mb-2">
                      {plan.displayPrice}
                    </p>

                    <ul className="text-sm text-gray-600 mt-4 space-y-3 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#0867bc]" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePayment(plan)}
                      disabled={alreadyBought}
                      className={`mt-6 w-full py-2.5 rounded-lg font-medium transition ${
                        alreadyBought
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : plan.highlighted
                          ? "w-full py-3 px-4 rounded-lg font-medium whitespace-nowrap cursor-pointer mb-6 bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-[#0867bc] hover:bg-[#023868] text-white"
                      }`}
                    >
                      {alreadyBought ? "Already Purchased" : plan.buttonText}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <PricingDetails />
      <Footer />
    </>
  );
};

export default Pricing;
