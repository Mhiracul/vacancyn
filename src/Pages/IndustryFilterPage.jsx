import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Cpu,
  GraduationCap,
  HeartPulse,
  Plane,
  Shirt,
  Leaf,
  Landmark,
  Truck,
  Store,
  Gavel,
  Factory,
  ShieldCheck,
  Radio,
} from "lucide-react";
import axios from "axios";
import BASE_URL from "../config";

const industries = [
  { label: "Agriculture, Fishing & Forestry", icon: Leaf },
  { label: "Construction", icon: Building2 },
  { label: "Banking, Finance & Insurance", icon: Landmark },
  { label: "Education", icon: GraduationCap },
  { label: "Science & Technology", icon: Cpu },
  { label: "Government", icon: Gavel },
  { label: "Healthcare", icon: HeartPulse },
  { label: "Hospitality & Hotel", icon: Store },
  { label: "Recruitment", icon: Briefcase },
  { label: "IT & Telecoms", icon: Cpu },
  { label: "Law & Compliance", icon: Gavel },
  { label: "Shipping & Logistics", icon: Truck },
  { label: "Manufacturing & Warehousing", icon: Factory },
  { label: "Advertising, Media & Communications", icon: Radio },
  { label: "Mining, Energy & Metals", icon: Landmark },
  { label: "NGO, NPO & Charity", icon: HeartPulse },
  { label: "Retail, Fashion & FMCG", icon: Shirt },
  { label: "Enforcement & Security", icon: ShieldCheck },
  { label: "Real Estate", icon: Building2 },
  { label: "Tourism & Travel", icon: Plane },
  { label: "Automotive & Aviation", icon: Truck },
  { label: "Entertainment, Events & Sport", icon: Radio },
];

const IndustryFilterPage = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/jobs/industry-count`);
        setCounts(res.data);
      } catch (error) {
        console.error("Error fetching industry counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <section className="bg-gray-50">
      <div className="py-20 container mx-auto px-4 2xl:px-10 text-center">
        <h2 className="text-3xl font-bold mb-3 text-gray-900">
          Browse Jobs by Industry
        </h2>
        <p className="text-gray-500 mb-10">
          Discover opportunities across various industries
        </p>

        {loading ? (
          <p className="text-gray-500 py-10">Loading job data...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map(({ label, icon: Icon }) => (
              <div
                key={label}
                onClick={() =>
                  navigate(`/jobs/industry/${encodeURIComponent(label)}`)
                }
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
                <p className="text-sm text-gray-600">
                  {counts[label] || 0} Jobs
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/findwork")}
          className="bg-[#0867bc] text-white font-normal text-base px-4 py-2 mt-10 rounded hover:bg-[#044b88] transition"
        >
          Explore All Jobs
        </button>
      </div>
    </section>
  );
};

export default IndustryFilterPage;
