import React from "react";
import { Briefcase, Users, User } from "lucide-react";

const AdminTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "jobs", label: "Job Posts", icon: <Briefcase size={18} /> },
    { id: "recruiters", label: "Employers", icon: <Users size={18} /> },
    { id: "users", label: "Job Seekers", icon: <User size={18} /> },
  ];

  return (
    <div className="flex gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-outfit border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default AdminTabs;
