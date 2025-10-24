import React, { useState } from "react";
import { Briefcase, Users, User, Menu, X } from "lucide-react";

const AdminTabs = ({ activeTab, setActiveTab }) => {
  const [open, setOpen] = useState(false);

  const tabs = [
    { id: "jobs", label: "Job Posts", icon: <Briefcase size={18} /> },
    { id: "recruiters", label: "Employers", icon: <Users size={18} /> },
    { id: "users", label: "Job Seekers", icon: <User size={18} /> },
    { id: "faqs", label: "FAQS", icon: <User size={18} /> },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    setOpen(false); // close sidebar after selecting tab
  };

  return (
    <>
      {/* ✅ Desktop Tabs */}
      <div className="hidden md:flex gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-outfit border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
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

      {/* ✅ Mobile Menu Toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-700 focus:outline-none"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ✅ Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Dashboard Menu
          </h3>
          <button onClick={() => setOpen(false)} className="text-gray-700">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col mt-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-3 px-5 py-3 text-left text-gray-700 font-medium ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Overlay when menu is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default AdminTabs;
