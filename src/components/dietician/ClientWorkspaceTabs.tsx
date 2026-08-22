"use client";

import { useState } from "react";

const tabs = [
  "Profile",
  "Notes",
  "Clinical Assessment",
  "Questionnaire",
  "Diet Recall",
  "24 Hour Diet",
  "QC Table",
  "Make Diet",
] as const;

type ClientWorkspaceTabsProps = {
  profileTab: React.JSX.Element;
};

export function ClientWorkspaceTabs({ profileTab }: ClientWorkspaceTabsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Profile");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              activeTab === tab ? "bg-primary text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Profile" ? (
        profileTab
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">{activeTab} will be added in a later phase.</div>
      )}
    </div>
  );
}
