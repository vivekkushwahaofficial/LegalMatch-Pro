import { useState } from "react";
import GeneralSettings from "./GeneralSettings";
import UserSettings from "./UserSettings";
import CaseSettings from "./CaseSettings";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";
import AIMatchingSettings from "./AISettings";

const tabs = [
  "General",
  "Users",
  "Cases",
  "Notifications",
  "Security",
  "AI Matching",
];

export default function AppSettings() {
  const [activeTab, setActiveTab] = useState("General");

  const renderTab = () => {
    switch (activeTab) {
      case "General": return <GeneralSettings />;
      case "Users": return <UserSettings />;
      case "Cases": return <CaseSettings />;
      case "Notifications": return <NotificationSettings />;
      case "Security": return <SecuritySettings />;
      case "AI Matching": return <AIMatchingSettings />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl ${activeTab === tab ? "bg-black text-white" : "bg-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow">{renderTab()}</div>
    </div>
  );
}