/**
 * TabBar
 * Horizontal navigation bar with the 8 dashboard sections.
 * Props:
 *   activeTab  – string key of the currently active tab
 *   onChange   – (tabKey: string) => void
 */

// Tab definitions — add/reorder here as needed
export const TABS = [
  { key: 'basic-profile',        label: 'Basic Profile' },
  { key: 'notes',                label: 'Notes' },
  { key: 'clinical-assessment',  label: 'Clinical Assessment' },
  { key: 'questionnaire',        label: 'Questionnaire' },
  { key: 'diet-recall',          label: 'Diet Recall' },
  { key: '24hr-diet',            label: '24Hr Diet' },
  { key: 'qc-table',             label: 'QC Table' },
  { key: 'make-diet',            label: 'Make Diet' },
]

export default function TabBar({ activeTab, onChange }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 overflow-x-auto">
      <ul className="flex gap-1 min-w-max">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <li key={tab.key}>
              <button
                onClick={() => onChange(tab.key)}
                className={[
                  'px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                  'border-b-2 focus:outline-none',
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50/60'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300',
                ].join(' ')}
              >
                {tab.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
