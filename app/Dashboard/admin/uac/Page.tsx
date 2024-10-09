"use client";
import React, { useState } from "react";
import Users from "./Users";
import Roles from "./Roles";
import Groups from "./Groups";

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Users" | "Roles" | "Groups">(
    "Users"
  );

  const tabs: ("Users" | "Roles" | "Groups")[] = ["Users", "Roles", "Groups"];

  return (
    <div className="p-6 bg-white text-sky-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-sky-700">
        User Access Control
      </h1>
      <div className="flex mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`mr-4 px-4 py-2 rounded-full transition-colors duration-200 ${
              activeTab === tab
                ? "bg-sky-500 text-white"
                : "bg-sky-100 text-sky-600 hover:bg-sky-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-sky-50 p-6 rounded-lg shadow-md">
        {activeTab === "Users" && <Users />}
        {activeTab === "Roles" && <Roles />}
        {activeTab === "Groups" && <Groups />}
      </div>
    </div>
  );
};

export default Page;
