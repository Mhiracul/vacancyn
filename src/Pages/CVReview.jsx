import React, { useState } from "react";
import axios from "axios";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import CVHero from "../Components/CVHero";
import Header from "../Components/Header";
import CVFooter from "../Components/CVFooter";
import BASE_URL from "../config";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CVReview = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAIReview = async () => {
    if (!file) {
      toast.error("Please upload your CV (PDF or Word file)");
      return;
    }

    try {
      setLoading(true);
      setReview(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${BASE_URL}/ai-review`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setReview(response.data.feedback);
        setShowModal(true);
        toast.success("✅ AI Review completed!");
      } else {
        toast.error(response.data.message || "AI review failed.");
      }
    } catch (error) {
      //console.error(error);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <CVHero />
      {/* Upload Section */}
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
        <div className="w-full container 2xl:px-20 px-4 mx-auto">
          <div className=" mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-100 ">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
              AI CV Review
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Upload your CV to get instant AI-powered feedback on your
              strengths, weaknesses, and ways to improve.
            </p>

            <div className="flex flex-col items-center">
              <label className="cursor-pointer max-w-2xl flex flex-col items-center justify-center w-full h-60 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                <Upload className="h-10 w-10 text-[#0867bc] mb-2" />
                <span className="text-gray-600">
                  {file ? file.name : "Click to upload CV (PDF/DOC/DOCX)"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <div className="flex md:flex-row flex-col md:gap-4 gap-2 ">
                <button
                  onClick={handleAIReview}
                  disabled={loading}
                  className={`md:mt-6 mt-4 w-full text-sm px-2 py-3 text-white font-semibold rounded-xl transition duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#0867bc] to-[#0d8df7] hover:opacity-90"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Analyzing CV...
                    </span>
                  ) : (
                    "Start AI Free Review"
                  )}
                </button>

                <button
                  onClick={() => {
                    if (user?.isGoldMember) {
                      const whatsappNumber = "2349153070499"; // your WhatsApp number (no '+')
                      const message = encodeURIComponent(
                        `Hello! I’m a Gold Member and I’d like a professional review of my CV.${
                          file ? ` My CV file name is "${file.name}".` : ""
                        }`
                      );
                      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
                      window.open(whatsappURL, "_blank");
                    } else {
                      Swal.fire({
                        icon: "info",
                        title: "Membership Required",
                        text: "This feature is exclusive to Gold Members. Pay a one time fee to access professional CV review.",
                        confirmButtonText: "Upgrade Now",
                        confirmButtonColor: "#1967d2",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.location.href = "/pricing-page"; // redirect to your membership page
                        }
                      });
                    }
                  }}
                  className="md:mt-6 mt-0 w-full py-3 whitespace-nowrap px-2 text-sm text-white font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:opacity-90 transition duration-300"
                >
                  CV Review by Professionals
                </button>
              </div>
            </div>
          </div>

          {/* CV Review Features */}
          <section className="w-full  mt-16 ">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              CV Review Features
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Comprehensive analysis to improve your job prospects
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="px-5 py-8 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800 mb-1">
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-500 text-sm">
                  Our advanced AI scans your CV for formatting, keywords, and
                  structure.
                </p>
              </div>

              <div className="px-5 py-8 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800 mb-1">
                  ATS Compatibility Check
                </h3>
                <p className="text-gray-500 text-sm">
                  Ensure your CV passes through Applicant Tracking Systems.
                </p>
              </div>

              <div className="px-5 py-8 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800 mb-1">
                  Industry-Specific Feedback
                </h3>
                <p className="text-gray-500 text-sm">
                  Get tailored advice based on your target industry.
                </p>
              </div>

              <div className="px-5 py-8 border border-yellow-200 rounded-xl bg-yellow-50 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-800">
                    Expert Human Review
                  </h3>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md font-medium">
                    Gold Only
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Professional recruiters provide detailed feedback.
                </p>
              </div>

              <div className="px-5 py-8 border border-yellow-200 rounded-xl bg-yellow-50 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-800">
                    Personal Consultation
                  </h3>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md font-medium">
                    Gold Only
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  30-minute one-on-one session with career experts.
                </p>
              </div>

              <div className="px-5 py-8 border border-yellow-200 rounded-xl bg-yellow-50 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-800">
                    Custom Rewrite Service
                  </h3>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md font-medium">
                    Gold Only
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Complete CV rewrite by professional writers.
                </p>
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section className="w-full mt-20  pb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Success Stories
            </h2>
            <p className="text-gray-500 text-center mb-10">
              See how our CV review helped others land their dream jobs
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center mb-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Sarah Johnson"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Sarah Johnson
                    </h4>
                    <p className="text-sm text-gray-500">
                      Software Engineer at Google
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  “The CV review helped me land my dream job at Google. The
                  feedback was incredibly detailed and actionable.”
                </p>
                <div className="text-yellow-500">★★★★★</div>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center mb-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/46.jpg"
                    alt="Michael Chen"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Michael Chen
                    </h4>
                    <p className="text-sm text-gray-500">
                      Product Manager at Microsoft
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  “Gold plan review was worth every penny. The human expert
                  caught issues that AI missed.”
                </p>
                <div className="text-yellow-500">★★★★★</div>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center mb-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/49.jpg"
                    alt="Emily Rodriguez"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Emily Rodriguez
                    </h4>
                    <p className="text-sm text-gray-500">
                      Marketing Director at Adobe
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  “The industry-specific feedback transformed my CV. Got 3
                  interview calls within a week!”
                </p>
                <div className="text-yellow-500">★★★★★</div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showModal && review && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative bg-white w-full h-full overflow-y-auto p-8">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-700 hover:text-red-600"
            >
              <X size={28} />
            </button>

            {/* Modal Content */}
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                AI Review Results
              </h2>

              {/* Overall Score */}
              <div className="bg-blue-50 p-5 rounded-xl mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Overall CV Score
                  </h3>
                  <span className="text-3xl font-bold text-[#0d8df7]">
                    {review.overallScore}%
                  </span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-[#0867bc] to-[#0d8df7] h-2.5 rounded-full"
                    style={{ width: `${review.overallScore}%` }}
                  />
                </div>
                <p className="text-gray-600 mt-3">{review.summary}</p>
              </div>

              {/* Section Breakdown */}
              <div className="grid md:grid-cols-2 gap-5 mb-8">
                {Object.entries(review.sections).map(([title, section]) => (
                  <div
                    key={title}
                    className="border border-gray-200 rounded-xl p-5 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800">{title}</h4>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-lg ${
                          section.rating === "excellent"
                            ? "bg-green-100 text-green-700"
                            : section.rating === "good"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {section.score}% {section.rating}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {section.feedback}
                    </p>
                    <p className="font-medium text-gray-700 text-sm mb-1">
                      Suggestions:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      {section.suggestions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Keyword Analysis */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Keyword Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">
                      Found Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {review.keywordAnalysis.foundKeywords.length > 0 ? (
                        review.keywordAnalysis.foundKeywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full"
                          >
                            {kw}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No keywords detected.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {review.keywordAnalysis.missingKeywords.length > 0 ? (
                        review.keywordAnalysis.missingKeywords.map(
                          (kw, idx) => (
                            <span
                              key={idx}
                              className="bg-red-100 text-red-700 px-3 py-1 text-sm rounded-full"
                            >
                              {kw}
                            </span>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No missing keywords 🎯
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <p className="font-medium text-gray-700">
                    Keyword Optimization Score
                  </p>
                  <span className="text-xl font-bold text-[#0867bc]">
                    {review.keywordAnalysis.keywordOptimizationScore}%
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => {
                    setFile(null);
                    setShowModal(false);
                  }}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition"
                >
                  Upload New CV
                </button>
                <button className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition">
                  Get Expert Review
                </button>
                <button className="px-5 py-3 bg-[#0867bc] hover:bg-[#0d8df7] text-white font-medium rounded-xl transition">
                  Apply to Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <CVFooter />
      <Footer />
    </>
  );
};

export default CVReview;
