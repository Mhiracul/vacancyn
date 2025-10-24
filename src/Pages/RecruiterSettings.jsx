import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import Swal from "sweetalert2";
import FineSelect from "../context/FineSelect";
import BASE_URL from "../config";

const RecruiterSettings = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    logo: null,
    banner: null,
    companyName: "",
    about: "",
    industryType: "",
    noOfEmployees: "",
    website: "",
    vision: "",
    facebook: "",
    instagram: "",
    youtube: "",
    phone: "",
    notificationEmail: "",
  });

  const token = localStorage.getItem("token");

  // === Fetch Existing Recruiter Data ===
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/recruiter/profiles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            logo: data.logo || null,
            banner: data.banner || null,
            companyName: data.companyName || "",
            about: data.about || "",
            industryType: data.industryType || "",
            noOfEmployees: data.noOfEmployees || "",
            website: data.website || "",
            vision: data.vision || "",
            facebook: data.facebook || "",
            instagram: data.instagram || "",
            youtube: data.youtube || "",
            phone: data.phone || "",
            notificationEmail: data.notificationEmail || "",
          });
        }
      } catch (err) {
        //console.error("Error loading recruiter data:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e, field) => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) formDataToSend.append(key, formData[key]);
    });

    try {
      const res = await fetch(`${BASE_URL}/recruiter/setup`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your recruiter details have been successfully updated.",
          confirmButtonColor: "#0867bc",
        });
      } else {
        Swal.fire("Error", data.message || "Something went wrong!", "error");
      }
    } catch (error) {
      //console.error("Error updating profile:", error);
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  const stepTitles = [
    "Company Info",
    "Founding Info",
    "Social Media Profile",
    "Contact",
  ];

  const industries = [
    "All",
    "Agriculture, Fishing & Forestry",
    "Construction",
    "Banking, Finance & Insurance",
    "Education",
    "Energy & Utilities",
    "Government",
    "Healthcare",
    "Hospitality & Hotel",
    "Recruitment",
    "IT & Telecoms",
    "Law & Compliance",
    "Shipping & Logistics",
    "Manufacturing & Warehousing",
    "Advertising, Media & Communications",
    "Mining, Energy & Metals",
    "NGO, NPO & Charity",
    "Retail, Fashion & FMCG",
    "Enforcement & Security",
    "Real Estate",
    "Tourism & Travel",
    "Automotive & Aviation",
    "Entertainment, Events & Sport",
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 2xl:px-20 flex flex-col items-center font-outfit">
      <div className="w-full container mx-auto bg-white shadow-sm rounded-lg p-8 relative">
        {/* === Step Tabs === */}
        <div className="flex justify-between items-center mb-8 border-b pb-2">
          {stepTitles.map((title, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 cursor-pointer ${
                step === index + 1
                  ? "text-[#0867bc] font-semibold"
                  : "text-gray-400"
              }`}
              onClick={() => setStep(index + 1)}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center rounded-full text-xs border ${
                  step === index + 1
                    ? "bg-[#0867bc] text-white border-[#0867bc]"
                    : "border-gray-300"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-sm">{title}</span>
            </div>
          ))}
        </div>

        {/* === Step Content === */}
        <form onSubmit={handleUpdate}>
          {/* STEP 1: Company Info */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Company Info
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Logo */}
                <label className="border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
                  {formData.logo ? (
                    <img
                      src={
                        typeof formData.logo === "string"
                          ? formData.logo
                          : URL.createObjectURL(formData.logo)
                      }
                      alt="Logo"
                      className="h-20 object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="text-gray-400 w-8 h-8 mb-2" />
                      <p className="text-gray-500 text-sm">
                        Browse logo or drop here
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "logo")}
                  />
                </label>

                {/* Banner */}
                <label className="border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
                  {formData.banner ? (
                    <img
                      src={
                        typeof formData.banner === "string"
                          ? formData.banner
                          : URL.createObjectURL(formData.banner)
                      }
                      alt="Banner"
                      className="h-24 w-full object-cover rounded-md"
                    />
                  ) : (
                    <>
                      <Upload className="text-gray-400 w-8 h-8 mb-2" />
                      <p className="text-gray-500 text-sm">
                        Browse banner or drop here
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "banner")}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  About Us
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#0867bc] text-white px-6 py-2 rounded-md hover:bg-[#075a9c] transition"
                >
                  Save & Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Founding Info */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Industry & Company Info
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <FineSelect
                  label="Industry Type"
                  options={industries}
                  value={formData.industryType}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, industryType: val }))
                  }
                />

                <FineSelect
                  label="Number of Employees"
                  options={["1-10", "11-50", "51-200", "201-500", "500+"]}
                  value={formData.noOfEmployees}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, noOfEmployees: val }))
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Company Vision
                </label>
                <textarea
                  name="vision"
                  value={formData.vision}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#0867bc] text-white px-6 py-2 rounded-md hover:bg-[#075a9c]"
                >
                  Save & Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Social Media */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Social Media Profiles
              </h2>

              <div className="space-y-4">
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="Facebook URL"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
                />
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="Instagram URL"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
                />
                <input
                  type="url"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="YouTube URL"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#0867bc] text-white px-6 py-2 rounded-md hover:bg-[#075a9c]"
                >
                  Save & Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Contact */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Contact
              </h2>

              <div className="space-y-4">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
                />
                <input
                  type="email"
                  name="notificationEmail"
                  value={formData.notificationEmail}
                  onChange={handleChange}
                  placeholder="Notification Email Address"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  className="bg-[#0867bc] text-white px-6 py-2 rounded-md hover:bg-[#075a9c]"
                >
                  Finish Editing
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <footer className="mt-10 text-gray-400 text-xs">
        © 2025 VacancyNG - Job Board. All rights reserved.
      </footer>
    </div>
  );
};

export default RecruiterSettings;
