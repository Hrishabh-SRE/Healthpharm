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
  notesTab: React.JSX.Element;
  clinicalAssessmentTab: React.JSX.Element;
  questionnaireTab: React.JSX.Element;
};

const placeholderMessages: Record<
  Exclude<(typeof tabs)[number], "Profile" | "Notes" | "Questionnaire" | "Clinical Assessment">,
  string
> = {
  "Diet Recall": "Diet Recall will be added in a later phase.",
  "24 Hour Diet": "24 Hour Diet will be added in a later phase.",
  "QC Table": "QC Table will be added in a later phase.",
  "Make Diet": "Make Diet will be added in a later phase.",
};

export function ClientWorkspaceTabs({
  profileTab,
  notesTab,
  clinicalAssessmentTab,
  questionnaireTab,
}: ClientWorkspaceTabsProps): React.JSX.Element {
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

      {activeTab === "Profile" ? profileTab : null}
      {activeTab === "Notes" ? notesTab : null}
      {activeTab === "Clinical Assessment" ? clinicalAssessmentTab : null}
      {activeTab === "Questionnaire" ? questionnaireTab : null}
      {activeTab !== "Profile" &&
      activeTab !== "Notes" &&
      activeTab !== "Clinical Assessment" &&
      activeTab !== "Questionnaire" ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          {placeholderMessages[activeTab as keyof typeof placeholderMessages]}
        </div>
      ) : null}
    </div>
  );
}
