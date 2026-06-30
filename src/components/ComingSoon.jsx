/**
 * ComingSoon
 * Generic placeholder card used by all non-Basic-Profile tabs.
 * Props:
 *   tabName – string name of the tab shown in the message
 */
export default function ComingSoon({ tabName }) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <span className="text-2xl">🚧</span>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Coming Soon: <span className="text-blue-600">{tabName}</span> Components
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              This section is under development. Replace this component with your
              actual <strong>{tabName}</strong> implementation.
            </p>
          </div>

          {/* File path hint for developers */}
          <code className="text-xs bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-gray-500 font-mono">
            src/tabs/{tabName.replace(/\s+/g, '')}.jsx
          </code>
        </div>
      </div>
    </div>
  )
}
