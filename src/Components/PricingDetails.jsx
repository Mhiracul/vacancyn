import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";

const PricingDetails = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/faqs`); // backend endpoint
        if (res.data.success) {
          setFaqs(res.data.faqs);
        } else {
          setFaqs([]);
        }
      } catch (error) {
        // console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);
  return (
    <div className="bg-white font-outfit">
      {/* Pricing Table */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Feature Comparison
        </h2>
        <h2 className="text-center text-gray-500 mb-4">
          See what’s included in each plan
        </h2>

        <div className="overflow-x-auto ">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Features
                </th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">
                  Free
                </th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900 bg-yellow-50">
                  Gold
                </th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Job Search & Applications",
                  "5/month",
                  "Unlimited",
                  "Unlimited",
                ],
                ["AI CV Analysis", true, true, true],
                ["Expert CV Review", false, true, true],
                ["Career Consultation", false, true, true],
                ["Priority Support", false, true, true],
                ["API Access", false, false, true],
                ["Team Management", false, false, true],
              ].map(([feature, free, gold, enterprise], i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-4 px-6 text-gray-900">{feature}</td>
                  {[free, gold, enterprise].map((val, idx) => (
                    <td
                      key={idx}
                      className={`py-4 px-6 text-center text-gray-600 ${
                        idx === 1 ? "bg-yellow-50" : ""
                      }`}
                    >
                      {typeof val === "boolean" ? (
                        val ? (
                          <span>✓</span>
                        ) : (
                          <span className="text-gray-400">×</span>
                        )
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Everything you need to know about our pricing plans
          </p>

          {loading ? (
            <p className="text-center text-gray-500">Loading FAQs...</p>
          ) : faqs.length > 0 ? (
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No FAQs have been added yet.
            </p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-[#0867bc] to-[#5fabed] text-white text-center py-16 px-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Ready to Accelerate Your Career?
        </h2>
        <p className="text-indigo-100 mb-10 max-w-2xl mx-auto">
          Join thousands of professionals who have successfully landed their
          dream jobs with our platform.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button className="bg-white text-[#0867bc] font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            <a href="/cv-review">Start Free Trial</a>
          </button>
          <button className="bg-[#0867bc] hover:bg-[#023868] px-6 py-3 rounded-lg font-medium text-white transition">
            <a href="/cv-review">Try CV Review</a>
          </button>
        </div>
      </section>
    </div>
  );
};

export default PricingDetails;
